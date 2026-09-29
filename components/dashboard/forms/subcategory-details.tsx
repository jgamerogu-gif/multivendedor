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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/dashboard/shared/image-upload";

import type {
  Category,
  SubCategory,
} from "@/lib/generated/prisma/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SubCategoryDetailsProps {
  data?: SubCategory;
  categories: Category[];
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
  categoryId: z.string().min(1, {
    message: "Selecciona una categoría.",
  }),
});

type SubCategoryFormValues = z.infer<typeof formSchema>;

const SubCategoryDetails = ({
  data,
  categories,
}: SubCategoryDetailsProps) => {
  const router = useRouter();

  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name ?? "",
      image: data?.image ?? "",
      url: data?.url ?? "",
      featured: data?.featured ?? false,
      categoryId: data?.categoryId ?? "",
    },
  });

  const onSubmit = async (values: SubCategoryFormValues) => {
  try {
    const url = data
      ? `/api/subcategories/${data.id}`
      : "/api/subcategories";

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

      toast.error(
        message ||
          (data
            ? "No se pudo actualizar la subcategoría"
            : "No se pudo crear la subcategoría")
      );

      return;
    }

    const subcategory = await response.json();

    console.log(
      data ? "Subcategoría actualizada:" : "Subcategoría creada:",
      subcategory
    );

    toast.success(
      data
        ? "Subcategoría actualizada correctamente"
        : "Subcategoría creada correctamente"
    );

    if (data) {
      router.refresh();
    } else {
      router.push("/dashboard/admin/subcategories");
      router.refresh();
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocurrió un error inesperado";

    toast.error(message);

    console.error(
      data
        ? "Error actualizando subcategoría:"
        : "Error creando subcategoría:",
      error
    );
  }
};

return (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold">
        {data ? "Editar subcategoría" : "Nueva subcategoría"}
      </h1>

      <p className="text-sm text-muted-foreground">
        {data
          ? "Actualiza la información de la subcategoría."
          : "Crea una nueva subcategoría y asígnala a una categoría."}
      </p>
    </div>

    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
   {/* Nombre */}
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Nombre</FormLabel>
      <FormControl>
        <Input
          disabled={form.formState.isSubmitting}
          placeholder="Ejemplo: Celulares"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{/* Categoría padre */}
<FormField
  control={form.control}
  name="categoryId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Categoría</FormLabel>

      <Select
        value={field.value}
        onValueChange={field.onChange}
        disabled={form.formState.isSubmitting}
      >
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
        </FormControl>

        <SelectContent>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id}
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <FormMessage />
    </FormItem>
  )}
/>
      {/* Imagen */}
<FormField
  control={form.control}
  name="image"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Imagen</FormLabel>
      <FormControl>
        <ImageUpload
          value={field.value ? [field.value] : []}
          disabled={form.formState.isSubmitting}
          onChange={(url) => field.onChange(url)}
          onRemove={() => field.onChange("")}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{/* URL */}
<FormField
  control={form.control}
  name="url"
  render={({ field }) => (
    <FormItem>
      <FormLabel>URL</FormLabel>
      <FormControl>
        <Input
          disabled={form.formState.isSubmitting}
          placeholder="Ejemplo: celulares"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{/* Destacada */}
<FormField
  control={form.control}
  name="featured"
  render={({ field }) => (
    <FormItem className="flex flex-row items-center gap-3 rounded-lg border p-4">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
          disabled={form.formState.isSubmitting}
        />
      </FormControl>

      <div className="space-y-1">
        <FormLabel>Subcategoría destacada</FormLabel>
        <p className="text-sm text-muted-foreground">
          Mostrar esta subcategoría como destacada.
        </p>
      </div>

      <FormMessage />
    </FormItem>
  )}
/>

     <Button
       type="submit"
        disabled={form.formState.isSubmitting}
        >
        {form.formState.isSubmitting
        ? "Guardando..."
        : data
        ? "Guardar cambios"
        : "Crear subcategoría"}
      </Button>

      </form>
    </Form>
  </div>
);

};

export default SubCategoryDetails;