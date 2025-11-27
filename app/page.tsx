import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    if (session.user.username) {
      redirect("/home");
    } else {
      redirect("/sign-up/complete-profile");
    }
  } else {
    redirect("/sign-in");
  }
}
