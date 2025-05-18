// DATABASE TYPES
import type { Database } from "@/types/supabase.types";

export type UserRow = Database["public"]["Tables"]["usuarios"]["Row"];
export type UserInsert = Database["public"]["Tables"]["usuarios"]["Insert"];

export enum UserRole {
  Admin = "admin",
  Organizador = "organizador",
  Usuario = "usuario",
}
