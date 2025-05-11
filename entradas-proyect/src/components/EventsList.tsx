// app/components/EventsList.tsx
"use client";

import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEventStatus,
  deleteEvent,
} from "@/app/actions/db/events";
import type { Database } from "@/types/supabase.types";
import { EventStatus } from "@/types/events.types";

// Tipo de fila
type EventRow = Database["public"]["Tables"]["eventos"]["Row"];

export default function EventsList() {
  const qc = useQueryClient();

  /** 1. Leer todos los eventos */
  const allEventsQuery = useQuery<EventRow[], Error>({
    queryKey: ["events"],
    queryFn: () => getAllEvents(),
  });

  /** 2. Leer evento por ID */
  const [searchId, setSearchId] = useState("");
  const eventByIdQuery = useQuery<EventRow, Error>({
    queryKey: ["event", searchId],
    queryFn: () => getEventById(searchId),
    enabled: false,
  });

  /** 3. Crear evento */
  const createMut = useMutation<
    EventRow,
    Error,
    Omit<
      Database["public"]["Tables"]["eventos"]["Insert"],
      "id" | "created_at" | "status"
    >
  >({
    mutationFn: (payload) => createEvent(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });

  /** 4. Actualizar estado */
  const [statusId, setStatusId] = useState("");
  const [newStatus, setNewStatus] = useState<EventStatus>(EventStatus.Aprobado);
  const statusMut = useMutation<
    EventRow,
    Error,
    { id: string; status: EventStatus }
  >({
    mutationFn: ({ id, status }) => updateEventStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });

  /** 5. Eliminar evento */
  const [delId, setDelId] = useState("");
  const deleteMut = useMutation<void, Error, string>({
    mutationFn: (id) => deleteEvent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });

  if (allEventsQuery.isLoading) return <p>Cargando eventos…</p>;
  if (allEventsQuery.error)
    return <p style={{ color: "red" }}>{allEventsQuery.error.message}</p>;

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      {/* 1. Listado */}
      <h2>1. Todos los eventos</h2>
      <ul>
        {allEventsQuery.data!.map((e) => (
          <li key={e.id}>
            <strong>{e.titulo}</strong> — {e.status} —{" "}
            {new Date(e.fecha).toLocaleString()}
          </li>
        ))}
      </ul>

      {/* 2. Buscar por ID */}
      <h2>2. Buscar evento por ID</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          eventByIdQuery.refetch();
        }}>
        <input
          placeholder="ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      {eventByIdQuery.isFetching && <p>Buscando…</p>}
      {eventByIdQuery.error && (
        <p style={{ color: "red" }}>{eventByIdQuery.error.message}</p>
      )}
      {eventByIdQuery.data && (
        <pre style={{ background: "#f0f0f0", padding: 8 }}>
          {JSON.stringify(eventByIdQuery.data, null, 2)}
        </pre>
      )}

      {/* 3. Crear */}
      <h2>3. Crear evento</h2>
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          // Creamos un FormData a partir del form
          const formData = new FormData(e.currentTarget);
          const titulo = formData.get("title") as string;
          const lugar = formData.get("lugar") as string;
          const descripcionRaw = formData.get("descripcion");
          const descripcion = descripcionRaw ? String(descripcionRaw) : null;

          createMut.mutate({
            titulo,
            fecha: new Date().toISOString(),
            lugar,
            descripcion,
            imagen_uri: null,
            organizador_id: null,
          });
        }}>
        <input name="title" placeholder="Título" required />
        <input name="lugar" placeholder="Lugar" required />
        <input name="descripcion" placeholder="Descripción" />
        <button type="submit">Crear</button>
      </form>
      {createMut.isError && (
        <p style={{ color: "red" }}>{createMut.error!.message}</p>
      )}

      {/* 4. Actualizar estado */}
      <h2>4. Cambiar estado</h2>
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          statusMut.mutate({ id: statusId, status: newStatus });
        }}>
        <input
          placeholder="ID"
          value={statusId}
          onChange={(e) => setStatusId(e.target.value)}
        />
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as EventStatus)}>
          {Object.values(EventStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit">Actualizar</button>
      </form>
      {statusMut.isError && (
        <p style={{ color: "red" }}>{statusMut.error!.message}</p>
      )}

      {/* 5. Eliminar */}
      <h2>5. Eliminar evento</h2>
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          deleteMut.mutate(delId);
        }}>
        <input
          placeholder="ID"
          value={delId}
          onChange={(e) => setDelId(e.target.value)}
        />
        <button type="submit">Eliminar</button>
      </form>
      {deleteMut.isError && (
        <p style={{ color: "red" }}>{deleteMut.error!.message}</p>
      )}
    </div>
  );
}
