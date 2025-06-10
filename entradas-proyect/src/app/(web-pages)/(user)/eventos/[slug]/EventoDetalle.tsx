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
import { toast } from "sonner";
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

export default function EventoDetalle({ evento }: { evento: EventoWOrganizador }) {
  const [cantidad, setCantidad] = useState<string>("1");
  const [entradasSeleccionadas, setEntradasSeleccionadas] = useState<number>(1);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // Formateo de fecha y hora
  // const fecha = new Date(evento.fecha);
  // const fechaFormateada = format(fecha, "EEEE d 'de' MMMM 'de' yyyy", {
  //   locale: es,
  // });
  // const horaFormateada = format(fecha, "HH:mm", { locale: es }) + "h";

  // // Precio formateado con 2 decimales
  // const precio = evento.precio ? evento.precio.toFixed(2) : "0.00";

  // Función para manejo de likes
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    const mensaje = isLiked ? "Eliminado de favoritos" : "Añadido a favoritos";
    toast(mensaje, {
      description: isLiked
        ? "Se ha eliminado este evento de tus favoritos."
        : "Este evento se ha añadido a tu lista de favoritos.",
      position: "top-center",
    });
  };

  // Función para compartir
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: evento.titulo,
          text: evento.descripcion ?? "",
          url: window.location.href,
        });
        toast("Compartido correctamente", {
          description: "El enlace al evento se ha compartido correctamente.",
          position: "top-center",
        });
      } catch (error) {
        console.error("Error al compartir:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("Enlace copiado", {
        description: "Enlace copiado al portapapeles.",
        position: "top-center",
      });
    }
  };

  // Función para manejar la compra
  const handleCompra = () => {
    toast.success("¡Entradas añadidas!", {
      description: `Has añadido ${entradasSeleccionadas} entrada(s) a tu carrito.`,
      position: "bottom-right",
    });
  };

  // Actualizar entradas seleccionadas cuando cambia el select
  const handleCantidadChange = (value: string) => {
    setCantidad(value);
    setEntradasSeleccionadas(Number(value));
  };

  return (
    <>
      {/* Imagen principal de fondo con degradado */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
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
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/20" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative h-full max-w-6xl z-10">
          <div className="absolute bottom-12 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {evento.titulo}
            </h1>
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <UserIcon className="w-4 h-4" />
              <span>Organizado por {evento.organizador?.nombre || "Anónimo"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {format(
                  new Date(evento.fecha_inicio.replace("+00:00", "Z")),
                  "EEEE d 'de' MMMM 'de' yyyy",
                  {
                    locale: es,
                  },
                )}

                {/* Si el evento es de un día, mostramos la hora de inicio y fin */}
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

              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                <MapPinIcon className="w-3 h-3 mr-1" />
                {evento.lugar}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
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
                    <AccordionTrigger className="text-base font-medium">
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
                    <AccordionTrigger className="text-base font-medium">
                      Accesibilidad
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      El recinto cuenta con acceso para personas con movilidad
                      reducida. Si necesitas asistencia especial, por favor contacta
                      con el organizador con al menos 48 horas de antelación.
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
                      {evento.organizador_id || "Organizador"}
                    </CardTitle>
                    <CardDescription>
                      Información sobre el organizador y eventos anteriores.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                      {evento.organizador_id} es un organizador de eventos con
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
                  Entradas disponibles para el evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* <div>
                    <p className="font-medium">Precio por entrada</p>
                    <p className="text-3xl font-bold">{precio}€</p>
                  </div> */}
                  <div className="w-24">
                    <Select value={cantidad} onValueChange={handleCantidadChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Cantidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* <div className="pt-4">
                  <div className="flex justify-between font-medium mb-1">
                    <span>Subtotal</span>
                    <span>
                      {(Number(precio) * entradasSeleccionadas).toFixed(2)}€
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm mb-8">
                    <span>Comisión de servicio</span>
                    <span>
                      {(Number(precio) * entradasSeleccionadas * 0.05).toFixed(2)}€
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span>Total</span>
                    <span>
                      {(Number(precio) * entradasSeleccionadas * 1.05).toFixed(2)}€
                    </span>
                  </div>
                </div> */}
                <Button className="w-full" size="lg" onClick={handleCompra}>
                  Comprar entradas
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Al hacer clic en "Comprar entradas" aceptas nuestros{" "}
                  <a href="#" className="text-primary hover:underline">
                    términos y condiciones
                  </a>
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-1">
                  <ShareIcon className="h-4 w-4" />
                  Compartir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLikeClick}
                  className={cn(
                    "flex items-center gap-1",
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

            {/* Acordeón de preguntas frecuentes */}
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="faq-1">
                <AccordionTrigger className="text-sm">
                  ¿Cómo recibiré mis entradas?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  Las entradas se enviarán a tu correo electrónico inmediatamente
                  después de la compra. También podrás acceder a ellas desde tu
                  cuenta en la sección "Mis Entradas".
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger className="text-sm">
                  ¿Puedo cancelar mi compra?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  Las cancelaciones son posibles hasta 48 horas antes del evento.
                  Para cancelar, accede a "Mis Entradas" y selecciona la opción de
                  cancelación.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}
