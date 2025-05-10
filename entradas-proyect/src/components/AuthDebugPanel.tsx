"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SupabaseJwtToken } from "@/types/global";
import { getSupabaseClient } from "@/lib/supabase/browserClient";

export default function AuthDebugPanel() {
  const supabase = getSupabaseClient();

  const { data: nextSession, status } = useSession();
  const [dbTest, setDbTest] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<SupabaseJwtToken | null>(null);

  // 1️⃣ Test Query a la base de datos
  //    - Si no hay token, error
  useEffect(() => {
    async function testDb() {
      if (!nextSession?.supabaseAccessToken) {
        setDbTest("❌ No token Supabase");
        return;
      }
      try {
        // Inyecta el token en el cliente
        await supabase.auth.setSession({
          access_token: nextSession.supabaseAccessToken,
          refresh_token: nextSession.supabaseAccessToken, // si no tienes refresh, repite el access
        });

        // Lanza la query con tipos y cabeceras automáticas
        const { error, status } = await supabase
          .from("entradas")
          .select("*")
          .limit(1);

        if (error) setDbTest(`❌ Error ${status}: ${error.message}`);
        else setDbTest("✅ Query OK");
      } catch (err: unknown) {
        if (err instanceof Error) setDbTest(`❌ ${err.message}`);
        else setDbTest(`❌ ${String(err)}`);
      }
    }

    testDb();
  }, [supabase, nextSession?.supabaseAccessToken]); // Ejecuta cada vez que cambie el token en la sesión o el cliente de supabase
  //OJO se crea un nuevo cliente en cada render

  // 2️⃣ Decodificar supabaseAccessToken para ver todo el payload
  useEffect(() => {
    if (!nextSession?.supabaseAccessToken) {
      setDecodedToken(null);
      return;
    }
    try {
      const [, payloadB64] = nextSession.supabaseAccessToken.split(".");
      const json = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
      const decoded = JSON.parse(
        decodeURIComponent(
          Array.from(json)
            .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join(""),
        ),
      ) as SupabaseJwtToken;
      setDecodedToken(decoded);
    } catch {
      setDecodedToken(null);
    }
  }, [nextSession?.supabaseAccessToken]);

  return (
    <Card className="bg-white dark:bg-zinc-900">
      <CardHeader>
        <CardTitle>🧪 Debug Auth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-xs break-all">
          <section>
            <h3 className="font-medium">🔐 NextAuth</h3>
            <p>
              Estado: <strong>{status}</strong>
            </p>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(nextSession, null, 2)}
            </pre>
          </section>

          <section>
            <h3 className="font-medium">🟣 PostgREST Test</h3>
            <p>
              Resultado query: <strong>{dbTest || "…"}</strong>
            </p>
          </section>

          <section>
            <h3 className="font-medium">🗄️ Payload JWT de Supabase</h3>
            {decodedToken ? (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(decodedToken, null, 2)}
              </pre>
            ) : (
              <p>— Sin token válido —</p>
            )}
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
