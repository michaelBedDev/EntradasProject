// app/actions/db/events.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { EventInsert, EventRow, EventStatus } from "@/types/events.types";

//Creamos el cliente de Supabase
// y lo exportamos para usarlo en las funciones
// de la API de eventos
// (no es necesario crear uno nuevo en cada función)

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

// Note sobre RLS: Si el RLS está configurado para filtrar solo eventos aprobados,
// no es necesario añadir el filtro en la consulta.

export async function getEventosWithOrganizers(): Promise<EventRow[]> {
  // Gracias al RLS, solo obtendremos los eventos que el usuario puede ver
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("eventos")
    .select(
      `
      *,
      usuarios!eventos_organizador_id_fkey (
        nombre
      )
    `,
    )
    .order("fecha", { ascending: true });

  if (error)
    throw new Error(`Error al obtener eventos con organizadores: ${error.message}`);

  // Transformar los datos para tener una estructura más sencilla
  return data!.map((evento: any) => ({
    ...evento,
    organizador_nombre: evento.usuarios?.nombre || "Organizador desconocido",
    usuarios: evento.usuarios ? { nombre: evento.usuarios.nombre } : undefined,
  })) as EventRow[];
}

export async function getEventosByName(query?: string): Promise<EventRow[]> {
  const supabase = await getSupabaseServerClient();

  // Base: selecciona todos y ordena por fecha
  // No necesitamos filtrar por status ya que el RLS se encarga de eso
  let b = supabase
    .from("eventos")
    .select(
      `
      *,
      usuarios!eventos_organizador_id_fkey (
        nombre
      )
    `,
    )
    .order("fecha", { ascending: true });

  // Si recibimos texto, añadimos el filtro ILIKE
  const q = query?.trim();
  if (q) {
    const filtro = `%${q.replace(/%/g, "\\%")}%`;
    b = b.or(`titulo.ilike.${filtro},descripcion.ilike.${filtro}`);
  }

  const { data, error } = await b;
  if (error) throw new Error(`Error buscando eventos: ${error.message}`);

  // Transformar los datos para tener una estructura más sencilla
  return data!.map((evento) => ({
    ...evento,
    organizador_nombre: evento.usuarios?.nombre || "Organizador desconocido",
    usuarios: evento.usuarios ? { nombre: evento.usuarios.nombre } : undefined,
  })) as EventRow[];
}

export async function getEventById(id: string): Promise<EventRow> {
  const supabase = await getSupabaseServerClient();

  // Primero obtener los detalles básicos del evento
  const { data: eventoData, error: eventoError } = await supabase
    .from("eventos")
    .select(
      `
      *,
      usuarios!eventos_organizador_id_fkey (
        nombre
      )
    `,
    )
    .eq("id", id)
    .single();

  if (eventoError) throw new Error(`Evento no encontrado: ${eventoError.message}`);

  // También obtenemos la información de precio del primer tipo de entrada disponible
  const { data: tipoEntrada, error: entradaError } = await supabase
    .from("tipo_entrada")
    .select("precio")
    .eq("evento_id", id)
    .order("precio", { ascending: true })
    .limit(1)
    .single();

  // No lanzamos error si no hay tipos de entrada, simplemente no tendrá precio
  const precio = !entradaError ? tipoEntrada.precio : undefined;

  return {
    ...eventoData!,
    organizador_nombre: eventoData!.usuarios?.nombre || "Organizador desconocido",
    usuarios: eventoData!.usuarios
      ? { nombre: eventoData!.usuarios.nombre }
      : undefined,
    precio: precio, // Añadir el precio al objeto de respuesta
  } as EventRow;
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

/**
 * Actualiza la URL de la imagen de un evento
 */
export async function updateEventImage(
  id: string,
  imageUrl: string,
): Promise<EventRow> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("eventos")
    .update({ imagen_uri: imageUrl })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar imagen del evento: ${error.message}`);
  }

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
