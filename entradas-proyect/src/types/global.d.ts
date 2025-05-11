// src/types/global.d.ts
import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Extiende la sesión de NextAuth
declare module "next-auth" {
  interface Session extends DefaultSession {
    supabaseAccessToken: string;
    supabaseAccessTokenExp: number;
    address: string;
  }

  interface JWT extends DefaultJWT {
    supabaseAccessToken: string;
    supabaseAccessTokenExp: number;
    wallet?: string;
  }
}

// Tipado para el payload de tu JWT custom de Supabase
export interface SupabaseJwtToken {
  sub: string;
  role: string;
  iat: number;
  exp: number;
  aud?: string;
  wallet: string;
}
