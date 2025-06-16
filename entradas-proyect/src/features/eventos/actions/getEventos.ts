"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { EventoStatus } from "../services/types";
import type { EventoPublico } from "@/types/global";

export async function getEventosProximos(
  categoria?: string,
  busqueda?: string,
): Promise<EventoPublico[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const hoy = new Date().toISOString();

    // Construir la consulta base
    let query = supabase
      .from("eventos")
      .select(
        `
        *,
        organizador:usuarios!inner(id, nombre, wallet)
      `,
      )
      .gte("fecha_inicio", hoy) // Solo eventos que no han pasado
      .eq("status", EventoStatus.APROBADO); // Solo eventos aprobados

    // Aplicar filtros si se proporcionan
    if (categoria && categoria !== "todos") {
      // Convertir la categoría a mayúsculas para coincidir con la base de datos
      query = query.eq("categoria", categoria.toUpperCase());
    }

    if (busqueda) {
      query = query.or(`titulo.ilike.%${busqueda}%,descripcion.ilike.%${busqueda}%`);
    }

    // Ordenar por fecha y limitar a 3 resultados
    query = query.order("fecha_inicio", { ascending: true }).limit(3);

    const { data: eventos, error } = await query;

    if (error) {
      console.error("Error al obtener eventos:", error);
      throw new Error("Error al obtener los eventos");
    }

    return eventos as EventoPublico[];
  } catch (error) {
    console.error("Error en getEventosProximos:", error);
    throw error;
  }
}
