"use client";

import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { createBrowserClient } from "@supabase/ssr";
import type {
  AuthChangeEvent,
  Session as SupabaseSession,
} from "@supabase/supabase-js";

const supabase = createBrowserClient();

export default function AuthSync() {
  useEffect(() => {
    const syncSupabase = async () => {
      const { data: supabaseSession } = await supabase.auth.getSession();

      if (!supabaseSession.session) {
        const nextAuthSession = await getSession();

        if (nextAuthSession?.supabaseToken) {
          await supabase.auth.setSession({
            access_token: nextAuthSession.supabaseToken,
            token_type: "bearer",
            expires_in: 3600,
          });
        }
      }
    };

    // Hacer sync inicial al montar
    syncSupabase();

    // Verificar cada 5 minutos si la sesión sigue activa
    const intervalId = setInterval(syncSupabase, 5 * 60 * 1000);

    // Detectar eventos de cierre de sesión
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: SupabaseSession | null) => {
        if (!session && event === "SIGNED_OUT") {
          const nextAuthSession = await getSession();
          if (nextAuthSession?.supabaseToken) {
            await supabase.auth.setSession({
              access_token: nextAuthSession.supabaseToken,
              token_type: "bearer",
              expires_in: 3600,
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
