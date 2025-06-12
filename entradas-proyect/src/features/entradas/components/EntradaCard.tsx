import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStatusStyle } from "@/features/entradas/lib/getStatusBadge";
import { EntradaCompletaPublica } from "@/types/global";
import { formatToFullDate } from "@/utils/dateFormat";
import {
  Calendar,
  Clock,
  Download,
  MapPin,
  QrCode,
  Share,
  Ticket,
} from "lucide-react";

// Componente para la tarjeta de entrada
interface EntradaCardProps {
  entrada: EntradaCompletaPublica;
  onShare: () => void;
  onDownload: () => void;
  onViewQR: () => void;
}

export function EntradaCard({
  entrada,
  onShare,
  onDownload,
  onViewQR,
}: EntradaCardProps) {
  // Extraer información del evento directamente
  const evento = entrada.tipo_entrada.evento;
  const tipo_entrada = entrada.tipo_entrada;

  // Asignar el badge y el texto según el estado de la entrada
  const statusStyle = getStatusStyle(entrada);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md p-0">
      <div className="w-full">
        {/* Sección de imagen a tamaño completo */}
        <div className="relative w-full h-64">
          {evento.imagen_uri ? (
            <img
              src={evento.imagen_uri}
              alt={evento.titulo}
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
              {tipo_entrada.nombre}
            </Badge>
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <CardHeader className="px-5 py-4">
          <CardTitle className="line-clamp-1 text-xl">{evento.titulo}</CardTitle>
          <CardDescription className="text-sm">
            {tipo_entrada.nombre}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 px-5 py-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="truncate text-base">
              {formatToFullDate(evento.fecha_inicio)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="text-base">{evento.fecha_inicio}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="truncate text-base">{evento.lugar}</span>
          </div>
          <div className="mt-5 text-base font-medium">
            Precio: {tipo_entrada.precio.toFixed(2)}€
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
