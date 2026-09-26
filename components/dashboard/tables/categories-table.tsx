
"use client";

import { DataTable } from "@/components/ui/data-table";

import {
  categoriesColumns,
  type Category,
} from "@/components/dashboard/tables/categories-columns";

import { useMemo, useState } from "react";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  url: string;
  featured: boolean;
}

interface CategoriesTableProps {
  categories: Category[];
}

export default function CategoriesTable({
  categories,
}: CategoriesTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [featuredFilter, setFeaturedFilter] = useState<
  "all" | "featured" | "normal"
  >("all");
  const filteredCategories = useMemo(() => {
  const term = search.trim().toLowerCase();

  return categories
    .filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(term) ||
        category.url.toLowerCase().includes(term);

      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && category.featured) ||
        (featuredFilter === "normal" && !category.featured);

      return matchesSearch && matchesFeatured;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name, "es")
        : b.name.localeCompare(a.name, "es")
    );
}, [categories, search, featuredFilter, sortOrder]);

   
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / pageSize)
  );

  const paginatedCategories = filteredCategories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
  <div className="space-y-4">

    {/* Buscador y filtros */}
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

      {/* Buscador */}
      <div className="relative w-full lg:max-w-sm">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4
          -translate-y-1/2 text-muted-foreground"
        />

        <Input
          type="search"
          placeholder="Buscar categoría..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">

        <select
          value={featuredFilter}
          onChange={(event) => {
            setFeaturedFilter(
              event.target.value as "all" | "featured" | "normal"
            );
            setPage(1);
          }}
          aria-label="Filtrar categorías"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm sm:w-auto"
        >
          <option value="all">Todas las categorías</option>
          <option value="featured">Destacadas</option>
          <option value="normal">Normales</option>
        </select>

        <select
          value={sortOrder}
          onChange={(event) => {
            setSortOrder(event.target.value as "asc" | "desc");
            setPage(1);
          }}
          aria-label="Ordenar categorías"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm sm:w-auto"
        >
          <option value="asc">Nombre: A - Z</option>
          <option value="desc">Nombre: Z - A</option>
        </select>

      </div>
    </div>



      {/* Listado de categorías */}
      {/* Tabla reutilizable de categorías */}
      
    
{/* Vista móvil: tarjetas */}
<div className="space-y-3 md:hidden">
  {paginatedCategories.map((category) => (
    <div
      key={category.id}
      className="min-w-0 space-y-3 rounded-xl border bg-card p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="min-w-0 break-words font-semibold">
          {category.name}
        </h3>

        <Badge variant="secondary">
          {category.featured ? "Destacada" : "Normal"}
        </Badge>
      </div>

      <p className="break-all text-sm text-muted-foreground">
        /{category.url}
      </p>

      
<Link
  href={`/dashboard/admin/categories/${category.id}`}
  className="inline-flex h-9 w-full items-center justify-center rounded-md 
  border px-4 text-sm font-medium transition-colors hover:bg-accent"
>
  Editar
</Link>

    </div>
  ))}
</div>

{/* Vista tablet y escritorio: tabla reutilizable */}
<div className="hidden min-w-0 md:block">
  <DataTable
    columns={categoriesColumns}
    data={paginatedCategories}
  />
</div>

{/* Mensaje cuando no existen resultados */}
{filteredCategories.length === 0 && (
  <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
    {categories.length === 0
      ? "No hay categorías registradas."
      : "No se encontraron categorías."}
  </div>
)}


  <p className="text-xs text-muted-foreground">
  Mostrando{" "}
  {filteredCategories.length === 0
    ? 0
    : (page - 1) * pageSize + 1}
  {" - "}
  {Math.min(
    page * pageSize,
    filteredCategories.length
  )}{" "}
  de {filteredCategories.length} categorías
</p>

      {totalPages > 1 && (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <Button
      variant="outline"
      size="sm"
      disabled={page === 1}
      onClick={() => setPage((current) => current - 1)}
    >
      Anterior
    </Button>

    <span className="text-sm text-muted-foreground">
      Página {page} de {totalPages}
    </span>

    <Button
      variant="outline"
      size="sm"
      disabled={page === totalPages}
      onClick={() => setPage((current) => current + 1)}
    >
      Siguiente
    </Button>
  </div>
)}
        
    </div>
  );
}