"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Icons } from "./icons";

export const SignInWithGoogleButton = () => {
  const [pending, setPending] = useState(false);

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onRequest: () => setPending(true),
        onError: (error) => {
          console.log(error);
          setPending(false);
        },
      }
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      aria-disabled={pending}
      onClick={handleGoogleSignIn}
    >
      <Icons.google />
      <span>Google</span>
      {pending && <Spinner />}
    </Button>
  );
};
