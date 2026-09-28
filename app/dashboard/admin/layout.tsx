import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
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
  <div className="min-h-screen w-full overflow-x-hidden">
    <Header />

    <div className="min-w-0 pt-14 xl:pt-[75px] xl:pl-[300px]">
      <Sidebar isAdmin={dbUser.role === "ADMIN"} />

      <main className="min-w-0 p-4 sm:p-5 lg:p-6">
        {children}
      </main>
    </div>
  </div>
);
}