import { NextRequest, NextResponse } from "next/server";

import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import { getUserRoleFromRequest } from "@/features/auth/lib/getUserRole";

/**
 * GET /api/organizadores
 * Endpoint público para obtener todos los usuarios que son organizadores
 * Requiere autenticación y rol de administrador
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClientForAPIs(request);

    const userRole = await getUserRoleFromRequest(request);
    if (userRole !== "administrador") {
      return NextResponse.json(
        {
          error:
            "No autorizado, no tienes los permisos de administrador para realizar esta consulta",
        },
        { status: 401 },
      );
    }

    // Obtener todos los usuarios que son organizadores
    const { data: organizadores, error } = await supabase
      .from("usuarios")
      .select(
        `
        id,
        nombre,
        wallet,
        email,
        created_at
      `,
      )
      .eq("rol", "organizador")
      .order("nombre", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Error al obtener los organizadores" },
        { status: 500 },
      );
    }

    return NextResponse.json(organizadores);
  } catch (error) {
    console.error("Error en GET /api/organizadores:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
