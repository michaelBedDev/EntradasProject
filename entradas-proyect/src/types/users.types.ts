// DATABASE TYPES
import type { Database } from "@/types/supabase.types";

export type UserRow = Database["public"]["Tables"]["usuarios"]["Row"];
export type UserInsert = Database["public"]["Tables"]["usuarios"]["Insert"];

/**
 * Enum para los roles de usuario.
 * IMPORTANTE: Los valores deben coincidir exactamente con los valores
 * almacenados en la base de datos.
 */
export enum UserRole {
  Admin = "admin",
  Organizador = "organizador",
  Usuario = "usuario",
}
