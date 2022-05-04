import { Router } from "express";
import env from "../env";
import jwt from "jsonwebtoken";

const api = Router();

async function validateCrediential(name: string, password: string) {
  return name == "admin" && password == "admin";
}

type Token = {
  name: string;
  type: "admin";
};

function createToken(name: string, type: Token["type"]) {
  const token = jwt.sign({ name, type }, env.JWT_SECRET, {
    expiresIn: "1800s",
  });

  return token;
}

export function validateToken(token: string) {
  return new Promise<Token>((res, failed) => {
    jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
      if (err) return failed();
      res(decoded as Token);
    });
  });
}

api.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const isValide = await validateCrediential(name, password);
  if (!isValide) return res.sendStatus(401);

  const token = createToken(name, "admin");
  validateToken(token).then(console.log);
  res.json({
    token: `Bearer ${token}`,
  });
});

export default api;
