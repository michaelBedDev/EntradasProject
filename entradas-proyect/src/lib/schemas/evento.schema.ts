import { EventoStatus } from "@/features/eventos/services/types";
import * as z from "zod";

// Esquema para los tipos de entrada
export const tipoEntradaSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" }),
  descripcion: z
    .string()
    .max(200, { message: "La descripción no puede exceder los 200 caracteres" })
    .nullable()
    .optional(),
  precio: z.number().min(0, { message: "El precio debe ser mayor o igual a 0" }),
  zona: z
    .string()
    .max(50, { message: "La zona no puede exceder los 50 caracteres" })
    .nullable()
    .optional(),
  cantidad_disponible: z
    .number()
    .int()
    .min(1, { message: "La cantidad debe ser mayor a 0" }),
});

// Esquema para el formulario de tipos de entrada
export const tipoEntradaFormSchema = tipoEntradaSchema;

// Esquema base para el formulario
export const eventoFormSchema = z.object({
  titulo: z
    .string()
    .min(5, { message: "El título debe tener al menos 5 caracteres" })
    .max(100, { message: "El título no puede exceder los 100 caracteres" }),

  descripcion: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(1000, { message: "La descripción no puede exceder los 1000 caracteres" })
    .nullable(),

  fecha_inicio: z.date().refine(
    (fecha) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return fecha >= today;
    },
    { message: "La fecha de inicio debe ser hoy o posterior" },
  ),

  fecha_fin: z.date(),

  lugar: z
    .string()
    .min(3, { message: "El lugar debe tener al menos 3 caracteres" })
    .max(100, { message: "El lugar no puede exceder los 100 caracteres" }),

  categoria: z.string().min(1, { message: "Debes seleccionar una categoría" }),

  imagen_uri: z
    .string()
    .refine(
      (value) => {
        // Permitir string vacío o URL válida
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "URL de imagen inválida" },
    )
    .nullable()
    .optional(),

  tipos_entrada: z.array(tipoEntradaFormSchema).optional(),
});

// Esquema completo para la base de datos
export const eventoSchema = eventoFormSchema.extend({
  id: z.string().uuid(),
  organizador_id: z.string().uuid(),
  status: z
    .enum([
      EventoStatus.PENDIENTE,
      EventoStatus.APROBADO,
      EventoStatus.RECHAZADO,
      EventoStatus.CANCELADO,
    ])
    .default(EventoStatus.PENDIENTE),
  created_at: z.date().optional(),
});

// Esquema para la creación de eventos
export const createEventoSchema = eventoFormSchema.extend({
  organizador_id: z.string().uuid(),
  status: z
    .enum([
      EventoStatus.PENDIENTE,
      EventoStatus.APROBADO,
      EventoStatus.RECHAZADO,
      EventoStatus.CANCELADO,
    ])
    .default(EventoStatus.PENDIENTE),
});

// Esquema para el formulario de creación
export const createEventoFormSchema = eventoFormSchema;

// Esquema para la actualización de eventos
export const updateEventoSchema = createEventoSchema.partial();

// Esquema para la aprobación/rechazo de eventos
export const estadoEventoSchema = z.object({
  motivo_rechazo: z.string().optional(),
});

// Tipos inferidos del esquema
export type EventoFormValues = z.infer<typeof eventoFormSchema>;
export type EventoResponse = z.infer<typeof eventoSchema>;
export type CreateEventoInput = z.infer<typeof createEventoSchema>;
export type CreateEventoFormInput = z.infer<typeof createEventoFormSchema>;
export type UpdateEventoInput = z.infer<typeof updateEventoSchema>;
export type EstadoEventoInput = z.infer<typeof estadoEventoSchema>;
export type TipoEntradaFormInput = z.infer<typeof tipoEntradaFormSchema>;
