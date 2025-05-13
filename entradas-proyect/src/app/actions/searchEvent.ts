// actions/searchEvent.ts

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { EventRow } from "@/types/events.types";

export async function searchEvent(query: string): Promise<EventRow[]> {
  const supabase = await getSupabaseServerClient();

  // Filtramos por nombre O descripción que contenga el término (ILIKE → case‐insensitive)
  const filtro = `%${query.replace(/%/g, "\\%")}%`;
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .or(`titulo.ilike.${filtro},descripcion.ilike.${filtro}`)
    .order("fecha", { ascending: true });

  console.log("SUPABASE searchEvent →", { data, error }); // ← Añade esto
  if (error) throw new Error(`Error buscando eventos: ${error.message}`);
  return data!;
}
