// utils/supabaseAdmin.ts
import { Database } from "@/types/supabase.types";
import { createClient } from "@supabase/supabase-js";

/**
 * Singleton para el cliente de Supabase en el servidor con token de administrador.
 * Este cliente se usa para operaciones administrativas,
 * como la creación de usuarios o la gestión de datos sin restricciones de seguridad.
 */

export function getSupabaseAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("No hay clave de servicio de Supabase");
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
