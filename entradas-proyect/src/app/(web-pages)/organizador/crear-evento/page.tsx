"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import {
  InfoIcon,
  MapPinIcon,
  CalendarIcon,
  UploadIcon,
  TagIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ImageUpload } from "@/components/ui/image-upload";
import { cn } from "@/lib/utils";
import {
  createEventoFormSchema,
  type CreateEventoFormInput,
  type CreateEventoInput,
} from "@/lib/schemas/evento.schema";
import { createEvent, uploadEventImage } from "@/app/actions/db/events";
import { EventoStatus } from "@/features/eventos/services/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definir las categorías disponibles
const categorias = [
  { id: "MUSICA", label: "Música" },
  { id: "TEATRO", label: "Teatro" },
  { id: "DEPORTES", label: "Deportes" },
  { id: "GASTRONOMIA", label: "Gastronomía" },
  { id: "ARTE", label: "Arte" },
  { id: "CONFERENCIAS", label: "Conferencias" },
  { id: "OTROS", label: "Otros" },
] as const;

export default function CrearEventoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [isRange, setIsRange] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<CreateEventoFormInput>({
    resolver: zodResolver(createEventoFormSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      fecha_inicio: new Date(),
      fecha_fin: new Date(),
      lugar: "",
      categoria: "",
    },
    mode: "onChange",
  });

  const handleImageChange = (value: string | File | null) => {
    if (value instanceof File) {
      setSelectedImage(value);
    } else {
      setSelectedImage(null);
    }
  };

  // Redirigir si no hay sesión
  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  const onSubmit = async (data: CreateEventoFormInput) => {
    if (!session?.address) {
      toast.error("Debes iniciar sesión para crear un evento");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Iniciando creación de evento...");
      console.log("Datos del formulario:", data);

      // Asegurarnos de que las fechas sean válidas
      const fechaInicio = data.fecha_inicio
        ? new Date(data.fecha_inicio)
        : new Date();
      const fechaFin = data.fecha_fin ? new Date(data.fecha_fin) : fechaInicio;

      const eventoData: CreateEventoInput = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        lugar: data.lugar,
        categoria: data.categoria,
        organizador_id: session.address,
        status: EventoStatus.PENDIENTE,
      };

      console.log("Datos a insertar:", eventoData);

      const evento = await createEvent(eventoData);

      if (!evento) {
        throw new Error("No se recibió respuesta al crear el evento");
      }

      console.log("Evento creado:", evento);

      // Si hay una imagen seleccionada, subirla
      if (selectedImage) {
        console.log("Subiendo imagen...");
        try {
          const updatedEvento = await uploadEventImage(evento.id, selectedImage);
          if (!updatedEvento) {
            throw new Error("Error al subir la imagen");
          }
          console.log("Imagen subida correctamente");
          toast.success("Evento creado con imagen correctamente");
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          toast.error("El evento se creó pero hubo un error al subir la imagen");
          return;
        }
      } else {
        toast.success("Evento creado correctamente");
      }

      router.push(`/organizador/eventos/${evento.id}`);
    } catch (error) {
      console.error("Error en onSubmit:", error);
      toast.error(
        error instanceof Error ? error.message : "Hubo un error al crear el evento",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar errores de validación
  const onError = (errors: FieldErrors<CreateEventoFormInput>) => {
    console.log("Errores de validación:", errors);
    Object.entries(errors).forEach(([field, error]) => {
      if (error?.message) {
        toast.error(`${field}: ${error.message}`);
      }
    });
  };

  return (
    <div className="container mx-auto py-12 px-8 max-w-6xl">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold pb-4">
            Crear nuevo evento
          </CardTitle>
          <CardDescription>
            Completa los datos para publicar tu evento
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Formulario enviado");
              console.log("Valores del formulario:", form.getValues());
              console.log("Errores del formulario:", form.formState.errors);
              form.handleSubmit(onSubmit, onError)(e);
            }}
            className="space-y-6">
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
                        value={field.value || ""}
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
                            defaultMonth={date?.from || new Date()}
                            selected={date}
                            onSelect={(newDate: DateRange | undefined) => {
                              if (newDate?.from) {
                                setDate(newDate);
                                field.onChange(newDate.from);
                                form.setValue(
                                  "fecha_fin",
                                  newDate.to || newDate.from,
                                );
                              }
                            }}
                            numberOfMonths={2}
                            locale={es}
                            required
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
                              if (newDate) {
                                field.onChange(newDate);
                                form.setValue("fecha_fin", newDate);
                              }
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

              {/* Categoría */}
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <div className="relative">
                            <TagIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <SelectValue
                              placeholder="Selecciona una categoría"
                              className="pl-10"
                            />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecciona la categoría que mejor describe tu evento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Imagen */}
              <FormItem>
                <FormLabel>Imagen del evento</FormLabel>
                <FormControl>
                  <ImageUpload
                    onChange={handleImageChange}
                    className="w-full aspect-video"
                  />
                </FormControl>
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
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => {
                  console.log("Botón de submit clickeado");
                  console.log("Estado del formulario:", form.formState);
                }}>
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
