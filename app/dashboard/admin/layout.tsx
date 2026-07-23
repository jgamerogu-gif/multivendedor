import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Header from "@/components/dashboard/header/header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user || user.privateMetadata?.role !== "ADMIN") {
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