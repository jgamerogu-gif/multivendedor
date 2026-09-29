"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { SubCategoryActions } from "./subcategory-actions";

export interface SubCategory {
  id: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

export const subcategoriesColumns: ColumnDef<SubCategory>[] = [
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
    id: "category",
    header: "Categoría padre",
    cell: ({ row }) => (
      <span>{row.original.category.name}</span>
    ),
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
  cell: ({ row }) => (
    <SubCategoryActions subcategory={row.original} />
  ),
},
];