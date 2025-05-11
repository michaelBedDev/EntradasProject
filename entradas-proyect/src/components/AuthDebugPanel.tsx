"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SupabaseJwtToken } from "@/types/global";
import { getSupabaseClient } from "@/lib/supabase/browserClient";
import jwt from "jsonwebtoken";

export default function AuthDebugPanel() {
  const supabase = getSupabaseClient();
  const { data: nextSession, status, update } = useSession();

  const [dbTest, setDbTest] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<SupabaseJwtToken | null>(null);
  const [cookieValue, setCookieValue] = useState<string | null>(null);
  const [allJsCookies, setAllJsCookies] = useState<string>("");
  const [tokenValid, setTokenValid] = useState<boolean>(false);

  // 1️⃣ Test Query a la base de datos
  useEffect(() => {
    async function testDb() {
      if (!nextSession?.supabaseAccessToken) {
        setDbTest("❌ No token Supabase");
        return;
      }

      try {
        // Verificar validez del token antes de usarlo
        const isValid = await verifyTokenExpiration(
          nextSession.supabaseAccessTokenExp,
        );
        if (!isValid) {
          setDbTest("❌ Token expirado - refrescando...");
          await update();
          return;
        }

        const { error } = await supabase.from("entradas").select("*").limit(1);

        setDbTest(error ? `❌ Error: ${error.message}` : "✅ Query OK");
      } catch (err: any) {
        setDbTest(`❌ ${err.message}`);
      }
    }
    testDb();
  }, [supabase, nextSession?.supabaseAccessToken]);

  // 2️⃣ Decodificar y validar token
  useEffect(() => {
    if (!nextSession?.supabaseAccessToken) {
      setDecodedToken(null);
      setTokenValid(false);
      return;
    }

    try {
      const decoded = jwt.decode(nextSession.supabaseAccessToken, {
        complete: true,
      });

      if (!decoded) {
        throw new Error("Token inválido");
      }

      const payload = decoded.payload as SupabaseJwtToken;
      const isValid = Date.now() < payload.exp * 1000;

      setDecodedToken(payload);
      setTokenValid(isValid);
    } catch (error) {
      console.error("Error decoding token:", error);
      setDecodedToken(null);
      setTokenValid(false);
    }
  }, [nextSession?.supabaseAccessToken]);

  // 3️⃣ Verificar cookie del middleware
  useEffect(() => {
    async function fetchCookie() {
      try {
        const res = await fetch("/api/auth/debug?t=" + Date.now(), {
          // Cache-buster
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        setCookieValue(data.cookiePresent ? "✅ Presente" : "❌ Ausente");
      } catch {
        setCookieValue("❌ Error");
      }
    }
    fetchCookie();
  }, []);

  // 4️⃣ Verificar cookies accesibles desde JS
  useEffect(() => {
    setAllJsCookies(document.cookie.split(";").join("\n"));
  }, []);

  // Función para verificar expiración
  const verifyTokenExpiration = async (exp: number) => {
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  };

  return (
    <Card className="bg-white dark:bg-zinc-900">
      <CardHeader>
        <CardTitle>🧪 Debug Auth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-xs break-all">
          <section>
            <h3 className="font-medium">🔐 NextAuth Session</h3>
            <div className="space-y-1">
              <p>
                Estado: <span className="font-semibold">{status}</span>
              </p>
              <p>
                Token válido:{" "}
                <span className={tokenValid ? "text-green-500" : "text-red-500"}>
                  {tokenValid ? "✅ Válido" : "❌ Inválido"}
                </span>
              </p>
              <pre className="text-xs p-2 bg-black-100 rounded">
                {JSON.stringify(
                  {
                    user: nextSession?.user,
                    expires: nextSession?.expires,
                    tokenExp:
                      nextSession?.supabaseAccessTokenExp &&
                      new Date(
                        nextSession.supabaseAccessTokenExp * 1000,
                      ).toISOString(),
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="font-medium">🛠️ Supabase Connection</h3>
            <div className="space-y-1">
              <p>
                Estado conexión:{" "}
                <span className="font-semibold">{dbTest || "..."}</span>
              </p>
              <p>
                Última actualización:{" "}
                <span className="font-mono">{new Date().toLocaleTimeString()}</span>
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-medium">🔑 JWT Payload</h3>
            <div className="p-2 bg-black-100 rounded">
              {decodedToken ? (
                <pre className="text-xs">
                  {JSON.stringify(
                    {
                      ...decodedToken,
                      iat: new Date(decodedToken.iat * 1000).toISOString(),
                      exp: new Date(decodedToken.exp * 1000).toISOString(),
                    },
                    null,
                    2,
                  )}
                </pre>
              ) : (
                <p className="text-red-500">Token no disponible</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="font-medium">🍪 Cookies</h3>
            <div className="space-y-2">
              <div>
                <p className="font-mono text-xs">sb-access-token:</p>
                <p className="text-xs p-2 bg-black-100 rounded">
                  {cookieValue || "Cargando..."}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs">document.cookie:</p>
                <pre className="text-xs p-2 bg-black-100 rounded">
                  {allJsCookies || "No se encontraron cookies"}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
