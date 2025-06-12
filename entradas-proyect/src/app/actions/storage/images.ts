"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

const BUCKET_NAME = "eventos";

/**
 * Sube una imagen de evento a Supabase Storage
 * @param file Archivo de imagen a subir
 * @param eventoId ID del evento al que pertenece la imagen
 * @returns URL pública de la imagen
 */
export async function uploadEventImage(file: File, eventoId: string) {
  console.log("Iniciando uploadEventImage en el servidor...");
  console.log("Evento ID:", eventoId);
  console.log("Archivo:", file.name, file.type, file.size);

  const supabase = await getSupabaseServerClient();
  console.log("Cliente Supabase obtenido");

  try {
    // Convertir el archivo a ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);
    console.log("Archivo convertido a buffer");

    // Generar un nombre único para el archivo
    const fileExt = file.name.split(".").pop();
    const fileName = `${eventoId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    console.log("Ruta del archivo:", filePath);

    // Subir el archivo al bucket
    console.log("Subiendo archivo al bucket...");
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Error de Supabase al subir imagen:", error);
      throw new Error("Error al subir la imagen: " + error.message);
    }

    console.log("Archivo subido exitosamente:", data);

    // Obtener la URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    console.log("URL pública generada:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error al subir imagen:", error);
    throw error;
  }
}

/**
 * Elimina una imagen de evento de Supabase Storage
 * @param imageUrl URL de la imagen a eliminar
 */
export async function deleteEventImage(imageUrl: string): Promise<void> {
  console.log("Iniciando deleteEventImage en el servidor...");
  console.log("URL de imagen:", imageUrl);

  const supabase = await getSupabaseServerClient();
  console.log("Cliente Supabase obtenido");

  try {
    // Extraer el path del archivo de la URL
    const urlParts = imageUrl.split("/");
    const filePath = urlParts[urlParts.length - 1];
    console.log("Path del archivo:", filePath);

    // Eliminar el archivo
    console.log("Eliminando archivo...");
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

    if (error) {
      console.error("Error de Supabase al eliminar imagen:", error);
      throw new Error("Error al eliminar la imagen: " + error.message);
    }

    console.log("Archivo eliminado exitosamente");
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    throw error;
  }
}

/**
 * Obtiene la URL pública de una imagen
 * @param imagePath Path de la imagen en el bucket
 * @returns URL pública de la imagen
 */
export async function getImageUrl(imagePath: string): Promise<string> {
  console.log("Iniciando getImageUrl en el servidor...");
  console.log("Path de imagen:", imagePath);

  const supabase = await getSupabaseServerClient();
  console.log("Cliente Supabase obtenido");

  try {
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(imagePath);

    console.log("URL pública generada:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error al obtener URL de imagen:", error);
    throw error;
  }
}
