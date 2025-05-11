"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function SupabaseSync() {
  const { data: session, status, update } = useSession();
  const isRefreshing = useRef(false);

  // 1️⃣ Sincronizar sesión con Supabase
  useEffect(() => {
    if (session?.supabaseAccessToken) {
      supabase.auth
        .setSession({
          access_token: session.supabaseAccessToken,
          refresh_token: session.supabaseAccessToken || "",
        })
        .catch((err) => console.error("AuthSync setSession:", err.message));
    } else {
      supabase.auth.signOut().catch(() => {});
    }
  }, [session?.supabaseAccessToken]);

  // 2️⃣ Programar refresco de token
  useEffect(() => {
    if (!session?.supabaseAccessTokenExp) return;

    const now = Math.floor(Date.now() / 1000);
    const secsLeft = session.supabaseAccessTokenExp - now;
    const refreshInMs = (secsLeft - 60) * 1000;

    if (refreshInMs <= 0) {
      triggerRefresh();
      return;
    }

    const timeout = setTimeout(triggerRefresh, refreshInMs);
    return () => clearTimeout(timeout);
  }, [session?.supabaseAccessTokenExp]);

  // 3️⃣ Manejar desautenticación
  useEffect(() => {
    if (status === "unauthenticated") {
      supabase.auth.signOut().catch(() => {});
    }
  }, [status]);

  async function triggerRefresh() {
    if (isRefreshing.current) return;
    isRefreshing.current = true;

    try {
      // Actualizar sesión de NextAuth
      await update();
    } catch (error) {
      console.error("Token refresh failed:", error);
      await supabase.auth.signOut();
      signOut({ redirect: false });
    } finally {
      isRefreshing.current = false;
    }
  }

  return null;
}
