import nodemailer from "nodemailer";

const user = process.env.EMAIL_USER as string;
const pass = process.env.EMAIL_PASS as string;

export const sendEmail = async (
  to: string,
  subject: string,
  html?: string,
  text?: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  const mailData = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    text,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};
