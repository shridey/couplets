"use client";
import { useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Icons } from "./icons";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await authClient.emailOtp.checkVerificationOtp(
      {
        email: email!,
        type: "forget-password",
        otp: otp,
      },
      {
        onRequest: () => setPending(true),
        onError: () => {
          setPending(false);
          toast.error("Error verifying the OTP");
        },
        onSuccess: () => {
          setPending(false);
          redirect(
            `/sign-in/forgot-password/reset-password?email=${encodeURIComponent(
              email!
            )}&otp=${encodeURIComponent(otp)}`
          );
        },
      }
    );
  };

  const handleResendOTP = async () => {
    await authClient.forgetPassword.emailOtp(
      {
        email: email!,
      },
      {
        onRequest: () => setPending(true),
        onError: () => {
          setPending(false);
          toast.error("Error sending the OTP");
        },
        onSuccess: () => {
          setPending(false);
          toast.success("New OTP sent to you email");
        },
      }
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <Icons.logo className="size-6" />
            </div>
            <span className="sr-only">Couplets.</span>
            <h1 className="text-xl font-bold">Enter verification code</h1>
            <FieldDescription>
              We sent a 6-digit code to your email address
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP
              maxLength={6}
              id="otp"
              value={otp}
              onChange={setOtp}
              required
              containerClassName="gap-4"
              disabled={pending}
              suppressHydrationWarning
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-600 hover:underline disabled:opacity-50"
                disabled={pending}
              >
                Resend
              </button>
            </FieldDescription>
          </Field>
          <Field>
            <Button
              type="submit"
              disabled={pending || otp.length !== 6}
              className="w-full"
            >
              {pending && <Spinner className="mr-2" />}
              Verify
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
