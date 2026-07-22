import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const role = user.privateMetadata?.role;

  if (!role || role === "USER") {
    redirect("/");
  }

  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (role === "SELLER") {
    redirect("/dashboard/seller");
  }

  redirect("/");
}