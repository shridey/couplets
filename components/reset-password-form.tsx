"use client";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const otp = searchParams.get("otp");
  const email = searchParams.get("email");

  const handleReset = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    await authClient.emailOtp.resetPassword(
      {
        email: email!,
        otp: otp!,
        password: password,
      },
      {
        onRequest: () => {
          setPending(true);
          handleReset();
        },
        onSuccess: () => {
          setPending(false);
          toast.success("Password has been reset successfully.");
          redirect("/sign-in");
        },
        onError: (ctx) => {
          setPending(false);
          toast.error(ctx.error.message);
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
              Reset your Password
            </h1>
            <p className="text-sm">
              Go ahead and create a new password for Couplets!
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="block text-sm">
                Password
              </Label>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                name="password"
                id="password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="block text-sm">
                Confirm Password
              </Label>
              <Input
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                name="confirm-password"
                id="confirm-password"
              />
            </div>

            <Button
              className="w-full"
              disabled={pending}
              aria-disabled={pending}
            >
              {pending && <Spinner />}
              Reset Password
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};
