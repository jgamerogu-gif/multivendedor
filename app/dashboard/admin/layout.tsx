import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Header from "@/components/dashboard/header/header";
import { db } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      role: true,
    },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen w-full">
      <Header />

      <div className="w-full md:ml-75">
        <main className="mt-[75px] p-4">
          {children}
        </main>
      </div>
    </div>
  );
}