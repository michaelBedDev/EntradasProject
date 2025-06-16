import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import { NextResponse, NextRequest } from "next/server";

/**
 * Endpoint para obtener eventos de un organizador específico.
 * @description Se utiliza la wallet en lugar del ID porque es un dato único que existe en el token de sesión y en JWT, es más fácil de manejar y obtener
 *
 * @param request - La solicitud entrante que contiene el wallet del organizador.
 * @param params - Parámetros de la ruta que incluyen el wallet del organizador.
 * @returns Una respuesta JSON con los eventos del organizador o un error.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wallet: string }> },
) {
  const { wallet } = await params;

  if (!wallet) {
    return NextResponse.json(
      { error: "Se requiere el la wallet del organizador a buscar" },
      { status: 400 },
    );
  }

  const supabase = await getSupabaseClientForAPIs(request);

  // Gracias a las RLS de supabase, si el usuario no es el organizador del evento este no se mostrará
  try {
    const { data, error } = await supabase
      .from("eventos")
      .select(
        `
      id,
      titulo,
      descripcion,
      fecha_inicio,
      fecha_fin,
      lugar,
      imagen_uri,
      status,
      categoria,
      organizador:usuarios!inner(wallet)
    `,
      )
      .eq("usuarios.wallet", wallet);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "No ha sido posible acceder a la query" },
        { status: 404 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          error:
            "No se encontraron eventos para este organizador, o no tienes los permisos suficientes para realizar la petición",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err instanceof Error ? err.stack : err);
    return NextResponse.json(
      { error: "Error al obtener el evento: " + (err as Error).message },
      { status: 500 },
    );
  }
}
