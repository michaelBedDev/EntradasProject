// app/components/EventsList.tsx
"use client";

import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllEvents } from "@/app/actions/db/events";
import type { Database } from "@/types/supabase.types";

// Tipo de fila
type EventRow = Database["public"]["Tables"]["eventos"]["Row"];

export default function EventsButton() {
  const queryClient = useQueryClient();
  const [showEvents, setShowEvents] = useState(false);

  // Configuramos la consulta para que no se ejecute automáticamente
  const allEventsQuery = useQuery<EventRow[], Error>({
    queryKey: ["events"],
    queryFn: () => getAllEvents(),
    enabled: showEvents, // La consulta solo se ejecuta cuando showEvents es true
  });

  const handleLoadEvents = () => {
    setShowEvents(true);
  };

  const handleResetEvents = () => {
    setShowEvents(false);
    // Opcional: invalidar la cache para que se recarguen los datos la próxima vez
    queryClient.invalidateQueries(["events"]);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Eventos</h2>

      {!showEvents ? (
        <button
          onClick={handleLoadEvents}
          style={{
            padding: "10px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}>
          Cargar Eventos
        </button>
      ) : (
        <>
          <button
            onClick={handleResetEvents}
            style={{
              padding: "10px 16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: "16px",
            }}>
            Ocultar Eventos
          </button>

          {allEventsQuery.isLoading && <div>Cargando eventos...</div>}

          {allEventsQuery.isError && (
            <div style={{ color: "red" }}>
              Error al cargar eventos: {allEventsQuery.error.message}
            </div>
          )}

          {allEventsQuery.isSuccess &&
            (allEventsQuery.data.length > 0 ? (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {allEventsQuery.data.map((e) => (
                  <li
                    key={e.id}
                    style={{
                      marginBottom: "12px",
                      padding: "12px",
                      borderRadius: "4px",
                      backgroundColor: "#f5f5f5",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                    }}>
                    <strong>{e.titulo}</strong>
                    <div>Estado: {e.status}</div>
                    <div>Fecha: {new Date(e.fecha).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay eventos disponibles</p>
            ))}
        </>
      )}
    </div>
  );
}
