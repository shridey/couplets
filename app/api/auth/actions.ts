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
  const { email, username, password } = Object.fromEntries(
    formData.entries()
  ) as {
    email: string;
    username: string;
    password: string;
  };

  try {
    if (username && username.trim() !== "") {
      const resultByUsername = await auth.api.signInUsername({
        body: {
          username: username,
          password: password,
        },
      });
      if (resultByUsername) {
        redirect("/home");
      }
      return undefined;
    }

    const result = await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });

    if (result) {
      redirect("/home");
    }

    return undefined;
  } catch (error) {
    if (error instanceof APIError) {
      console.error("❌ Auth API error:", error.message);
      return { errorMessage: error.message };
    }

    if (error && typeof error === "object" && "digest" in error) {
      throw error;
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
  const fullName = formDataObj.fullName as string;
  const email = formDataObj.email as string;
  const username = formDataObj.username as string;
  const password = formDataObj.password as string;

  console.log(fullName, email, username, password);

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: fullName.trim(),
        email: email,
        password: password,
        username: username.trim(),
      },
    });

    if (result) {
      redirect("/home");
    }

    return undefined;
  } catch (error) {
    if (error instanceof APIError) {
      console.error("❌ Auth API error:", error.message);
      return { errorMessage: error.message };
    }

    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }

    console.error("❌ Unexpected error:", error);
    return { errorMessage: "An unexpected error occurred" };
  }
}
