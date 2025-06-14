import EventosList from "@/features/eventos/components/EventosList";

import { SearchBar } from "@/features/layout/components/SearchBar";

interface Props {
  searchParams: Promise<{ query?: string }>;
}

export default async function page({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.query?.trim() ?? "";

  return (
    <>
      <div className="container mx-auto py-12 px-8 max-w-6xl">
        {/* Encabezado con estilo Apple - Aumentado el espacio vertical */}
        <div className="mb-16 text-center mt-8">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            {q ? `Resultados para "${q}"` : "Descubre eventos"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explora los mejores eventos disponibles y reserva tus entradas ahora.
          </p>
        </div>
        {/* Barra de búsqueda */}
        <SearchBar query={q} />
      </div>
      <EventosList query={q} />
    </>
  );
}
