import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authClient } from "@/lib/auth-client";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // If user exists, use Better Auth to send reset email
    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: "/sign-in/reset-password",
    });

    if (!result) {
      return NextResponse.json(
        { error: "Failed to send reset email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Error in check-and-send-reset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
