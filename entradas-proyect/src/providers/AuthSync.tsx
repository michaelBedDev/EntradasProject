"use client";

import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { createBrowserClient } from "@supabase/ssr";
import type {
  AuthChangeEvent,
  Session as SupabaseSession,
} from "@supabase/supabase-js";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AuthSync() {
  useEffect(() => {
    const syncSupabase = async () => {
      const { data: supabaseSession } = await supabase.auth.getSession();

      if (!supabaseSession.session) {
        const nextAuthSession = await getSession();

        if (nextAuthSession?.supabaseToken) {
          await supabase.auth.setSession({
            access_token: nextAuthSession.supabaseToken,
            refresh_token: "", // Si no usas refresh tokens personalizados, deja esto vacío
          });
        }
      }
    };

    // Hacer sync inicial al montar
    syncSupabase();

    // Verificar cada 5 minutos si la sesión sigue activa
    const intervalId = setInterval(syncSupabase, 5 * 60 * 1000);

    // Detectar eventos de cierre de sesión en Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: SupabaseSession | null) => {
        if (!session && event === "SIGNED_OUT") {
          const nextAuthSession = await getSession();
          if (nextAuthSession?.supabaseToken) {
            await supabase.auth.setSession({
              access_token: nextAuthSession.supabaseToken,
              refresh_token: "",
            });
          }
        }
      },
    );

    return () => {
      clearInterval(intervalId);
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
