import { convert } from "html-to-text";
import nodemailer from "nodemailer";
import { userDocument } from "../models/userModel";

export class Email {
  to: string;
  from: string;
  firstName: string;
  url: string;
  constructor(user: userDocument, url: string) {
    this.to = user.email;
    this.firstName = user.firstName.split(" ")[0];
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
    <div style="font-family: Arial, sans-serif; color: #4c4132; padding: 20px; ">
        <div style="display:flex; align-items:center ; transform: translate(-6%,10%) ; ">
        
        <img src="https://i.ibb.co/n8hRM6d/dasalogo-removebg.png" alt="dasalogo-removebg" width="150" />
        <p style="font-weight: 800; border-left:solid 2px #4c4132; padding-block: 15px; padding-left: 8px; transform: translateX(-6%); ">Dagbon Students <br/>
        Associantion</p>
        </div>
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
        html,
        text: convert(html)
      };
      return await this.newTransport().sendMail(mailOptions);
    
  }

  async sendWelcome() {
   return  await this.send(`Welcome to the Dasa Family ${this.firstName}`);
  }

  async sendPasswordReset() {
   return  await this.send("Your password reset token (valid for only 10 minutes)");
  }
}
