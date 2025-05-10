// components/EventsList.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Database } from "@/types/supabase.types";

// Tipo de fila de evento
export type EventRow = Database["public"]["Tables"]["eventos"]["Row"];

// Función para obtener eventos
async function fetchEvents(): Promise<EventRow[]> {
  const response = await axios.get<EventRow[]>("/api/events");
  return response.data;
}

// Función para eliminar un evento por ID
async function deleteEventById(id: string): Promise<void> {
  await axios.delete(`/api/events/${id}`);
}

export default function EventsList() {
  const queryClient = useQueryClient();

  // Query para obtener la lista de eventos
  const {
    data: eventsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<EventRow[], Error>({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
  const eventsList = eventsData ?? [];

  // Mutación para eliminar un evento
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteEventById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  // Estados de carga y error iniciales
  if (isLoading) return <p>Cargando eventos…</p>;
  if (isError) return <p>Error al cargar eventos: {error?.message}</p>;
  if (eventsList.length === 0) return <p>No hay eventos disponibles.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Eventos</h1>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="px-3 py-1 rounded shadow">
          {isRefetching ? "Refrescando…" : "Refrescar"}
        </button>
      </div>

      <ul className="space-y-2">
        {eventsList.map((event) => (
          <li
            key={event.id}
            className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{event.titulo}</h2>
              <p className="text-sm">{new Date(event.fecha).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => deleteMutation.mutate(event.id)}
              disabled={deleteMutation.isPending}
              className="px-2 py-1 rounded bg-red-100">
              {deleteMutation.isPending ? "Eliminando…" : "Eliminar"}
            </button>
          </li>
        ))}
      </ul>

      {deleteMutation.isError && (
        <p className="mt-4 text-red-600">
          Error al eliminar evento: {deleteMutation.error?.message}
        </p>
      )}
    </div>
  );
}
