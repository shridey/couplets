"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { signIn } from "@/app/api/auth/actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Page() {
  const [state, formAction, pending] = useActionState(signIn, {
    errorMessage: null,
  });

  const [signInMethod, setSignInMethod] = useState<"email" | "username">(
    "email"
  );

  useEffect(() => {
    if (state?.errorMessage) {
      toast.error(state.errorMessage);
    }
  }, [state]);

  return (
    <section className="flex min-h-screen bg-zinc-50 dark:bg-transparent">
      <form
        action={formAction}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Icons.logo />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Sign in to Couplets
            </h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor={signInMethod} className="text-sm">
                  {signInMethod === "email" ? "Email" : "Username"}
                </Label>
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setSignInMethod(
                      signInMethod === "email" ? "username" : "email"
                    );
                  }}
                >
                  <Link
                    href="#"
                    className="link intent-info variant-ghost text-sm"
                  >
                    {signInMethod === "email"
                      ? "Sign in with Username"
                      : "Sign in with Email"}
                  </Link>
                </Button>
              </div>
              <Input
                type={signInMethod === "email" ? "email" : "text"}
                required
                autoComplete={signInMethod === "email" ? "email" : "username"}
                name={signInMethod}
                id={signInMethod}
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="#"
                    className="link intent-info variant-ghost text-sm"
                  >
                    Forgot your Password ?
                  </Link>
                </Button>
              </div>
              <Input
                type="password"
                required
                name="password"
                id="password"
                className="input sz-md variant-mixed"
              />
            </div>

            <Button
              className="w-full"
              disabled={pending}
              aria-disabled={pending}
            >
              Sign In
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">
              Or continue With
            </span>
            <hr className="border-dashed" />
          </div>

          <div className="grid grid-cols-1">
            <Button type="button" variant="outline">
              <Icons.google />
              <span>Google</span>
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Don&apos;t have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/sign-up">Create account</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
