// app/actions/db/events.ts
"use server";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { EventInsert, EventRow, EventStatus } from "@/types/events.types";

export async function getAllEvents(): Promise<EventRow[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .order("fecha", { ascending: true });

  console.log("SUPABASE getAllEvents →", { data, error }); // ← Añade esto
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
