import { Router } from "express";

const api = Router();

api.get("/sellers/?:page", async (req, res) => {
  const size = req.query.size ?? 10;
  const sorted = req.query.sort ?? true;
  const onlyEmpty = req.query.empty ?? false;
  const search = req.query?.search;
  const page = req.params.page ?? 0;
});

api.get("/codes/?:page", async (req, res) => {
  const size = req.query.size ?? 10;
  const sorted = req.query.sort ?? true;
  const onlyEmpty = req.query.empty ?? false;
  const search = req.query?.search;
  const page = req.params.page ?? 0;
});

api.post("/sellers", (req, res) => {
  const { name } = req.body;
});

api.post("/sellers/assign/:seller/:serial", async (req, res) => {
  const { seller, serial } = req.params;
});

api.delete("code/:serial", (req, res) => {
  const { serial } = req.params;
});

api.post("contest", (req, res) => {
  const { title, titleAr, start, end, file } = req.body;
});

api.patch("contest/:id", (req, res) => {
  const { id } = req.params;
  const {} = req.body;
});

api.delete("contest/:id", (req, res) => {
  const { id } = req.params;
});



export default api;
