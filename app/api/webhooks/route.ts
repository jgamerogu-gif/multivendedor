import { clerkClient } from "@clerk/nextjs/server";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Falta CLERK_WEBHOOK_SECRET", {
      status: 500,
    });
  }

  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Faltan encabezados de Svix", {
      status: 400,
    });
  }

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

      const name =
        [data.first_name, data.last_name]
          .filter(Boolean)
          .join(" ") || "Usuario";

      const dbUser = await db.user.upsert({
        where: {
          clerkId: data.id,
        },

        update: {
          name,
          email,
        },

        create: {
          clerkId: data.id,
          name,
          email,
          role: "USER",
        },
      });

      /*
       * Evitamos actualizar Clerk repetidamente.
       * Actualizar metadata puede producir otro evento user.updated.
       */
      const currentRole = data.private_metadata?.role;

      if (currentRole !== dbUser.role) {
        const client = await clerkClient();

        await client.users.updateUserMetadata(data.id, {
          privateMetadata: {
            role: dbUser.role,
          },
        });
      }

      console.log("Usuario sincronizado:", dbUser);
    }

    if (event.type === "user.deleted") {
      const clerkId = event.data.id;

      if (!clerkId) {
        return new Response("El evento no contiene el ID del usuario", {
          status: 400,
        });
      }

      const result = await db.user.deleteMany({
        where: {
          clerkId,
        },
      });

      console.log("Usuarios eliminados:", result.count);
    }

    return new Response("Webhook procesado correctamente", {
      status: 200,
    });
  } catch (error) {
    console.error("Error sincronizando el usuario:", error);

    return new Response("Error al acceder a la base de datos", {
      status: 500,
    });
  }
}