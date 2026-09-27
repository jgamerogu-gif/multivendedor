
"use client";

import { useState } from "react";
import Link from "next/link";
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

import type { Category } from "./categories-columns";

interface CategoryActionsProps {
  category: Category;
}

export function CategoryActions({
  category,
}: CategoryActionsProps) {
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/categories/${category.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "No se pudo eliminar la categoría"
        );
      }

      toast.success(
        "Categoría eliminada correctamente"
      );

      setConfirmOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la categoría"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Acciones de ${category.name}`}
          className="
            inline-flex size-9 items-center
            justify-center rounded-md
            hover:bg-muted
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
          "
        >
          <MoreHorizontal
            className="h-5 w-5"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              Acciones
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
            router.push(`/dashboard/admin/categories/${category.id}`)
            }
            >
            <Pencil className="mr-2 size-4" />
            Editar
        </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setConfirmOpen(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

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
            aria-labelledby="delete-category-title"
            aria-describedby="delete-category-description"
            className="
              w-full max-w-md rounded-xl border
              bg-background p-6 shadow-xl
            "
          >
            <h2
              id="delete-category-title"
              className="text-lg font-semibold"
            >
              ¿Eliminar categoría?
            </h2>

            <p
              id="delete-category-description"
              className="mt-3 text-sm text-muted-foreground"
            >
              ¿Seguro que deseas eliminar
              {" "}
              <strong>{category.name}</strong>?
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
                  text-sm font-medium
                  hover:bg-muted
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
                  text-white
                  disabled:opacity-50
                "
              >
                {deleting
                  ? "Eliminando..."
                  : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
