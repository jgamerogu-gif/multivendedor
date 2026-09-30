import Link from "next/link";
import { Plus } from "lucide-react";



import SubcategoriesTable from "@/components/dashboard/tables/subcategories-table";
import { db } from "@/lib/db";

export default async function SubcategoriesPage() {
  const subcategories = await db.subCategory.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

return (
  <main className="min-w-0 space-y-6 pb-8">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div className="space-y-1">
    <p className="text-sm font-medium text-primary">
      Administración / Catálogo
    </p>

    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
      Subcategorías
    </h1>

    <p className="text-sm text-muted-foreground">
      Administra las subcategorías de tu marketplace.
    </p>
  </div>

  <Link
    href="/dashboard/admin/subcategories/new"
    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
  >
    <Plus className="size-4" aria-hidden="true" />
    Nueva subcategoría
  </Link>
      </header>

      <SubcategoriesTable subcategories={subcategories} />
    </main>
  );
}