import CategoryDetails from "@/components/dashboard/forms/category-details";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { categoryId } = await params;

  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6">
      <CategoryDetails data={category} />
    </div>
  );
}