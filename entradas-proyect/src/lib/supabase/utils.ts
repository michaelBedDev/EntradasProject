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

/**
 * Namespace for UUID-v5 used to derive a deterministic UUID from the wallet address.
 * This should be a valid UUID string, e.g., "00000000-0000-0000-0000-000000000000".
 */
export const SUPABASE_JWT_TTL_SECONDS = 60 * 15;

/**
 * Convierte una dirección de wallet a un UUID único.
 * Como el UUID es determinista, siempre generará el mismo UUID para la misma dirección de wallet.
 * Esto es útil para identificar de manera única a un usuario basado en su dirección de wallet. Supabase identifica a los usuarios por UUIDs, no por direcciones de wallet.
 * @param addr - Dirección de la wallet (en minúsculas).
 * @returns Un UUID v5 basado en la dirección de la wallet.
 */
export function walletToUid(addr: string): string {
  return uuidv5(addr.toLowerCase(), UUID_NAMESPACE as string);
}

/**
 * Crea un JWT para Supabase con la dirección de wallet.
 * Este JWT se utiliza para autenticar al usuario en Supabase.
 * El JWT incluye el UUID del usuario, su rol y la dirección de wallet.
 * @param addr - Dirección de la wallet (en minúsculas).
 * @returns Un objeto que contiene el token JWT y su fecha de expiración.
 * @throws Error si el secreto de JWT no está configurado en las variables de entorno.
 */
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

/**
 * Función para verificar si un token está expirado o a punto de expirar.
 * @description Esta función comprueba si el token ha expirado o está a menos de 60 segundos de expirar, en este caso, se considera que está expirado.
 * @param exp - Timestamp de expiración del token en segundos (Unix timestamp).
 * @returns true si el token está expirado o a punto de expirar, false en caso contrario.
 */
export function isTokenExpiredOrExpiring(exp?: number): boolean {
  if (!exp) return true;
  return Date.now() > exp * 1000 - 60000;
}

/**
 * Obtiene el token de Supabase desde la sesión de NextAuth
 * @description Esta función obtiene el token de Supabase y su expiración desde la sesión de NextAuth.
 * Si no hay sesión o no se encuentra el token, retorna un objeto vacío.
 * @returns Un objeto con el token de Supabase y su expiración
 */
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

    return supabaseObject;
  } catch (error) {
    console.error("Error al obtener token de Supabase:", error);
    return {};
  }
}

/**
 * Extrae el payload y la expiración del token de Supabase
 * @param token - El token JWT generado para Supabase
 * @returns Un objeto con el payload, timestamp de expiración y fecha formateada
 */
export function parseSupabaseToken(token: string | null) {
  if (!token) {
    console.warn("[parseSupabaseToken] Token nulo o indefinido");
    return null;
  }

  try {
    const decoded = jwt.decode(token) as { token: string; exp: number } | null;

    if (!decoded || !decoded.exp) {
      console.warn("[parseSupabaseToken] Token inválido o sin campo 'exp'");
      return null;
    }

    const expDate = new Date(decoded.exp * 1000); // convertir a milisegundos
    const expFormatted = expDate.toLocaleString(); // formato local (opcionalmente, usar UTC)

    return {
      payload: decoded,
      expTimestamp: decoded.exp,
      expFormatted,
    };
  } catch (error) {
    console.error("[parseSupabaseToken] Error al decodificar token:", error);
    return null;
  }
}
