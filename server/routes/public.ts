import { Router } from "express";
import { body, validationResult } from "express-validator";

import Geo from "geoip-country";
import { Countries } from "../helper";

import db from "../knex";
import { sms } from "../main";
import { Application, Code } from "../models";

const api = Router();

api.use((req, res, next) => {
  console.log("IP ######", req.ip);

  const geo = Geo.lookup(req.ip != "::1" ? req.ip : "129.45.36.242");
  if (geo) {
    const countryCodes = Countries.find((c) =>
      c[2].split("/").some((d) => d == geo.country)
    )?.[1];
    if (countryCodes) {
      (req as any).countryCodes = countryCodes;
      return next();
    }
  }

  res.sendStatus(500);
});

const isSubscriptionCode = (x: string) =>
  x.toString().length > 4 && (x.match(/(\d|[A-F])+/) ?? [])[0] == x;

async function validateCode(code: string, countries: number[]) {
  if (code.length != 8 || !isSubscriptionCode(code)) {
    return false;
  }

  const query = await db<Code>("codes")
    .where("subscription", "=", code)
    .where("selled", "=", 0)
    .join("contests", "codes.contest", "contests.id")
    .select({
      countries: "contests.countries",
    });

  if (query.length) {
    const requiredCountries = (query[0].countries?.split(",") ??
      []) as string[];
    return countries.some((mine) =>
      requiredCountries.some((must) => mine.toString() == must)
    );
  }

  return false;
}
api.get("/check/:subscription", async (req, res) => {
  //BUG you have also to check the contest id
  const { subscription } = req.params;

  const countryCodes = (req as any).countryCodes as number[];

  const isValide = await validateCode(subscription, countryCodes);

  res.send(isValide ? "valide" : "error");
});

api.post(
  "/check/:subscription",
  body("name").isLength({ min: 8, max: 100 }),
  body("age").isInt({ min: 16, max: 80 }).toInt(),
  body("email").optional().isEmail(),
  body("tel")
    .isString()
    .matches(/\+\d+\-0?\d{9}\d?$/),
  body("address").isLength({ min: 3, max: 200 }),
  body("married").optional().isBoolean(),

  async (req, res) => {
    console.log("##############");
    const { subscription } = req.params as any;
    const { name, age, tel: phone, email, address, married } = req.body;
    const errors = validationResult(req);

    console.log(errors.array());
    const countryCodes = (req as any).countryCodes as number[];

    const isValide =
      errors.isEmpty() && (await validateCode(subscription, countryCodes));

    if (isValide) {
      try {
        await db<Application>("applications").insert({
          age,
          name,
          email,
          address,
          married,
          phone: parseInt(phone.split("-")[1]),
          subscription,
        });

        await db<Code>("codes")
          .update("selled", "1")
          .where("subscription", "=", subscription);

        sms.send(
          `thank you ${name} for participating in our contest`,
          phone.replace("-", "")
        );

        return res.send("done");
      } catch (e) {
        console.log(e);
      }
    } else {
      // todo log this mullision activity!
    }
    return res.sendStatus(422);
  }
);

export default api;
