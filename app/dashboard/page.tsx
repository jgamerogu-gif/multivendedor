import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export default async function DashboardPage() {
  const { userId } = await auth();

  // No autenticado
  if (!userId) {
    redirect("/sign-in");
  }

  // Buscamos el usuario real en nuestra base de datos
  const dbUser = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      role: true,
    },
  });

  // El usuario todavía no existe en nuestra BD
  if (!dbUser) {
    redirect("/");
  }

  // Administrador
  if (dbUser.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  // Vendedor
  if (dbUser.role === "SELLER") {
    redirect("/dashboard/seller");
  }

  // Usuario normal
  redirect("/");
}