// src/lib/supabase/serverClient.ts
"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase.types";
import { getSupabaseToken, getSupabaseTokenFromRequest } from "./utils";
import { NextRequest } from "next/server";

/**
 * Crea un cliente de Supabase para el servidor.
 * Este cliente se utiliza para realizar consultas a la base de datos de Supabase
 * y manejar la autenticación del usuario.
 * @param {NextApiRequest} [req] - Solicitud de Next.js, necesaria si se llama desde una API.
 * @param {NextApiResponse} [res] - Respuesta de Next.js, necesaria si se llama desde una API.
 * @description utiliza getSupabaseToken para obtener el JWT de Supabase de la sesión de NextAuth
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient>} Cliente de Supabase configurado.
 */
export async function getSupabaseServerClient() {
  const supabaseObject = await getSupabaseToken();
  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
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
          apikey: process.env.SUPABASE_ANON_KEY!,
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
/**
 * Crea un cliente de Supabase para las APIs.
 * @description Este cliente se utiliza para realizar consultas a la base de datos de Supabase
 * y manejar la autenticación del usuario a través de las API. De otra forma, no se puede acceder a supabase desde las APIs creadas por en app/api,
 * porque getSupabaseToken utiliza getServerSession, y este una API de Nextjs no está disponible, por lo tanto, no obtiene ninguna sesión.
 * @param {NextRequest} request - Solicitud de Next.js, necesaria para obtener el token de Supabase.
 * @description utiliza getSupabaseTokenFromRequest para obtener el JWT de Supabase de la solicitud
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient>} Cliente de Supabase configurado para las APIs.
 *
 */

export async function getSupabaseClientForAPIs(request: NextRequest) {
  const supabaseObject = await getSupabaseTokenFromRequest(request);
  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          ),
      },
      global: {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY!,
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
