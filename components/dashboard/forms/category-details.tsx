import type { Category } from "@/lib/generated/prisma/client";

interface CategoryDetailsProps {
  data?: Category;
}

const CategoryDetails = ({ data }: CategoryDetailsProps) => {
  return (
    <div>
      Category Details
    </div>
  );
};

export default CategoryDetails;