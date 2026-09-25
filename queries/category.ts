
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Buscar una categoría por su ID.
// Solo los administradores pueden consultar sus datos para editarlos.
export async function getCategoryById(categoryId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No autorizado");
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      role: true,
    },
  });

  if (user?.role !== "ADMIN") {
    throw new Error("Acceso denegado");
  }

  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  return category;
}