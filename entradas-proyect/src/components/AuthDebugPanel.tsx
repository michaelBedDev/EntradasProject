"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { createBrowserClient } from "@supabase/ssr";
import type { Session as SupabaseSession } from "@supabase/supabase-js";

const supabase = createBrowserClient();

export default function AuthDebugPanel() {
  const { data: nextAuthSession, status } = useSession();
  const [supabaseSession, setSupabaseSession] = useState<SupabaseSession | null>(
    null,
  );

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSupabaseSession(data.session);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSupabaseSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isNextAuthAuthenticated = !!nextAuthSession?.address;
  const isSupabaseAuthenticated = !!supabaseSession?.access_token;

  return (
    <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 text-sm">
      <h2 className="text-lg font-bold mb-2">🧪 Estado de Autenticación</h2>

      <div className="mb-3">
        <p className="font-medium">🔐 NextAuth:</p>
        <p className="flex items-center gap-2">
          Estado: <strong>{status}</strong>
          {isNextAuthAuthenticated ? (
            <span className="text-green-600">✅ Autenticado</span>
          ) : (
            <span className="text-red-600">❌ No autenticado</span>
          )}
        </p>
        <p className="text-xs break-words">
          Dirección: {nextAuthSession?.address ?? "—"}
        </p>
      </div>

      <div>
        <p className="font-medium">🟣 Supabase:</p>
        <p className="flex items-center gap-2">
          Sesión activa:
          {isSupabaseAuthenticated ? (
            <span className="text-green-600">✅ Sí</span>
          ) : (
            <span className="text-red-600">❌ No</span>
          )}
        </p>
        <p className="text-xs break-words">
          Expira:{" "}
          {supabaseSession?.expires_at
            ? new Date(supabaseSession.expires_at * 1000).toLocaleString()
            : "—"}
        </p>
      </div>
    </div>
  );
}
