import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import { EventoStatus } from "@/features/eventos/services/types";
import { getUserRoleFromRequest } from "@/features/auth/lib/getUserRole";

/**
 * PATCH /api/eventos/[id]/status
 * Endpoint privado para actualizar el estado de un evento
 * Requiere autenticación y rol de administrador
 *
 * Cuerpo de la petición:
 * - status: EventoStatus (APROBADO | RECHAZADO)
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await getSupabaseClientForAPIs(request);
    const id = (await context.params).id;
    const json = await request.json();
    const { status } = json;

    // Verificar que el usuario sea administrador
    const userRole = await getUserRoleFromRequest(request);
    if (userRole !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Validar el estado
    if (!Object.values(EventoStatus).includes(status)) {
      return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
    }

    // Obtener el evento actual
    const { data: eventoActual, error: errorEvento } = await supabase
      .from("eventos")
      .select("status")
      .eq("id", id)
      .single();

    if (errorEvento) {
      return NextResponse.json(
        { error: "Error al obtener el evento" },
        { status: 500 },
      );
    }

    if (!eventoActual) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    // Actualizar el estado del evento
    const { data: evento, error } = await supabase
      .from("eventos")
      .update({
        status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al actualizar el estado del evento" },
        { status: 500 },
      );
    }

    return NextResponse.json(evento);
  } catch (error) {
    console.error("Error en PATCH /api/eventos/[id]/status:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
