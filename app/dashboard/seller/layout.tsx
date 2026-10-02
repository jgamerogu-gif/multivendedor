import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
export default async function SellerLayout({
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

  if (!dbUser || dbUser.role !== "SELLER") {
    redirect("/");
  }

 return (
  <div className="min-h-screen w-full overflow-x-hidden">
    <Header isAdmin={false} />

    <div className="min-w-0 pt-[75px] xl:pl-[300px]">
      <Sidebar isAdmin={false} />

      <main className="min-w-0 p-4 sm:p-5 lg:p-6">
        {children}
      </main>
    </div>
    </div>
  );
}