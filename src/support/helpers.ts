import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import handlebars from "handlebars";
import { logger } from "../logger";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // Update with your email service provider
  auth: {
    user: process.env.username, // Update with your email address
    pass: process.env.pass, // Update with your email password
  },
});

const sentMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: process.env.username, // Update with your email address
    to: to,
    subject: subject,
    html: html,
  });
};

export const sendTemplateMail = async (
  email: string,
  subject: string,
  templatePath: string,
  context: object
) => {
  // Read the HTML template file
  const html = fs.readFileSync(templatePath, "utf8");

  // Compile the template
  const template = handlebars.compile(html);

  // Render the template with dynamic data
  const compiledHtml = template(context);

  // Send the email
  await sentMail(email, subject, compiledHtml);
};

export function writeErrorsToLogs(error: any) {
  logger.error(`${error.name}: ${error.message}\n${error.stack}`);
}

export function generateRandomAlphNumeric(length: number = 6): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function addSuffix(num: number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = num % 100;

  return (
    num +
    (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0])
  );
}
