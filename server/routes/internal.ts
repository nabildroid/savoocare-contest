import { Router } from "express";
import db from "../knex";
import { Contest } from "../models";

const api = Router();


api.get("/contest/latest", async (req, res) => {
  const contest = await db<Contest>("contests")
    .orderBy("end", "desc")
    .limit(1)
    .select("*");

  console.log(contest);
  if (contest.length && Date.now() < contest[0].end.getTime())
    return res.json(contest[0]);

  res.send({});
});

export default api;
