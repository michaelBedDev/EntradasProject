export function extractID(slug: string) {
  // Patrón regex para UUID v4
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = slug.match(uuidRegex);
  return match ? match[0] : null;
}
