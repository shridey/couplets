"use client";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { signUp } from "@/app/api/auth/actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Page() {
  const initialState = { errorMessage: null };
  const [state, formAction, pending] = useActionState(signUp, initialState);

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
              Create a Couplets Account
            </h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="block text-sm">
                Full Name
              </Label>
              <Input
                type="text"
                required
                autoComplete="name"
                name="fullName"
                id="fullName"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                autoComplete="email"
                name="email"
                id="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="block text-sm">
                Username
              </Label>
              <Input
                type="text"
                required
                autoComplete="username"
                name="username"
                id="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="block text-sm">
                Password
              </Label>
              <Input type="password" required name="password" id="password" />
            </div>

            <Button
              className="w-full"
              disabled={pending}
              aria-disabled={pending}
            >
              Sign Up
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
            Have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
