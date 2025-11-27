import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const smtpConfig: SMTPTransport.Options = {
  host: process.env.SMTP_HOST as string,
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
};

export const transporter = nodemailer.createTransport(smtpConfig);

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) => {
  try {
    await transporter.verify();
  } catch (error) {
    console.error("Transporter Verification Failed:", error);
    throw new Error("Failed to connect to email server.");
  }

  await transporter.sendMail({
    from: { name: "Couplets", address: process.env.EMAIL_USER as string },
    to,
    subject,
    html,
    text,
  });
};
