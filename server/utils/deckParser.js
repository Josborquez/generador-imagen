/**
 * Deck Parser Utility
 *
 * Parsea texto de listas de mazos segun el formato del juego.
 * Soporta MTG, One Piece y Pokemon con deteccion automatica.
 */

/**
 * Formato MTG: "4 Dark Ritual" o "4x Dark Ritual"
 */
function parseMtg(text) {
  if (!text || !text.trim()) return [];
  return text.split("\n").map(line => {
    const m = line.trim().match(/^(\d+)x?\s+(.+)$/);
    return m ? { qty: parseInt(m[1]), name: m[2].trim() } : null;
  }).filter(Boolean);
}

/**
 * Formato One Piece: "4 Roronoa Zoro (OP01-025)" — incluye codigo de set
 */
function parseOnePiece(text) {
  if (!text || !text.trim()) return [];
  return text.split("\n").map(line => {
    // Con codigo de set: "4 Roronoa Zoro (OP01-025)"
    const m = line.trim().match(/^(\d+)x?\s+(.+?)(?:\s+\(([A-Z0-9]+-[A-Z0-9]+)\))?(?:\s+([LCSRE]))?$/);
    if (!m) return null;
    return {
      qty: parseInt(m[1]),
      name: m[2].trim(),
      setCode: m[3] || null,
      type: m[4] || null, // L=Leader, C=Character, S=Stage, E=Event, R=DON!!
    };
  }).filter(Boolean);
}

/**
 * Formato Pokemon: "3 Charizard ex (OBF 125)" — set code con espacio
 */
function parsePokemon(text) {
  if (!text || !text.trim()) return [];
  return text.split("\n").map(line => {
    // Con codigo de set: "3 Charizard ex (OBF 125)"
    const m = line.trim().match(/^(\d+)x?\s+(.+?)(?:\s+\(([A-Z]{2,4}\s+\d+)\))?$/);
    if (!m) {
      // Sin codigo de set: "3 Fire Energy"
      const simple = line.trim().match(/^(\d+)x?\s+(.+)$/);
      return simple ? { qty: parseInt(simple[1]), name: simple[2].trim(), setCode: null } : null;
    }
    return {
      qty: parseInt(m[1]),
      name: m[2].trim(),
      setCode: m[3] || null,
    };
  }).filter(Boolean);
}

/**
 * Detecta automaticamente el formato basado en el contenido
 */
function detectFormat(text) {
  if (!text) return "mtg";
  // Pokemon: set codes like (OBF 125), (SVI 191)
  if (/\([A-Z]{2,4}\s+\d+\)/.test(text)) return "pokemon";
  // One Piece: set codes like (OP01-025), type letters at end
  if (/\([A-Z0-9]+-[A-Z0-9]+\)/.test(text)) return "onepiece";
  return "mtg";
}

/**
 * Parser principal — recibe texto y formato, retorna array de cartas
 */
function parseDeck(text, format) {
  const fmt = format || detectFormat(text);
  switch (fmt) {
    case "pokemon": return parsePokemon(text);
    case "onepiece": return parseOnePiece(text);
    case "mtg":
    default: return parseMtg(text);
  }
}

/**
 * Convierte resultado del parser a formato simple [qty, name] para el canvas
 */
function toCanvasFormat(parsed) {
  return parsed.map(card => [card.qty, card.name]);
}

module.exports = { parseDeck, parseMtg, parseOnePiece, parsePokemon, detectFormat, toCanvasFormat };
