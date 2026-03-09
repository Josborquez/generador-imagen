/**
 * Client-side deck parser
 * Parsea texto de listas de mazos en formato [qty, name] para el canvas
 */

export function parseDeck(text) {
  if (!text || !text.trim()) return [];
  return text.split("\n").map(line => {
    const m = line.trim().match(/^(\d+)x?\s+(.+?)(?:\s+\([^)]+\))?(?:\s+[LCSRE])?$/);
    if (!m) {
      // Fallback simple
      const simple = line.trim().match(/^(\d+)x?\s+(.+)$/);
      return simple ? [parseInt(simple[1]), simple[2].trim()] : null;
    }
    return [parseInt(m[1]), m[2].trim()];
  }).filter(Boolean);
}

/**
 * Detecta automaticamente el formato del texto de un mazo
 */
export function detectFormat(text) {
  if (!text) return "mtg";
  if (/\([A-Z]{2,4}\s+\d+\)/.test(text)) return "pokemon";
  if (/\([A-Z0-9]+-[A-Z0-9]+\)/.test(text)) return "onepiece";
  return "mtg";
}
