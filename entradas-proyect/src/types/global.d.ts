// src/types/global.d.ts
import { DefaultSession } from "next-auth";

// Extiende la sesión de NextAuth
declare module "next-auth" {
  interface Session extends DefaultSession {
    address: string;
    chainId: number;
    supabaseAccessToken: string;
    supabaseAccessTokenExp: number;
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
