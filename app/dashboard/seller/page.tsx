import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export default async function SellerPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!dbUser || dbUser.role !== "SELLER") {
    redirect("/");
  }

  const stores = await db.store.findMany({
    where: {
      userId: dbUser.id,
    },
    select: {
      url: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Si todavía no tiene tiendas, debe crear una.
  if (stores.length === 0) {
    redirect("/dashboard/seller/stores/new");
  }

  // Si ya tiene tiendas, entramos a la primera.
  redirect(`/dashboard/seller/stores/${stores[0].url}`);
}