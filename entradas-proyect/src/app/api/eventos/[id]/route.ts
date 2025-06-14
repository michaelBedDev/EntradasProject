import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import { EventoStatus } from "@/features/eventos/services/types";
import { getUserRoleFromRequest } from "@/features/auth/lib/getUserRole";

/**
 * GET /api/eventos/[id]
 * Endpoint público para obtener detalles de un evento específico
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = getSupabaseAdminClient();
    const id = (await context.params).id;
    console.log("API: Obteniendo evento con ID:", id);

    // Obtener el evento con sus relaciones
    const { data: evento, error } = await supabase
      .from("eventos")
      .select(
        `
    *,
    organizador:usuarios!inner(id, nombre, wallet),
    tipos_entrada (
      id,
      cantidad_disponible,
      descripcion,
      nombre,
      precio,
      zona
    )
  `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("API: Error al obtener el evento:", error);
      return NextResponse.json(
        { error: "Error al obtener el evento" },
        { status: 500 },
      );
    }

    if (!evento) {
      console.log("API: Evento no encontrado");
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    console.log("API: Evento encontrado:", {
      id: evento.id,
      titulo: evento.titulo,
      status: evento.status,
    });

    return NextResponse.json(evento);
  } catch (error) {
    console.error("API: Error en GET /api/eventos/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/eventos/[id]
 * Endpoint privado para actualizar un evento existente
 * Requiere autenticación y uno de los siguientes roles:
 * - Organizador del evento
 * - Administrador
 *
 * Si el evento está aprobado, solo los administradores pueden editarlo
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await getSupabaseClientForAPIs(request);
    const id = (await context.params).id;
    const json = await request.json();

    // Verificar que el usuario esté autenticado
    const userRole = await getUserRoleFromRequest(request);
    if (userRole === "usuario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener el evento actual
    const { data: eventoActual, error: errorEvento } = await supabase
      .from("eventos")
      .select("organizador_id, status")
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

    // Verificar permisos
    if (
      eventoActual.organizador_id !== request.headers.get("x-user-id") &&
      userRole !== "admin"
    ) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Si el evento está aprobado, solo los administradores pueden editarlo
    if (eventoActual.status === EventoStatus.APROBADO && userRole !== "admin") {
      return NextResponse.json(
        { error: "No se puede editar un evento aprobado" },
        { status: 403 },
      );
    }

    // Actualizar el evento
    const { data: evento, error } = await supabase
      .from("eventos")
      .update({
        ...json,
        status: EventoStatus.PENDIENTE, // Al editar, vuelve a pendiente
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al actualizar el evento" },
        { status: 500 },
      );
    }

    return NextResponse.json(evento);
  } catch (error) {
    console.error("Error en PATCH /api/eventos/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/eventos/[id]
 * Endpoint privado para eliminar un evento
 * Requiere autenticación y uno de los siguientes roles:
 * - Organizador del evento
 * - Administrador
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

    // Obtener el evento actual
    const { data: eventoActual, error: errorEvento } = await supabase
      .from("eventos")
      .select("organizador_id, status")
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

    // Verificar permisos
    if (
      eventoActual.organizador_id !== request.headers.get("x-user-id") &&
      userRole !== "admin"
    ) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Eliminar el evento
    const { error } = await supabase.from("eventos").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Error al eliminar el evento" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error en DELETE /api/eventos/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
