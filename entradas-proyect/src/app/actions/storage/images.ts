"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { v4 as uuidv4 } from "uuid";

const BUCKET_NAME = "eventos";

/**
 * Sube una imagen al almacenamiento de Supabase
 */
export async function uploadEventImage(
  file: File,
  eventId: string,
): Promise<string> {
  const supabase = await getSupabaseServerClient();

  // Obtener extensión del archivo
  const fileExt = file.name.split(".").pop() || "";

  // Crear nombre único para el archivo
  const fileName = `${eventId}/${uuidv4()}.${fileExt}`;
  const filePath = `eventos/${fileName}`;

  // Convertir archivo a ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Subir archivo
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Error al subir imagen: ${error.message}`);
  }

  // Obtener URL pública
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Elimina una imagen del almacenamiento de Supabase
 */
export async function deleteEventImage(imageUrl: string): Promise<void> {
  const supabase = await getSupabaseServerClient();

  // Extraer el path del archivo de la URL
  const urlParts = imageUrl.split(`${BUCKET_NAME}/`);
  if (urlParts.length < 2) {
    throw new Error("URL de imagen no válida");
  }

  const filePath = urlParts[1];

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) {
    throw new Error(`Error al eliminar imagen: ${error.message}`);
  }
}

/**
 * Obtiene la URL pública de una imagen
 */
export async function getImageUrl(imagePath: string): Promise<string> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(imagePath);

  return publicUrl;
}
