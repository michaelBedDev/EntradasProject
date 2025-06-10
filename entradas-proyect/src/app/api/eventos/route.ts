// Devuelve todos los eventos aprobados ordenados por fecha
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

import { EventoStatus } from "@/features/eventos/services/types";
import { getUserRoleFromRequest } from "@/features/auth/lib/getUserRole";
import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";

/**
 * GET /api/eventos
 * Endpoint público para obtener eventos
 * Parámetros opcionales:
 * - status: filtrar por estado (aprobado por defecto)
 * - organizador: filtrar por ID del organizador
 * - categoria: filtrar por categoría
 * - fecha_inicio: filtrar por fecha de inicio
 * - fecha_fin: filtrar por fecha de fin
 * - busqueda: buscar por título o descripción
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const searchParams = request.nextUrl.searchParams;

    // Construir la consulta base
    let query = supabase.from("eventos").select(`
      *,
      organizador:usuarios!inner(id, nombre, wallet)
    `);

    // Aplicar filtros según los parámetros
    const status = searchParams.get("status");
    if (status) {
      query = query.eq("status", status);
    } else {
      // Por defecto, mostrar solo eventos aprobados
      query = query.eq("status", EventoStatus.APROBADO);
    }

    const organizador = searchParams.get("organizador");
    if (organizador) {
      query = query.eq("organizador_id", organizador);
    }

    const categoria = searchParams.get("categoria");
    if (categoria) {
      query = query.eq("categoria", categoria);
    }

    const fechaInicio = searchParams.get("fecha_inicio");
    if (fechaInicio) {
      query = query.gte("fecha_inicio", fechaInicio);
    }

    const fechaFin = searchParams.get("fecha_fin");
    if (fechaFin) {
      query = query.lte("fecha_fin", fechaFin);
    }

    const busqueda = searchParams.get("busqueda");
    if (busqueda) {
      query = query.or(`titulo.ilike.%${busqueda}%,descripcion.ilike.%${busqueda}%`);
    }

    // Ejecutar la consulta
    const { data: eventos, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Error al obtener los eventos" },
        { status: 500 },
      );
    }

    return NextResponse.json(eventos);
  } catch (error) {
    console.error("Error en GET /api/eventos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/eventos
 * Endpoint privado para crear un nuevo evento
 * Requiere autenticación y rol de organizador
 * Cuerpo de la petición:
 * - titulo: string
 * - descripcion: string
 * - fecha_inicio: Date
 * - fecha_fin?: Date
 * - lugar: string
 * - categoria: string
 * - imagen_uri?: string
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClientForAPIs(request);
    const json = await request.json();

    // Verificar que el usuario esté autenticado y sea organizador
    const userRole = await getUserRoleFromRequest(request);
    if (userRole === "usuario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Crear el evento
    const { data: evento, error } = await supabase
      .from("eventos")
      .insert({
        ...json,
        organizador_id: request.headers.get("x-user-id"),
        status: EventoStatus.PENDIENTE,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al crear el evento" },
        { status: 500 },
      );
    }

    return NextResponse.json(evento);
  } catch (error) {
    console.error("Error en POST /api/eventos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

//Ejemplo de devolución de un evento: // {
//   "eventos": [
//     {
//       "id": "uuid-del-evento",
//       "titulo": "Nombre del Evento",
//       "descripcion": "Descripción del evento...",
//       "fecha_inicio": "2023-06-15T19:00:00",
//       "fecha_fin": "2023-06-15T21:00:00",
//       "lugar": "Estadio Municipal",
//       "imagen_uri": "https://ejemplo.com/imagen.jpg",
//       "organizador_id": "id-del-organizador"
//     },
//     // más eventos...
//   ]
// }
