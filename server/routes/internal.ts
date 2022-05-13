import { Router } from "express";
import db from "../knex";
import { Contest } from "../models";

const api = Router();

api.get("/contest/:id", async (req, res) => {
  const { id } = req.params;
  const contest = await db<Contest>("contests")
    .where("id", "=", id)
    .orderBy("end", "desc")
    .limit(1)
    .select("*");

  if (contest.length && Date.now() < contest[0].end.getTime() && Date.now() > contest[0].start.getTime())
    return res.json(contest[0]);

  res.send({});
});

api.get("/contest", async (req, res) => {
  const query = await db<Contest>("contests").select("id");

  const ids = query.map((i) => i.id);

  res.json(ids);
});

export default api;
