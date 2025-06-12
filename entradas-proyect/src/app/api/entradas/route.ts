import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

/**
 * GET /api/entradas
 * Endpoint público para obtener entradas con filtros
 * Parámetros opcionales:
 * - evento_id: filtrar por ID del evento
 * - organizador_id: filtrar por ID del organizador
 * - wallet: filtrar por wallet del comprador
 * - tipo_entrada_id: filtrar por tipo de entrada
 * - estado: filtrar por estado de la entrada
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const searchParams = request.nextUrl.searchParams;

    // Construir la consulta base
    let query = supabase.from("entradas").select(`
      *,
      tipo_entrada:tipo_entrada_id (
        *,
        evento:evento_id (
          *,
          organizador:organizador_id (
            id,
            nombre,
            wallet
          )
        )
      )
    `);

    // Aplicar filtros según los parámetros
    const eventoId = searchParams.get("evento_id");
    if (eventoId) {
      query = query.eq("tipo_entrada.evento_id", eventoId);
    }

    const organizadorId = searchParams.get("organizador_id");
    if (organizadorId) {
      query = query.eq("tipo_entrada.evento.organizador_id", organizadorId);
    }

    const wallet = searchParams.get("wallet");
    if (wallet) {
      query = query.eq("wallet", wallet);
    }

    const tipoEntradaId = searchParams.get("tipo_entrada_id");
    if (tipoEntradaId) {
      query = query.eq("tipo_entrada_id", tipoEntradaId);
    }

    const estado = searchParams.get("estado");
    if (estado) {
      query = query.eq("estado", estado);
    }

    // Ejecutar la consulta
    const { data: entradas, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Error al obtener las entradas" },
        { status: 500 },
      );
    }

    return NextResponse.json(entradas);
  } catch (error) {
    console.error("Error en GET /api/entradas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
