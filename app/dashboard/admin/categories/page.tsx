
import Link from "next/link";

import { Button } from "@/components/ui/button";
import CategoriesTable from "@/components/dashboard/tables/categories-table";
import { getAllCategories } from "@/queries/category";

export default async function AdminCategories() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div
        className="flex flex-col gap-4
        sm:flex-row sm:items-center
        sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold">
            Categorías
          </h1>

          <p className="text-sm text-muted-foreground">
            Administra las categorías del marketplace.
          </p>
        </div>

        <Link href="/dashboard/admin/categories/new">
          <Button>Nueva categoría</Button>
        </Link>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  );
}