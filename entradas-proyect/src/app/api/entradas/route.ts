import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import { getUserRoleFromRequest } from "@/features/auth/lib/getUserRole";

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

/**
 * POST /api/entradas
 * Endpoint privado para crear una nueva entrada
 * Requiere autenticación
 *
 * Cuerpo de la petición:
 * - tipo_entrada_id: string
 * - wallet: string
 * - tx_hash?: string
 * - metadata_uri: string
 * - qr_code: string
 * - token: string
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClientForAPIs(request);
    const json = await request.json();

    // Verificar que el usuario esté autenticado
    const userRole = await getUserRoleFromRequest(request);
    if (userRole === "usuario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Crear la entrada
    const { data: entrada, error } = await supabase
      .from("entradas")
      .insert({
        ...json,
        estado: "activa",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al crear la entrada" },
        { status: 500 },
      );
    }

    return NextResponse.json(entrada);
  } catch (error) {
    console.error("Error en POST /api/entradas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
