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

  fecha: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .refine(
      (fecha) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reinicia la hora a medianoche
        return fecha.from >= today;
      },
      { message: "La fecha de inicio debe ser hoy o posterior" },
    ),

  lugar: z
    .string()
    .min(3, { message: "El lugar debe tener al menos 3 caracteres" })
    .max(100, { message: "El lugar no puede exceder los 100 caracteres" }),

  // Campo opcional para la URL de la imagen
  imagen_uri: z
    .string()
    .url({ message: "URL de imagen inválida" })
    .optional()
    .nullable(),
});

// Tipo inferido del esquema para usar en los formularios
export type EventoFormValues = z.infer<typeof eventoSchema>;
