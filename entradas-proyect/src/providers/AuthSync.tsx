"use client";

import { useEffect, useState } from "react";
import { useSession, signOut as nextSignOut } from "next-auth/react";
import { getBrowserSupabase } from "@/lib/supabase/browserClient";

const supabase = getBrowserSupabase();

async function setAccessToken(access_token: string) {
  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token: access_token,
  });
  if (error) console.error("[AuthSync] setSession error:", error.message);
}

export default function AuthSync() {
  const { data: next, status } = useSession();
  const [sbExp, setSbExp] = useState<number | null>(null);

  /* ① Inserta token en cuanto aparezca en Next-Auth */
  useEffect(() => {
    if (!next?.supabaseToken) return;

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        /* ▼ el “!” indica al compilador que el valor NO es undefined */
        setAccessToken(next.supabaseToken!);
      }
    });
  }, [next?.supabaseToken]);

  /* ② Vigila expiración de Supabase */
  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_e, ses) =>
      setSbExp(ses?.expires_at ?? null),
    ).data.subscription;
    return () => sub.unsubscribe();
  }, []);

  /* ③ Refresh 5 min antes de expirar */
  useEffect(() => {
    const id = setInterval(async () => {
      if (!sbExp || !next?.supabaseToken) return;

      const now = Date.now() / 1000;
      if (sbExp - now < 300) {
        try {
          const res = await fetch("/api/auth/refresh");
          if (res.ok) {
            const { access_token } = await res.json();
            await setAccessToken(access_token);
          } else {
            await supabase.auth.signOut();
            await nextSignOut({ redirect: false });
          }
        } catch (err) {
          console.error("[AuthSync] refresh error:", err);
        }
      }
    }, 60_000);

    return () => clearInterval(id);
  }, [sbExp, next?.supabaseToken]);

  /* ④ Limpia Supabase si Next-Auth se desconecta */
  useEffect(() => {
    if (status === "unauthenticated") supabase.auth.signOut();
  }, [status]);

  return null;
}
