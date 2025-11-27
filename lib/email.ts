import nodemailer from "nodemailer";

// Create transporter with enhanced configuration for Vercel
// Switching to port 587 with STARTTLS, which is often more stable
// on serverless platforms than port 465, which requires full SSL/TLS negotiation from the start.
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Port 587 for STARTTLS
  secure: false, // Must be false for port 587 (uses STARTTLS)
  requireTLS: true, // Explicitly requires STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Added a specific TLS option to help with connection stability
  // Note: rejectUnauthorized: false is typically for self-signed certs,
  // but sometimes helps with proxy/environment issues. Use with caution
  // but it's often a necessary diagnostic step in these scenarios.
  tls: {
    rejectUnauthorized: false,
  },
  // Vercel-optimized settings
  pool: true,
  maxConnections: 1,
  maxMessages: 5,
  connectionTimeout: 10000,
  socketTimeout: 15000,
});

// Verify transporter configuration
transporter.verify(function (error) {
  if (error) {
    // Logging the full error object is crucial for diagnosis
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

    // The await keyword here is essential for serverless functions
    const result = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("📨 Message ID:", result.messageId);
    console.log("✅ Response:", result.response);

    return result;
  } catch (error) {
    console.error("❌ Email sending failed:");
    // Print the full error object to get the SMTP error code (e.g., ETIMEDOUT, EAUTH)
    console.error("🔴 Error:", error);
    // Re-throwing the error is good practice for the calling API handler to catch and respond with 500
    throw error;
  }
};
