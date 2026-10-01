import SubCategoryDetails from "@/components/dashboard/forms/subcategory-details";
import BackLink from "@/components/shared/back-link";
import { db } from "@/lib/db";

export default async function NewSubcategoryPage() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <BackLink
        href="/dashboard/admin/subcategories"
        label="Subcategorías"
      />

      <SubCategoryDetails categories={categories} />
    </div>
  );
}