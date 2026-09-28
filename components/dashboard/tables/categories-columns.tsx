

"use client";
import Image from "next/image";

import type { ColumnDef } from "@tanstack/react-table";

import { CategoryActions } from "./category-actions";

export interface Category {
  id: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
}

export const categoriesColumns: ColumnDef<Category>[] = [
  {
  accessorKey: "image",
  header: "Imagen",
  cell: ({ row }) => (
    <div className="relative size-14 overflow-hidden rounded-xl border bg-muted">
      <Image
        src={row.original.image}
        alt={`Imagen de ${row.original.name}`}
        fill
        sizes="56px"
        className="object-cover"
      />
    </div>
  ),
},

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
