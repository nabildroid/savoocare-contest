import { Router } from "express";

const api = Router();

api.get("check/:subscription", (req, res) => {
  const { subscription } = req.params;
});

api.post("check/:subscription", (req, res) => {
  const { subscription } = req.params;
  const { name, age } = req.body;
});

export default api;
