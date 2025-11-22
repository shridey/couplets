"use server";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";

interface State {
  errorMessage?: string | null;
}

export async function signIn(
  prevState: State | undefined,
  formData: FormData
): Promise<State | undefined> {
  const { email, password } = Object.fromEntries(formData.entries()) as {
    email: string;
    password: string;
  };

  try {
    console.log("🔧 Sign-in attempt:", { email });

    const result = await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });

    console.log("✅ Sign-in successful:", result);

    if (result) {
      redirect("/home"); // This throws a redirect exception
    }

    return undefined; // This line won't be reached due to redirect
  } catch (error) {
    if (error instanceof APIError) {
      console.error("❌ Auth API error:", error.message);
      return { errorMessage: error.message };
    }

    // Check if it's a redirect exception
    if (error && typeof error === "object" && "digest" in error) {
      throw error; // Re-throw redirect exceptions
    }

    console.error("❌ Unexpected error:", error);
    return { errorMessage: "An unexpected error occurred" };
  }
}

export async function signUp(
  prevState: State | undefined,
  formData: FormData
): Promise<State | undefined> {
  const formDataObj = Object.fromEntries(formData.entries());
  const firstName = formDataObj.firstname as string;
  const lastName = formDataObj.lastname as string;
  const email = formDataObj.email as string;
  const password = formDataObj.password as string;
  const confirmPassword = formDataObj["confirm-password"] as string;

  console.log("🔧 Sign-up attempt:", { email, firstName, lastName });

  if (password !== confirmPassword) {
    return { errorMessage: "Passwords do not match" };
  }

  try {
    console.log("📝 Calling Better Auth...");

    const result = await auth.api.signUpEmail({
      body: {
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        password: password,
      },
    });

    console.log("✅ Sign-up successful:", result);

    if (result) {
      redirect("/home"); // This throws a redirect exception
    }

    return undefined; // This line won't be reached due to redirect
  } catch (error) {
    if (error instanceof APIError) {
      console.error("❌ Auth API error:", error.message);
      return { errorMessage: error.message };
    }

    // Check if it's a redirect exception
    if (error && typeof error === "object" && "digest" in error) {
      throw error; // Re-throw redirect exceptions
    }

    console.error("❌ Unexpected error:", error);
    return { errorMessage: "An unexpected error occurred" };
  }
}
