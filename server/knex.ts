import knex from "knex";

import env from "./env";

const db = knex({
  client: "mysql",
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },
});

export default db;
