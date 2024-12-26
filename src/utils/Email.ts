import { convert } from "html-to-text";
import nodemailer from "nodemailer";
import { userDocument } from "../models/userModel";
import dotenv from 'dotenv'

dotenv.config()
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
      port: Number(process.env.EMAIL_PORT),
      host: process.env.EMAIL_HOST,

      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject: string) {
    const html = `
    <div style="font-family: Arial, sans-serif; color: #4c4132; padding: 20px;">
        <h1>Hello ${this.firstName}!</h1>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <p><a href="${this.url}" style="color: #ffd8a8;">Click here to reset your password</a></p>
        <p>The link is valid for only 10 minutes.</p>
        <p>If you did not request this change, please ignore this email.</p>
      </div>
    `;
    const message = 'message not Damian'
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(`Welcome to the Dasa Family ${this.firstName}`);
  }

  async sendPasswordReset() {
    await this.send("Your password reset token (valid for only 10 minutes)");
  }
}
