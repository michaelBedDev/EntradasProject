// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { useSession } from "next-auth/react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { SupabaseJwtToken } from "@/types/global";
// import { getSupabaseClient } from "@/lib/supabase/browserClient";

// // Helper para decodificar el payload de un JWT sin librerías externas
// function parseJwt<T>(token: string): T | null {
//   try {
//     const base64 = token.split(".")[1];
//     // atob + decodeURIComponent para manejar correctamente UTF-8
//     const json = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join(""),
//     );
//     return JSON.parse(json) as T;
//   } catch {
//     return null;
//   }
// }

// export default function AuthDebugPanel() {
//   const { data: session, status, update } = useSession();

//   const supabase = useMemo(
//     () => getSupabaseClient(session?.supabase.token ?? ""),
//     [session?.supabase.token],
//   );

//   const [dbTest, setDbTest] = useState<string>("Cargando...");
//   const [decodedToken, setDecodedToken] = useState<SupabaseJwtToken | null>(null);
//   const [cookieValue, setCookieValue] = useState<string>("Cargando...");
//   const [allJsCookies, setAllJsCookies] = useState<string>("");

//   // 1️⃣ Test a la DB
//   useEffect(() => {
//     let mounted = true;
//     async function testDb() {
//       if (!session?.supabase.token) {
//         mounted && setDbTest("❌ Sin token Supabase");
//         return;
//       }
//       const now = Math.floor(Date.now() / 1000);
//       if (session.supabase.exp <= now) {
//         mounted && setDbTest("❌ Token expirado, refrescando...");
//         await update();
//         return;
//       }
//       try {
//         const { error } = await supabase.from("entradas").select("*").limit(1);
//         mounted && setDbTest(error ? `❌ ${error.message}` : "✅ Consulta OK");
//       } catch (err: any) {
//         mounted && setDbTest(`❌ ${err.message}`);
//       }
//     }
//     testDb();
//     return () => {
//       mounted = false;
//     };
//   }, [supabase, session?.supabase.token, session?.supabase.exp, update]);

//   // 2️⃣ Decodificar JWT
//   useEffect(() => {
//     if (!session?.supabase.token) {
//       setDecodedToken(null);
//       return;
//     }
//     const payload = parseJwt<SupabaseJwtToken>(session.supabase.token);
//     setDecodedToken(payload);
//   }, [session?.supabase.token]);

//   // 3️⃣ Comprobar cookie via API
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(`/api/auth/debug?t=${Date.now()}`, {
//           credentials: "include",
//           cache: "no-store",
//         });
//         const { cookiePresent } = await res.json();
//         setCookieValue(cookiePresent ? "✅ Presente" : "❌ Ausente");
//       } catch {
//         setCookieValue("❌ Error al comprobar");
//       }
//     })();
//   }, []);

//   // 4️⃣ Cookies JS
//   useEffect(() => {
//     setAllJsCookies(document.cookie || "No hay cookies accesibles");
//   }, []);

//   return (
//     <Card className="bg-white dark:bg-zinc-900">
//       <CardHeader>
//         <CardTitle>🧪 Debug Auth</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4 text-xs break-all">
//           <section>
//             <h3 className="font-medium">🔐 NextAuth Session</h3>
//             <p>
//               Estado: <strong>{status}</strong>
//             </p>
//             <pre className="p-2 bg-black-100 rounded">
//               {JSON.stringify(
//                 {
//                   user: session?.user,
//                   expires: session?.expires,
//                   exp: session?.supabase.exp
//                     ? new Date(session.supabase.exp * 1000).toISOString()
//                     : null,
//                 },
//                 null,
//                 2,
//               )}
//             </pre>
//           </section>

//           <section>
//             <h3 className="font-medium">🛠️ Supabase Connection</h3>
//             <p>
//               Estado conexión: <strong>{dbTest}</strong>
//             </p>
//             <p>
//               Última prueba: <code>{new Date().toLocaleTimeString()}</code>
//             </p>
//           </section>

//           <section>
//             <h3 className="font-medium">🔑 JWT Payload</h3>
//             {decodedToken ? (
//               <pre className="p-2 bg-black-100 rounded">
//                 {JSON.stringify(
//                   {
//                     ...decodedToken,
//                     iat: new Date(decodedToken.iat * 1000).toISOString(),
//                     exp: new Date(decodedToken.exp * 1000).toISOString(),
//                   },
//                   null,
//                   2,
//                 )}
//               </pre>
//             ) : (
//               <p className="text-red-500">Token no disponible</p>
//             )}
//           </section>

//           <section>
//             <h3 className="font-medium">🍪 Cookies</h3>
//             <p>
//               <code>sb-access-token</code>: {cookieValue}
//             </p>
//             <pre className="p-2 bg-black-100 rounded">{allJsCookies}</pre>
//           </section>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
