import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 *
 * @param fechaInicio Fecha en formato ISO 8601 (ejemplo: "2023-10-01T12:00:00Z")
 * @description Formatea la fecha a un formato legible en español, devolviendo el día y mes.
 * Ejemplo de retorno: { diaMes: "01", mes: "OCT" }
 * @returns
 */
export function extractDayAndMonth(fechaInicio: string) {
  if (!fechaInicio) return { diaMes: "", mes: "" };
  const fecha = new Date(fechaInicio);
  const diaMes = format(fecha, "dd", { locale: es });
  const mes = format(fecha, "MMM", { locale: es }).toUpperCase();

  return { diaMes, mes };
}

/**
 * Función auxiliar para formatear fechas
 * @param dateString Fecha en formato ISO 8601 (ejemplo: "2023-10-01T12:00:00Z")
 * @description Formatea la fecha a un formato legible en español (ejemplo: "1 de octubre de 2023")
 * @returns
 */
export function formatToFullDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
}
