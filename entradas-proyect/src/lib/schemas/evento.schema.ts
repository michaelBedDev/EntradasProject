import { EventoStatus } from "@/features/eventos/services/types";
import * as z from "zod";

// Esquema para validar la creación y edición de eventos
export const eventoSchema = z.object({
  titulo: z
    .string()
    .min(5, { message: "El título debe tener al menos 5 caracteres" })
    .max(100, { message: "El título no puede exceder los 100 caracteres" }),

  descripcion: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(1000, { message: "La descripción no puede exceder los 1000 caracteres" }),

  fecha_inicio: z.date().refine(
    (fecha) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return fecha >= today;
    },
    { message: "La fecha de inicio debe ser hoy o posterior" },
  ),

  fecha_fin: z.date().optional(),

  lugar: z
    .string()
    .min(3, { message: "El lugar debe tener al menos 3 caracteres" })
    .max(100, { message: "El lugar no puede exceder los 100 caracteres" }),

  categoria: z.string().min(1, { message: "Debes seleccionar una categoría" }),

  estado: z
    .enum([
      EventoStatus.PENDIENTE,
      EventoStatus.APROBADO,
      EventoStatus.RECHAZADO,
      EventoStatus.CANCELADO,
    ])
    .default(EventoStatus.PENDIENTE),

  motivo_rechazo: z.string().optional().nullable(),

  organizador_id: z.string().uuid(),

  // Campo opcional para la URL de la imagen
  imagen_uri: z
    .string()
    .url({ message: "URL de imagen inválida" })
    .optional()
    .nullable(),
});

// Esquema para la respuesta de la API
export const eventoResponseSchema = eventoSchema.extend({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Esquema para la creación de eventos
export const createEventoSchema = eventoSchema.omit({
  estado: true,
  motivo_rechazo: true,
});

// Esquema para la actualización de eventos
export const updateEventoSchema = createEventoSchema.partial();

// Esquema para la aprobación/rechazo de eventos
export const estadoEventoSchema = z.object({
  motivo_rechazo: z.string().optional(),
});

// Tipos inferidos del esquema
export type EventoFormValues = z.infer<typeof eventoSchema>;
export type EventoResponse = z.infer<typeof eventoResponseSchema>;
export type CreateEventoInput = z.infer<typeof createEventoSchema>;
export type UpdateEventoInput = z.infer<typeof updateEventoSchema>;
export type EstadoEventoInput = z.infer<typeof estadoEventoSchema>;
