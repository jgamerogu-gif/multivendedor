import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multivendedor",
  description: "Marketplace multivendedor para comprar y vender productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="flex h-16 items-center justify-end gap-4 border-b px-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="cursor-pointer rounded-md border px-4 py-2 text-sm font-medium">
                  Iniciar sesión
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="cursor-pointer rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                  Registrarse
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>

          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}