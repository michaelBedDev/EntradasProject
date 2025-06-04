import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { NextResponse, NextRequest } from "next/server";

/**
 * Endpoint para obtener un evento específico por ID.
 *
 * @param request - La solicitud entrante que contiene el ID del evento.
 * @param params - Parámetros de la ruta que incluyen el ID del evento.
 * @returns Una respuesta JSON con los detalles del evento o un error.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Se requiere el ID del evento" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();

  try {
    const { data, error } = await supabase
      .from("eventos")
      .select(
        `
        id,
        titulo,
        descripcion,
        fecha,
        lugar,
        imagen_uri,
        organizador_id
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ evento: data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Error al obtener el evento: " + (err as Error).message },
      { status: 500 },
    );
  }
}
