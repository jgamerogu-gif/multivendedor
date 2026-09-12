import Link from "next/link";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function AdminCategories() {
  const categories = await db.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categorías</h1>

          <p className="text-sm text-muted-foreground">
            Administra las categorías del marketplace.
          </p>
        </div>

        <Link href="/dashboard/admin/categories/new">
          <Button>Nueva categoría</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        {categories.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            No hay categorías registradas.
          </div>
        ) : (
          <div className="divide-y">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium">{category.name}</p>

                  <p className="text-sm text-muted-foreground">
                    /{category.url}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm">
                    {category.featured ? "Destacada" : "Normal"}
                  </span>

                  <Link
                    href={`/dashboard/admin/categories/${category.id}`}
                  >
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}