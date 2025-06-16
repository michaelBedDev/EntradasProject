"use server";

import { authOptions } from "@/features/auth/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getServerSession } from "next-auth";

interface EntradaInput {
  tipo_entrada_id: string;
  metadata_uri?: string;
}

export async function crearEntradas(entradas: EntradaInput[]) {
  try {
    // Verificar autenticación en server-side
    const session = await getServerSession(authOptions);
    if (!session?.user || !session?.address) {
      return {
        success: false,
        error: "No autorizado. Debes estar conectado con tu wallet.",
      };
    }

    // Validaciones adicionales
    if (entradas.length > 10) {
      // Límite de entradas por compra
      throw new Error("Máximo 10 entradas por compra");
    }

    // Generar tokens únicos
    const entradasConTokens: Entrada[] = entradas.map((entrada) => ({
      ...entrada,
      id: crypto.randomUUID(),
      token: crypto.randomUUID(),
      qr_code: crypto.randomUUID(),
      qr_image_uri: null,
      wallet: session.address!, //Aseguramos que existe el address
      estado: "ACTIVA",
      metadata_uri: "https://example.com/metadata1.json",
      created_at: new Date().toISOString(),
      tx_hash: null,
    }));

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("entradas")
      .insert(entradasConTokens)
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error en server action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
