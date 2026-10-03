"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/dashboard/shared/image-upload";

import type { Store } from "@/lib/generated/prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface StoreDetailsProps {
  data?: Store;
}

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre no puede superar los 100 caracteres."),

  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(1000, "La descripción no puede superar los 1000 caracteres."),

  email: z.string().trim().email("Ingresa un correo electrónico válido."),

  phone: z
    .string()
    .trim()
    .min(7, "Ingresa un número de teléfono válido.")
    .max(20, "El teléfono no puede superar los 20 caracteres."),

  logo: z.string().min(1, "Selecciona un logo para la tienda."),

  cover: z.string().min(1, "Selecciona una portada para la tienda."),

  url: z
    .string()
    .trim()
    .min(3, "La URL debe tener al menos 3 caracteres.")
    .max(100, "La URL no puede superar los 100 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Usa solo letras minúsculas, números y guiones.",
    ),

  featured: z.boolean(),
});

type StoreFormValues = z.infer<typeof formSchema>;

const StoreDetails = ({ data }: StoreDetailsProps) => {
  const router = useRouter();
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      logo: data?.logo ?? "",
      cover: data?.cover ?? "",
      url: data?.url ?? "",
      featured: data?.featured ?? false,
    },
  });

  const onSubmit = async (values: StoreFormValues) => {
    if (!data?.id) {
      toast.error("No se encontró la tienda");
      return;
    }

    try {
      const response = await fetch(`/api/stores/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "No se pudo actualizar la tienda");
      }

      const updatedStore = await response.json();

      console.log("Tienda actualizada:", updatedStore);

      toast.success("Tienda actualizada correctamente");
      router.refresh();
    } catch (error) {
      console.error("Error al actualizar la tienda:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar la tienda",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {data ? "Información de la tienda" : "Crear nueva tienda"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {data
            ? "Actualiza la información y configuración de tu tienda."
            : "Completa la información para configurar tu nueva tienda."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>

                <FormControl>
                  <Input placeholder="Ej. Electrónica" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo de la tienda</FormLabel>

                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    type="profile"
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Portada */}
          <FormField
            control={form.control}
            name="cover"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portada de la tienda</FormLabel>

                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    type="cover"
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>

                <FormControl>
                  <Input placeholder="electronica" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <div className="space-y-1 leading-none">
                  <FormLabel>Tienda destacada</FormLabel>

                  <p className="text-sm text-muted-foreground">
                    Mostrar esta tienda como destacada.
                  </p>
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full sm:w-auto"
            >
              {form.formState.isSubmitting
                ? "Guardando..."
                : data
                  ? "Guardar cambios"
                  : "Crear categoría"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StoreDetails;
