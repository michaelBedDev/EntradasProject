// app/(user)/explorar-eventos/page.tsx

import { getAllEvents } from "@/app/actions/db/events";
import { searchEvent } from "@/app/actions/searchEvent";
import { EventRow } from "@/types/events.types";

interface Props {
  searchParams: Promise<{ query?: string }>;
}

export default async function ExplorarEventosPage({ searchParams }: Props) {
  // Esperamos a que searchParams se resuelva
  const { query } = await searchParams;
  const q = query?.trim() ?? "";

  // Si hay término de búsqueda, filtramos; si no, traemos todos
  const eventos: EventRow[] = q ? await searchEvent(q) : await getAllEvents();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">
        {q ? `Resultados para “${q}”` : "Todos los eventos"}
      </h1>

      {eventos.length === 0 ? (
        <p className="text-gray-600">No se encontraron eventos.</p>
      ) : (
        <ul className="space-y-2">
          {eventos.map((e) => (
            <li key={e.id} className="p-4 border rounded hover:shadow transition">
              <h2 className="text-lg font-semibold">{e.titulo}</h2>
              <p className="text-sm text-gray-500">
                {new Date(e.fecha).toLocaleDateString("es-ES")}
              </p>
              <p className="mt-1">{e.descripcion}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
