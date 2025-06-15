"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldErrors, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { showToastSuccess, showToastError } from "@/utils/toast";

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
} from "@/lib/schemas/evento.schema";
import { EventoPublicoWTipos } from "@/types/global";
import { CATEGORIAS_OPTIONS } from "@/types/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EventoStatus } from "@/features/eventos/services/types";
import { uploadEventImage } from "@/app/actions/storage/images";

type FormValues = CreateEventoFormInput;

interface EditarEventoFormProps {
  evento: EventoPublicoWTipos;
}

export default function EditarEventoForm({ evento }: EditarEventoFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRange, setIsRange] = useState(evento.fecha_inicio !== evento.fecha_fin);
  const [tiposEntrada, setTiposEntrada] = useState(evento.tipos_entrada);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchTiposEntrada = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/eventos/${evento.id}/tipos-entrada`,
        );
        if (!response.ok) throw new Error("Error al obtener tipos de entrada");
        const data = await response.json();
        setTiposEntrada(data);
      } catch (error) {
        console.error("Error al obtener tipos de entrada:", error);
        showToastError({
          title: "Error al cargar los tipos de entrada",
          description: "No se pudo cargar los tipos de entrada del evento",
        });
      }
    };

    fetchTiposEntrada();
  }, [evento.id]);

  const form = useForm<FormValues>({
    resolver: zodResolver(createEventoFormSchema),
    defaultValues: {
      titulo: evento.titulo,
      descripcion: evento.descripcion || "",
      fecha_inicio: new Date(evento.fecha_inicio),
      fecha_fin: new Date(evento.fecha_fin),
      lugar: evento.lugar,
      categoria: "placeholder",
      imagen_uri: evento.imagen_uri || "",
      tipos_entrada: tiposEntrada.map((tipo) => ({
        ...tipo,
        descripcion: tipo.descripcion || "",
        zona: tipo.zona || "",
      })),
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tipos_entrada",
  });

  // Actualizar los tipos de entrada cuando cambien
  useEffect(() => {
    form.setValue(
      "tipos_entrada",
      tiposEntrada.map((tipo) => ({
        ...tipo,
        descripcion: tipo.descripcion || "",
        zona: tipo.zona || "",
      })),
    );
  }, [tiposEntrada, form]);

  const handleImageChange = (value: string | File | null) => {
    if (value instanceof File) {
      setSelectedImage(value);
      form.setValue("imagen_uri", ""); // Limpiar la URL actual ya que subiremos una nueva
    } else {
      setSelectedImage(null);
      if (value === null) {
        form.setValue("imagen_uri", evento.imagen_uri); // Mantener la imagen actual
      } else {
        form.setValue("imagen_uri", value);
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!session?.address) {
      showToastError({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para editar un evento",
      });
      return;
    }

    // Si el evento está aprobado, mostrar el diálogo de confirmación
    if (evento.status === EventoStatus.APROBADO) {
      setFormData(data);
      setShowConfirmDialog(true);
      return;
    }

    await submitForm(data);
  };

  const submitForm = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Iniciando actualización de evento...");
      console.log("Datos del formulario:", data);

      let imagenUri = data.imagen_uri;

      // Si hay una nueva imagen seleccionada, subirla primero
      if (selectedImage) {
        console.log("Subiendo nueva imagen...");
        try {
          const publicUrl = await uploadEventImage(selectedImage, evento.id);
          if (!publicUrl) {
            throw new Error("Error al subir la imagen");
          }
          imagenUri = publicUrl;
          console.log("Imagen subida correctamente");
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          showToastError({
            title: "Error al subir la imagen",
            description: "No se pudo subir la imagen del evento",
          });
          return;
        }
      }

      // Extraer tipos_entrada del objeto de datos
      const { tipos_entrada, ...eventoData } = data;

      // Actualizar el evento (sin los tipos de entrada)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/eventos/${evento.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...eventoData,
            imagen_uri: imagenUri,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el evento");
      }

      // Actualizar los tipos de entrada
      if (tipos_entrada && tipos_entrada.length > 0) {
        console.log("Actualizando tipos de entrada...");
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
          throw new Error("Error al actualizar los tipos de entrada");
        }
      }

      showToastSuccess({
        title: "Evento actualizado",
        description: "El evento ha sido actualizado correctamente",
      });
      router.push("/organizador/mis-eventos");
    } catch (error) {
      console.error("Error en onSubmit:", error);
      showToastError({
        title: "Error al actualizar",
        description:
          error instanceof Error
            ? error.message
            : "Hubo un error al actualizar el evento",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar errores de validación
  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Errores de validación:", errors);
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
    <div className="container mx-auto py-12 px-8 max-w-6xl">
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar edición de evento aprobado</AlertDialogTitle>
            <AlertDialogDescription>
              Al editar este evento, su estado cambiará a pendiente y deberá ser
              aprobado nuevamente. ¿Estás seguro de que deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (formData) {
                  submitForm(formData);
                }
                setShowConfirmDialog(false);
              }}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold pb-4">Editar evento</CardTitle>
          <CardDescription>
            Modifica los detalles de tu evento. Solo puedes editar eventos en estado
            pendiente o rechazado.
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
                      {CATEGORIAS_OPTIONS.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.label}>
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
                    {evento.imagen_uri && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Imagen actual del evento:
                        </p>
                        <div className="relative w-full md:w-1/3 aspect-video">
                          <img
                            src={evento.imagen_uri}
                            alt="Imagen actual del evento"
                            className="rounded-lg object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Subir nueva imagen (opcional):
                      </p>
                      <FormControl>
                        <ImageUpload
                          value=""
                          onChange={handleImageChange}
                          onRemove={() => {
                            // Al eliminar, establecer la imagen actual
                            field.onChange(evento.imagen_uri);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Sube una nueva imagen para tu evento. Si no subes una nueva,
                        se mantendrá la imagen actual. Formatos permitidos: JPG, PNG.
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}>
                      <Trash2Icon className="h-4 w-4 text-destructive" />
                    </Button>
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
                className="cursor-pointer"
                onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer">
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
