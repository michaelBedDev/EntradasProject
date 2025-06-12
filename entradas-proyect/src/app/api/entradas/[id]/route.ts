import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import { getUserRoleFromRequest } from "@/features/auth/lib/getUserRole";

/**
 * GET /api/entradas/[id]
 * Endpoint público para obtener los detalles de una entrada específica
 * Incluye información del tipo de entrada y el evento asociado
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = getSupabaseAdminClient();
    const id = (await context.params).id;

    // Obtener la entrada con sus relaciones
    const { data: entrada, error } = await supabase
      .from("entradas")
      .select(
        `
      *,
      asiento:asientos!entrada_id (
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
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al obtener la entrada" },
        { status: 500 },
      );
    }

    if (!entrada) {
      return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 });
    }

    return NextResponse.json(entrada);
  } catch (error) {
    console.error("Error en GET /api/entradas/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/entradas/[id]
 * Endpoint privado para cancelar una entrada
 * Requiere autenticación y uno de los siguientes roles:
 * - Propietario de la entrada (wallet)
 * - Organizador del evento
 * - Administrador
 *
 * En lugar de eliminar la entrada, se marca como cancelada
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await getSupabaseClientForAPIs(request);
    const id = (await context.params).id;

    // Verificar que el usuario esté autenticado
    const userRole = await getUserRoleFromRequest(request);
    if (userRole === "usuario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener la entrada actual
    const { data: entradaActual, error: errorEntrada } = await supabase
      .from("entradas")
      .select(
        `
        *,
        tipo_entrada:tipo_entrada_id (
          evento:evento_id (
            organizador_id
          )
        )
      `,
      )
      .eq("id", id)
      .single();

    if (errorEntrada) {
      return NextResponse.json(
        { error: "Error al obtener la entrada" },
        { status: 500 },
      );
    }

    if (!entradaActual) {
      return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 });
    }

    // Marcar la entrada como cancelada
    const { data: entrada, error } = await supabase
      .from("entradas")
      .update({
        estado: "cancelada",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al cancelar la entrada" },
        { status: 500 },
      );
    }

    return NextResponse.json(entrada);
  } catch (error) {
    console.error("Error en DELETE /api/entradas/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
