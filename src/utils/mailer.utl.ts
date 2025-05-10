import nodemailer from "nodemailer";
import "dotenv/config";

export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "yvette31@ethereal.email",
    pass: process.env.ETHEREAL_API_KEY || ""
  }
});
