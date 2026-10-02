interface StorePageProps {
  params: Promise<{
    storeUrl: string;
  }>;
}

export default async function StorePage({
  params,
}: StorePageProps) {
  const { storeUrl } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Dashboard de la tienda
      </h1>

      <p className="mt-2 text-muted-foreground">
        Tienda: {storeUrl}
      </p>
    </div>
  );
}
