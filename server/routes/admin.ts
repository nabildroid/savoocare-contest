import { Router } from "express";
import knex from "../knex";
import db from "../knex";
import fs from "fs";
import { Code, Contest, Seller } from "../models";

const multer = require("multer");
const upload = multer({ dest: "/tmp" });

const api = Router();

// export type Seller = {
//     name: string;
//     products: number;
//     selled: number;
//   };

// SELECT count(codes.seller), sellers.name, sum(codes.selled = 1) from sellers JOIN codes on codes.seller = sellers.name GROUP BY(sellers.name);

api.get("/sellers/?:page", async (req, res) => {
  const size = parseInt((req.query.size as string) ?? 10);
  const name = req.query.name as string;
  const type = req.query.type as string;
  const page = parseInt((req.params.page as string) ?? 0);

  let ref = db<Seller>("sellers");
  ref = ref.limit(size);
  ref = ref.offset(Math.max(0, size * (page - 1)));

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

  res.json(sellers);
});

// export type Code = {
//     serial: string;
//     seller?: string;
//     selled: boolean;
//   };

api.get("/codes/:contest/?:page", async (req, res) => {
  const contest = req.params.contest as string;

  const size = parseInt((req.query?.size as string) ?? 10);
  const page = parseInt((req.params?.page as string) ?? 0);

  let ref = db<Code>("codes");

  ref = ref.limit(size);
  ref = ref.offset(Math.max(0, size * (page - 1)));

  ref = ref.where("contest", "=", contest);

  ref = ref.orderBy("serial", "desc");

  const codes = await ref.select("serial", "seller", "selled");
  res.json(codes);
});

api.post("/sellers", async (req, res) => {
  const { name } = req.body;

  await db<Seller>("sellers").insert({ name });
  res.json({
    name,
    products: 0,
    selled: 0,
  });
});

api.post("/sellers/assign/:seller/:serial", async (req, res) => {
  const { seller, serial } = req.params;

  await db<Code>("codes").update("seller", seller).where("serial", "=", serial);
  res.send("ok");
});

api.delete("/code/:serial", async (req, res) => {
  const { serial } = req.params;

  await db<Code>("codes").del().where("serial", "=", serial);
  res.send("ok");
});

api.post("/contest", upload.single("csv"), async (req, res) => {
  const { title, titleAr, start, end } = req.body;
  console.log({
    end: new Date(parseInt(end)),
    start: new Date(parseInt(end)),
    title: title,
    title_ar: titleAr,
  });
  const file = (req as any).file;
  console.log(file);

  const data = fs.readFileSync(file.path, "utf8");

  const csv = data.split("\n").map((e) => e.split(","));

  csv.shift();
  if (!csv[csv.length - 1][0]) {
    csv.pop();
  }

  let id = "";
  await knex.transaction(async (tdb) => {
    id = (
      await tdb<Contest>("contests")
        .insert({
          end: new Date(parseInt(end)),
          start: new Date(parseInt(end)),
          title: title,
          title_ar: titleAr,
        })
        .select("id")
    )[0].toString();

    console.log(id);

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
    id,
    end: new Date(end),
    start: new Date(start),
    title,
    titleAr,
    sellers: 0,
    total: 0,
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
      "contests.title_ar"
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

api.patch("/contest/:id", async (req, res) => {
  const { id } = req.params;
  const { title, titleAr, start, end } = req.body;

  await db<Contest>("contests")
    .update({
      end: new Date(end),
      start: new Date(start),
      title: title,
      title_ar: titleAr,
    })
    .where("id", "=", id);

  res.send("ok");
});

api.delete("/contest/:id", async (req, res) => {
  const { id } = req.params;

  await db<Contest>("contests").del().where("id", "=", id);

  res.send("ok");
});

export default api;
