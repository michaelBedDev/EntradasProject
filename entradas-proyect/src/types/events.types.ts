// DATABASE TYPES
import type { Database } from "@/types/supabase.types";

export type EventRow = Database["public"]["Tables"]["eventos"]["Row"] & {
  organizador_nombre?: string;
  usuarios?: { nombre?: string };
  precio?: number; // Precio del evento (opcional)
};

export type EventInsert = Database["public"]["Tables"]["eventos"]["Insert"];

export enum EventStatus {
  Pendiente = "pendiente",
  Aprobado = "aprobado",
  Cancelado = "cancelado",
}
