"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";
import { EventoStatus } from "@/features/eventos/services/types";
import { EventoPublico } from "@/types/global";
import { RolUsuario } from "@/types/enums";

export async function getSolicitudesEventos(): Promise<EventoPublico[]> {
  const session = await getServerSession(authOptions);

  if (!session?.address) {
    throw new Error("No hay sesión de usuario activa");
  }

  const supabase = await getSupabaseServerClient();

  console.log("Buscando eventos pendientes...");
  const { data: eventos, error } = await supabase
    .from("eventos")
    .select(
      `
      id,
      titulo,
      descripcion,
      lugar,
      fecha_inicio,
      fecha_fin,
      categoria,
      imagen_uri,
      status,
      organizador:usuarios!eventos_organizador_id_fkey (
        nombre,
        wallet
      )
    `,
    )
    .eq("status", EventoStatus.PENDIENTE);

  if (error) {
    console.error("Error al obtener solicitudes:", error);
    throw new Error("Error al obtener las solicitudes");
  }

  console.log("Eventos encontrados:", eventos);

  const eventosTransformados = eventos.map((evento) => {
    console.log("Transformando evento:", evento);
    const eventoTransformado = {
      id: evento.id,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      lugar: evento.lugar,
      imagen_uri: evento.imagen_uri,
      fecha_inicio: evento.fecha_inicio,
      fecha_fin: evento.fecha_fin,
      categoria: evento.categoria || "Otros",
      status: evento.status,
      organizador: {
        nombre: evento.organizador?.nombre || null,
        wallet: evento.organizador?.wallet || "",
      },
    };
    console.log("Evento transformado:", eventoTransformado);
    return eventoTransformado;
  });

  console.log("Eventos transformados finales:", eventosTransformados);
  return eventosTransformados;
}

export async function actualizarEstadoEvento(
  eventoId: string,
  nuevoEstado: EventoStatus,
): Promise<EventoPublico> {
  const session = await getServerSession(authOptions);

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

  if (errorUsuario || !usuario || usuario.rol !== RolUsuario.ADMINISTRADOR) {
    throw new Error("No autorizado - Se requiere rol de administrador");
  }

  // Validar el estado
  if (!Object.values(EventoStatus).includes(nuevoEstado)) {
    throw new Error("Estado no válido");
  }

  // Obtener el evento actual
  const { data: eventoActual, error: errorEvento } = await supabase
    .from("eventos")
    .select("status")
    .eq("id", eventoId)
    .single();

  if (errorEvento) {
    throw new Error("Error al obtener el evento");
  }

  if (!eventoActual) {
    throw new Error("Evento no encontrado");
  }

  // Actualizar el estado del evento
  const { data: evento, error } = await supabase
    .from("eventos")
    .update({
      status: nuevoEstado,
    })
    .eq("id", eventoId)
    .select(
      `
      id,
      titulo,
      descripcion,
      lugar,
      fecha_inicio,
      fecha_fin,
      categoria,
      imagen_uri,
      status,
      organizador:usuarios!eventos_organizador_id_fkey (
        nombre,
        wallet
      )
    `,
    )
    .single();

  if (error) {
    throw new Error("Error al actualizar el estado del evento");
  }

  return {
    id: evento.id,
    titulo: evento.titulo,
    descripcion: evento.descripcion,
    lugar: evento.lugar,
    imagen_uri: evento.imagen_uri,
    fecha_inicio: evento.fecha_inicio,
    fecha_fin: evento.fecha_fin,
    categoria: evento.categoria || "Otros",
    status: evento.status,
    organizador: {
      nombre: evento.organizador?.nombre || null,
      wallet: evento.organizador?.wallet || "",
    },
  };
}
