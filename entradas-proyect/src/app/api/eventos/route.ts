// Devuelve todos los eventos aprobados ordenados por fecha
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint para obtener eventos aprobados con búsqueda opcional.
 *
 * @param request - La solicitud entrante que puede contener parámetros de búsqueda.
 * @returns Una respuesta JSON con la lista de eventos o un error.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() || "";

  const supabase = getSupabaseAdminClient();

  try {
    let queryBuilder = supabase
      .from("eventos")
      .select(
        `
        id,
        titulo,
        descripcion,
        fecha,
        lugar,
        imagen_uri,
        organizador_id,
        status
      `,
      )
      .eq("status", "aprobado")
      .order("fecha", { ascending: true });

    // Aplicar filtro de búsqueda solo si hay query
    if (query) {
      const safeQuery = `%${query.replace(/%/g, "\\%")}%`;

      queryBuilder = queryBuilder.or(
        `titulo.ilike.${safeQuery}, descripcion.ilike.${safeQuery}`,
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ eventos: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Error al obtener eventos: " + (err as Error).message },
      { status: 500 },
    );
  }
}

/**
 * Endpoint para crear un nuevo evento.
 * @route POST /api/eventos
 * @description Este endpoint permite a los usuarios crear un nuevo evento.
 * Los datos del evento deben enviarse en formato JSON y deben incluir los campos requeridos.
 * Los eventos se crean con estado "pendiente" por defecto.
 * @param request - La solicitud entrante que contiene los datos del evento a crear.
 * @returns Una respuesta JSON con el ID del evento creado o un error.
 */
export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdminClient();

  try {
    const eventData = await request.json();

    // Validar campos
    const requiredFields = [
      "titulo",
      "descripcion",
      "fecha",
      "lugar",
      "organizador_id",
    ];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { error: `El campo '${field}' es obligatorio` },
          { status: 400 },
        );
      }
    }

    const { data, error } = await supabase
      .from("eventos")
      .insert({
        ...eventData,
        status: "pendiente", // Por defecto los eventos se crean como pendientes
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Evento creado correctamente",
        evento_id: data.id,
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Error al crear evento: " + (err as Error).message },
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
//       "fecha": "2023-06-15T19:00:00",
//       "lugar": "Estadio Municipal",
//       "imagen_uri": "https://ejemplo.com/imagen.jpg",
//       "organizador_id": "id-del-organizador"
//     },
//     // más eventos...
//   ]
// }
