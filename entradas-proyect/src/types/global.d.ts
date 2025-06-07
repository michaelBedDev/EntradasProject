// src/types/global.d.ts

import { DefaultJWT } from "next-auth/jwt";

// Declaración del tipo del JWT de NextAuth

/**
 * Token.sub tiene el formato "chainId:address"
 * token.supabase tiene el JWT firmado por supabase
 * token.userRole tiene el rol del usuario (admin, user, etc.)
 */
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    supabase?: SupabaseJwt;
    userRole?: string;
  }
}

// Declaración del tipo de sesión de NextAuth

/**
 * Session.address es la dirección del usuario
 * Session.chainId es el ID de la cadena del usuario
 * Session.supabase es el JWT firmado por supabase
 * Session.userRole es el rol del usuario (admin, user, etc.)
 */
declare module "next-auth" {
  interface Session extends SIWESession {
    address?: string;
    chainId?: number;
    supabase?: SupabaseJwt;
    userRole?: string;
  }
}

/**
 * Interfaz para el JWT firmado por Supabase
 * - token: JWT firmado por Supabase
 * - exp: Expiración del token en formato timestamp UNIX (segundos)
 */
export interface SupabaseJwt {
  token: string;
  exp: number;
}

/* TIPOS DE LA BASE DE DATOS */
import { Database as DB } from "@/types/supabase.types";

declare global {
  type Usuario = DB["public"]["Tables"]["usuarios"]["Row"];
  type Evento = DB["public"]["Tables"]["eventos"]["Row"];
  type EventoWOrganizador = Evento & {
    organizador?: {
      nombre: string;
    };
  };
  type Entrada = DB["public"]["Tables"]["entradas"]["Row"];
}

/* TIPOS ADICIONALES */
export interface LinkType {
  href: string;
  label: string;
  icon: string; // Use the type of the icon component
}
