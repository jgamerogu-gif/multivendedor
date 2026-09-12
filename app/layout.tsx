import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { ThemeProvider } from "@/components/shared/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Multivendedor",
  description: "Plataforma ecommerce multivendedor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>

        <body>
          
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </body>

      </html>
    </ClerkProvider>
  );
}