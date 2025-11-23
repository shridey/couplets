import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { Spinner } from "@/components/ui/spinner";

export default async function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
