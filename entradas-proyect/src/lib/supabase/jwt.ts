// lib/supabase/jwt.ts
import jwt from "jsonwebtoken";

/**
 * Genera un JWT válido para Supabase a partir de una dirección de wallet.
 * Este JWT se usará para aplicar políticas RLS personalizadas.
 */
export function createSupabaseJwt(address: string): string {
  if (!process.env.SUPABASE_JWT_SECRET) {
    throw new Error("SUPABASE_JWT_SECRET no está definido en variables de entorno");
  }

  const payload = {
    sub: address.toLowerCase(), // auth.uid() devolverá esto
    address: address.toLowerCase(), // opcional, por si lo necesitas como auth.jwt() ->> 'address'
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora de expiración
  };

  return jwt.sign(payload, process.env.SUPABASE_JWT_SECRET);
}
