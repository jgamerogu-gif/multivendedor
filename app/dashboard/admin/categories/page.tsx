import Link from "next/link";
import { Plus } from "lucide-react";
import CategoriesTable from "@/components/dashboard/tables/categories-table";
import { getAllCategories } from "@/queries/category";

export default async function AdminCategories() {
  const categories = await getAllCategories();

  return (
    <main className="min-w-0 space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">Administración / Catálogo</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Categorías</h1>
          <p className="text-sm text-muted-foreground">
            Organiza el catálogo y facilita que los compradores encuentren productos.
          </p>
        </div>
        <Link
          href="/dashboard/admin/categories/new"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nueva categoría
        </Link>
      </header>

      <CategoriesTable categories={categories} />
    </main>
  );
}
