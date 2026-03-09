/**
 * GameConfig Controller
 *
 * Maneja las peticiones relacionadas con configuraciones de juegos TCG.
 */

const games = require("../config/games");
const { parseDeck, detectFormat } = require("../utils/deckParser");

/**
 * GET /api/games
 * Retorna lista resumida de todos los juegos disponibles
 */
function getAllGames(req, res) {
  const list = Object.values(games).map(g => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    formats: g.formats,
  }));
  res.json(list);
}

/**
 * GET /api/games/:slug
 * Retorna la configuracion completa de un juego (tema, layout, defaults)
 */
function getGameConfig(req, res) {
  const { slug } = req.params;
  const game = games[slug];
  if (!game) {
    return res.status(404).json({ error: `Game "${slug}" not found` });
  }
  res.json(game);
}

/**
 * GET /api/games/:slug/theme
 * Retorna solo el tema visual (colores, tipografia, layout, decoraciones)
 */
function getGameTheme(req, res) {
  const { slug } = req.params;
  const game = games[slug];
  if (!game) {
    return res.status(404).json({ error: `Game "${slug}" not found` });
  }
  res.json({
    theme: game.theme,
    fonts: game.fonts,
    deckStructure: game.deckStructure,
  });
}

/**
 * GET /api/games/:slug/defaults
 * Retorna los datos por defecto para el formulario
 */
function getGameDefaults(req, res) {
  const { slug } = req.params;
  const game = games[slug];
  if (!game) {
    return res.status(404).json({ error: `Game "${slug}" not found` });
  }
  res.json(game.defaultData);
}

/**
 * POST /api/parse-deck
 * Parsea una lista de mazo segun el formato
 * Body: { text: string, format?: "mtg" | "onepiece" | "pokemon" }
 */
function parseDeckList(req, res) {
  const { text, format } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Missing 'text' in request body" });
  }
  const detectedFormat = format || detectFormat(text);
  const parsed = parseDeck(text, detectedFormat);
  res.json({ format: detectedFormat, cards: parsed });
}

module.exports = {
  getAllGames,
  getGameConfig,
  getGameTheme,
  getGameDefaults,
  parseDeckList,
};
