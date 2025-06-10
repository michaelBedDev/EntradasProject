"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateEventoSchema,
  type UpdateEventoInput,
} from "@/lib/schemas/evento.schema";
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
import {
  CalendarIcon,
  ImageIcon,
  UploadIcon,
  MapPinIcon,
  InfoIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { Switch } from "@/components/ui/switch";
import { EventoStatus } from "@/features/eventos/services/types";

export default function EditarEventoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [date, setDate] = useState<DateRange | undefined>();
  const [isRange, setIsRange] = useState(false);

  // Inicializar formulario con react-hook-form y zod
  const form = useForm<UpdateEventoInput>({
    resolver: zodResolver(updateEventoSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      fecha_inicio: new Date(),
      fecha_fin: undefined,
      lugar: "",
      categoria: "",
      organizador_id: "",
      imagen_uri: null,
    },
  });

  // Cargar datos del evento
  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await fetch(`/api/eventos/${params.id}`);
        if (!response.ok) {
          throw new Error("Error al cargar el evento");
        }
        const data = await response.json();

        // Actualizar el formulario con los datos del evento
        form.reset({
          titulo: data.titulo,
          descripcion: data.descripcion,
          fecha_inicio: new Date(data.fecha_inicio),
          fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : undefined,
          lugar: data.lugar,
          categoria: data.categoria,
          organizador_id: data.organizador_id,
          imagen_uri: data.imagen_uri,
        });

        // Configurar el estado del rango de fechas
        if (data.fecha_fin) {
          setIsRange(true);
          setDate({
            from: new Date(data.fecha_inicio),
            to: new Date(data.fecha_fin),
          });
        } else {
          setIsRange(false);
          setDate(undefined);
        }

        // Configurar la imagen si existe
        if (data.imagen_uri) {
          setImagePreview(data.imagen_uri);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar el evento:", error);
        toast.error("Error al cargar el evento");
        router.push("/organizador/mis-eventos");
      }
    };

    fetchEvento();
  }, [params.id, form, router]);

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

  const onSubmit = async (data: UpdateEventoInput) => {
    setIsSubmitting(true);
    try {
      // Preparar los datos para la actualización
      const formData = new FormData();
      if (data.titulo) formData.append("titulo", data.titulo);
      if (data.descripcion) formData.append("descripcion", data.descripcion);
      if (data.fecha_inicio)
        formData.append("fecha_inicio", data.fecha_inicio.toISOString());
      if (isRange && date?.to) {
        formData.append("fecha_fin", date.to.toISOString());
      }
      if (data.lugar) formData.append("lugar", data.lugar);
      if (data.categoria) formData.append("categoria", data.categoria);
      if (imageFile) {
        formData.append("imagen", imageFile);
      }

      // Actualizar el evento
      const response = await fetch(`/api/eventos/${params.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el evento");
      }

      toast.success("¡Evento actualizado con éxito!");
      router.push("/organizador/mis-eventos");
    } catch (error) {
      console.error("Error al actualizar evento:", error);
      toast.error("Error al actualizar el evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Cargando...</CardTitle>
            <CardDescription>
              Por favor, espera mientras cargamos los datos del evento
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Editar evento</CardTitle>
          <CardDescription>Modifica los datos de tu evento</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <FormLabel>
                        {isRange ? "Rango de fechas del evento" : "Fecha del evento"}
                      </FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormLabel
                          htmlFor="range-mode"
                          className="text-sm text-muted-foreground">
                          Fecha única
                        </FormLabel>
                        <Switch
                          id="range-mode"
                          checked={isRange}
                          onCheckedChange={setIsRange}
                        />
                        <FormLabel
                          htmlFor="range-mode"
                          className="text-sm text-muted-foreground">
                          Rango de fechas
                        </FormLabel>
                      </div>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}>
                            {field.value ? (
                              isRange ? (
                                date?.from ? (
                                  date.to ? (
                                    <>
                                      {format(date.from, "LLL dd, y", {
                                        locale: es,
                                      })}{" "}
                                      -{" "}
                                      {format(date.to, "LLL dd, y", { locale: es })}
                                    </>
                                  ) : (
                                    format(date.from, "LLL dd, y", { locale: es })
                                  )
                                ) : (
                                  <span>Selecciona un rango de fechas</span>
                                )
                              ) : (
                                format(new Date(field.value), "LLL dd, y", {
                                  locale: es,
                                })
                              )
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        {isRange ? (
                          <Calendar
                            mode="range"
                            defaultMonth={
                              field.value ? new Date(field.value) : new Date()
                            }
                            selected={date}
                            onSelect={(newDate: DateRange | undefined) => {
                              setDate(newDate);
                              if (newDate?.from) {
                                field.onChange(newDate.from);
                              }
                            }}
                            numberOfMonths={2}
                            locale={es}
                          />
                        ) : (
                          <Calendar
                            mode="single"
                            defaultMonth={
                              field.value ? new Date(field.value) : new Date()
                            }
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(newDate: Date | undefined) => {
                              field.onChange(newDate);
                            }}
                            numberOfMonths={2}
                            locale={es}
                          />
                        )}
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      {isRange
                        ? "Selecciona el rango de fechas en que se realizará el evento"
                        : "Selecciona la fecha en que se realizará el evento"}
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
                    Actualizando...
                  </>
                ) : (
                  "Actualizar evento"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
