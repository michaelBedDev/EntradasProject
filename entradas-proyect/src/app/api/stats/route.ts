import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

interface EstadisticaTipo {
  tipo: string;
  vendidas: number;
}

interface EstadisticaEvento {
  evento_id: string;
  titulo: string;
  vendidas: number;
}

interface EstadisticaOrganizador {
  organizador_id: string;
  nombre: string;
  vendidas: number;
}

/**
 * GET /api/stats
 * Endpoint público para obtener estadísticas de entradas
 * Parámetros:
 * - evento_id: ID del evento (opcional)
 * - tipo: 'total' | 'por-evento' | 'por-organizador' | 'por-tipo'
 *
 * Ejemplos:
 * - /api/stats?tipo=total
 * - /api/stats?tipo=por-evento
 * - /api/stats?tipo=por-organizador
 * - /api/stats?tipo=por-tipo&evento_id=123
 *
 * No requiere autenticación
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get("tipo");
    const eventoId = searchParams.get("evento_id");

    if (!tipo) {
      return NextResponse.json(
        { error: "Se requiere el parámetro 'tipo'" },
        { status: 400 },
      );
    }

    // Si el tipo es 'por-tipo', se requiere el evento_id
    if (tipo === "por-tipo" && !eventoId) {
      return NextResponse.json(
        { error: "Se requiere el ID del evento para obtener estadísticas por tipo" },
        { status: 400 },
      );
    }

    switch (tipo) {
      case "total": {
        // Obtener total de entradas vendidas
        const { count, error } = await supabase
          .from("entradas")
          .select("*", { count: "exact", head: true })
          .eq("estado", "activa");

        if (error) {
          return NextResponse.json(
            { error: "Error al obtener el total de entradas" },
            { status: 500 },
          );
        }

        return NextResponse.json({ total: count });
      }

      case "por-evento": {
        // Obtener entradas vendidas por evento
        const { data, error } = await supabase
          .from("entradas")
          .select(
            `
            id,
            estado,
            tipo_entrada:tipo_entrada_id (
              id,
              evento:evento_id (
                id,
                titulo,
                status
              )
            )
          `,
          )
          .eq("estado", "activa")
          .eq("tipo_entrada.evento.status", "APROBADO");

        if (error) {
          console.error("Error en consulta por-evento:", error);
          return NextResponse.json(
            { error: "Error al obtener las estadísticas por evento" },
            { status: 500 },
          );
        }

        // Agrupar y contar entradas por evento
        const estadisticas = data.reduce((acc: EstadisticaEvento[], entrada) => {
          const evento = entrada.tipo_entrada?.evento;
          if (!evento) return acc;

          const eventoExistente = acc.find((e) => e.evento_id === evento.id);
          if (eventoExistente) {
            eventoExistente.vendidas++;
          } else {
            acc.push({
              evento_id: evento.id,
              titulo: evento.titulo,
              vendidas: 1,
            });
          }
          return acc;
        }, []);

        return NextResponse.json(estadisticas);
      }

      case "por-organizador": {
        // Obtener entradas vendidas por organizador
        const { data, error } = await supabase
          .from("entradas")
          .select(
            `
            tipo_entrada:tipo_entrada_id (
              evento:evento_id (
                organizador:organizador_id (
                  id,
                  nombre,
                  wallet
                )
              )
            )
          `,
          )
          .eq("estado", "activa");

        if (error) {
          console.error("Error en consulta por-organizador:", error);
          return NextResponse.json(
            { error: "Error al obtener las estadísticas por organizador" },
            { status: 500 },
          );
        }

        // Agrupar y contar entradas por organizador
        const estadisticas = data.reduce(
          (acc: EstadisticaOrganizador[], entrada) => {
            const organizador = entrada.tipo_entrada?.evento?.organizador;
            if (!organizador) return acc;

            const organizadorExistente = acc.find(
              (o) => o.organizador_id === organizador.id,
            );
            if (organizadorExistente) {
              organizadorExistente.vendidas++;
            } else {
              acc.push({
                organizador_id: organizador.id,
                nombre: organizador.nombre || "",
                vendidas: 1,
              });
            }
            return acc;
          },
          [],
        );

        return NextResponse.json(estadisticas);
      }

      case "por-tipo": {
        if (!eventoId) {
          return NextResponse.json(
            { error: "eventoId es requerido para estadísticas por tipo" },
            { status: 400 },
          );
        }

        // Obtener entradas vendidas por tipo para un evento específico
        const { data, error } = await supabase
          .from("entradas")
          .select(
            `
            tipo_entrada:tipo_entrada_id (
              nombre,
              evento:evento_id (
                id
              )
            )
          `,
          )
          .eq("estado", "activa")
          .eq("tipo_entrada.evento_id", eventoId);

        if (error) {
          console.error("Error en consulta por-tipo:", error);
          return NextResponse.json(
            { error: "Error al obtener las estadísticas por tipo" },
            { status: 500 },
          );
        }

        // Agrupar y contar entradas por tipo
        const estadisticas = data.reduce((acc: EstadisticaTipo[], entrada) => {
          const tipo = entrada.tipo_entrada?.nombre;
          if (!tipo) return acc;

          const tipoExistente = acc.find((t) => t.tipo === tipo);
          if (tipoExistente) {
            tipoExistente.vendidas++;
          } else {
            acc.push({
              tipo,
              vendidas: 1,
            });
          }
          return acc;
        }, []);

        return NextResponse.json(estadisticas);
      }

      default:
        return NextResponse.json(
          { error: "Tipo de estadística no válido" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Error en GET /api/stats:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
