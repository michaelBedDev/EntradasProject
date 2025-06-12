"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { CreateEventoInput } from "@/lib/schemas/evento.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";

export async function createEvent(data: CreateEventoInput) {
  console.log("Iniciando createEvent en el servidor...");
  console.log("Datos recibidos:", data);

  const session = await getServerSession(authOptions);
  console.log("Sesión del servidor:", session);

  if (!session?.address) {
    console.error("No hay sesión de usuario activa en el servidor");
    throw new Error("No hay sesión de usuario activa");
  }

  const supabase = await getSupabaseServerClient();
  console.log("Cliente Supabase obtenido");

  try {
    // Primero obtener el ID del organizador usando su wallet address
    const { data: organizador, error: errorOrganizador } = await supabase
      .from("usuarios")
      .select("id")
      .eq("wallet", session.address)
      .single();

    if (errorOrganizador) {
      console.error("Error al obtener el organizador:", errorOrganizador);
      throw new Error(
        "Error al obtener los datos del organizador: " + errorOrganizador.message,
      );
    }

    if (!organizador?.id) {
      console.error("No se encontró el organizador");
      throw new Error("No se encontró el organizador");
    }

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
      imagen_uri: null, // Inicialmente null, se actualizará después si hay imagen
    };

    console.log("Datos del evento a insertar:", eventoData);

    const { data: evento, error } = await supabase
      .from("eventos")
      .insert(eventoData)
      .select()
      .single();

    if (error) {
      console.error("Error de Supabase al crear evento:", error);
      throw new Error("Error al crear el evento: " + error.message);
    }

    console.log("Evento creado exitosamente:", evento);
    return evento;
  } catch (error) {
    console.error("Error al crear evento:", error);
    throw error;
  }
}

export async function uploadEventImage(eventoId: string, file: File) {
  console.log("Iniciando uploadEventImage en el servidor...");
  console.log("Evento ID:", eventoId);

  const session = await getServerSession(authOptions);
  if (!session?.address) {
    console.error("No hay sesión de usuario activa en el servidor");
    throw new Error("No hay sesión de usuario activa");
  }

  const supabase = await getSupabaseServerClient();
  console.log("Cliente Supabase obtenido");

  try {
    // Primero obtener el ID del organizador usando su wallet address
    const { data: organizador, error: errorOrganizador } = await supabase
      .from("usuarios")
      .select("id")
      .eq("wallet", session.address)
      .single();

    if (errorOrganizador) {
      console.error("Error al obtener el organizador:", errorOrganizador);
      throw new Error(
        "Error al obtener los datos del organizador: " + errorOrganizador.message,
      );
    }

    if (!organizador?.id) {
      console.error("No se encontró el organizador");
      throw new Error("No se encontró el organizador");
    }

    // Verificar que el evento pertenece al organizador
    const { data: evento, error: errorEvento } = await supabase
      .from("eventos")
      .select("id")
      .eq("id", eventoId)
      .eq("organizador_id", organizador.id)
      .single();

    if (errorEvento || !evento) {
      console.error("Error al verificar el evento:", errorEvento);
      throw new Error(
        "No se encontró el evento o no tienes permisos para modificarlo",
      );
    }

    // Generar un nombre único para el archivo
    const fileExt = file.name.split(".").pop();
    const fileName = `${eventoId}-${Date.now()}.${fileExt}`;
    const filePath = `eventos/${fileName}`;

    // Subir el archivo al bucket
    const { error: uploadError } = await supabase.storage
      .from("eventos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error al subir la imagen:", uploadError);
      throw new Error("Error al subir la imagen: " + uploadError.message);
    }

    // Obtener la URL pública de la imagen
    const {
      data: { publicUrl },
    } = supabase.storage.from("eventos").getPublicUrl(filePath);

    // Actualizar el evento con la URL de la imagen
    const { data: updatedEvento, error: updateError } = await supabase
      .from("eventos")
      .update({ imagen_uri: publicUrl })
      .eq("id", eventoId)
      .eq("organizador_id", organizador.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error al actualizar la imagen del evento:", updateError);
      // Intentar eliminar la imagen subida si falla la actualización
      await supabase.storage.from("eventos").remove([filePath]);
      throw new Error(
        "Error al actualizar la imagen del evento: " + updateError.message,
      );
    }

    console.log("Imagen subida y evento actualizado exitosamente:", updatedEvento);
    return updatedEvento;
  } catch (error) {
    console.error("Error al subir la imagen del evento:", error);
    throw error;
  }
}
