import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface CategoryRouteProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export async function PATCH(
  req: Request,
  { params }: CategoryRouteProps
) {
  try {
    const { categoryId } = await params;
    const body = await req.json();

    const { name, image, url, featured } = body;

    if (!name) {
      return new NextResponse("El nombre es obligatorio", {
        status: 400,
      });
    }

    if (!image) {
      return new NextResponse("La imagen es obligatoria", {
        status: 400,
      });
    }

    if (!url) {
      return new NextResponse("La URL es obligatoria", {
        status: 400,
      });
    }

    // Buscar si existe OTRA categoría con la misma URL
    const existingCategory = await db.category.findFirst({
      where: {
        url,
        NOT: {
          id: categoryId,
        },
      },
    });

    if (existingCategory) {
      return new NextResponse(
        "Ya existe otra categoría con esa URL",
        {
          status: 409,
        }
      );
    }

    const category = await db.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        image,
        url,
        featured: featured ?? false,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);

    return new NextResponse(
      "Error interno del servidor",
      {
        status: 500,
      }
    );
  }
}

// ========================================
// ELIMINAR CATEGORÍA
// ========================================

export async function DELETE(
  _req: Request,
  { params }: CategoryRouteProps
) {
  try {
    const { categoryId } = await params;

    const category = await db.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);

    return new NextResponse(
      "Error interno del servidor",
      {
        status: 500,
      }
    );
  }
}