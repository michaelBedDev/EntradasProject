// lib/supabase/utils.ts
import jwt from "jsonwebtoken";
import { v5 as uuidv5 } from "uuid";

// Namespace for UUID-v5 – must exist in your .env.local
const UUID_NAMESPACE = process.env.WALLET_UUID_NAMESPACE;
if (!UUID_NAMESPACE) {
  throw new Error("WALLET_UUID_NAMESPACE missing in .env.local");
}

// TTL in seconds (30 minutes)
export const SUPABASE_JWT_TTL_SECONDS = 60 * 30;

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
