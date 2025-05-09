// src/lib/postgrestClient.ts
import { PostgrestClient } from "@supabase/postgrest-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export function getDbClient(token?: string) {
  return new PostgrestClient(`${URL}/rest/v1`, {
    headers: {
      // siempre envío la llave en 'apikey' (necesaria para todas las rutas)
      apikey: token ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      // si tengo JWT, lo meto como Bearer para RLS
      Authorization: token ? `Bearer ${token}` : "",
      // obligatorio cuando usas PostgREST en supabase
      "Content-Type": "application/json",
    },
  });
}
