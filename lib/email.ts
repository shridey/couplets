import nodemailer from "nodemailer";

const user = process.env.EMAIL_USER as string;
const pass = process.env.EMAIL_PASS as string;

export const sendEmail = async (
  to: string,
  subject: string,
  html?: string,
  text?: string
) => {
  try {
    // Use a more robust transporter configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
      // Better timeout settings for serverless
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify connection configuration
    await transporter.verify();

    const mailData = {
      from: {
        name: "Shridhar Pandey",
        address: user,
      },
      to,
      subject,
      html: html,
      text: text,
    };

    const info = await transporter.sendMail(mailData);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
