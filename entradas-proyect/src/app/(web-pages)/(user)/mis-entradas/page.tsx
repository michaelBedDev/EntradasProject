"use client";

import { useState, useEffect } from "react";
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  QrCode,
  Share,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

// Tipos simulados para entradas
interface Entrada {
  id: string;
  eventoId: string;
  eventoTitulo: string;
  eventoImagen?: string;
  fechaEvento: string;
  lugar: string;
  hora: string;
  precio: number;
  tipo: string;
  qrData: string;
  estado: "usado" | "disponible" | "expirado";
}

export default function MisEntradasPage() {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí cargarías las entradas desde la API
    setTimeout(() => {
      setEntradas([
        {
          id: "1",
          eventoId: "evt-1",
          eventoTitulo: "Festival de Música Electrónica",
          eventoImagen:
            "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
          fechaEvento: "2024-12-15",
          lugar: "Auditorio Principal",
          hora: "18:00",
          precio: 45.99,
          tipo: "VIP",
          qrData: "entrada-1234567890",
          estado: "disponible",
        },
        {
          id: "2",
          eventoId: "evt-2",
          eventoTitulo: "Conferencia de Tecnología y Blockchain",
          eventoImagen:
            "https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg",
          fechaEvento: "2024-11-25",
          lugar: "Centro de Convenciones",
          hora: "10:00",
          precio: 25.0,
          tipo: "General",
          qrData: "entrada-0987654321",
          estado: "disponible",
        },
        {
          id: "3",
          eventoId: "evt-3",
          eventoTitulo: "Exposición de Arte Digital",
          eventoImagen:
            "https://images.pexels.com/photos/3510401/pexels-photo-3510401.jpeg",
          fechaEvento: "2024-10-05",
          lugar: "Galería Moderna",
          hora: "11:30",
          precio: 15.5,
          tipo: "Estudiante",
          qrData: "entrada-abcdef123456",
          estado: "usado",
        },
        {
          id: "4",
          eventoId: "evt-4",
          eventoTitulo: "Workshop de Desarrollo Web",
          eventoImagen:
            "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg",
          fechaEvento: "2024-11-10",
          lugar: "Campus Tecnológico",
          hora: "09:00",
          precio: 35.0,
          tipo: "Premium",
          qrData: "entrada-xyz789456",
          estado: "disponible",
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  // Funciones para acciones de entradas
  const handleShare = (entrada: Entrada) => {
    if (navigator.share) {
      navigator
        .share({
          title: `Mi entrada para ${entrada.eventoTitulo}`,
          text: `¡Voy a asistir a ${entrada.eventoTitulo} el ${formatDate(
            entrada.fechaEvento,
          )}!`,
          url: window.location.href,
        })
        .catch(() => {
          copyToClipboard(entrada);
        });
    } else {
      copyToClipboard(entrada);
    }
  };

  const copyToClipboard = (entrada: Entrada) => {
    navigator.clipboard
      .writeText(
        `¡Voy a asistir a ${entrada.eventoTitulo} el ${formatDate(
          entrada.fechaEvento,
        )}! ${window.location.origin}/eventos/${entrada.eventoId}`,
      )
      .then(() => toast.success("¡Enlace copiado al portapapeles!"))
      .catch(() => toast.error("Error al copiar"));
  };

  const handleDownload = (entrada: Entrada) => {
    toast.success(`Descargando entrada para ${entrada.eventoTitulo}...`);
    // Aquí iría la lógica real para descargar la entrada como PDF
  };

  const handleViewQR = (entrada: Entrada) => {
    toast.success("Mostrando código QR", {
      description: `Código QR para ${entrada.eventoTitulo}. Presenta este código en la entrada del evento`,
      action: {
        label: "Cerrar",
        onClick: () => console.log("Cerrado"),
      },
    });
    // Aquí iría la lógica para mostrar el QR grande usando entrada.qrData
  };

  // Formateador de fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Encabezado con estilo Apple */}
      <div className="mb-12 mt-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Mis Entradas</h1>
        <p className="text-muted-foreground text-lg">
          Gestiona y visualiza todas tus entradas para eventos
        </p>
      </div>

      {/* Tabs para filtrar entradas */}
      <Tabs defaultValue="todas" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="disponibles">Disponibles</TabsTrigger>
          <TabsTrigger value="usadas">Usadas</TabsTrigger>
          <TabsTrigger value="expiradas">Expiradas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <EntradaSkeleton key={i} />
                ))}
              </div>
            ) : entradas.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-xl bg-muted/20">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No tienes entradas</h3>
                <p className="text-muted-foreground mb-6">
                  Parece que aún no has adquirido entradas para ningún evento
                </p>
                <Button asChild>
                  <a href="/eventos">Explorar eventos</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {entradas.map((entrada) => (
                  <EntradaCard
                    key={entrada.id}
                    entrada={entrada}
                    onShare={() => handleShare(entrada)}
                    onDownload={() => handleDownload(entrada)}
                    onViewQR={() => handleViewQR(entrada)}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="disponibles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {!loading &&
              entradas
                .filter((e) => e.estado === "disponible")
                .map((entrada) => (
                  <EntradaCard
                    key={entrada.id}
                    entrada={entrada}
                    onShare={() => handleShare(entrada)}
                    onDownload={() => handleDownload(entrada)}
                    onViewQR={() => handleViewQR(entrada)}
                  />
                ))}
            {!loading &&
              entradas.filter((e) => e.estado === "disponible").length === 0 && (
                <div className="text-center py-8 col-span-2">
                  <p>No tienes entradas disponibles actualmente</p>
                </div>
              )}
          </div>
        </TabsContent>

        <TabsContent value="usadas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {!loading &&
              entradas
                .filter((e) => e.estado === "usado")
                .map((entrada) => (
                  <EntradaCard
                    key={entrada.id}
                    entrada={entrada}
                    onShare={() => handleShare(entrada)}
                    onDownload={() => handleDownload(entrada)}
                    onViewQR={() => handleViewQR(entrada)}
                  />
                ))}
            {!loading &&
              entradas.filter((e) => e.estado === "usado").length === 0 && (
                <div className="text-center py-8 col-span-2">
                  <p>No tienes entradas usadas</p>
                </div>
              )}
          </div>
        </TabsContent>

        <TabsContent value="expiradas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {!loading &&
              entradas
                .filter((e) => e.estado === "expirado")
                .map((entrada) => (
                  <EntradaCard
                    key={entrada.id}
                    entrada={entrada}
                    onShare={() => handleShare(entrada)}
                    onDownload={() => handleDownload(entrada)}
                    onViewQR={() => handleViewQR(entrada)}
                  />
                ))}
            {!loading &&
              entradas.filter((e) => e.estado === "expirado").length === 0 && (
                <div className="text-center py-8 col-span-2">
                  <p>No tienes entradas expiradas</p>
                </div>
              )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para la tarjeta de entrada
interface EntradaCardProps {
  entrada: Entrada;
  onShare: () => void;
  onDownload: () => void;
  onViewQR: () => void;
}

function EntradaCard({ entrada, onShare, onDownload, onViewQR }: EntradaCardProps) {
  // Determinamos el estilo según el estado
  const getStatusStyle = () => {
    switch (entrada.estado) {
      case "usado":
        return {
          badge:
            "text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900/30",
          text: "Usado",
        };
      case "expirado":
        return {
          badge: "text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/30",
          text: "Expirado",
        };
      default:
        return {
          badge:
            "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/30",
          text: "Disponible",
        };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md p-0">
      <div className="w-full">
        {/* Sección de imagen a tamaño completo */}
        <div className="relative w-full h-64">
          {entrada.eventoImagen ? (
            <img
              src={entrada.eventoImagen}
              alt={entrada.eventoTitulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
              <Ticket className="h-10 w-10 text-muted-foreground" />
            </div>
          )}

          {/* Gradiente sobrepuesto a la imagen */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          {/* Badges posicionados sobre la imagen */}
          <div className="absolute bottom-3 left-3">
            <Badge className={statusStyle.badge}>{statusStyle.text}</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {entrada.tipo}
            </Badge>
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <CardHeader className="px-5 py-4">
          <CardTitle className="line-clamp-1 text-xl">
            {entrada.eventoTitulo}
          </CardTitle>
          <CardDescription className="text-sm">
            Entrada {entrada.tipo}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 px-5 py-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="truncate text-base">
              {formatDate(entrada.fechaEvento)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="text-base">{entrada.hora}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="truncate text-base">{entrada.lugar}</span>
          </div>
          <div className="mt-5 text-base font-medium">
            Precio: {entrada.precio.toFixed(2)}€
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-3 px-5 py-4">
          <Button
            variant="outline"
            size="default"
            className="flex-1"
            onClick={onShare}>
            <Share className="h-5 w-5 mr-2" /> Compartir
          </Button>
          <Button
            variant="outline"
            size="default"
            className="flex-1"
            onClick={onDownload}>
            <Download className="h-5 w-5 mr-2" /> Descargar
          </Button>
          <Button
            variant="default"
            size="default"
            className="flex-1"
            onClick={onViewQR}>
            <QrCode className="h-5 w-5 mr-2" /> Ver QR
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

// Componente para el skeleton de carga
function EntradaSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="w-full">
        <div className="w-full h-64">
          <Skeleton className="h-full w-full" />
        </div>
        <CardHeader className="px-5 py-4">
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4 px-5 py-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-6 w-1/3 mt-3" />
        </CardContent>
        <CardFooter className="flex justify-between gap-3 px-5 py-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </CardFooter>
      </div>
    </Card>
  );
}

// Función auxiliar para formatear fechas (usada por el componente)
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
}
