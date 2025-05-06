// lib/supabase/token.ts
import jwt from "jsonwebtoken";

export function createSupabaseJwt(address: string) {
  if (!process.env.SUPABASE_JWT_SECRET) {
    throw new Error("SUPABASE_JWT_SECRET not set");
  }

  return jwt.sign(
    {
      sub: address.toLowerCase(),
      role: "authenticated",
    },
    process.env.SUPABASE_JWT_SECRET,
    {
      expiresIn: "1h",
      issuer: "your-app",
    },
  );
}
