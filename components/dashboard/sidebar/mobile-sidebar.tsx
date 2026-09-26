
"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import SidebarLinks from "./sidebar-links";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Cerrar con Escape y bloquear el scroll del fondo.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
      menuButtonRef.current?.focus();
    };
  }, [open]);

  // Cerrar el menú cuando se navega a otra página.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <Button
        ref={menuButtonRef}
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        aria-controls="mobile-navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Fondo oscuro */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            tabIndex={-1}
          />

          {/* Panel móvil */}
          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="
                absolute inset-y-0 left-0
                flex w-[min(85vw,320px)] flex-col
                overflow-y-auto
                border-r bg-background
                px-4 pt-4 pb-8
                shadow-xl
            "
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src="/assets/icons/logo.png"
                  alt="Logotipo de Multivendedor"
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 object-contain"
                />

                <div className="min-w-0">
                  <p className="truncate text-base font-bold">
                    Multivendedor
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Administración
                  </p>
                </div>
              </div>

              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="my-5 h-px bg-border" />

            {/* Enlaces existentes */}
            <nav
              aria-label="Navegación principal"
              className="flex-1"
            >
              <SidebarLinks
                onNavigate={() => setOpen(false)}
              />
            </nav>

            {/* Perfil */}
            <div className="mt-auto border-t pt-5 pb-6">
              <div className="flex min-w-0 items-center gap-3">
                <UserButton />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {user?.fullName ?? "Administrador"}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress ??
                      "Mi cuenta"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
