import { Router } from "express";
import knex from "../../knex";
import db from "../../knex";
import { Code, Contest, Seller } from "../../models";

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
  const page = parseInt((req.params.page as string) ?? 0);

  let ref = db<Seller>("sellers");
  ref = ref.limit(size);
  ref = ref.offset(page);

  ref = ref.join("codes", "codes.seller", "sellers.name");
  ref = ref.groupBy("sellers.name");
  ref = ref.orderBy("selled", "desc");

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
  ref = ref.offset(page);

  ref = ref.where("contest", "=", contest);

  ref = ref.orderBy("selled", "desc");

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

api.delete("code/:serial", async (req, res) => {
  const { serial } = req.params;

  await db<Code>("codes").del().where("serial", "=", serial);
  res.send("ok");
});

api.post("contest", upload.single("csv"), async (req, res) => {
  const { title, titleAr, start, end } = req.body;
  const file = (req as any).file.buffer as Buffer;

  const csv = file
    .toString("utf8")
    .split("\n")
    .map((e) => e.split(","));

  csv.shift();

  await knex.transaction(async (tdb) => {
    const { id } = await tdb<Contest>("contests")
      .insert({
        end: new Date(end),
        start: new Date(start),
        title: title,
        title_ar: titleAr,
      })
      .select("id");

    await Promise.all(
      csv.map((item) => {
        tdb<Code>("codes").insert({
          contest: id,
          subscription: item[1],
          serial: item[2],
        });
      })
    );
  });

  res.send("ok");
});

api.patch("contest/:id", async (req, res) => {
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

api.delete("contest/:id", async (req, res) => {
  const { id } = req.params;

  await db<Contest>("contests").del().where("id", "=", id);

  res.send("ok");
});

export default api;
