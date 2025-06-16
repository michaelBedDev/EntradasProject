export function slugify(text: string): string {
  // Crear un slug amigable para la URL usando el título y el ID completo
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Eliminar caracteres especiales
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/--+/g, "-") // Eliminar guiones múltiples
    .trim(); // Quitar espacios al inicio y final
}
