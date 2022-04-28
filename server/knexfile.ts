import env from "./env";

module.exports = {
  client: "mysql",
  connection: {
    host: env.DB_HOST,
    database: env.DB_NAME,
    user: env.DB_USER,
    port: env.DB_PORT,
    password: env.DB_PASSWORD,
  },
  migrations: {
    extension: "ts",
    tableName: "knex_migrations",
    directory: "db/migrations",
  },
};
