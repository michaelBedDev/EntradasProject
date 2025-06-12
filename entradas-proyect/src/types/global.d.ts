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
  type Entrada = DB["public"]["Tables"]["entradas"]["Row"];
  type TipoEntrada = DB["public"]["Tables"]["tipos_entrada"]["Row"];
  type Asiento = DB["public"]["Tables"]["asientos"]["Row"];
}

/* TIPOS ADICIONALES */
export type AsientoPublico = {
  fila: string | null;
  numero: string | null;
};

export type UsuarioOrganizadorPublico = {
  nombre: string | null;
  wallet: string;
};

export type EventoPublico = {
  id: string;
  titulo: string;
  descripcion: string | null;
  lugar: string;
  imagen_uri: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  categoria: string;
  status: string | null; // CONSTRAINT
  organizador: UsuarioOrganizadorPublico;
};

export type TipoEntradaPublica = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  zona: string | null;
  evento: EventoPublico;
  cantidad_disponible: number;
};

export type EntradaCompletaPublica = Entrada & {
  asiento?: AsientoPublico | null;
  tipo_entrada: TipoEntradaPublica;
};

/* PARA UN EVENTO CON SUS TIPOS DE ENTRADA */
export type EventoPublicoWTipos = EventoPublico & {
  tipos_entrada: TipoEntradaPublica[];
};

/* OTROS TIPOS */
export type LinkType = {
  href: string;
  label: string;
  icon: string;
};

export type EventoEstadisticas = {
  totalEventos: number;
  eventosAprobados: number;
  eventosPendientes: number;
  proximosEventos: Evento[];
};
