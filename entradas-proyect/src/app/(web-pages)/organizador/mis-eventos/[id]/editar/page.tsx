"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EventoStatus } from "@/features/eventos/services/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import { Separator } from "@/components/ui/separator";

// Datos de ejemplo
const evento = {
  id: "1",
  titulo: "Concierto de Rock",
  descripcion: "Gran concierto de rock con bandas locales",
  fecha: "2024-03-15",
  hora: "20:00",
  ubicacion: "Sala Principal",
  capacidad: 500,
  estado: EventoStatus.PENDIENTE,
  imagen: "https://example.com/imagen.jpg",
};

const formSchema = z.object({
  titulo: z.string().min(2, {
    message: "El título debe tener al menos 2 caracteres.",
  }),
  descripcion: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  fecha: z.string().min(1, {
    message: "La fecha es requerida.",
  }),
  hora: z.string().min(1, {
    message: "La hora es requerida.",
  }),
  ubicacion: z.string().min(2, {
    message: "La ubicación debe tener al menos 2 caracteres.",
  }),
  capacidad: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "La capacidad debe ser un número positivo.",
  }),
  imagen: z.string().min(1, {
    message: "La imagen es requerida.",
  }),
});

export default function EditarEventoPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      hora: evento.hora,
      ubicacion: evento.ubicacion,
      capacidad: evento.capacidad.toString(),
      imagen: evento.imagen,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Aquí iría la lógica para actualizar el evento
    console.log(values);
    toast.success("Evento actualizado correctamente");
    router.push("/organizador/mis-eventos");
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Editar Evento</CardTitle>
          <CardDescription>
            Modifica los detalles de tu evento. Solo puedes editar eventos en estado
            pendiente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="imagen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagen del Evento</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            onRemove={() => field.onChange("")}
                          />
                        </FormControl>
                        <FormDescription>
                          Sube una imagen representativa para tu evento.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del Evento</FormLabel>
                        <FormControl>
                          <Input placeholder="Concierto de Rock" {...field} />
                        </FormControl>
                        <FormDescription>
                          El título que aparecerá en la página del evento.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe tu evento..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Proporciona detalles sobre el evento.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ubicacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <FormControl>
                        <Input placeholder="Sala Principal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidad</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="500" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <CardFooter className="flex justify-end gap-4 px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
