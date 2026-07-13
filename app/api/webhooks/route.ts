import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Falta CLERK_WEBHOOK_SECRET", {
      status: 500,
    });
  }

  // Obtenemos los encabezados enviados por Svix.
  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Faltan encabezados de Svix", {
      status: 400,
    });
  }

  // Leemos el cuerpo original del webhook.
  const payload = await req.text();

  const webhook = new Webhook(webhookSecret);

  let event: WebhookEvent;

  try {
    event = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Error verificando el webhook:", error);

    return new Response("Firma del webhook inválida", {
      status: 400,
    });
  }

  try {
    if (event.type === "user.created" || event.type === "user.updated") {
      const data = event.data;

      // Buscamos el correo principal del usuario.
      const primaryEmail = data.email_addresses.find(
        (emailAddress) =>
          emailAddress.id === data.primary_email_address_id,
      );

      const email =
        primaryEmail?.email_address ??
        data.email_addresses[0]?.email_address;

      if (!email) {
        return new Response("El usuario no tiene correo electrónico", {
          status: 400,
        });
      }

      // Unimos nombre y apellido.
      const name =
        [data.first_name, data.last_name]
          .filter(Boolean)
          .join(" ") || "Usuario";

      const user = {
        name,
        email,
      };

      const dbUser = await db.user.upsert({
        where: {
          email: user.email,
        },
        update: {
          name: user.name,
        },
        create: {
          ...user,
          role: "USER",
        },
      });

      console.log("Tipo de evento:", event.type);
      console.log("Usuario guardado en MySQL:", dbUser);
    }

    if (event.type === "user.deleted") {
      console.log("Usuario eliminado en Clerk:", event.data.id);
    }

    return new Response("Webhook recibido correctamente", {
      status: 200,
    });
  } catch (error) {
    console.error("Error trabajando con la base de datos:", error);

    return new Response("Error al guardar el usuario en MySQL", {
      status: 500,
    });
  }
}

