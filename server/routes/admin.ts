import { Router } from "express";
import axios from "axios";
import knex from "../knex";
import db from "../knex";
import fs from "fs";
import { Application, Code, Contest, Seller } from "../models";
import { validateToken } from "./auth";
import env from "../env";
import writeXlsxFile from "write-excel-file";

import Crypto from "node:crypto";

import os from "os";
import Path from "path";

const multer = require("multer");
const upload = multer({ dest: "/tmp" });

const api = Router();

const cUploads = upload.fields([
  { name: "csv", maxCount: 1 },
  { name: "prize1", maxCount: 1 },
  { name: "prize2", maxCount: 1 },
  { name: "prize3", maxCount: 1 },
]);

api.use(async (req, res, next) => {
  if (req.path.startsWith("/auth")) {
    return next();
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1].trim();

  if (token == null) return res.sendStatus(401);

  try {
    const user = await validateToken(token);
    if (user.type == "admin") {
      return next();
    } else {
      throw new Error("Unauthorized");
    }
  } catch (e) {
    return res.sendStatus(403);
  }
});

// export type Seller = {
//     name: string;
//     products: number;
//     selled: number;
//   };

// SELECT count(codes.seller), sellers.name, sum(codes.selled = 1) from sellers JOIN codes on codes.seller = sellers.name GROUP BY(sellers.name);

api.get("/sellers/?:page", async (req, res) => {
  const max = parseInt((req.query.max as string) ?? 10);
  const name = req.query.name as string;
  const type = req.query.type as string;
  const page = parseInt((req.params.page as string) ?? 0);

  let ref = db<Seller>("sellers");
  ref = ref.limit(max);
  ref = ref.offset(Math.max(0, max * page));

  ref = ref.leftJoin("codes", "codes.seller", "sellers.name");
  ref = ref.groupBy("sellers.name");
  ref = ref.orderBy("sellers.name", "desc");
  if (name) {
    ref = ref.whereLike("sellers.name", `%${name}%`);
  }

  if (type == "unassigned") {
    // ref = ref.whereLike("codes.", `%${name}%`);
  }

  const sellers = await ref
    .count({ products: "codes.seller" })
    .sum({ selled: knex.raw("codes.selled = 1") })
    .select("sellers.name");

  const count = await db<Seller>("sellers").count({ count: "name" });
  res.json({
    data: sellers,
    count: count[0].count,
  });
});

// export type Code = {
//     serial: string;
//     seller?: string;
//     selled: boolean;
//   };

// SELECT *,  from codes GROUP BY codes.serial ORDER by target DESC, seller;

api.get("/codes/:contest/?:page", async (req, res) => {
  const contest = req.params.contest as string;

  const max = parseInt((req.query.max as string) ?? 10);

  const page = parseInt((req.params?.page as string) ?? 0);
  const seller = req.query.seller;

  let ref = db<Code>("codes");

  ref = ref.limit(max);
  ref = ref.offset(Math.max(0, max * page));

  ref = ref.where("contest", "=", contest);

  if (seller) {
    ref = ref.groupBy("serial");
    ref = ref.sum({
      target: knex.raw(
        `Case When codes.seller = "${seller}" Then 1 Else 0 End`
      ),
    });
    ref = ref.orderBy("target", "desc");
    ref = ref.orderBy("seller");
  }

  ref = ref.orderBy("serial", "desc");

  const codes = await ref.select("serial", "seller", "selled");
  const count = await db<Code>("codes").count({ count: "serial" });
  res.json({
    data: codes,
    count: count[0].count,
  });
});

api.post("/seller", async (req, res) => {
  const { name } = req.body;

  await db<Seller>("sellers").insert({ name });
  res.json({
    name,
    products: 0,
    selled: 0,
  });
});

api.delete("/seller/:id", async (req, res) => {
  const { id } = req.params;

  await db<Code>("codes").delete().where("seller", "=", id);
  await db<Seller>("sellers").delete().where("name", id);

  return res.send("ok");
});

api.post("/sellers/assign/:seller/:serial", async (req, res) => {
  const { seller, serial } = req.params;

  await db<Code>("codes")
    .update("seller", seller)
    .where("serial", "=", parseInt(serial));
  res.send("ok");
});

api.delete("/code/:serial", async (req, res) => {
  const { serial } = req.params;

  // todo delete first all the subscriptions

  const subscription = (
    await db<Code>("codes")
      .where("serial", "=", parseInt(serial))
      .select("subscription")
  )[0];

  if (subscription) {
    await db<Application>("applications")
      .del()
      .where("subscription", "=", subscription.toString());
  }

  await db<Code>("codes").del().where("serial", "=", parseInt(serial));
  res.send("ok");
});

api.post("/contest", cUploads, async (req, res) => {
  const { title, titleAr, start, end, description, countries } = req.body;

  const files = (req as any).files;
  const data = fs.readFileSync(files.csv[0].path, "utf8");

  let csv = data.split("\n").map((e) => e.split(","));
  csv.shift();
  csv = csv.filter((i) => i.every((q) => !!q));

  const imgs = [files.prize1[0], files.prize2[0], files.prize3[0]];
  const imgsNames = imgs.map((e) => e.filename);
  const imgsPaths = imgs.map((e) => e.path);

  imgsPaths.forEach((img, i) =>
    fs.copyFileSync(img, env.PRIZE_LOCATIONS + imgsNames[i] + ".png")
  );

  let id = "";
  const newContest = {
    end: new Date(parseInt(end)),
    start: new Date(parseInt(start)),
    title: title,
    title_ar: titleAr,
    description,
    countries,
    prize1: imgsNames[0],
    prize2: imgsNames[1],
    prize3: imgsNames[2],
  };
  await knex.transaction(async (tdb) => {
    id = (
      await tdb<Contest>("contests").insert(newContest).select("id")
    )[0].toString();

    (newContest as any)["id"] = id;

    await Promise.all(
      csv.map((item) =>
        tdb<Code>("codes").insert({
          contest: id,
          subscription: item[1],
          serial: item[2],
        })
      )
    );
  });

  res.json({
    sellers: 0,
    total: 0,
    ...newContest,
  });
});

// export type Contest = {
//   id: string;
//   title: string;
//   titleAr: string;
//   start: Date;
//   end: Date;
//   prizes: { name: string; image: string }[];
//   selled: number;
//   sellers: number;
//   total: number;
// };
// select count() as total,count(DISTINCT(codes.seller)) as sellers, sum(codes.selled = 1) as selled, contests.id from contests JOIN codes on codes.contest = contests.id GROUP BY(contests.id);

api.get("/contest", async (_, res) => {
  let ref = db<Contest>("contests");
  ref = ref.groupBy("contests.id");

  ref = ref.join("codes", "codes.contest", "contests.id");

  const contests = await ref
    .count({ total: "codes.subscription" })
    .count({ sellers: knex.raw("DISTINCT(codes.seller)") })
    .sum({ selled: knex.raw("codes.selled = 1") })
    .select(
      "contests.id",
      "contests.end",
      "contests.start",
      "contests.title",
      "contests.title_ar",
      "contests.countries",
      "contests.description"
    );

  return res.json(
    contests.map((e) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
      titleAr: e.title_ar,
    }))
  );
});

api.patch("/contest/:id", cUploads, async (req, res) => {
  const { id } = req.params;
  const { title, titleAr, start, end, description, countries } = req.body;
  console.log(title, titleAr, start, end, description, countries);
  const files = (req as any).files;

  let imgsNames: string[] = [];
  let csv: string[][] = [];
  if (Object.values(files).length) {
    if (files.csv) {
      const data = fs.readFileSync(files.csv[0].path, "utf8");

      csv = data.split("\n").map((e) => e.split(","));
      csv.shift();

      csv = csv.filter((i) => i.every((q) => !!q));
    }
    if (files.prize1) {
      const imgs = [files.prize1[0], files.prize2[0], files.prize3[0]];
      imgsNames = imgs.map((e) => e.filename);
      const imgsPaths = imgs.map((e) => e.path);

      imgsPaths.forEach((img, i) =>
        fs.copyFileSync(img, env.PRIZE_LOCATIONS + imgsNames[i] + ".png")
      );
    }
  }

  try {
    await knex.transaction(async (tdb) => {
      const updated = {
        end: new Date(parseInt(end)),
        start: new Date(parseInt(start)),
        title: title,
        title_ar: titleAr,
        description,
        countries,
      } as any;

      if (imgsNames.length) {
        updated["prize1"] = imgsNames[0];
        updated["prize2"] = imgsNames[1];
        updated["prize3"] = imgsNames[2];
      }
      await db<Contest>("contests").update(updated).where("id", "=", id);
      if (csv.length) {
        await Promise.all(
          csv.map((item) =>
            tdb<Code>("codes").insert({
              contest: id,
              subscription: item[1],
              serial: item[2],
            })
          )
        );
      }
    });

    res.send("ok");

    axios
      .get("http://localhost:3000/api/revalidate/?id=" + id)
      .catch((e) => console.log("front page is not active"));
  } catch (e) {
    res.sendStatus(500);
    console.log("unable to handle update contest#", id, req.body, e);
  }
});

api.delete("/contest/:id", async (req, res) => {
  const { id } = req.params;

  // todo delete all the forigni keys, and the codes

  await db<Contest>("contests").del().where("id", "=", id);

  res.send("ok");
});

api.get("/contest/:id/applications", async (req, res) => {
  const { id } = req.params;
  const seller = req.query.seller as string;

  let apps = db<Code>("codes")
    .join("contests", "contests.id", "codes.contest")
    .where("contests.id", "=", id)
    .leftJoin("applications", "applications.subscription", "codes.subscription")
    .select({
      title: "contests.title",
      serial: "codes.serial",
      seller: "codes.seller",
      activated: "codes.selled",
      app_name: "applications.name",
      app_age: "applications.age",
      app_phone: "applications.phone",
      app_email: "applications.email",
      app_married: "applications.married",
      app_address: "applications.address",
      app_created: "applications.created_at",
    });

  if (seller) {
    apps = apps.where("codes.seller", "=", seller);
    apps = apps.select({
      subscription: "codes.subscription",
    });
  }

  let csv = `contest title, ${
    seller ? "subscription," : ""
  } serial code,seller,activated,name,address,age,phone,email,married, applied at\n`;

  (await apps).forEach((app) => {
    csv += app["title"].replace(",", " ") + ",";
    if (seller) {
      csv += app["subscription"].replace(",", " ") + ",";
    }

    csv += app["serial"].replace("\r", "").replace(",", " ") + ",";
    csv += app["seller"] + ",";
    csv += (app["activated"] ? "activated" : "open") + ",";
    csv += (app["app_name"] ?? "").replace(",", " ") + ",";
    csv += (app["app_address"] ?? "").replace(",", " ") + ",";
    csv += app["app_age"] + ",";
    csv += (app["app_phone"] ?? "") + ",";
    csv += (app["app_email"] ?? "").replace(",", " ") + ",";
    csv += app["app_married"] + ",";
    csv += ((app["app_created"] as Date | undefined) ?? "")?.toString() + ",";
    csv += "\n";
  });

  const rand = Crypto.randomUUID().slice(0, 30);
  const name = env.APPLICATIONS_FILE_PREFIX + "-" + rand + ".csv";
  const path = Path.join(os.tmpdir(), name);

  console.log(apps);
  fs.writeFileSync(path, csv);

  res.send(name);
});

export default api;
