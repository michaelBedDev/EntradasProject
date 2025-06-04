// app/(user)/explorar-eventos/EventosClient.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPinIcon,
  UserIcon,
  ArrowRightIcon,
  SearchIcon,
  ShareIcon,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export default function EventosList({
  eventos,
  query,
}: {
  eventos: Evento[];
  query: string;
}) {
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
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Encabezado con estilo Apple - Aumentado el espacio vertical */}
      <div className="mb-16 text-center mt-8">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          {query ? `Resultados para "${query}"` : "Descubre eventos"}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explora los mejores eventos disponibles y reserva tus entradas ahora.
        </p>
      </div>
      {/* Barra de búsqueda con estilo moderno */}
      <div className="mb-12">
        <form
          action="/eventos"
          method="get"
          className="flex w-full max-w-lg mx-auto rounded-xl overflow-hidden border shadow-sm focus-within:ring-2 focus-within:ring-primary/50">
          <div className="flex-1 flex items-center px-4">
            <SearchIcon className="text-muted-foreground mr-2 h-5 w-5" />
            <input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Buscar eventos..."
              className="flex-1 py-3 outline-none bg-transparent"
            />
          </div>
          <div className="flex items-stretch">
            <Button type="submit" className="rounded-l-none py-6 px-6">
              Buscar
            </Button>
          </div>
        </form>
      </div>
      {eventos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4 text-xl">
            {query
              ? "No se encontraron eventos."
              : "No hay eventos publicados todavía."}
          </div>
          <Button variant="outline" asChild>
            <Link href="/eventos">Ver todos los eventos</Link>
          </Button>
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map((evento) => (
          <EventoCard
            key={evento.id}
            evento={evento}
            onShare={() => handleShare(evento)}
          />
        ))}
      </div>
    </div>
  );
}

interface EventoCardProps {
  evento: Evento;
  onShare: () => void;
}

function EventoCard({ evento, onShare }: EventoCardProps) {
  // Formatear la fecha para mostrarla de forma más elegante
  const fecha = new Date(evento.fecha);
  // Asegurarse de que el día tenga 2 dígitos
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
              <span>{evento.organizador_id || "Organizador"}</span>
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
              onClick={onShare}>
              <ShareIcon className="h-4 w-4 mr-1" />
              Compartir
            </Button>
            <Button
              size="sm"
              className="gap-1 bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary"
              onClick={() => {
                // Crear un slug amigable para la URL usando el título y el ID completo
                const tituloSlug = evento.titulo
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, "") // Eliminar caracteres especiales
                  .replace(/\s+/g, "-") // Reemplazar espacios con guiones
                  .replace(/--+/g, "-") // Eliminar guiones múltiples
                  .trim(); // Quitar espacios al inicio y final

                // Redirigir a la página de detalle con formato slug-uuid (incluimos el UUID completo)
                window.location.href = `/eventos/${tituloSlug}-${evento.id}`;
              }}
              onMouseEnter={() => {
                const img = document.getElementById(`img-${evento.id}`);
                if (img) img.classList.add("scale-110");
              }}
              onMouseLeave={() => {
                const img = document.getElementById(`img-${evento.id}`);
                if (img) img.classList.remove("scale-110");
              }}>
              Ver detalles
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
