/**
 * Configuraciones de juegos TCG
 *
 * Cada juego define su paleta, tipografia, estructura de mazo,
 * layout del canvas y datos por defecto.
 */

const games = {
  // ════════════════════════════════════════════════════════════════
  // MAGIC: THE GATHERING — PREMODERN
  // ════════════════════════════════════════════════════════════════
  "mtg-premodern": {
    id: "mtg-premodern",
    name: "Magic: The Gathering",
    slug: "mtg-premodern",
    formats: ["Premodern", "Standard", "Modern", "Legacy"],
    fonts: {
      url: "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,400&display=swap",
      families: ["Cinzel", "Cinzel Decorative", "Crimson Pro"],
    },
    theme: {
      colors: {
        primary: "#C9A84C",
        primaryLight: "#E8C97A",
        primaryDim: "rgba(201,168,76,0.6)",
        secondary: "#8B1A1A",
        bg: "#0A0A0F",
        bgOverlay: "rgba(10,10,15,0.85)",
        text: "#C8B898",
        textWhite: "#FAFAFA",
        accent1: "#9BB8A0",   // green — lands
        accent2: "#7A9BB8",   // blue — sideboard
        glowCenter: "rgba(201,168,76,0.08)",
        glowSecondary: "rgba(139,26,26,0.09)",
      },
      typography: {
        season: { font: "600 9px 'Cinzel', serif", color: "rgba(201,168,76,0.6)" },
        leagueTitle: { font: "700 16px 'Cinzel Decorative', serif", color: "#C9A84C" },
        eventDate: { font: "600 8.5px 'Cinzel', serif", color: "rgba(201,168,76,0.45)" },
        winnerLabel: { font: "600 8px 'Cinzel', serif", color: "#C9A84C" },
        winnerName: { font: "900 23px 'Cinzel Decorative', serif", color: "#FAFAFA" },
        archetype: { font: "600 8px 'Cinzel', serif", color: "rgba(201,168,76,0.65)" },
        sectionHeader: { font: "600 7px 'Cinzel', serif", color: "rgba(201,168,76,0.38)" },
        deckLabel: { font: "600 8px 'Cinzel', serif", color: "rgba(201,168,76,0.55)" },
        deckCount: { font: "700 9px 'Cinzel Decorative', serif", color: "rgba(201,168,76,0.4)" },
        cardQty: { font: "700 12px 'Cinzel Decorative', serif", color: "#C9A84C" },
        cardName: { font: "400 13px 'Crimson Pro', serif", color: "#C8B898" },
        footer: { font: "600 8px 'Cinzel', serif", color: "rgba(201,168,76,0.4)" },
        footerCenter: { font: "700 9px 'Cinzel Decorative', serif", color: "rgba(201,168,76,0.5)" },
        trophyLabel: { font: "600 7.5px 'Cinzel', serif", color: "#C9A84C" },
      },
      layout: {
        canvas: { width: 900, height: 560 },
        header: { height: 68 },
        footer: { height: 36 },
        photo: { width: 310, filter: "contrast(1.05) saturate(0.88)" },
        deck: { lineHeight: 17, qtyOffset: 16, nameOffset: 22 },
        name: { offsetFromBottom: 55, lineSpacing: 26 },
      },
      decorations: {
        headerIcon: "\u2694",  // swords
        trophyIcon: "\uD83C\uDFC6", // trophy
        trophySize: "40px serif",
        borderColor: "rgba(201,168,76,0.35)",
        borderWidth: 1,
        cornerSize: 22,
        cornerColor: "rgba(201,168,76,0.5)",
        cornerWidth: 1.5,
        separatorColor: "rgba(201,168,76,0.15)",
        photoPlaceholder: "\uD83D\uDCF7 Foto del ganador",
        winnerLabel: "GANADOR",
      },
    },
    deckStructure: {
      sections: [
        { key: "maindeck", label: "MAZO PRINCIPAL", column: 0 },
        { key: "lands", label: "TIERRAS", column: 1, colorKey: "accent1" },
        { key: "sideboard", label: "SIDEBOARD", column: 1, colorKey: "accent2", separated: true },
      ],
      totalDisplay: "60 / 15",
      parseFormat: "mtg",
    },
    defaultData: {
      firstName: "Carlos",
      lastName: "Iglesias",
      archetype: "BLACK PONZA",
      event: "ONPLAY GAMES",
      fecha: "FECHA 1",
      date: "JUEVES 5 DE MARZO 2026",
      season: "CIRCUITO PREMODERN CHILE \u00b7 SEASON I",
      leagueTitle: "PREMODERN LEAGUE",
      website: "premodernchile.cl",
      maindeck: "4 Dark Ritual\n4 Duress\n4 Choking Sands\n4 Icequake\n4 Rancid Earth\n4 Tangle Wire\n3 Phyrexian Arena\n3 Thrashing Wumpus\n2 Powder Keg\n2 Innocent Blood\n1 Bane of the Living\n1 Braids, Cabal Minion\n1 Contagion\n1 Diabolic Edict",
      lands: "12 Swamp\n4 Rishadan Port\n3 Wasteland\n2 Mishra's Factory",
      sideboard: "3 Engineered Plague\n2 Massacre\n2 Perish\n2 Tormod's Crypt\n1 Defense Grid\n1 Diabolic Edict\n1 Nevinyrral's Disk\n1 Phyrexian Furnace\n1 Planar Void\n1 Wasteland",
    },
  },

  // ════════════════════════════════════════════════════════════════
  // ONE PIECE TCG
  // ════════════════════════════════════════════════════════════════
  "onepiece": {
    id: "onepiece",
    name: "One Piece TCG",
    slug: "onepiece",
    formats: ["Standard", "Flagship"],
    fonts: {
      url: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap",
      families: ["Bebas Neue", "Oswald", "Barlow Condensed"],
    },
    theme: {
      colors: {
        primary: "#D42B2B",
        primaryLight: "#FF4D4D",
        primaryDim: "rgba(212,43,43,0.6)",
        secondary: "#1A3A5C",
        bg: "#0C1929",
        bgOverlay: "rgba(12,25,41,0.9)",
        text: "#E8DCC8",
        textWhite: "#FFFFFF",
        accent1: "#2E86AB",   // blue — characters
        accent2: "#F0A500",   // gold — events
        glowCenter: "rgba(212,43,43,0.1)",
        glowSecondary: "rgba(30,58,92,0.15)",
      },
      typography: {
        season: { font: "600 10px 'Oswald', sans-serif", color: "rgba(240,165,0,0.7)" },
        leagueTitle: { font: "700 20px 'Bebas Neue', sans-serif", color: "#D42B2B" },
        eventDate: { font: "600 9px 'Oswald', sans-serif", color: "rgba(240,165,0,0.5)" },
        winnerLabel: { font: "700 9px 'Oswald', sans-serif", color: "#F0A500" },
        winnerName: { font: "700 26px 'Bebas Neue', sans-serif", color: "#FFFFFF" },
        archetype: { font: "600 9px 'Oswald', sans-serif", color: "rgba(240,165,0,0.7)" },
        sectionHeader: { font: "700 8px 'Oswald', sans-serif", color: "rgba(212,43,43,0.6)" },
        deckLabel: { font: "700 9px 'Oswald', sans-serif", color: "rgba(212,43,43,0.7)" },
        deckCount: { font: "700 10px 'Bebas Neue', sans-serif", color: "rgba(212,43,43,0.5)" },
        cardQty: { font: "700 13px 'Bebas Neue', sans-serif", color: "#D42B2B" },
        cardName: { font: "400 12px 'Barlow Condensed', sans-serif", color: "#E8DCC8" },
        footer: { font: "600 8px 'Oswald', sans-serif", color: "rgba(240,165,0,0.5)" },
        footerCenter: { font: "700 10px 'Bebas Neue', sans-serif", color: "rgba(212,43,43,0.6)" },
        trophyLabel: { font: "700 8px 'Oswald', sans-serif", color: "#F0A500" },
      },
      layout: {
        canvas: { width: 900, height: 560 },
        header: { height: 72 },
        footer: { height: 40 },
        photo: { width: 320, filter: "contrast(1.1) saturate(1.15)" },
        deck: { lineHeight: 16, qtyOffset: 16, nameOffset: 22 },
        name: { offsetFromBottom: 60, lineSpacing: 28 },
      },
      decorations: {
        headerIcon: "\u2693",  // anchor
        trophyIcon: "\uD83C\uDFF4\u200D\u2620\uFE0F", // pirate flag
        trophySize: "36px sans-serif",
        borderColor: "rgba(212,43,43,0.4)",
        borderWidth: 2,
        cornerSize: 26,
        cornerColor: "#D42B2B",
        cornerWidth: 2.5,
        separatorColor: "rgba(212,43,43,0.2)",
        photoPlaceholder: "\uD83D\uDCF7 Foto del ganador",
        winnerLabel: "WANTED",
        // One Piece specific: inner "wanted poster" frame
        wantedFrame: true,
      },
    },
    deckStructure: {
      sections: [
        { key: "leader", label: "LEADER", column: 0, maxCards: 1 },
        { key: "characters", label: "CHARACTERS", column: 0, colorKey: "accent1" },
        { key: "events", label: "EVENTS", column: 1, colorKey: "accent2" },
        { key: "stages", label: "STAGES", column: 1, separated: true },
      ],
      totalDisplay: "50 + 1",
      parseFormat: "onepiece",
    },
    defaultData: {
      firstName: "Monkey D.",
      lastName: "Luffy",
      archetype: "RED/GREEN LUFFY",
      event: "TREASURE CUP",
      fecha: "RONDA 1",
      date: "SABADO 8 DE MARZO 2026",
      season: "ONE PIECE TCG CHILE \u00b7 SEASON II",
      leagueTitle: "ONE PIECE LEAGUE",
      website: "opcard.cl",
      leader: "1 Monkey.D.Luffy (OP01-003) L",
      characters: "4 Roronoa Zoro (OP01-025)\n4 Nami (OP01-016)\n4 Sanji (OP01-013)\n3 Tony Tony.Chopper (OP01-015)\n3 Nico Robin (OP01-017)\n3 Usopp (OP01-022)\n2 Brook (OP01-008)\n2 Franky (OP01-021)\n2 Jinbe (OP01-030)",
      events: "4 Gum-Gum Jet Pistol (OP01-026)\n4 Diable Jambe (OP01-028)\n3 Radical Beam (OP01-029)\n2 Oni Giri (OP01-027)",
      stages: "4 Thousand Sunny (OP01-024)\n2 Baratie (OP01-047)",
    },
  },

  // ════════════════════════════════════════════════════════════════
  // POKEMON TCG
  // ════════════════════════════════════════════════════════════════
  "pokemon": {
    id: "pokemon",
    name: "Pokemon TCG",
    slug: "pokemon",
    formats: ["Standard", "Expanded", "GLC"],
    fonts: {
      url: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap",
      families: ["Outfit", "Space Grotesk", "Inter"],
    },
    theme: {
      colors: {
        primary: "#FFCB05",
        primaryLight: "#FFE066",
        primaryDim: "rgba(255,203,5,0.6)",
        secondary: "#3B4CCA",
        bg: "#1A1A2E",
        bgOverlay: "rgba(26,26,46,0.9)",
        text: "#E0E0F0",
        textWhite: "#FFFFFF",
        accent1: "#FF5350",   // red — pokemon
        accent2: "#3B82F6",   // blue — trainers
        glowCenter: "rgba(255,203,5,0.08)",
        glowSecondary: "rgba(59,76,202,0.1)",
      },
      typography: {
        season: { font: "600 10px 'Space Grotesk', sans-serif", color: "rgba(255,203,5,0.6)" },
        leagueTitle: { font: "800 18px 'Outfit', sans-serif", color: "#FFCB05" },
        eventDate: { font: "500 9px 'Space Grotesk', sans-serif", color: "rgba(255,203,5,0.5)" },
        winnerLabel: { font: "700 9px 'Space Grotesk', sans-serif", color: "#FFCB05" },
        winnerName: { font: "800 24px 'Outfit', sans-serif", color: "#FFFFFF" },
        archetype: { font: "600 9px 'Space Grotesk', sans-serif", color: "rgba(255,203,5,0.65)" },
        sectionHeader: { font: "700 7px 'Space Grotesk', sans-serif", color: "rgba(255,203,5,0.45)" },
        deckLabel: { font: "700 9px 'Space Grotesk', sans-serif", color: "rgba(255,203,5,0.6)" },
        deckCount: { font: "700 10px 'Outfit', sans-serif", color: "rgba(255,203,5,0.4)" },
        cardQty: { font: "700 12px 'Outfit', sans-serif", color: "#FFCB05" },
        cardName: { font: "400 12px 'Inter', sans-serif", color: "#E0E0F0" },
        footer: { font: "500 8px 'Space Grotesk', sans-serif", color: "rgba(255,203,5,0.4)" },
        footerCenter: { font: "700 10px 'Outfit', sans-serif", color: "rgba(255,203,5,0.5)" },
        trophyLabel: { font: "700 8px 'Space Grotesk', sans-serif", color: "#FFCB05" },
      },
      layout: {
        canvas: { width: 900, height: 560 },
        header: { height: 70 },
        footer: { height: 38 },
        photo: { width: 300, filter: "contrast(1.08) saturate(1.1) brightness(1.02)" },
        deck: { lineHeight: 16, qtyOffset: 16, nameOffset: 22 },
        name: { offsetFromBottom: 55, lineSpacing: 26 },
      },
      decorations: {
        headerIcon: "\u26A1",  // lightning bolt
        trophyIcon: "\uD83C\uDFC5", // medal
        trophySize: "38px sans-serif",
        borderColor: "rgba(255,203,5,0.3)",
        borderWidth: 1.5,
        cornerSize: 20,
        cornerColor: "rgba(255,203,5,0.5)",
        cornerWidth: 2,
        separatorColor: "rgba(255,203,5,0.15)",
        photoPlaceholder: "\uD83D\uDCF7 Foto del entrenador",
        winnerLabel: "CAMPEON",
        pokeball: true,
      },
    },
    deckStructure: {
      sections: [
        { key: "pokemon", label: "POKEMON", column: 0, colorKey: "accent1" },
        { key: "trainers", label: "TRAINERS", column: 1, colorKey: "accent2" },
        { key: "energy", label: "ENERGY", column: 1, separated: true },
      ],
      totalDisplay: "60",
      parseFormat: "pokemon",
    },
    defaultData: {
      firstName: "Ash",
      lastName: "Ketchum",
      archetype: "CHARIZARD EX",
      event: "LIGA POKEMON",
      fecha: "RONDA 1",
      date: "DOMINGO 9 DE MARZO 2026",
      season: "POKEMON TCG CHILE \u00b7 SEASON I",
      leagueTitle: "POKEMON LEAGUE",
      website: "pokemonchile.cl",
      pokemon: "3 Charizard ex (OBF 125)\n2 Charmeleon (OBF 026)\n3 Charmander (OBF 025)\n2 Pidgeot ex (OBF 164)\n2 Pidgey (OBF 162)\n1 Pidgeotto (OBF 163)\n1 Manaphy (BRS 041)\n1 Lumineon V (BRS 040)",
      trainers: "4 Rare Candy (SVI 191)\n4 Ultra Ball (SVI 196)\n3 Nest Ball (SVI 181)\n2 Boss's Orders (PAL 172)\n2 Professor's Research (SVI 189)\n3 Iono (PAL 185)\n2 Arven (SVI 166)\n1 Switch (SVI 194)\n1 Forest Seal Stone (SIT 156)\n1 Lost Vacuum (CRZ 135)\n1 Super Rod (PAL 188)",
      energy: "3 Fire Energy\n3 Reversal Energy (PAL 192)",
    },
  },
};

module.exports = games;
