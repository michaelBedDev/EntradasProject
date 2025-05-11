// src/lib/supabase/serverClient.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase.types";

/**
 * Cliente Supabase para el backend (Server Actions / Server Components)
 * - Lee el JWT de la cookie 'sb-access-token'
 * - Añade siempre el header `apikey`
 * - Añade `Authorization: Bearer <token>` si existe
 * - Desactiva la lógica interna de supabase.auth
 */
export async function getSupabaseServerClient() {
  const token = (await cookies()).get("sb-access-token")?.value;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, anonKey, {
    global: {
      headers: {
        apikey: anonKey,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
