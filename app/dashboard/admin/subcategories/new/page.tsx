import SubCategoryDetails from "@/components/dashboard/forms/subcategory-details";
import { db } from "@/lib/db";

export default async function NewSubcategoryPage() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return <SubCategoryDetails categories={categories} />;
}
