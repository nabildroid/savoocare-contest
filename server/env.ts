import { cleanEnv, num, str, bool } from "envalid";

const env = cleanEnv(process.env, {
  PORT: num({ default: 3002 }),
  SITE_NAME: str({ default: "Savoo - contest" }),
  DB_HOST: str({ default: "localhost" }),
  DB_PORT: num({ default: 3306 }),
  DB_NAME: str({ default: "contest" }),
  DB_USER: str({ default: "admin" }),
  DB_PASSWORD: str({ default: "admin" }),
  DASHBOARD_USER: str({ default: "admin" }),
  DASHBOARD_PASSWORD: str({ default: "admin" }),
  JWT_SECRET: str({ default: "ilk2" }),
  APPLICATIONS_FILE_PREFIX: str({ default: "savoo" }),
  PRIZE_LOCATIONS: str({ default: "/home/nabil/Desktop/" }),
});

export default env;
