import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ wallet: string }> },
) {
  try {
    const supabase = await getSupabaseClientForAPIs(request);
    const wallet = (await context.params).wallet;

    const { data, error } = await supabase
      .from("entradas")
      .select(
        `
        *,
        asientos:asientos!entrada_id (
          fila,
          numero
        ),
        tipo_entrada:tipo_entrada_id (
          nombre,
          descripcion,
          precio,
          zona,
          evento:evento_id (
            titulo,
            descripcion,
            lugar,
            imagen_uri,
            fecha_inicio,
            fecha_fin,
            status,
            organizador:organizador_id (
              nombre,
              wallet
            )
          )
        )
      `,
      )
      .eq("wallet", wallet)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error de Supabase:", error);
      return NextResponse.json(
        { error: "Error al obtener las entradas" },
        { status: 500 },
      );
    }

    // Verificar si no hay entradas (array vacío)
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          message: "No hay entradas para esta wallet",
          data: [],
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        message: "Entradas obtenidas correctamente",
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en GET /api/entradas/[wallet]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
