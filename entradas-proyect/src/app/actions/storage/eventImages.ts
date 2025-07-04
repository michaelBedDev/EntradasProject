"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";

// Función auxiliar para verificar sesión y obtener organizador
export async function getOrganizadorFromSession() {
  const session = await getServerSession(authOptions);

  if (!session?.address) {
    throw new Error("No hay sesión de usuario activa");
  }

  const supabase = await getSupabaseServerClient();

  const { data: organizador, error: errorOrganizador } = await supabase
    .from("usuarios")
    .select("id")
    .eq("wallet", session.address)
    .single();

  if (errorOrganizador || !organizador?.id) {
    throw new Error("Error al obtener los datos del organizador");
  }

  return { session, organizador, supabase };
}

export async function uploadEventImage(eventoId: string, file: File) {
  const { organizador, supabase } = await getOrganizadorFromSession();

  try {
    // Verificar que el evento pertenece al organizador
    const { data: evento, error: errorEvento } = await supabase
      .from("eventos")
      .select("id")
      .eq("id", eventoId)
      .eq("organizador_id", organizador.id)
      .single();

    if (errorEvento || !evento) {
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
      // Intentar eliminar la imagen subida si falla la actualización
      await supabase.storage.from("eventos").remove([filePath]);
      throw new Error(
        "Error al actualizar la imagen del evento: " + updateError.message,
      );
    }

    return updatedEvento;
  } catch (error) {
    console.error("Error al subir la imagen del evento:", error);
    throw error;
  }
}
