"use client";
import { useSession } from "next-auth/react";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

export default function AuthDebugPanel() {
  const { data: next, status } = useSession();
  const sb = useSupabaseSession();

  return (
    <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 text-xs break-all">
      <h2 className="text-lg font-bold mb-3">🧪 Debug Auth</h2>

      <section className="mb-4">
        <h3 className="font-medium">🔐 Next-Auth</h3>
        <p>
          Estado: <strong>{status}</strong>
        </p>
        <pre className="whitespace-pre-wrap">{JSON.stringify(next, null, 2)}</pre>
      </section>

      <section>
        <h3 className="font-medium">🟣 Supabase</h3>
        <p>
          Sesión: {sb ? "✅" : "❌"}{" "}
          {sb?.expires_at && new Date(sb.expires_at * 1000).toLocaleTimeString()}
        </p>
        <pre className="whitespace-pre-wrap">{JSON.stringify(sb, null, 2)}</pre>
      </section>
    </div>
  );
}
