"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

export const CompleteProfileForm = () => {
  const [username, setUsername] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await authClient.isUsernameAvailable(
      {
        username: username,
      },
      {
        onRequest: () => setPending(true),
        onError: ({ error }) => {
          setPending(false);
          toast.error(error.message);
        },
        onSuccess: async (ctx) => {
          if (ctx.data.available) {
            await authClient.updateUser(
              {
                username: username,
              },
              {
                onError: ({ error }) => {
                  setPending(false);
                  toast.error(error.message);
                },
                onSuccess: () => {
                  setPending(false);
                  redirect("/home");
                },
              }
            );
          } else {
            setPending(false);
            toast.error("Username not available");
          }
        },
      }
    );
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Icons.logo />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Complete Your Profile
            </h1>
            <p className="text-sm">
              Choose a username to continue with your Google account
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="block text-sm">
                Choose Username
              </Label>
              <Input
                type="text"
                placeholder="john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                name="username"
                id="username"
              />
            </div>

            <Button
              className="w-full"
              disabled={pending}
              aria-disabled={pending}
            >
              {pending && <Spinner />}
              Continue
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};
