// DATABASE TYPES
import type { Database } from "@/types/supabase.types";

export type EventRow = Database["public"]["Tables"]["eventos"]["Row"];
export type EventInsert = Database["public"]["Tables"]["eventos"]["Insert"];

export enum EventStatus {
  Pendiente = "pendiente",
  Aprobado = "aprobado",
  Cancelado = "cancelado",
}
