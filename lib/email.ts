import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
});

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
  await transporter.sendMail({
    from: process.env.EMAIL_USER as string,
    to,
    subject,
    html,
    text,
  });
};
