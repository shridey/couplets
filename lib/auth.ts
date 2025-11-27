import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP, username } from "better-auth/plugins";
import { sendEmail } from "./email";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [
    nextCookies(),
    username({
      minUsernameLength: 3,
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          await sendEmail({
            to: email,
            subject: "Verify your email address",
            text: `Your email verification code is: ${otp}. This code will expire in 10 minutes.`,
          });
        } else if (type === "forget-password") {
          await sendEmail({
            to: email,
            subject: "Forget password",
            text: `Your forget password code is: ${otp}. This code will expire in 10 minutes.`,
          });
        }
      },
      otpLength: 6,
      expiresIn: 10 * 60, // 10 minutes
    }),
  ],
});
