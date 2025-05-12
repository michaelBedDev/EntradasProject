// src/lib/supabase/browserClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase.types";

export function getSupabaseClient(accessToken?: string): SupabaseClient<Database> {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const headers: Record<string, string> = {
    apikey: anonKey,
    // Añadimos siempre el header X-Supabase-Client para identificar peticiones del navegador
    "X-Supabase-Client": "browser-client",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, anonKey, {
    global: { headers },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

// PARA USARLO EN UN COMPONENTE REACT:
// const { data: session } = useSession();

// // Solo se vuelve a crear si cambia el token
// return useMemo(
//   () => getSupabaseClient(session?.supabase.token ?? ""),
//   [session?.supabase.token],
// );

// Y EN LOS COMPONENTES:
//   useEffect(() => {
//     supabase
//       .from("mi_tabla")
//       .select("*")
//       .then(...)
//   }, [supabase]);
