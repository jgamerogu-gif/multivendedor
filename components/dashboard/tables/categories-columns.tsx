
"use client";



import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Category {
  id: string;
  name: string;
  url: string;
  featured: boolean;
}

export const categoriesColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        /{row.original.url}
      </span>
    ),
  },
  {
    accessorKey: "featured",
    header: "Estado",
    cell: ({ row }) =>
      row.original.featured ? "Destacada" : "Normal",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const category = row.original;

      return (
      <DropdownMenu>
         <DropdownMenuTrigger
          aria-label={`Acciones de ${category.name}`}
          className="
          inline-flex size-9 items-center justify-center
          rounded-md
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

    <DropdownMenuItem asChild>
      <Link
        href={`/dashboard/admin/categories/${category.id}`}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Editar
      </Link>
    </DropdownMenuItem>

    <DropdownMenuItem asChild>
      <Link
        href={`/dashboard/admin/categories/${category.id}`}
        className="text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Eliminar
      </Link>
    </DropdownMenuItem>
  </DropdownMenuGroup>
</DropdownMenuContent>
 </DropdownMenu>
      );
    },
  },
];
