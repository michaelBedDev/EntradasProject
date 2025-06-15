import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import {
  getUserRoleFromRequest,
  getUserIdFromRequest,
} from "@/features/auth/lib/getUserRole";
import { tiposEntradaSchema } from "@/features/eventos/schemas/tipoEntrada";

/**
 * POST /api/eventos/[id]/tipos-entrada
 * Endpoint privado para crear tipos de entrada para un evento
 * Requiere autenticación y ser el organizador del evento
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await getSupabaseClientForAPIs(request);
    const id = (await context.params).id;
    const json = await request.json();

    // Verificar que el usuario esté autenticado y sea organizador
    const userRole = await getUserRoleFromRequest(request);
    const userId = await getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado - ID de usuario no encontrado" },
        { status: 401 },
      );
    }

    if (userRole === "usuario") {
      return NextResponse.json(
        { error: "No autorizado - Rol insuficiente" },
        { status: 401 },
      );
    }

    // Verificar que el usuario sea el organizador del evento
    const { data: evento, error: errorEvento } = await supabase
      .from("eventos")
      .select("organizador_id")
      .eq("id", id)
      .single();

    if (errorEvento) {
      console.error("Error al verificar el evento:", errorEvento);
      return NextResponse.json(
        { error: "Error al verificar el evento" },
        { status: 500 },
      );
    }

    if (!evento) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    if (evento.organizador_id !== userId) {
      return NextResponse.json(
        { error: "No autorizado - No es el organizador del evento" },
        { status: 403 },
      );
    }

    // Primero, eliminar los tipos de entrada existentes
    const { error: deleteError } = await supabase
      .from("tipos_entrada")
      .delete()
      .eq("evento_id", id);

    if (deleteError) {
      console.error("Error al eliminar tipos de entrada existentes:", deleteError);
      return NextResponse.json(
        { error: "Error al actualizar los tipos de entrada" },
        { status: 500 },
      );
    }

    // Validar y preparar los nuevos tipos de entrada
    const validationResult = tiposEntradaSchema.safeParse(json);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validationResult.error.format() },
        { status: 400 },
      );
    }

    // Crear los nuevos tipos de entrada
    const tiposEntrada = validationResult.data.map((tipo) => ({
      ...tipo,
      evento_id: id,
    }));

    const { data, error } = await supabase
      .from("tipos_entrada")
      .insert(tiposEntrada)
      .select();

    if (error) {
      console.error("Error al crear los tipos de entrada:", error);
      return NextResponse.json(
        { error: "Error al actualizar los tipos de entrada" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en POST /api/eventos/[id]/tipos-entrada:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/eventos/[id]/tipos-entrada
 * Endpoint público para obtener los tipos de entrada de un evento
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await getSupabaseClientForAPIs(request);
    const id = (await context.params).id;

    const { data, error } = await supabase
      .from("tipos_entrada")
      .select("*")
      .eq("evento_id", id)
      .order("precio", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Error al obtener los tipos de entrada" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET /api/eventos/[id]/tipos-entrada:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
