/**
 * GameConfig Model
 *
 * Define la estructura de configuracion visual para cada juego TCG.
 * Cada config incluye: paleta de colores, tipografias, layout del canvas,
 * estructura del mazo y metadatos del juego.
 */

class GameConfig {
  constructor({
    id,
    name,
    slug,
    formats = [],
    theme,
    deckStructure,
    defaultData,
    fonts,
  }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.formats = formats;
    this.theme = new ThemeConfig(theme);
    this.deckStructure = deckStructure;
    this.defaultData = defaultData;
    this.fonts = fonts;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      formats: this.formats,
      theme: this.theme,
      deckStructure: this.deckStructure,
      defaultData: this.defaultData,
      fonts: this.fonts,
    };
  }
}

class ThemeConfig {
  constructor({
    colors,
    typography,
    layout,
    decorations,
  }) {
    this.colors = colors;        // { primary, secondary, bg, text, accent, ... }
    this.typography = typography; // { header, title, body, cardName, ... }
    this.layout = layout;        // { canvas, header, photo, deck, footer, name }
    this.decorations = decorations; // { border, corners, glows, separators, icons }
  }
}

class Player {
  constructor({ firstName, lastName, archetype, photoUrl }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.archetype = archetype;
    this.photoUrl = photoUrl || null;
  }
}

class Tournament {
  constructor({
    gameSlug,
    format,
    event,
    date,
    dateLabel,
    season,
    leagueTitle,
    website,
    winner,
    decklist,
  }) {
    this.gameSlug = gameSlug;
    this.format = format;
    this.event = event;
    this.date = date;
    this.dateLabel = dateLabel;
    this.season = season;
    this.leagueTitle = leagueTitle;
    this.website = website;
    this.winner = winner ? new Player(winner) : null;
    this.decklist = decklist || {};
  }
}

module.exports = { GameConfig, ThemeConfig, Player, Tournament };
