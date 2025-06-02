// lib/supabase/utils.ts\
import jwt from "jsonwebtoken";
import { v5 as uuidv5 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Namespace for UUID-v5 – must exist in your .env.local
const UUID_NAMESPACE = process.env.NEXT_PUBLIC_WALLET_UUID_NAMESPACE;
if (!UUID_NAMESPACE) {
  throw new Error("WALLET_UUID_NAMESPACE missing in .env");
}

// TTL in seconds (3 minutes for testing purposes)
export const SUPABASE_JWT_TTL_SECONDS = 60 * 3;

// Derive a deterministic UUID-v5 from the wallet address
export const walletToUid = (addr: string): string =>
  uuidv5(addr.toLowerCase(), UUID_NAMESPACE);

// Sign a valid JWT for Supabase
// Asegurar el tipo de retorno
export function createSupabaseJwt(addr: string): { token: string; exp: number } {
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) throw new Error("SUPABASE_JWT_SECRET is not set");

  const payload = {
    sub: walletToUid(addr),
    role: "authenticated",
    wallet: addr.toLowerCase(),
  };

  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    audience: "authenticated",
    expiresIn: SUPABASE_JWT_TTL_SECONDS,
  });

  // Decodificar para obtener expiración exacta
  const decoded = jwt.decode(token) as { exp: number };
  return { token, exp: decoded.exp };
}

// Verificar si un token está expirado o a punto de expirar (menos de 1 minuto)
export function isTokenExpiredOrExpiring(exp?: number): boolean {
  if (!exp) return true;
  // Verificar si el token expira en menos de 1 minuto (60000 ms)
  return Date.now() > exp * 1000 - 60000;
}

// Función centralizada para obtener el token de Supabase a partir de la sesión
export async function getSupabaseToken(): Promise<{ token?: string; exp?: number }> {
  try {
    // Obtener la sesión directamente con getServerSession
    const session = await getServerSession(authOptions);

    // Si no hay sesión, retornar objeto vacío
    if (!session?.address) {
      return {};
    }

    // Extraemos el token de Supabase de la sesión
    const supabaseObject = {
      token: session.supabase?.token,
      exp: session.supabase?.exp,
    };

    // Verificar si necesitamos regenerar el token
    if (isTokenExpiredOrExpiring(supabaseObject.exp)) {
      const newJwt = createSupabaseJwt(session.address);
      return {
        token: newJwt.token,
        exp: newJwt.exp,
      };
    }

    // Devolvemos el token actual si es válido
    return supabaseObject;
  } catch (error) {
    console.error("Error al obtener token de Supabase:", error);
    return {};
  }
}
