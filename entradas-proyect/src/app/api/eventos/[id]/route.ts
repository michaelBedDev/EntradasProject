import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import { EventoStatus } from "@/features/eventos/services/types";
import {
  getUserRoleFromRequest,
  getUserIdFromRequest,
} from "@/features/auth/lib/getUserRole";

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

    // Obtener el usuario y su rol de la sesión
    const userRole = await getUserRoleFromRequest(request);
    const userId = await getUserIdFromRequest(request);

    console.log("PATCH /api/eventos/[id] - Auth Debug:", {
      userRole,
      userId,
      headers: Object.fromEntries(request.headers.entries()),
    });

    if (!userId) {
      console.log("PATCH /api/eventos/[id] - No se pudo obtener el ID del usuario");
      return NextResponse.json(
        { error: "No autorizado - ID de usuario no encontrado" },
        { status: 401 },
      );
    }

    if (userRole === "usuario") {
      console.log(
        "PATCH /api/eventos/[id] - Usuario con rol insuficiente:",
        userRole,
      );
      return NextResponse.json(
        { error: "No autorizado - Rol insuficiente" },
        { status: 401 },
      );
    }

    // Obtener el evento actual
    const { data: eventoActual, error: errorEvento } = await supabase
      .from("eventos")
      .select("organizador_id, status")
      .eq("id", id)
      .single();

    if (errorEvento) {
      console.error(
        "PATCH /api/eventos/[id] - Error al obtener el evento:",
        errorEvento,
      );
      return NextResponse.json(
        { error: "Error al obtener el evento" },
        { status: 500 },
      );
    }

    if (!eventoActual) {
      console.log("PATCH /api/eventos/[id] - Evento no encontrado:", id);
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    console.log("PATCH /api/eventos/[id] - Comparando permisos:", {
      eventoOrganizadorId: eventoActual.organizador_id,
      userId,
      userRole,
    });

    // Verificar permisos usando el ID del usuario
    if (eventoActual.organizador_id !== userId && userRole !== "admin") {
      console.log("PATCH /api/eventos/[id] - Permisos insuficientes");
      return NextResponse.json(
        { error: "No autorizado - No es el organizador ni admin" },
        { status: 403 },
      );
    }

    // Actualizar el evento
    const { data: evento, error } = await supabase
      .from("eventos")
      .update({
        ...json,
        status: EventoStatus.PENDIENTE, // Al editar, siempre vuelve a pendiente
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("PATCH /api/eventos/[id] - Error al actualizar:", error);
      return NextResponse.json(
        { error: "Error al actualizar el evento" },
        { status: 500 },
      );
    }

    console.log("PATCH /api/eventos/[id] - Evento actualizado correctamente");
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

    // Obtener el usuario y su rol de la sesión
    const userRole = await getUserRoleFromRequest(request);
    const userId = await getUserIdFromRequest(request);

    console.log("DELETE /api/eventos/[id] - Auth Debug:", {
      userRole,
      userId,
      headers: Object.fromEntries(request.headers.entries()),
    });

    if (!userId) {
      console.log("DELETE /api/eventos/[id] - No se pudo obtener el ID del usuario");
      return NextResponse.json(
        { error: "No autorizado - ID de usuario no encontrado" },
        { status: 401 },
      );
    }

    if (userRole === "usuario") {
      console.log(
        "DELETE /api/eventos/[id] - Usuario con rol insuficiente:",
        userRole,
      );
      return NextResponse.json(
        { error: "No autorizado - Rol insuficiente" },
        { status: 401 },
      );
    }

    // Obtener el evento actual
    const { data: eventoActual, error: errorEvento } = await supabase
      .from("eventos")
      .select("organizador_id, status")
      .eq("id", id)
      .single();

    if (errorEvento) {
      console.error(
        "DELETE /api/eventos/[id] - Error al obtener el evento:",
        errorEvento,
      );
      return NextResponse.json(
        { error: "Error al obtener el evento" },
        { status: 500 },
      );
    }

    if (!eventoActual) {
      console.log("DELETE /api/eventos/[id] - Evento no encontrado:", id);
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    console.log("DELETE /api/eventos/[id] - Comparando permisos:", {
      eventoOrganizadorId: eventoActual.organizador_id,
      userId,
      userRole,
    });

    // Verificar permisos usando el ID del usuario
    if (eventoActual.organizador_id !== userId && userRole !== "admin") {
      console.log("DELETE /api/eventos/[id] - Permisos insuficientes");
      return NextResponse.json(
        { error: "No autorizado - No es el organizador ni admin" },
        { status: 403 },
      );
    }

    // Eliminar el evento
    const { error } = await supabase.from("eventos").delete().eq("id", id);

    if (error) {
      console.error("DELETE /api/eventos/[id] - Error al eliminar:", error);
      return NextResponse.json(
        { error: "Error al eliminar el evento" },
        { status: 500 },
      );
    }

    console.log("DELETE /api/eventos/[id] - Evento eliminado correctamente");
    return NextResponse.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error en DELETE /api/eventos/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
