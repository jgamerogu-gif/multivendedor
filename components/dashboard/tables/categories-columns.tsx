

"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { CategoryActions } from "./category-actions";

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
      row.original.featured
        ? "Destacada"
        : "Normal",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <CategoryActions category={row.original} />
    ),
  },
];
