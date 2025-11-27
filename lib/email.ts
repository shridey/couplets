"use server";
import nodemailer from "nodemailer";

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smpt.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user,
    pass,
  },
});

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    await transporter.verify();
  } catch (error) {
    console.error("Something Went Wrong", error);
    return;
  }
  const info = await transporter.sendMail({
    from: user,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });
  return info;
}
