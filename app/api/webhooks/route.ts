import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Falta CLERK_WEBHOOK_SECRET", {
      status: 500,
    });
  }

  // En Next.js 16, headers() es asíncrono
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

  const eventType = event.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    console.log("Tipo de evento:", eventType);
    console.log("ID del usuario:", event.data.id);
    console.log("Datos del usuario:", event.data);
  }

  if (eventType === "user.deleted") {
    console.log("Usuario eliminado:", event.data.id);
  }

  return new Response("Webhook recibido correctamente", {
    status: 200,
  });
}