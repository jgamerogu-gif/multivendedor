
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth/admin";
import { NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";
import { z } from "zod";

interface CategoryRouteProps {
  params: Promise<{
    categoryId: string;
  }>;
}

const categorySchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  image: z.string().trim().min(1, "La imagen es obligatoria"),
  url: z.string().trim().min(1, "La URL es obligatoria"),
  featured: z.boolean().default(false),
});

export async function PATCH(
  req: Request,
  { params }: CategoryRouteProps
) {
  try {
    if (!(await isAdmin())) {
      return new NextResponse("No autorizado", {
        status: 403,
      });
    }

    const { categoryId } = await params;

    const body = await req.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse(
        parsed.error.issues[0]?.message ??
          "Datos inválidos",
        { status: 400 }
      );
    }

    const { name, image, url, featured } = parsed.data;

    // Comprobar que la categoría exista.
    const currentCategory = await db.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!currentCategory) {
      return new NextResponse(
        "La categoría no existe",
        { status: 404 }
      );
    }

    // Comprobar que otra categoría no tenga el mismo nombre.
    const existingName = await db.category.findFirst({
      where: {
        name,
        NOT: {
          id: categoryId,
        },
      },
    });

    if (existingName) {
      return new NextResponse(
        "Ya existe otra categoría con ese nombre",
        { status: 409 }
      );
    }

    // Comprobar que otra categoría no tenga la misma URL.
    const existingUrl = await db.category.findFirst({
      where: {
        url,
        NOT: {
          id: categoryId,
        },
      },
    });

    if (existingUrl) {
      return new NextResponse(
        "Ya existe otra categoría con esa URL",
        { status: 409 }
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
        featured,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === "P2025") {
        return new NextResponse(
          "La categoría no existe",
          { status: 404 }
        );
      }

      if (error.code === "P2002") {
        return new NextResponse(
          "El nombre o la URL ya está en uso",
          { status: 409 }
        );
      }
    }

    return new NextResponse(
      "Error interno del servidor",
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: CategoryRouteProps
) {
  try {
    if (!(await isAdmin())) {
      return new NextResponse("No autorizado", {
        status: 403,
      });
    }

    const { categoryId } = await params;

    const category = await db.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return new NextResponse(
        "La categoría no existe",
        { status: 404 }
      );
    }

    return new NextResponse(
      "Error interno del servidor",
      { status: 500 }
    );
  }
}

// ========================================
