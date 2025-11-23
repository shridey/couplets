import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
      <p className="text-lg mb-4">You are successfully signed in.</p>

      {/* Display user information */}
      <div className="bg-muted p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
        <p>
          <strong>Name:</strong> {session.user.name || "Not provided"}
        </p>
        <p>
          <strong>Email:</strong> {session.user.email}
        </p>
        <p>
          <strong>Username:</strong> {session.user.username || "Not set"}
        </p>
      </div>

      <SignOutButton />
    </div>
  );
}
