import Twilio from "twilio";

export default class SMS {
  client: Twilio.Twilio;
  sender: string;
  constructor(sid: string, token: string, sender: string) {
    this.client = Twilio(sid, token);
    this.sender = sender;
  }

  async send(msg: string, phone: string) {
    return this.client.messages.create({
      from: "SAVOO CARE",
      to: phone,
      body: msg,
    });
  }
}
