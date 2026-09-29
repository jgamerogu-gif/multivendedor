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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Subcategorías
        </h1>

        <p className="text-sm text-muted-foreground sm:text-base">
          Administra las subcategorías de tu marketplace.
        </p>
      </div>

      <SubcategoriesTable subcategories={subcategories} />
    </div>
  );
}
