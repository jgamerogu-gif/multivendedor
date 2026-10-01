import CategoryDetails from "@/components/dashboard/forms/category-details";
import BackLink from "@/components/shared/back-link";

export default function AdminNewCategoryPage() {
  return (
    <div className="space-y-6">
      <BackLink
        href="/dashboard/admin/categories"
        label="Categorías"
      />

      <CategoryDetails />
    </div>
  );
}