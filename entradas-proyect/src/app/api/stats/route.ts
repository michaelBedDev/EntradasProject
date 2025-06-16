import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";
import { getSupabaseClientForAPIs } from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

// Tipos para las consultas
type TipoEntrada = {
  id: string;
  precio: number;
};

type EntradaVendida = {
  created_at: string | null;
  tipo_entrada_id: string;
};

type EventoDB = {
  id: string;
  status: string | null;
};

type Evento = {
  id: string;
  status: string;
};

export async function GET(request: NextRequest) {
  console.log("Iniciando endpoint de estadísticas...");

  try {
    const session = await getServerSession(authOptions);
    console.log("Sesión obtenida:", session ? "Sí" : "No");

    if (!session?.address) {
      console.log("No hay sesión o dirección de wallet");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabase = await getSupabaseClientForAPIs(request);
    console.log("Cliente Supabase inicializado");

    // Obtener el ID del organizador
    const { data: organizador, error: errorOrganizador } = await supabase
      .from("usuarios")
      .select("id")
      .eq("wallet", session.address)
      .single();

    if (errorOrganizador || !organizador) {
      console.error("Error al obtener organizador:", errorOrganizador);
      return NextResponse.json(
        { error: "Error al obtener datos del organizador" },
        { status: 500 },
      );
    }

    console.log("Organizador encontrado:", organizador.id);

    // Obtener eventos del organizador
    const { data: eventosDB, error: errorEventos } = await supabase
      .from("eventos")
      .select("id, status")
      .eq("organizador_id", organizador.id);

    if (errorEventos) {
      console.error("Error al obtener eventos:", errorEventos);
      return NextResponse.json(
        { error: "Error al obtener eventos" },
        { status: 500 },
      );
    }

    // Convertir eventos a tipo Evento (manejando nulos)
    const eventos: Evento[] =
      eventosDB?.map((e: EventoDB) => ({
        id: e.id,
        status: e.status || "PENDIENTE",
      })) || [];

    console.log("Eventos encontrados:", eventos.length);

    // Obtener IDs de eventos
    const eventoIds = eventos.map((e) => e.id);

    // Obtener tipos de entrada con precios
    const { data: tiposEntrada, error: errorTipos } = await supabase
      .from("tipos_entrada")
      .select("id, precio")
      .in("evento_id", eventoIds);

    if (errorTipos) {
      console.error("Error al obtener tipos de entrada:", errorTipos);
      return NextResponse.json(
        { error: "Error al obtener tipos de entrada" },
        { status: 500 },
      );
    }

    // Crear mapa de precios por tipo de entrada
    const preciosPorTipo = new Map(
      tiposEntrada?.map((t: TipoEntrada) => [t.id, t.precio]) || [],
    );

    // Obtener todas las entradas vendidas
    const { data: entradasVendidas, error: errorEntradas } = await supabase
      .from("entradas")
      .select("created_at, tipo_entrada_id")
      .in("tipo_entrada_id", tiposEntrada?.map((t: TipoEntrada) => t.id) || [])
      .order("created_at", { ascending: true });

    if (errorEntradas) {
      console.error("Error al obtener entradas:", errorEntradas);
      return NextResponse.json(
        { error: "Error al obtener entradas" },
        { status: 500 },
      );
    }

    console.log("Total de entradas encontradas:", entradasVendidas?.length);

    // Calcular estadísticas
    const totalEventos = eventos.length;
    const eventosPorEstado = eventos.reduce(
      (acc: Record<string, number>, evento: Evento) => {
        acc[evento.status] = (acc[evento.status] || 0) + 1;
        return acc;
      },
      {},
    );

    // Calcular totales
    const totalEntradasVendidas = entradasVendidas?.length ?? 0;
    const ingresosTotales =
      entradasVendidas?.reduce((total: number, entrada: EntradaVendida) => {
        if (!entrada.created_at) return total;
        const precio = preciosPorTipo.get(entrada.tipo_entrada_id) ?? 0;
        return total + precio;
      }, 0) ?? 0;

    // Generar array para los últimos 7 días
    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 6); // Incluir hoy y 6 días atrás

    const tendenciaVentas = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(sieteDiasAtras);
      fecha.setDate(fecha.getDate() + i);
      const fechaStr = fecha.toISOString().split("T")[0];

      // Filtrar entradas del día específico
      const entradasDelDia =
        entradasVendidas?.filter((entrada: EntradaVendida) => {
          if (!entrada.created_at) return false;
          const fechaEntrada = new Date(entrada.created_at);
          return fechaEntrada.toISOString().split("T")[0] === fechaStr;
        }) || [];

      // Calcular ventas e ingresos del día
      const entradasVendidasDia = entradasDelDia.length;
      const ingresosDia = entradasDelDia.reduce(
        (total: number, entrada: EntradaVendida) => {
          const precio = preciosPorTipo.get(entrada.tipo_entrada_id) ?? 0;
          return total + precio;
        },
        0,
      );

      return {
        fecha: fechaStr,
        entradas_vendidas: entradasVendidasDia,
        ingresos_totales: ingresosDia,
      };
    });

    console.log("Tendencia de ventas generada:", tendenciaVentas);

    // Calcular eventos aprobados y pendientes
    const eventosAprobados = eventos.filter((e) => e.status === "APROBADO").length;
    const eventosPendientes = eventos.filter((e) => e.status === "PENDIENTE").length;

    return NextResponse.json({
      totalEventos,
      eventosPorEstado,
      totalEntradasVendidas,
      ingresosTotales,
      tendenciaVentas,
      eventosAprobados,
      eventosPendientes,
    });
  } catch (error) {
    console.error("Error en el endpoint de estadísticas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
