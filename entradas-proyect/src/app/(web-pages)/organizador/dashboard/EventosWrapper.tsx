"use server";

import EventosClient from "./EventosClient";
import { EventoEstadisticas } from "@/features/eventos/services/types";
import { EventoPublicoWTipos } from "@/types/global";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getSessionData } from "@/features/auth/lib/getSessionData";

async function getEventosOrganizador(
  wallet: string,
): Promise<EventoPublicoWTipos[]> {
  const supabase = await getSupabaseServerClient();

  const { data: eventos, error } = await supabase
    .from("eventos")
    .select(
      `
      *,
      organizador:usuarios!eventos_organizador_id_fkey (
        nombre,
        wallet
      ),
      tipos_entrada (
        id,
        nombre,
        descripcion,
        precio,
        zona,
        cantidad_disponible
      )
    `,
    )
    .eq("organizador.wallet", wallet.toLowerCase());

  if (error) {
    console.error("Error fetching eventos:", error);
    return [];
  }

  // Transformar los datos al formato esperado
  return eventos.map((evento) => ({
    id: evento.id,
    titulo: evento.titulo,
    descripcion: evento.descripcion,
    lugar: evento.lugar,
    imagen_uri: evento.imagen_uri,
    fecha_inicio: evento.fecha_inicio,
    fecha_fin: evento.fecha_fin,
    categoria: evento.categoria || "Sin categoría",
    status: evento.status,
    organizador: {
      nombre: evento.organizador?.nombre,
      wallet: evento.organizador?.wallet,
    },
    tipos_entrada: evento.tipos_entrada.map((tipo) => ({
      id: tipo.id,
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
      precio: tipo.precio,
      zona: tipo.zona,
      cantidad_disponible: tipo.cantidad_disponible,
      evento: {
        id: evento.id,
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        lugar: evento.lugar,
        imagen_uri: evento.imagen_uri,
        fecha_inicio: evento.fecha_inicio,
        fecha_fin: evento.fecha_fin,
        categoria: evento.categoria || "Sin categoría",
        status: evento.status,
        organizador: {
          nombre: evento.organizador?.nombre,
          wallet: evento.organizador?.wallet,
        },
      },
    })),
  }));
}

async function getEstadisticasEventos(wallet: string): Promise<EventoEstadisticas> {
  const supabase = await getSupabaseServerClient();

  const { data: eventos, error } = await supabase
    .from("eventos")
    .select(
      `
      status,
      fecha_inicio,
      organizador:usuarios!eventos_organizador_id_fkey (
        wallet
      )
    `,
    )
    .eq("organizador.wallet", wallet.toLowerCase());

  if (error) {
    console.error("Error fetching estadísticas:", error);
    return {
      totalEventos: 0,
      eventosAprobados: 0,
      eventosPendientes: 0,
      eventosProximos: 0,
    };
  }

  const estadisticas: EventoEstadisticas = {
    totalEventos: eventos.length,
    eventosAprobados: eventos.filter((e) => e.status === "APROBADO").length,
    eventosPendientes: eventos.filter((e) => e.status === "PENDIENTE").length,
    eventosProximos: eventos.filter(
      (e) => new Date(e.fecha_inicio) > new Date() && e.status === "APROBADO",
    ).length,
  };

  return estadisticas;
}

export default async function EventosWrapper() {
  const session = await getSessionData();

  const wallet = session?.address;
  if (!wallet) {
    return null;
  }

  const [eventos, estadisticas] = await Promise.all([
    getEventosOrganizador(wallet),
    getEstadisticasEventos(wallet),
  ]);

  return <EventosClient eventos={eventos} estadisticas={estadisticas} />;
}
