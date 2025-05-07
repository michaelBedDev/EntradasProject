import jwt from "jsonwebtoken";
import { v5 as uuidv5 } from "uuid";

/* ---------------------------------------------------------
 * Namespace para UUID-v5 –  debe existir en tu .env.local
 * --------------------------------------------------------- */
const UUID_NAMESPACE = process.env.WALLET_UUID_NAMESPACE;
if (!UUID_NAMESPACE) throw new Error("WALLET_UUID_NAMESPACE faltante en .env.local");

/* TTL en segundos (30 min) */
export const SUPABASE_JWT_TTL_SECONDS = 60 * 30;

/* Deriva un UUID-v5 estable a partir de la wallet */
export const walletToUid = (addr: string) =>
  uuidv5(addr.toLowerCase(), UUID_NAMESPACE);

/* Firma un JWT válido para Supabase */
export function createSupabaseJwt(addr: string) {
  const secret = process.env.SUPABASE_JWT_SECRET!;

  return jwt.sign(
    {
      sub: walletToUid(addr),
      role: "authenticated",
    },
    secret,
    {
      algorithm: "HS256",
      audience: "authenticated",
      expiresIn: SUPABASE_JWT_TTL_SECONDS,
    },
  );
}
