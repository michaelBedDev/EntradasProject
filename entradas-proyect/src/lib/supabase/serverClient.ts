// src/lib/supabase/serverClient.ts
"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase.types";
import { getSupabaseToken } from "./utils";

export async function getSupabaseServerClient() {
  // 1) Obtenemos el token de Supabase (posiblemente regenerado)
  const supabaseObject = await getSupabaseToken();

  // 2) Leemos las cookies para el cliente de Supabase
  const cookieStore = await cookies();

  // 3) Creamos el cliente de Supabase con @supabase/ssr
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
