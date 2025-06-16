import { NextResponse } from "next/server";
import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";
import { Database } from "@/types/supabase.types";
import { NextRequest } from "next/server";

type Evento = Database["public"]["Tables"]["eventos"]["Row"];
type TipoEntrada = Database["public"]["Tables"]["tipos_entrada"]["Row"];
type Entrada = Database["public"]["Tables"]["entradas"]["Row"];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.address) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const supabase = await getSupabaseClientForAPIs(request);

    // Obtener el ID del organizador usando su wallet address
    const { data: organizador, error: errorOrganizador } = await supabase
      .from("usuarios")
      .select("id")
      .eq("wallet", session.address)
      .single();

    if (errorOrganizador || !organizador) {
      console.error("Error al obtener el organizador:", errorOrganizador);
      return new NextResponse("Error al obtener datos del organizador", {
        status: 500,
      });
    }

    // Obtener todos los eventos del organizador con sus tipos de entrada y entradas vendidas
    const { data: eventos, error: eventosError } = await supabase
      .from("eventos")
      .select(
        `
        *,
        tipos_entrada (
          *,
          entradas (
            *
          )
        )
      `,
      )
      .eq("organizador_id", organizador.id);

    if (eventosError) {
      console.error("Error al obtener eventos:", eventosError);
      return new NextResponse("Error al obtener eventos", { status: 500 });
    }

    // Procesar los datos para obtener ventas por tipo de entrada
    const ventasPorEvento = eventos.map(
      (
        evento: Evento & {
          tipos_entrada: (TipoEntrada & { entradas: Entrada[] })[];
        },
      ) => {
        const ventasPorTipo = evento.tipos_entrada.map((tipo) => ({
          nombre: tipo.nombre,
          ventas: tipo.entradas.filter((e) => e.estado === "ACTIVA").length,
          evento: evento.titulo,
        }));

        return {
          evento: evento.titulo,
          ventas: ventasPorTipo,
        };
      },
    );

    return NextResponse.json(ventasPorEvento);
  } catch (error) {
    console.error("Error en el endpoint de ventas por entrada:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
