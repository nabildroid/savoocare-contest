import { Router } from "express";
import { body, validationResult } from "express-validator";

import db from "../knex";
import { sms } from "../main";
import { Application, Code } from "../models";

const api = Router();

const isSubscriptionCode = (x: string) =>
  (x.match(/\d{3}(\d|[A-F]){5}/) ?? [])[0] == x;

async function validateCode(code: string) {
  if (code.length != 8 || !isSubscriptionCode(code)) {
    return false;
  }

  const query = await db<Code>("codes")
    .where("subscription", "=", code)
    .where("selled", "=", 0)
    .count({
      exists: "subscription",
    });

  return query.length && !!query[0].exists;
}
api.get("/check/:subscription", async (req, res) => {
  //BUG you have also to check the contest id
  const { subscription } = req.params;

  const isValide = await validateCode(subscription);

  res.send(isValide ? "valide" : "error");
});

api.post(
  "/check/:subscription",
  body("name").isLength({ min: 8, max: 100 }),
  body("age").isInt({ min: 16, max: 80 }).toInt(),
  body("email").optional().isEmail(),
  body("tel")
    .isString()
    .matches(/\+\d+\-\d{10}$/g),
  body("address").isLength({ min: 3, max: 200 }),
  body("married").optional().isBoolean(),

  async (req, res) => {
    const { subscription } = req.params as any;
    const { name, age, tel: phone, email, address, married } = req.body;
    const errors = validationResult(req);

    console.log(errors.array());
    const isValide = errors.isEmpty() && (await validateCode(subscription));
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
