"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { SubCategory } from "./subcategories-columns";

interface SubCategoryActionsProps {
  subcategory: SubCategory;
  variant?: "menu" | "buttons";
}

export function SubCategoryActions({
  subcategory,
  variant = "menu",
}: SubCategoryActionsProps) {
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/subcategories/${subcategory.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "No se pudo eliminar la subcategoría"
        );
      }

      toast.success("Subcategoría eliminada correctamente");

      setConfirmOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la subcategoría"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {variant === "buttons" ? (
        <div className="grid w-full grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/admin/subcategories/${subcategory.id}`
              )
            }
            className="
              inline-flex min-h-10 items-center justify-center
              gap-2 rounded-md border px-3 text-sm font-medium
              transition-colors hover:bg-accent
            "
          >
            <Pencil className="size-4" />
            Editar
          </button>

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="
              inline-flex min-h-10 items-center justify-center
              gap-2 rounded-md border border-destructive/40
              px-3 text-sm font-medium text-destructive
              transition-colors hover:bg-destructive/10
            "
          >
            <Trash2 className="size-4" />
            Eliminar
          </button>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Acciones de ${subcategory.name}`}
            className="
              inline-flex size-9 items-center justify-center
              rounded-md hover:bg-muted
            "
          >
            <MoreHorizontal className="size-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/dashboard/admin/subcategories/${subcategory.id}`
                  )
                }
              >
                <Pencil className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setConfirmOpen(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {confirmOpen && (
        <div
          className="
            fixed inset-0 z-50 flex items-center
            justify-center bg-black/60 p-4
          "
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-subcategory-title"
            aria-describedby="delete-subcategory-description"
            className="
              w-full max-w-md rounded-xl border
              bg-background p-6 shadow-xl
            "
          >
            <h2
              id="delete-subcategory-title"
              className="text-lg font-semibold"
            >
              ¿Eliminar subcategoría?
            </h2>

            <p
              id="delete-subcategory-description"
              className="mt-3 text-sm text-muted-foreground"
            >
              ¿Seguro que deseas eliminar{" "}
              <strong>{subcategory.name}</strong>?
              Esta acción no se puede deshacer.
            </p>

            <div
              className="
                mt-6 flex flex-col-reverse gap-3
                sm:flex-row sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="
                  rounded-md border px-4 py-2
                  text-sm font-medium hover:bg-muted
                  disabled:opacity-50
                "
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="
                  rounded-md bg-destructive
                  px-4 py-2 text-sm font-medium
                  text-white disabled:opacity-50
                "
              >
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
