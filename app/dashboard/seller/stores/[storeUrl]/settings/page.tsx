import StoreDetails from "@/components/dashboard/forms/store-details";
import { db } from "@/lib/db";
interface StoreSettingsPageProps {
  params: Promise<{
    storeUrl: string;
  }>;
}

export default async function StoreSettingsPage({
  params,
}: StoreSettingsPageProps) {
  const { storeUrl } = await params;

  const store = await db.store.findUnique({
  where: {
    url: storeUrl,
  },
});

if (!store) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tienda no encontrada</h1>
    </div>
  );
}

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Configuración de la tienda
      </h1>

      <p className="mt-2 text-muted-foreground">
        Tienda: {storeUrl}
      </p>

      <StoreDetails data={store} />
    </div>

  );
}