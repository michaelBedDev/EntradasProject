import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import { getUserRoleFromRequest } from "@/features/auth/lib/getUserRole";
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
    if (userRole === "usuario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Validar el cuerpo de la petición
    const validationResult = tiposEntradaSchema.safeParse(json);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validationResult.error.format() },
        { status: 400 },
      );
    }

    // Verificar que el usuario sea el organizador del evento
    const { data: evento, error: errorEvento } = await supabase
      .from("eventos")
      .select("organizador_id")
      .eq("id", id)
      .single();

    if (errorEvento) {
      return NextResponse.json(
        { error: "Error al verificar el evento" },
        { status: 500 },
      );
    }

    if (!evento) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    if (evento.organizador_id !== request.headers.get("x-user-id")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Crear los tipos de entrada
    const tiposEntrada = validationResult.data.map((tipo) => ({
      ...tipo,
      evento_id: id,
      cantidad_disponible: tipo.cantidad,
    }));

    const { data, error } = await supabase
      .from("tipos_entrada")
      .insert(tiposEntrada)
      .select();

    if (error) {
      return NextResponse.json(
        { error: "Error al crear los tipos de entrada" },
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
