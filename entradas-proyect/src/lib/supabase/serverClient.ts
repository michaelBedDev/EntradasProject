// src/lib/supabase/serverClient.ts
"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase.types";
import { getSupabaseToken } from "./utils";

/**
 * Crea un cliente de Supabase para el servidor.
 * Este cliente se utiliza para realizar consultas a la base de datos de Supabase
 * y manejar la autenticación del usuario.
 * @description utiliza getSupabaseToken para obtener el JWT de Supabase de la sesión de NextAuth
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient>} Cliente de Supabase configurado.
 */
export async function getSupabaseServerClient() {
  const supabaseObject = await getSupabaseToken();
  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // sincronización de cookies Supabase ↔ Next.js
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
      // inyectamos siempre apikey y, si existe, el Bearer
      global: {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          ...(supabaseObject.token && {
            Authorization: `Bearer ${supabaseObject.token}`,
          }),
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  return supabase;
}
