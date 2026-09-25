
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const filteredCategories = useMemo(() => {
  const term = search.trim().toLowerCase();

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.url.toLowerCase().includes(term)
    );
  }, [categories, search]);

   
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
      {/* Aquí continúa tu buscador y el resto del JSX */}
      <div className="relative w-full sm:max-w-sm">
     <Search
          className="absolute left-3 top-1/2
          h-4 w-4 -translate-y-1/2
          text-muted-foreground"
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

      {/* Listado de categorías */}
      <div className="overflow-hidden rounded-md border">
        {filteredCategories.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            {categories.length === 0
              ? "No hay categorías registradas."
              : "No se encontraron categorías."}
          </div>
        ) : (
          <div className="divide-y">
            {paginatedCategories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col gap-3 p-4
                sm:flex-row sm:items-center
                sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="break-words font-medium">
                    {category.name}
                  </p>

                  <p className="break-all text-sm text-muted-foreground">
                    /{category.url}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm">
                    {category.featured
                      ? "Destacada"
                      : "Normal"}
                  </span>

                 <Link
                    href={`/dashboard/admin/categories/${category.id}`}
                    >
                        <Button variant="outline" size="sm">
                         Editar
                        </Button>
                </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

   
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