// lib/email.ts
import nodemailer from "nodemailer";

// Create transporter with enhanced configuration for Vercel
export const transporter = nodemailer.createTransport({
  // **Change the service property to explicit host/port settings**
  host: "smtp.gmail.com", // Explicit Gmail SMTP Host
  port: 465, // Port 465 is for SMTPS (Secure SMTP)
  secure: true, // MUST be true for port 465 (SSL/TLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Your App Password
  },
  // Keep the Vercel-optimized settings
  pool: true,
  maxConnections: 1,
  maxMessages: 5,
  connectionTimeout: 10000,
  socketTimeout: 15000,
});

// Verify transporter configuration
transporter.verify(function (error) {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Transporter is ready to send emails");
  }
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
  try {
    console.log("🔧 Email sending process started");
    console.log("📧 To:", to);
    console.log("📝 Subject:", subject);
    console.log("🏢 Environment:", process.env.NODE_ENV);

    // Validate environment variables
    if (!process.env.EMAIL_USER) {
      throw new Error("EMAIL_USER environment variable is not set");
    }
    if (!process.env.EMAIL_PASS) {
      throw new Error("EMAIL_PASS environment variable is not set");
    }

    console.log("✅ Environment variables are set");

    const mailOptions = {
      from: {
        name: "Shridhar Pandey",
        address: process.env.EMAIL_USER,
      },
      to,
      subject,
      html,
      text: text,
    };

    console.log("📤 Sending email via Gmail...");

    const result = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("📨 Message ID:", result.messageId);
    console.log("✅ Response:", result.response);

    return result;
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("🔴 Error:", error);
  }
};
