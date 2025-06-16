"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  TicketIcon,
  ShareIcon,
  HeartIcon,
  InfoIcon,
  AlertCircleIcon,
  Loader2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { EventoPublicoWTipos, TipoEntradaPublica } from "@/types/global";
import { getBadgeVariant } from "@/utils/getBadgeVariant";

import { showToastError, showToastSuccess } from "@/utils/toast";
import { handleShareEvento } from "@/utils/handleShare";
import { crearEntradas } from "@/features/entradas/actions/entradas";
import { EventoStatus } from "@/features/eventos/services/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EventoDetalle({ evento }: { evento: EventoPublicoWTipos }) {
  const [cantidad, setCantidad] = useState<string>("1");
  const [entradasSeleccionadas, setEntradasSeleccionadas] = useState<number>(1);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [tipoEntradaSeleccionada, setTipoEntradaSeleccionada] =
    useState<TipoEntradaPublica | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const tipos_entrada = evento.tipos_entrada;

  // Función para formatear precios
  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(precio);
  };

  // Calcular precios basados en el tipo de entrada seleccionado
  const precioUnitario = tipoEntradaSeleccionada
    ? tipoEntradaSeleccionada.precio
    : 0;
  const subtotal = precioUnitario * entradasSeleccionadas;
  const comision = subtotal * 0.05;
  const precioTotal = subtotal + comision;

  // Función para manejar la compra
  const handleCompra = async () => {
    if (evento.status !== EventoStatus.APROBADO) {
      showToastError({
        title: "Evento no disponible",
        description:
          "Este evento aún no está aprobado y no se pueden comprar entradas.",
      });
      return;
    }

    if (!tipoEntradaSeleccionada) {
      showToastError({
        title: "Selecciona un tipo de entrada",
        description: "Por favor, selecciona un tipo de entrada antes de continuar.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Crear un array de entradas según la cantidad seleccionada
      const entradasParaComprar = Array(entradasSeleccionadas).fill({
        tipo_entrada_id: tipoEntradaSeleccionada.id,
        metadata_uri: "https://example.com/metadata1.json",
      });

      const result = await crearEntradas(entradasParaComprar);

      if (!result.success) {
        throw new Error(result.error || "Error al procesar la compra");
      }

      showToastSuccess({
        title: "¡Compra exitosa!",
        description: `Se han comprado ${entradasSeleccionadas} entradas de tipo ${tipoEntradaSeleccionada.nombre}.`,
      });

      // Resetear el formulario después de la compra exitosa
      setCantidad("1");
      setEntradasSeleccionadas(1);
      setTipoEntradaSeleccionada(null);
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
        });
      }
      showToastError({
        title: "Error al procesar la compra",
        description:
          error instanceof Error ? error.message : "Inténtalo de nuevo más tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejo de likes
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    const mensaje = isLiked ? "Eliminado de favoritos" : "Añadido a favoritos";

    showToastSuccess({
      title: mensaje,
      description: isLiked
        ? "Este evento ha sido eliminado de tu lista de favoritos."
        : "Este evento ha sido añadido a tu lista de favoritos.",
    });
  };

  // Actualizar entradas seleccionadas cuando cambia el select
  const handleCantidadChange = (value: string) => {
    setCantidad(value);
    setEntradasSeleccionadas(Number(value));
  };

  // Función para manejar el compartir
  const handleShare = () => {
    handleShareEvento(evento);
  };

  // Asegurarnos de que el status sea del tipo EventoStatus
  const eventoStatus = evento.status as EventoStatus;

  return (
    <>
      {/* Hero section con imagen de fondo */}
      <div className="relative w-full h-[70vh] md:aspect-[21/8] pt-16 md:pt-20">
        {evento.imagen_uri ? (
          <Image
            src={evento.imagen_uri}
            alt={evento.titulo}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
            <TicketIcon className="w-20 h-20 text-muted-foreground opacity-20" />
          </div>
        )}

        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 md:via-background/60 to-transparent" />

        {/* Contenido superpuesto */}
        <div className="absolute inset-0 container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="absolute bottom-0 left-0 right-0 pb-4 md:pb-8 px-4">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                {evento.titulo}
              </h1>
              {eventoStatus !== EventoStatus.APROBADO && (
                <Badge
                  variant={getBadgeVariant(eventoStatus)}
                  className="text-sm font-medium px-3 py-1">
                  {eventoStatus}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4 text-white/90 drop-shadow-md">
              <UserIcon className="w-4 h-4" />
              <span>Organizado por {evento.organizador?.nombre}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/10 text-white hover:bg-white/20 border-0 backdrop-blur-sm">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {format(
                  new Date(evento.fecha_inicio.replace("+00:00", "Z")),
                  "EEEE d 'de' MMMM 'de' yyyy",
                  {
                    locale: es,
                  },
                )}

                {new Date(
                  evento.fecha_inicio.replace("+00:00", "Z"),
                ).toDateString() ===
                new Date(evento.fecha_fin.replace("+00:00", "Z")).toDateString() ? (
                  <>
                    {" "}
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {format(
                      new Date(evento.fecha_inicio.replace("+00:00", "Z")),
                      "HH:mm",
                      {
                        locale: es,
                      },
                    )}
                    {" - "}
                    {format(
                      new Date(evento.fecha_fin.replace("+00:00", "Z")),
                      "HH:mm",
                      {
                        locale: es,
                      },
                    )}
                  </>
                ) : (
                  <>
                    {" - "}
                    {format(
                      new Date(evento.fecha_fin.replace("+00:00", "Z")),
                      "EEEE d 'de' MMMM 'de' yyyy",
                      {
                        locale: es,
                      },
                    )}{" "}
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {format(
                      new Date(evento.fecha_inicio.replace("+00:00", "Z")),
                      "HH:mm",
                      {
                        locale: es,
                      },
                    )}
                  </>
                )}
              </Badge>

              <Badge className="bg-white/10 text-white hover:bg-white/20 border-0 backdrop-blur-sm">
                <MapPinIcon className="w-3 h-3 mr-1" />
                {evento.lugar}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2">
            {/* Descripción del evento */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Acerca del evento</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  {evento.descripcion ||
                    "No hay descripción disponible para este evento."}
                </p>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Pestañas con información adicional */}
            <Tabs defaultValue="detalles" className="mb-12">
              <TabsList className="mb-4">
                <TabsTrigger value="detalles">Detalles</TabsTrigger>
                <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                <TabsTrigger value="organizador">Organizador</TabsTrigger>
              </TabsList>
              <TabsContent value="detalles" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Información importante
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <InfoIcon className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-primary" />
                      <span>Apertura de puertas 1 hora antes del evento.</span>
                    </li>
                    <li className="flex items-start">
                      <InfoIcon className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-primary" />
                      <span>Se recomienda llegar con 30 minutos de antelación.</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircleIcon className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-primary" />
                      <span>
                        Las entradas no son reembolsables salvo cancelación del
                        evento.
                      </span>
                    </li>
                  </ul>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-base font-medium cursor-pointer">
                      Normas del evento
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <ul className="space-y-2 list-disc pl-5">
                        <li>
                          No se permite la entrada con comida o bebida del exterior.
                        </li>
                        <li>Está prohibido fumar en todo el recinto.</li>
                        <li>
                          No se admiten devoluciones de entradas una vez efectuada la
                          compra.
                        </li>
                        <li>El organizador se reserva el derecho de admisión.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-base font-medium cursor-pointer">
                      Accesibilidad
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      El recinto cuenta con acceso para personas con movilidad
                      reducida. Si necesitas asistencia especial, por favor contacta
                      con el organizador con al menos 48 horas de antelación.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-base font-medium cursor-pointer">
                      Preguntas frecuentes
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          ¿Cómo recibiré mis entradas?
                        </h4>
                        <p className="text-sm">
                          Las entradas se enviarán a tu correo electrónico
                          inmediatamente después de la compra. También podrás acceder
                          a ellas desde tu cuenta en la sección &quot;Mis
                          Entradas&quot;.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">
                          ¿Puedo cancelar mi compra?
                        </h4>
                        <p className="text-sm">
                          Las cancelaciones no son posibles una vez realizada la
                          compra. Sin embargo, puedes vender tus entradas a otros
                          usuarios a través de nuestra plataforma oficial de reventa
                          entre particulares, donde garantizamos la autenticidad de
                          todas las entradas transferidas.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="ubicacion">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2 text-primary" />
                      {evento.lugar}
                    </CardTitle>
                    <CardDescription>
                      Dirección completa del evento con indicaciones para llegar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted aspect-video rounded-lg overflow-hidden flex items-center justify-center mb-4">
                      <p className="text-muted-foreground text-sm">
                        Aquí se mostraría un mapa con la ubicación exacta
                      </p>
                    </div>
                    <div className="text-muted-foreground">
                      <p className="mb-2">
                        <strong>Dirección:</strong> {evento.lugar}
                      </p>
                      <p>
                        <strong>Cómo llegar:</strong> Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Maecenas sed commodo tellus, vel
                        suscipit turpis.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="organizador">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserIcon className="w-5 h-5 mr-2 text-primary" />
                      {evento.organizador.nombre}
                    </CardTitle>
                    <CardDescription>
                      Información sobre el organizador y eventos anteriores.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                      {evento.organizador.nombre} es un organizador de eventos con
                      experiencia en la creación de experiencias únicas para todo
                      tipo de público.
                    </p>
                    <div>
                      <h4 className="text-foreground font-medium mb-2">
                        Otros eventos de este organizador:
                      </h4>
                      <ul className="list-disc pl-5">
                        <li>Evento anterior 1</li>
                        <li>Evento anterior 2</li>
                        <li>Evento anterior 3</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Ver todos los eventos del organizador
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Panel lateral para compras */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Compra tus entradas</CardTitle>
                <CardDescription>
                  {evento.status !== EventoStatus.APROBADO ? (
                    <div className="text-destructive font-medium">
                      Este evento aún no está aprobado
                    </div>
                  ) : (
                    "Selecciona el tipo y cantidad de entradas"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {evento.status !== EventoStatus.APROBADO ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full" size="lg" variant="outline">
                        <InfoIcon className="w-4 h-4 mr-2" />
                        Ver estado del evento
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Evento pendiente de aprobación
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Este evento está actualmente en proceso de revisión. Las
                          entradas no estarán disponibles hasta que el evento sea
                          aprobado por nuestro equipo.
                          <br />
                          <br />
                          Puedes guardar el evento en tus favoritos para recibir una
                          notificación cuando esté disponible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>Cerrar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Tipo de entrada
                        </label>
                        <Select
                          value={tipoEntradaSeleccionada?.id.toString()}
                          onValueChange={(value) => {
                            const tipo = tipos_entrada.find(
                              (t) => t.id.toString() === value,
                            );
                            setTipoEntradaSeleccionada(tipo || null);
                          }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de entrada" />
                          </SelectTrigger>
                          <SelectContent>
                            {tipos_entrada.map((tipo) => (
                              <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                {tipo.nombre} - {formatPrecio(tipo.precio)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Cantidad</label>
                        <Select
                          value={cantidad}
                          onValueChange={handleCantidadChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(10)].map((_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {tipoEntradaSeleccionada && (
                        <div className="pt-4 space-y-2">
                          <div className="flex justify-between font-medium">
                            <span>Precio unitario</span>
                            <span>{formatPrecio(precioUnitario)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Subtotal</span>
                            <span>{formatPrecio(subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground text-sm">
                            <span>Comisión de servicio (5%)</span>
                            <span>{formatPrecio(comision)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>{formatPrecio(precioTotal)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full cursor-pointer"
                      size="lg"
                      onClick={handleCompra}
                      disabled={
                        !tipoEntradaSeleccionada ||
                        entradasSeleccionadas < 1 ||
                        isSubmitting ||
                        evento.status !== EventoStatus.APROBADO
                      }>
                      {isSubmitting ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        "Comprar entradas"
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Al hacer clic en &quot;Comprar entradas&quot; aceptas nuestros{" "}
                      <a href="#" className="text-primary hover:underline">
                        términos y condiciones
                      </a>
                    </p>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-1 cursor-pointer">
                  <ShareIcon className="h-4 w-4" />
                  Compartir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLikeClick}
                  className={cn(
                    "flex items-center gap-1 cursor-pointer",
                    isLiked && "text-red-500 hover:text-red-600",
                  )}>
                  <HeartIcon
                    className="h-4 w-4"
                    fill={isLiked ? "currentColor" : "none"}
                  />
                  {isLiked ? "Guardado" : "Guardar"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
