import { z } from "zod";

export const tipoEntradaSchema = z.object({
  nombre: z.string().min(1, "El nombre del tipo de entrada es requerido"),
  precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  cantidad: z.number().min(1, "La cantidad debe ser al menos 1"),
  descripcion: z.string().optional(),
  zona: z.string().optional(),
});

export type TipoEntradaInput = z.infer<typeof tipoEntradaSchema>;

export const tiposEntradaSchema = z
  .array(tipoEntradaSchema)
  .min(1, "Debe haber al menos un tipo de entrada");
