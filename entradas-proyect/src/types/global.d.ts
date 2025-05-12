// src/types/global.d.ts
import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// 1) Ampliación del JWT interno que usa NextAuth en jwt()
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    supabase?: {
      token: string;
      exp: number;
    };
  }
}

// 2) Ampliación de la sesión / user que usa NextAuth en session()
declare module "next-auth" {
  // Aquí le decimos que el objeto session tiene un id con la wallet y la chainId, y un objeto supabase con el token y la expiración.
  interface Session extends DefaultSession {
    address: string;
    chainId: number;
    supabase: {
      token: string;
      exp: number;
    };
  }

  // Aquí le decimos que el objeto user de authorize() tiene un id con la wallet y la chainId.
  interface User {
    id: string;
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
