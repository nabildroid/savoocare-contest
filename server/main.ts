import Express from "express";
import cors from "cors";

import env from "./env";
import Admin from "./routes/admin";
import Public from "./routes/public";
import Auth from "./routes/auth";
import Internal from "./routes/internal";
import SMS from "./services/sms";

const app = Express();

app.use("/nextstatic/", Express.static(env.PRIZE_LOCATIONS));

export const sms = new SMS(env.TWILIO_SID, env.TWILIO_TOKEN, env.TWILIO_PHONE);

app.use(cors());

app.use(Express.json());

app.use("/admin", Admin);

app.use("/api", Public);

app.use("/auth", Auth);

app.use("/internal", Internal);

app.listen(env.PORT, async () => {
  console.log("listening to ", env.PORT);
});
