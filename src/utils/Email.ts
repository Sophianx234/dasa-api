import { text } from "stream/consumers";
import { userDocument } from "../models/userModel";
import nodemailer from "nodemailer";
export class Email {
  to: string;
  from: string;
  firstName: string;
  url: string;
  constructor(user: userDocument, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.from = `Damian X <${process.env.EMAIL_FROM}>`;
    this.url = url;
  }
  newTransport() {
    return nodemailer.createTransport({
      port: Number(process.env.EMAIL_PORT || 500),
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject:string){
    const mailOptions = {
        from:this.from,
        to:this.firstName,
        subject,
        
    }
    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome(){
    await this.send(`Welcome to the Dasa Family ${this.firstName}`)
  }

  async sendPasswordReset(){
    await this.send('Your password reset token (valid for only 10 minutes)')
  }
}
