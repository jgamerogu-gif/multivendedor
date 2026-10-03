import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import type { Store } from "@/lib/generated/prisma/client";

export async function upsertStore(store: Partial<Store>) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No autorizado");
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user || user.role !== "SELLER") {
    throw new Error("Acceso denegado");
  }
  if (!store.id) {
    throw new Error("El ID de la tienda es obligatorio");
  }

  const existingStore = await db.store.findUnique({
    where: {
      id: store.id,
    },
  });

  if (!existingStore) {
    throw new Error("Tienda no encontrada");
  }

  if (existingStore.userId !== user.id) {
    throw new Error("No tienes permiso para modificar esta tienda");
  }

  const duplicateStore = await db.store.findFirst({
  where: {
    id: {
      not: store.id,
    },
    OR: [
      ...(store.email ? [{ email: store.email }] : []),
      ...(store.url ? [{ url: store.url }] : []),
    ],
  },
});

if (duplicateStore) {
  throw new Error("El correo o la URL ya están siendo utilizados por otra tienda");
}
  
  const updatedStore = await db.store.update({
    where: {
      id: store.id,
    },
    data: {
      name: store.name,
      description: store.description,
      email: store.email,
      phone: store.phone,
      logo: store.logo,
      cover: store.cover,
      url: store.url,
      featured: store.featured,
    },
  });

  return updatedStore;
}
