
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


// Obtener todas las categorías para el panel administrativo.
export async function getAllCategories() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No autorizado");
  }

  // Verificamos el rol desde nuestra base de datos.
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

  // Obtenemos las categorías más recientes primero.
  const categories = await db.category.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return categories;
}
