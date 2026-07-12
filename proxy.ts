import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

const isWebhookRoute = createRouteMatcher([
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Permitir acceso público a los webhooks
  if (isWebhookRoute(req)) {
    return;
  }

  // Proteger el dashboard
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ico|ttf|woff2?|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};