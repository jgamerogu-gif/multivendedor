interface StoreSettingsPageProps {
  params: Promise<{
    storeUrl: string;
  }>;
}

export default async function StoreSettingsPage({
  params,
}: StoreSettingsPageProps) {
  const { storeUrl } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Configuración de la tienda
      </h1>

      <p className="mt-2 text-muted-foreground">
        Tienda: {storeUrl}
      </p>
    </div>
  );
}