import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
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

    // Buscar si ya existe una categoría con la misma URL
    const existingCategory = await db.category.findUnique({
      where: {
        url,
      },
    });

    if (existingCategory) {
      return new NextResponse(
        "Ya existe una categoría con esa URL",
        {
          status: 409,
        }
      );
    }

    const category = await db.category.create({
      data: {
        name,
        image,
        url,
        featured: featured ?? false,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_POST]", error);

    return new NextResponse("Error interno del servidor", {
      status: 500,
    });
  }
}