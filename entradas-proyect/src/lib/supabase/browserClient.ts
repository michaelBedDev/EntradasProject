// src/lib/supabase/browserClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase.types";

/**
 * Cliente Supabase para el navegador
 * - Siempre envía el `apikey`
 * - Si recibe un JWT, lo pone en Authorization
 * - No usa el manejo de sesión interno
 */
export function getSupabaseClient(accessToken?: string): SupabaseClient<Database> {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const headers: Record<string, string> = { apikey: anonKey };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, anonKey, {
    global: { headers },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
