// app/(user)/explorar-eventos/EventosClient.tsx
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { EventoCard } from "./EventoCard";
import { EventoCardSkeleton } from "./EventoCardSkeleton";
import { useFetchEventos } from "../hooks/useFetchEventos";

export default function EventosList({ query }: { query: string }) {
  const { eventos, loading, error } = useFetchEventos(query);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-8 max-w-6xl">
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
      <div className="container mx-auto py-12 px-8 max-w-6xl">
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
      <div className="container mx-auto py-12 px-8 max-w-6xl">
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
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map((evento) => (
          <EventoCard evento={evento} key={evento.id} />
        ))}
      </div>
    </div>
  );
}
