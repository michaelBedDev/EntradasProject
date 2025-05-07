import { useEffect, useState } from "react";
import type { Session as SupabaseSession } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/supabase/browserClient";

/**
 * Devuelve la sesión actual de Supabase (o null) y
 * se mantiene sincronizada mientras el componente esté montado.
 */
export function useSupabaseSession() {
  const supabase = getBrowserSupabase();
  const [session, setSession] = useState<SupabaseSession | null>(null);

  useEffect(() => {
    let mounted = true;

    /* Sesión inicial */
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });

    /* Suscripción a cambios */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) setSession(newSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]); // ⚠️ supabase es estable, pero lo incluimos por convención

  return session;
}
