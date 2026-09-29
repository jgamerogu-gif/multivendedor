"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  subcategoriesColumns,
  type SubCategory,
} from "@/components/dashboard/tables/subcategories-columns";

import { SubCategoryActions } from "./subcategory-actions";

interface SubcategoriesTableProps {
  subcategories: SubCategory[];
}

export default function SubcategoriesTable({
  subcategories,
}: SubcategoriesTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [featuredFilter, setFeaturedFilter] = useState<
    "all" | "featured" | "normal"
  >("all");

  const filteredSubcategories = useMemo(() => {
    const term = search.trim().toLowerCase();

    return subcategories
      .filter((subcategory) => {
        const matchesSearch =
          subcategory.name.toLowerCase().includes(term) ||
          subcategory.url.toLowerCase().includes(term) ||
          subcategory.category.name.toLowerCase().includes(term);

        const matchesFeatured =
          featuredFilter === "all" ||
          (featuredFilter === "featured" && subcategory.featured) ||
          (featuredFilter === "normal" && !subcategory.featured);

        return matchesSearch && matchesFeatured;
      })
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name, "es")
          : b.name.localeCompare(a.name, "es")
      );
  }, [subcategories, search, featuredFilter, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubcategories.length / pageSize)
  );

  const paginatedSubcategories = filteredSubcategories.slice(
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
            className="
              absolute left-3 top-1/2 h-4 w-4
              -translate-y-1/2 text-muted-foreground
            "
          />

          <Input
            type="search"
            placeholder="Buscar subcategoría..."
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
            aria-label="Filtrar subcategorías"
            className="
              h-9 w-full rounded-md border
              bg-background px-3 text-sm sm:w-auto
            "
          >
            <option value="all">Todas las subcategorías</option>
            <option value="featured">Destacadas</option>
            <option value="normal">Normales</option>
          </select>

          <select
            value={sortOrder}
            onChange={(event) => {
              setSortOrder(event.target.value as "asc" | "desc");
              setPage(1);
            }}
            aria-label="Ordenar subcategorías"
            className="
              h-9 w-full rounded-md border
              bg-background px-3 text-sm sm:w-auto
            "
          >
            <option value="asc">Nombre: A - Z</option>
            <option value="desc">Nombre: Z - A</option>
          </select>
        </div>
      </div>

      {/* Vista móvil y tablet: tarjetas */}
      <div
        className="
          grid grid-cols-1 gap-3
          sm:grid-cols-2
          min-[900px]:grid-cols-3
          xl:hidden
        "
      >
        {paginatedSubcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="
              min-w-0 space-y-3 rounded-xl
              border bg-card p-4 shadow-sm
            "
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-4">
                {/* Imagen */}
                <div
                  className="
                    relative size-20 shrink-0
                    overflow-hidden rounded-xl border bg-muted
                  "
                >
                  {subcategory.image ? (
                    <Image
                      src={subcategory.image}
                      alt={`Imagen de ${subcategory.name}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="
                        flex h-full items-center justify-center
                        text-center text-xs text-muted-foreground
                      "
                    >
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="min-w-0">
                  <h3 className="font-semibold">
                    {subcategory.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    /{subcategory.url}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Categoría:
                    <span className="ml-1 font-medium text-foreground">
                      {subcategory.category.name}
                    </span>
                  </p>
                </div>
              </div>

              <Badge variant="secondary">
                {subcategory.featured ? "Destacada" : "Normal"}
              </Badge>
            </div>

            {/* Acciones */}
            <div className="flex justify-end">
              <SubCategoryActions
                subcategory={subcategory}
                variant="buttons"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Vista escritorio */}
      <div className="hidden min-w-0 xl:block">
        <DataTable
          columns={subcategoriesColumns}
          data={paginatedSubcategories}
        />
      </div>

      {/* Sin resultados */}
      {filteredSubcategories.length === 0 && (
        <div
          className="
            rounded-lg border p-6 text-center
            text-sm text-muted-foreground
          "
        >
          {subcategories.length === 0
            ? "No hay subcategorías registradas."
            : "No se encontraron subcategorías."}
        </div>
      )}

      {/* Contador */}
      <p className="text-xs text-muted-foreground">
        Mostrando{" "}
        {filteredSubcategories.length === 0
          ? 0
          : (page - 1) * pageSize + 1}
        {" - "}
        {Math.min(
          page * pageSize,
          filteredSubcategories.length
        )}{" "}
        de {filteredSubcategories.length} subcategorías
      </p>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() =>
              setPage((current) => current - 1)
            }
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
            onClick={() =>
              setPage((current) => current + 1)
            }
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
