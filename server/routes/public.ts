import { Router } from "express";
import db from "../knex";
import { Application, Code } from "../models";

const api = Router();

async function validateCode(code: string) {
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

api.post("/check/:subscription", async (req, res) => {
  const { subscription } = req.params;
  const { name, age } = req.body;
  const isValide = await validateCode(subscription);
  if (isValide) {
    await db<Application>("applications").insert({
      age,
      name,
      subscription,
    });

    await db<Code>("codes")
      .update("selled", "1")
      .where("subscription", "=", subscription);

    res.send("done");
  } else {
    // todo log this mullision activity!
    res.status(501).send("error");
  }
});

export default api;
