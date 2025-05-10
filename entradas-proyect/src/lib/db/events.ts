// lib/db/events.ts
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import type { Database } from "@/types/supabase.types";

// Tipos basados en el esquema generado de Supabase
type EventRow = Database["public"]["Tables"]["eventos"]["Row"];
type EventInsert = Database["public"]["Tables"]["eventos"]["Insert"];

export enum EventStatus {
  Pendiente = "pendiente",
  Aprobado = "aprobado",
  Cancelado = "cancelado",
}

export async function getAllEvents(): Promise<EventRow[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .order("fecha", { ascending: true });
  if (error) throw new Error(`Error al obtener eventos: ${error.message}`);
  return data!;
}

export async function getEventById(id: string): Promise<EventRow> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(`Evento no encontrado: ${error.message}`);
  return data!;
}

export async function createEvent(
  payload: Omit<EventInsert, "id" | "created_at" | "status">,
): Promise<EventRow> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("eventos")
    .insert({ ...payload, status: EventStatus.Pendiente })
    .select()
    .single();
  if (error) throw new Error(`Error al crear evento: ${error.message}`);
  return data!;
}

export async function updateEventStatus(
  id: string,
  status: EventStatus,
): Promise<EventRow> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("eventos")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error)
    throw new Error(`Error al actualizar status del evento: ${error.message}`);
  return data!;
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("eventos").delete().eq("id", id);
  if (error) throw new Error(`Error al eliminar evento: ${error.message}`);
}
