"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventoSchema, type EventoFormValues } from "@/lib/schemas/evento.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { uploadEventImage } from "@/app/actions/storage/images";
import { createEvent, updateEventImage } from "@/app/actions/db/events";
import {
  CalendarIcon,
  ImageIcon,
  UploadIcon,
  MapPinIcon,
  InfoIcon,
} from "lucide-react";

export default function CrearEventoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Inicializar formulario con react-hook-form y zod
  const form = useForm<EventoFormValues>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      fecha: "",
      lugar: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Crear URL para previsualización
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EventoFormValues) => {
    setIsSubmitting(true);

    try {
      // Crear evento en la base de datos
      const evento = await createEvent({
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha: data.fecha,
        lugar: data.lugar,
        imagen_uri: null, // Lo actualizaremos después si hay imagen
      });

      // Si hay imagen, subirla a Supabase Storage
      if (imageFile) {
        const imagenUrl = await uploadEventImage(imageFile, evento.id);

        // Actualizar el evento con la URL de la imagen
        await updateEventImage(evento.id, imagenUrl);
      }

      toast.success("¡Evento creado con éxito!");
      router.push("/organizador/mis-eventos");
    } catch (error) {
      console.error("Error al crear evento:", error);
      toast.error("Error al crear el evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Crear nuevo evento</CardTitle>
          <CardDescription>
            Completa los datos para publicar tu evento
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* Título */}
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del evento</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <InfoIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ej. Concierto de rock"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Nombre atractivo y descriptivo para tu evento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descripción */}
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe los detalles del evento..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Incluye información relevante sobre el evento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha */}
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha del evento</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="date" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Selecciona la fecha en que se realizará el evento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Lugar */}
              <FormField
                control={form.control}
                name="lugar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lugar</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ej. Teatro Municipal"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Indica dónde se llevará a cabo el evento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Imagen */}
              <FormItem>
                <FormLabel>Imagen del evento</FormLabel>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="border rounded-lg p-2">
                    <FormLabel
                      htmlFor="imagen"
                      className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-secondary/50 transition-colors">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        {imageFile ? "Cambiar imagen" : "Seleccionar imagen"}
                      </span>
                      <Input
                        id="imagen"
                        name="imagen"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </FormLabel>
                  </div>

                  {/* Preview */}
                  <div className="border rounded-lg overflow-hidden h-32 bg-secondary/30 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Vista previa
                      </span>
                    )}
                  </div>
                </div>
                <FormDescription>
                  Sube una imagen atractiva para tu evento (opcional)
                </FormDescription>
              </FormItem>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <UploadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear evento"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
