"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldErrors, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import { UploadIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { createEvent } from "@/app/actions/db/eventos";
import { uploadEventImage } from "@/app/actions/storage/eventImages";
import { EventoStatus } from "@/features/eventos/services/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequireOrganizer from "@/features/auth/components/guards/RequireOrganizer";
import { showToastError, showToastSuccess } from "@/lib/utils/toast";

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
      tipos_entrada: [
        {
          nombre: "",
          descripcion: "",
          precio: 0,
          zona: "",
          cantidad_disponible: 0,
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tipos_entrada",
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
      showToastError({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para crear un evento",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Asegurarnos de que las fechas sean válidas
      const fechaInicio = data.fecha_inicio
        ? new Date(data.fecha_inicio)
        : new Date();
      const fechaFin = data.fecha_fin ? new Date(data.fecha_fin) : fechaInicio;

      // Extraer tipos_entrada del objeto de datos
      const { tipos_entrada, ...eventoData } = data;

      const eventoToCreate: CreateEventoInput = {
        ...eventoData,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        organizador_id: session.address,
        status: EventoStatus.PENDIENTE,
        categoria: eventoData.categoria.toUpperCase(),
      };

      const evento = await createEvent(eventoToCreate);

      if (!evento) {
        throw new Error("No se recibió respuesta al crear el evento");
      }

      // Si hay una imagen seleccionada, subirla
      if (selectedImage) {
        try {
          const updatedEvento = await uploadEventImage(evento.id, selectedImage);
          console.log("Imagen subida correctamente:", updatedEvento);
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          showToastError({
            title: "Error al subir la imagen",
            description: "El evento se creó pero hubo un error al subir la imagen",
          });
          return;
        }
      }

      // Crear los tipos de entrada
      if (tipos_entrada && tipos_entrada.length > 0) {
        try {
          const tiposEntradaResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/eventos/${evento.id}/tipos-entrada`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(tipos_entrada),
            },
          );

          if (!tiposEntradaResponse.ok) {
            throw new Error("Error al crear los tipos de entrada");
          }
        } catch (error) {
          console.error("Error al crear tipos de entrada:", error);
          showToastError({
            title: "Error al crear tipos de entrada",
            description:
              "El evento se creó pero hubo un error al crear los tipos de entrada",
          });
          return;
        }
      }

      showToastSuccess({
        title: "Evento creado",
        description: "El evento se ha creado correctamente",
      });

      router.push("/organizador/mis-eventos");
    } catch (error) {
      console.error("Error en onSubmit:", error);
      showToastError({
        title: "Error al crear",
        description:
          error instanceof Error
            ? error.message
            : "Hubo un error al crear el evento",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar errores de validación
  const onError = (errors: FieldErrors<CreateEventoFormInput>) => {
    Object.entries(errors).forEach(([field, error]) => {
      if (error?.message) {
        showToastError({
          title: `Error en ${field}`,
          description: error.message,
        });
      }
    });
  };

  return (
    <RequireOrganizer>
      <div className="container mx-auto py-12 px-8 max-w-7xl">
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
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6 p-6">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el título del evento" {...field} />
                    </FormControl>
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
                        placeholder="Describe tu evento"
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2">
                <Switch
                  id="is-range"
                  checked={isRange}
                  onCheckedChange={(checked) => {
                    setIsRange(checked);
                    if (!checked) {
                      // Si se desactiva el rango, establecer la fecha de fin igual a la de inicio
                      const fechaInicio = form.getValues("fecha_inicio");
                      form.setValue("fecha_fin", fechaInicio);
                    }
                  }}
                />
                <label htmlFor="is-range">Evento de varios días</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fecha_inicio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de inicio</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}>
                              {field.value ? (
                                field.value.toLocaleDateString()
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                if (!isRange) {
                                  // Si no es rango, actualizar también la fecha de fin
                                  form.setValue("fecha_fin", date);
                                }
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isRange && (
                  <FormField
                    control={form.control}
                    name="fecha_fin"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de fin</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}>
                                {field.value ? (
                                  field.value.toLocaleDateString()
                                ) : (
                                  <span>Selecciona una fecha</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const fechaInicio = form.getValues("fecha_inicio");
                                return date < fechaInicio || date < new Date();
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="lugar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lugar</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el lugar del evento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "placeholder"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="placeholder" disabled>
                          Selecciona una categoría
                        </SelectItem>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imagen_uri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen del evento</FormLabel>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormControl>
                          <ImageUpload
                            value=""
                            onChange={handleImageChange}
                            onRemove={() => {
                              field.onChange("");
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Sube una imagen para tu evento (opcional). Formatos
                          permitidos: JPG, PNG.
                        </FormDescription>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Tipos de entrada</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        nombre: "",
                        descripcion: "",
                        precio: 0,
                        zona: "",
                        cantidad_disponible: 0,
                      })
                    }>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar tipo de entrada
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-lg space-y-4 bg-muted/50">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Tipo de entrada {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}>
                          <Trash2Icon className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`tipos_entrada.${index}.nombre`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej: VIP, General"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`tipos_entrada.${index}.zona`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zona</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej: Platea, Palco"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`tipos_entrada.${index}.descripcion`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe los beneficios o características de esta entrada"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`tipos_entrada.${index}.precio`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Precio (€)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`tipos_entrada.${index}.cantidad_disponible`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantidad disponible</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
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
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </RequireOrganizer>
  );
}
