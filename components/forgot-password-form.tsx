"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Icons } from "./icons";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"none" | "success">("none");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);

    try {
      const response = await fetch("/api/auth/check-and-send-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        toast.success("Password reset email sent successfully");
      } else {
        if (response.status === 404) {
          toast.error("Account not found");
        } else {
          toast.error(data.error || "Failed to send reset email");
        }
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return status !== "success" ? (
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
              Forgot your password?
            </h1>
            <p className="text-sm">
              Follow the instructions to access your account!
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                placeholder="john.doe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                name="email"
                id="email"
              />
            </div>

            <Button
              className="w-full"
              disabled={pending}
              aria-disabled={pending}
            >
              {pending && <Spinner />}
              Send Reset Link
            </Button>
          </div>
        </div>
      </form>
    </section>
  ) : (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
      <p className="text-lg">
        A password reset link has been sent to your email address.
      </p>
      <Button asChild className="mt-6">
        <Link href="/sign-in">Return to Sign In</Link>
      </Button>
    </div>
  );
};
