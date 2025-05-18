"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { uploadEventImage } from "@/app/actions/storage/images";
import { createEvent, updateEventImage } from "@/app/actions/db/events";
import { CalendarIcon, ImageIcon, UploadIcon } from "lucide-react";

export default function CrearEventoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Obtener datos del formulario
      const formData = new FormData(e.currentTarget);
      const titulo = formData.get("titulo") as string;
      const descripcion = formData.get("descripcion") as string;
      const fecha = formData.get("fecha") as string;
      const lugar = formData.get("lugar") as string;

      if (!titulo || !fecha || !lugar) {
        toast.error("Por favor completa todos los campos obligatorios");
        setIsSubmitting(false);
        return;
      }

      // Crear evento en la base de datos
      const evento = await createEvent({
        titulo,
        descripcion,
        fecha,
        lugar,
        imagen_uri: null, // Lo actualizaremos después
      });

      // Si hay imagen, subirla a Supabase Storage
      if (imageFile) {
        const imagenUrl = await uploadEventImage(imageFile, evento.id);

        // Actualizar el evento con la URL de la imagen
        await updateEventImage(evento.id, imagenUrl);
      }

      toast.success("¡Evento creado con éxito!");
      router.push("/explorar-eventos");
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
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título del evento *</Label>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Ej. Concierto de rock"
                required
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe los detalles del evento..."
                rows={5}
              />
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha del evento *</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fecha"
                  name="fecha"
                  type="date"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Lugar */}
            <div className="space-y-2">
              <Label htmlFor="lugar">Lugar *</Label>
              <Input
                id="lugar"
                name="lugar"
                placeholder="Ej. Teatro Municipal"
                required
              />
            </div>

            {/* Imagen */}
            <div className="space-y-2">
              <Label htmlFor="imagen">Imagen del evento</Label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="border rounded-lg p-2">
                  <Label
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
                  </Label>
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
            </div>
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
      </Card>
    </div>
  );
}
