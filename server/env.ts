import { cleanEnv, num, str, bool } from "envalid";

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  SITE_NAME: str({ default: "Savoo - contest" }),
  DB_HOST: str({ default: "localhost" }),
  DB_PORT: num({ default: 3306 }),
  DB_NAME: str({ default: "contest" }),
  DB_USER: str({ default: "admin" }),
  DB_PASSWORD: str({ default: "admin" }),
  USER_LIMIT_PER_DAY: num({ default: 50 }),
});

export default env;
