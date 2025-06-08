"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { slugify } from "@/utils/slugify";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  ShareIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

export function EventoCard({ evento }: { evento: EventoWOrganizador }) {
  {
    /*Función para compartir los eventos */
  }
  const handleShare = (evento: Evento) => {
    const url = `${window.location.origin}/eventos/${evento.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: evento.titulo,
          text: evento.descripcion || "Mira este evento",
          url: url,
        })
        .catch((error) => {
          console.error("Error compartiendo:", error);
        });
    }
    toast("Compartido correctamente", {
      description: "El enlace al evento se ha compartido correctamente.",
      position: "top-center",
    });
  };

  {
    /* Formateo la fecha */
  }
  const fecha = new Date(evento.fecha);
  const diaMes = format(fecha, "dd", { locale: es });
  const mes = format(fecha, "MMM", { locale: es }).toUpperCase();

  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl relative h-[400px]">
      {/* Imagen de fondo a tamaño completo */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/5 z-0 overflow-hidden">
        {evento.imagen_uri ? (
          <img
            src={evento.imagen_uri}
            alt={evento.titulo}
            id={`img-${evento.id}`}
            className="w-full h-full object-cover transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
            <span className="text-muted-foreground">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Overlay con gradiente para el contenido */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-all duration-500 z-10">
        {/* Fecha destacada estilo moderno - simplificada */}
        <div className="absolute top-4 left-4 shadow-lg">
          <div className="rounded-xl overflow-hidden flex flex-col items-center bg-background/95 backdrop-blur-md">
            {/* Cabecera con mes */}
            <div className="w-full flex items-center justify-center py-1.5 bg-primary px-3">
              <CalendarIcon className="h-4 w-4 text-primary-foreground mr-1.5" />
              <span className="text-xs font-bold uppercase text-primary-foreground tracking-wider">
                {mes}
              </span>
            </div>

            {/* Día del mes */}
            <div className="p-2 flex justify-center w-full">
              <span className="text-3xl font-bold text-foreground">{diaMes}</span>
            </div>
          </div>
        </div>

        {/* Contenido principal en la parte inferior */}
        <div className="absolute inset-x-0 bottom-0 p-6 space-y-4">
          {/* Título y organizador */}
          <div>
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
              {evento.titulo}
            </h3>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <UserIcon className="h-3 w-3" />
              <span>{evento.organizador?.nombre}</span>
            </div>
          </div>

          {/* Badges de información */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <MapPinIcon className="h-3 w-3 mr-1" />
              {evento.lugar}
            </Badge>

            {evento.descripcion && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-0 cursor-default"
                title={evento.descripcion}>
                {evento.descripcion.length > 30
                  ? evento.descripcion.substring(0, 27) + "..."
                  : evento.descripcion}
              </Badge>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 transition-all duration-300"
              onClick={() => handleShare(evento)}>
              <ShareIcon className="h-4 w-4 mr-1" />
              Compartir
            </Button>
            <Button
              size="sm"
              className="group gap-1 bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary-foreground hover:text-primary hover:shadow-md cursor-pointer"
              onClick={() => {
                // Redirigir a la página de detalle con formato slug-uuid (incluimos el UUID completo)
                const tituloSlug = slugify(evento.titulo);
                window.location.href = `/eventos/${tituloSlug}-${evento.id}`;
              }}>
              Ver detalles
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
