import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";

const subcategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  image: z.string().trim().min(1, "La imagen es obligatoria"),
  url: z.string().trim().min(1, "La URL es obligatoria"),
  featured: z.boolean().default(false),
  categoryId: z.string().trim().min(1, "La categoría es obligatoria"),
});

interface SubcategoryRouteProps {
  params: Promise<{
    subcategoryId: string;
  }>;
}

export async function PATCH(
  req: Request,
  { params }: SubcategoryRouteProps
) {
  try {
    // 1. Verificar que el usuario inició sesión
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("No autorizado", {
        status: 401,
      });
    }

    // 2. Verificar que el usuario sea ADMIN
    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("No tienes permisos para editar subcategorías", {
        status: 403,
      });
    }

    // 3. Obtener el ID de la subcategoría
    const { subcategoryId } = await params;

    // 4. Leer y validar los datos enviados
    const body = await req.json();
    const parsed = subcategorySchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse(
        parsed.error.issues[0]?.message ?? "Datos inválidos",
        {
          status: 400,
        }
      );
    }

    const { name, image, url, featured, categoryId } = parsed.data;

    // 5. Verificar que la subcategoría exista
    const existingSubcategory = await db.subCategory.findUnique({
      where: {
        id: subcategoryId,
      },
    });

    if (!existingSubcategory) {
      return new NextResponse("Subcategoría no encontrada", {
        status: 404,
      });
    }

    // 6. Evitar nombres duplicados
    const duplicateSubcategory = await db.subCategory.findFirst({
      where: {
        name,
        NOT: {
          id: subcategoryId,
        },
      },
    });

    if (duplicateSubcategory) {
      return new NextResponse(
        "Ya existe una subcategoría con ese nombre",
        {
          status: 409,
        }
      );
    }

    // 7. Actualizar la subcategoría
    const subcategory = await db.subCategory.update({
      where: {
        id: subcategoryId,
      },
      data: {
        name,
        image,
        url,
        featured,
        categoryId,
      },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("[SUBCATEGORY_PATCH]", error);

    return new NextResponse("Error interno del servidor", {
      status: 500,
    });
  }
}

export async function DELETE(
  _req: Request,
  { params }: SubcategoryRouteProps
) {
  try {
    // 1. Verificar que el usuario inició sesión
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("No autorizado", {
        status: 401,
      });
    }

    // 2. Verificar que el usuario sea ADMIN
    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return new NextResponse(
        "No tienes permisos para eliminar subcategorías",
        {
          status: 403,
        }
      );
    }

    // 3. Obtener el ID de la URL
    const { subcategoryId } = await params;

    // 4. Verificar que la subcategoría exista
    const existingSubcategory = await db.subCategory.findUnique({
      where: {
        id: subcategoryId,
      },
    });

    if (!existingSubcategory) {
      return new NextResponse("Subcategoría no encontrada", {
        status: 404,
      });
    }

    // 5. Eliminar la subcategoría
    const deletedSubcategory = await db.subCategory.delete({
      where: {
        id: subcategoryId,
      },
    });

    // 6. Responder correctamente
    return NextResponse.json({
      message: "Subcategoría eliminada correctamente",
      subcategory: deletedSubcategory,
    });
  } catch (error) {
    console.error("[SUBCATEGORY_DELETE]", error);

    return new NextResponse("Error interno del servidor", {
      status: 500,
    });
  }
}