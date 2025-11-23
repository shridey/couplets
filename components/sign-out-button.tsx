"use client";
import { useState } from "react";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export const SignOutButton = () => {
  const [pending, setPending] = useState(false);
  const handleClick = async () => {
    setPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/sign-in");
        },
      },
    });
    setPending(false);
  };
  return (
    <Button disabled={pending} aria-disabled={pending} onClick={handleClick}>
      {pending && <Spinner />}
      Sign Out
    </Button>
  );
};
