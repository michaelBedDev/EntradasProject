"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SupabaseJwtToken } from "@/types/global";

export default function AuthDebugPanel() {
  const { data: nextSession, status } = useSession();
  const [dbTest, setDbTest] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<SupabaseJwtToken | null>(null);

  // 1️⃣ Test PostgREST
  useEffect(() => {
    async function testDb() {
      if (nextSession?.supabaseAccessToken) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/entradas?select=*&limit=1`,
            {
              headers: {
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
                Authorization: `Bearer ${nextSession.supabaseAccessToken}`,
              },
            },
          );
          if (res.ok) setDbTest("✅ Query OK");
          else setDbTest(`❌ Error ${res.status}`);
        } catch (err: unknown) {
          if (err instanceof Error) setDbTest(`❌ ${err.message}`);
          else setDbTest(`❌ ${String(err)}`);
        }
      } else {
        setDbTest("❌ No token Supabase");
      }
    }
    testDb();
  }, [nextSession?.supabaseAccessToken]);

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
