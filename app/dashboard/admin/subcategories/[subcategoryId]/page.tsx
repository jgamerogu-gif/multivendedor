import { notFound } from "next/navigation";

import SubCategoryDetails from "@/components/dashboard/forms/subcategory-details";
import { db } from "@/lib/db";

interface SubcategoryPageProps {
  params: Promise<{
    subcategoryId: string;
  }>;
}

export default async function SubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const { subcategoryId } = await params;

  const subcategory = await db.subCategory.findUnique({
    where: {
      id: subcategoryId,
    },
  });

  if (!subcategory) {
    notFound();
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <SubCategoryDetails
      data={subcategory}
      categories={categories}
    />
  );
}
