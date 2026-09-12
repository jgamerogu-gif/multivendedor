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

import type { Category } from "@/lib/generated/prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CategoryDetailsProps {
  data?: Category;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  image: z.string().min(1, {
    message: "La imagen es obligatoria.",
  }),
  url: z.string().min(1, {
    message: "La URL es obligatoria.",
  }),
  featured: z.boolean(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryDetails = ({ data }: CategoryDetailsProps) => {
  const router = useRouter(); 
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name ?? "",
      image: data?.image ?? "",
      url: data?.url ?? "",
      featured: data?.featured ?? false,
    },
  });

const onSubmit = async (values: CategoryFormValues) => {
  try {
    const url = data
      ? `/api/categories/${data.id}`
      : "/api/categories";

    const method = data ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const message = await response.text();

      throw new Error(
        message ||
          (data
            ? "No se pudo actualizar la categoría"
            : "No se pudo crear la categoría")
      );
    }

    const category = await response.json();

    console.log(
      data ? "Categoría actualizada:" : "Categoría creada:",
      category
    );

    toast.success(
      data
        ? "Categoría actualizada correctamente"
        : "Categoría creada correctamente"
    );

    if (!data) {
      form.reset({
        name: "",
        image: "",
        url: "",
        featured: false,
      });
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocurrió un error inesperado";

    toast.error(message);

    console.error(
      data
        ? "Error actualizando categoría:"
        : "Error creando categoría:",
      error
    );
  }
};
// ========================================


const onDelete = async () => {
  if (!data) return;

  const confirmed = window.confirm(
    `¿Seguro que deseas eliminar la categoría "${data.name}"?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `/api/categories/${data.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const message = await response.text();

      throw new Error(
        message || "No se pudo eliminar la categoría"
      );
    }

    toast.success("Categoría eliminada correctamente");

    router.push("/dashboard/admin/categories");
    router.refresh();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo eliminar la categoría";

    toast.error(message);

    console.error(
      "Error eliminando categoría:",
      error
    );
  }
};



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {data ? "Editar categoría" : "Nueva categoría"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {data
            ? "Actualiza la información de la categoría."
            : "Completa los datos para crear una nueva categoría."}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Ej. Electrónica"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>

                <FormControl>
                  <Input
                    placeholder="https://ejemplo.com/imagen.jpg"
                    {...field}
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
                  <Input
                    placeholder="electronica"
                    {...field}
                  />
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
                  <FormLabel>Categoría destacada</FormLabel>

                  <p className="text-sm text-muted-foreground">
                    Mostrar esta categoría como destacada.
                  </p>
                </div>
              </FormItem>
            )}
          />

          <div className="flex items-center gap-3">
            <Button type="submit">
              {data ? "Guardar cambios" : "Crear categoría"}
            </Button>

            {data && (
           <Button
            type="button"
            variant="destructive"
           onClick={onDelete}
          >
             Eliminar categoría
        </Button>
        )}
      </div>

        </form>
      </Form>
    </div>
  );
};

export default CategoryDetails;