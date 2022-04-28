import Express from "express";
import env from "./env";
import Admin from "./domains/admin";
import Public from "./domains/public";
import db from "./knex";
import { Seller } from "./models";

const app = Express();
app.use(Express.json());

app.use("/api/admin", Admin);
app.use("/api", Public);

app.listen(env.PORT, async () => {


  console.log("listening to ", env.PORT);
});
