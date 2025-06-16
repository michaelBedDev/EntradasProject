// app/(user)/explorar-eventos/EventosClient.tsx
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { EventoCard } from "./EventoCard";
import { EventoCardSkeleton } from "./EventoCardSkeleton";
import { useFetchEventos } from "../hooks/useFetchEventos";

interface EventosListProps {
  query?: string;
  categoria?: string;
}

export default function EventosList({ query = "", categoria }: EventosListProps) {
  const { eventos, loading, error } = useFetchEventos({ query, categoria });

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventoCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-8 max-w-7xl">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4 text-xl">
            No se han podido cargar los eventos
          </div>
        </div>
      </div>
    );
  }

  if (!loading && eventos.length === 0) {
    return (
      <div className="container mx-auto py-12 px-8 max-w-7xl">
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4 text-xl">
            {query || categoria
              ? "No se encontraron eventos."
              : "No hay eventos publicados todavía."}
          </div>
          <Button variant="outline" asChild>
            <Link href="/eventos">Ver todos los eventos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map((evento) => (
          <EventoCard evento={evento} key={evento.id} />
        ))}
      </div>
    </div>
  );
}
