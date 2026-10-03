import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { upsertStore } from "@/queries/store";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { storeId } = await params;

    const body = await req.json();

    const { name, logo, cover, url, featured } = body;

    if (!name || !url) {
      return new NextResponse("Nombre y URL son obligatorios", {
        status: 400,
      });
    }

    const store = await db.store.findFirst({
      where: {
        id: storeId,
        user: {
          clerkId: userId,
        },
      },
    });

    if (!store) {
      return new NextResponse("Tienda no encontrada o sin autorización", {
        status: 404,
      });
    }

   const updatedStore = await upsertStore({
  id: storeId,
  ...body,
});

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
