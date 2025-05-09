"use client";

import { useEffect } from "react";
import {
  useSession,
  getSession as getNextSession,
  signOut as nextSignOut,
} from "next-auth/react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

/**
 * Función que se encarga de sincronizar la sesión de NextAuth con Supabase
 * y de refrescar el token de acceso de Supabase cuando sea necesario.
 * 1. Cada vez que cambie la sesión de NextAuth
 * 2. Programamos un refresco justo antes de que expire el JWT de Supabase y la sesión siga activa
 * 3. Si NextAuth nos desconecta, eliminamos el JWT de Supabase también
 */
export default function SupabaseSync() {
  const { data: session, status } = useSession();

  // 1️⃣ Cada vez que cambie la sesión de NextAuth, actualizamos Supabase
  useEffect(() => {
    if (session?.supabaseAccessToken) {
      supabase.auth
        .setSession({
          access_token: session.supabaseAccessToken,
          refresh_token: session.supabaseAccessToken,
        })
        .catch((err) => console.error("AuthSync setSession:", err.message));
    } else {
      // logout o no tenemos token aún
      supabase.auth.signOut().catch(() => {});
    }
  }, [session?.supabaseAccessToken]);

  // 2️⃣ Programamos un refresco justo antes de que expire el JWT de Supabase
  useEffect(() => {
    if (!session?.supabaseAccessTokenExp) return;

    const now = Math.floor(Date.now() / 1000);
    const secsLeft = session.supabaseAccessTokenExp - now;
    // refrescar 1 minuto antes
    const refreshInMs = (secsLeft - 60) * 1000;

    // **Si el token ya expiró (secsLeft ≤ 0) o está a punto de hacerlo (secsLeft < 60s)**
    if (refreshInMs <= 0) {
      triggerRefresh();
    }

    const timeout = setTimeout(triggerRefresh, refreshInMs);
    return () => clearTimeout(timeout);

    async function triggerRefresh() {
      try {
        // 1) Obtén la sesión de NextAuth (dispara jwt+session callbacks)
        const newSession = await getNextSession();
        // 2) Si tienes un token renovado, súbelo a Supabase
        if (newSession?.supabaseAccessToken) {
          await supabase.auth.setSession({
            access_token: newSession.supabaseAccessToken,
            refresh_token: newSession.supabaseAccessToken,
          });
        }
      } catch {
        // En error, desconecta todo
        await supabase.auth.signOut();
        nextSignOut({ redirect: false });
      }
    }
  }, [session?.supabaseAccessTokenExp]);

  // 3️⃣ Si NextAuth nos desconecta, limpiamos Supabase también
  useEffect(() => {
    if (status === "unauthenticated") {
      supabase.auth.signOut().catch(() => {});
    }
  }, [status]);

  return null;
}
