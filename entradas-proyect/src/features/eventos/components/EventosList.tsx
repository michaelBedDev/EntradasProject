// app/(user)/explorar-eventos/EventosClient.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { EventoCard } from "./EventoCard";
import { EventoCardSkeleton } from "./EventoCardSkeleton";
import { SearchBar } from "../../layout/components/SearchBar";

export default function EventosList({
  eventos,
  query,
}: {
  eventos: EventoWOrganizador[];
  query: string;
}) {
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
      {/* Barra de búsqueda */}
      <SearchBar query={query} />

      {/**
       * Aquí compruebo si hay eventos para mostrar.
       * Si no hay eventos, muestro un mensaje y un botón para ver todos los eventos.
       * Si hay eventos, los muestro con EventoCard.
       */}
      {eventos.length === 0 ? (
        <div className="text-center py-12">
          {/* Query show */}
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
          <Suspense fallback={<EventoCardSkeleton />} key={evento.id}>
            <EventoCard evento={evento} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
