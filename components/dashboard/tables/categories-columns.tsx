
"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

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
  cell: ({ row }) => (
    <Link
      href={`/dashboard/admin/categories/${row.original.id}`}
    >
      <Button variant="outline" size="sm">
        Editar
      </Button>
    </Link>
  ),
},

];
