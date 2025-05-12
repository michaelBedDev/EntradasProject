// src/lib/supabase/getServerSupabaseClient.ts
"use server";

import { cookies, headers } from "next/headers";
import { getToken, type GetTokenParams } from "next-auth/jwt";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase.types";

export async function getSupabaseServerClient() {
  // 1) Leemos las cookies con next/headers
  const cookieStore = await cookies();

  // 2) Await para destructurar correctamente las cabeceras
  const headerList = await headers(); // ReadonlyHeaders
  const headersObj = Object.fromEntries(headerList.entries());

  // 3) Construimos un objeto plano de cookies para getToken()
  const cookieObj: Partial<Record<string, string>> = Object.fromEntries(
    cookieStore.getAll().map((c) => [c.name, c.value]),
  );

  // 4) Preparamos un `req` que satisfaga a NextAuth (solo importa headers y cookies)
  const reqForToken = {
    headers: headersObj,
    cookies: cookieObj,
  } as GetTokenParams["req"];

  // 5) Extraemos nuestro JWT interno de NextAuth
  const token = await getToken({
    req: reqForToken,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const supabaseObject = {
    token: token?.supabase?.token,
    exp: token?.supabase?.exp,
  };

  // 6) Creamos el cliente de Supabase con @supabase/ssr
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
