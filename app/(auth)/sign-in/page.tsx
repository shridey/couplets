import { SignInForm } from "@/components/sign-in-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/home");
  }

  return <SignInForm />;
}
