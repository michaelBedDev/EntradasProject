"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";
import { EventoPublicoWTipos } from "@/types/global";
import { EventoEstadisticas } from "@/features/eventos/services/types";
import { EventoStatus } from "@/features/eventos/services/types";
import { RolUsuario } from "@/types/enums";
import { CreateEventoInput } from "@/lib/schemas/evento.schema";
import { getOrganizadorFromSession } from "../storage/eventImages";

export async function getEventosOrganizador(): Promise<{
  eventos: EventoPublicoWTipos[];
  estadisticas: EventoEstadisticas;
}> {
  const session = await getServerSession(authOptions);
  if (!session?.address) {
    throw new Error("No hay sesión de usuario activa");
  }

  if (!session?.address) {
    throw new Error("No hay sesión de usuario activa");
  }

  const supabase = await getSupabaseServerClient();

  // Verificar que el usuario sea administrador
  const { data: usuario, error: errorUsuario } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("wallet", session.address)
    .single();

  if (errorUsuario || !usuario || usuario.rol !== RolUsuario.ORGANIZADOR) {
    throw new Error("No autorizado - Se requiere rol de administrador");
  }

  // Obtener eventos
  const { data: eventos, error: eventosError } = await supabase
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
    .eq("organizador.wallet", session.address.toLowerCase());

  if (eventosError) {
    console.error("Error fetching eventos:", eventosError);
    throw new Error("Error al obtener eventos");
  }

  // Transformar eventos
  const eventosTransformados = eventos.map((evento) => ({
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

  // Calcular estadísticas
  const estadisticas: EventoEstadisticas = {
    totalEventos: eventos.length,
    eventosAprobados: eventos.filter((e) => e.status === EventoStatus.APROBADO)
      .length,
    eventosPendientes: eventos.filter((e) => e.status === EventoStatus.PENDIENTE)
      .length,
    eventosProximos: eventos.filter(
      (e) =>
        new Date(e.fecha_inicio) > new Date() && e.status === EventoStatus.APROBADO,
    ).length,
  };

  return {
    eventos: eventosTransformados,
    estadisticas,
  };
}

export async function createEvent(data: CreateEventoInput) {
  const { organizador, supabase } = await getOrganizadorFromSession();

  try {
    // Convertir las fechas a strings ISO y asegurar que fecha_fin existe
    const eventoData = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha_inicio:
        data.fecha_inicio instanceof Date
          ? data.fecha_inicio.toISOString()
          : data.fecha_inicio,
      fecha_fin:
        data.fecha_fin instanceof Date
          ? data.fecha_fin.toISOString()
          : data.fecha_inicio.toISOString(),
      lugar: data.lugar,
      categoria: data.categoria,
      status: "PENDIENTE" as const,
      organizador_id: organizador.id,
      imagen_uri: null,
    };

    const { data: evento, error } = await supabase
      .from("eventos")
      .insert(eventoData)
      .select()
      .single();

    if (error) {
      throw new Error("Error al crear el evento: " + error.message);
    }

    return evento;
  } catch (error) {
    console.error("Error al crear evento:", error);
    throw error;
  }
}
