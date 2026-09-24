
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  image: z.string().trim().min(1, "La imagen es obligatoria"),
  url: z.string().trim().min(1, "La URL es obligatoria"),
  featured: z.boolean().default(false),
});

export async function POST(req: Request) {
  try {
    // 1. Verificar que el usuario haya iniciado sesión.
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("No autorizado", {
        status: 401,
      });
    }

    // 2. Consultar el rol en nuestra base de datos.
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
        "No tienes permisos para crear categorías",
        {
          status: 403,
        }
      );
    }

    // 3. Validar los datos recibidos.
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse(
        parsed.error.issues[0]?.message ??
          "Datos de categoría inválidos",
        {
          status: 400,
        }
      );
    }

    const { name, image, url, featured } = parsed.data;

    // 4. Evitar nombres duplicados.
    const existingName = await db.category.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    });

    if (existingName) {
      return new NextResponse(
        "Ya existe una categoría con ese nombre",
        {
          status: 409,
        }
      );
    }

    // 5. Evitar URL duplicadas.
    const existingUrl = await db.category.findUnique({
      where: {
        url,
      },
    });

    if (existingUrl) {
      return new NextResponse(
        "Ya existe una categoría con esa URL",
        {
          status: 409,
        }
      );
    }

    // 6. Crear la categoría.
    const category = await db.category.create({
      data: {
        name,
        image,
        url,
        featured,
      },
    });

    return NextResponse.json(category, {
      status: 201,
    });
  } catch (error) {
    console.error("[CATEGORY_POST]", error);

    return new NextResponse(
      "Error interno del servidor",
      {
        status: 500,
      }
    );
  }
}