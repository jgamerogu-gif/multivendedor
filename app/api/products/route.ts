import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      price,
      image,
      url,
      stock,
      featured,
      categoryId,
    } = body;

    // Validaciones
    if (!name) {
      return new NextResponse("El nombre es obligatorio", {
        status: 400,
      });
    }

    if (!description) {
      return new NextResponse("La descripción es obligatoria", {
        status: 400,
      });
    }

    if (price === undefined || price === null) {
      return new NextResponse("El precio es obligatorio", {
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

    if (!categoryId) {
      return new NextResponse("La categoría es obligatoria", {
        status: 400,
      });
    }

    // Verificar que la categoría exista
const category = await db.category.findUnique({
  where: {
    id: categoryId,
  },
});

if (!category) {
  return new NextResponse("La categoría no existe", {
    status: 404,
  });
}

    // Evitar URLs duplicadas
    const existingProduct = await db.product.findUnique({
      where: {
        url,
      },
    });

    if (existingProduct) {
      return new NextResponse(
        "Ya existe un producto con esa URL",
        {
          status: 409,
        }
      );
    }

    // Crear producto
    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        image,
        url,
        stock: stock ?? 0,
        featured: featured ?? false,
        categoryId,
        
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_POST]", error);

    return new NextResponse(
      "Error interno del servidor",
      {
        status: 500,
      }
    );
  }
}