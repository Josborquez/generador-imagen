/**
 * ThemeSwitcher — Selector de juego TCG
 *
 * Muestra botones para cada juego disponible.
 * Al seleccionar uno, cambia el tema global de la aplicacion
 * (colores, fuentes, layout del canvas, estructura del mazo).
 */

const GAME_ICONS = {
  "mtg-premodern": "\u2694\uFE0F",
  "onepiece": "\u2693",
  "pokemon": "\u26A1",
};

const GAME_SHORT_NAMES = {
  "mtg-premodern": "MTG",
  "onepiece": "One Piece",
  "pokemon": "Pokemon",
};

export default function ThemeSwitcher({ games, currentSlug, onSelect, themeColors }) {
  if (!games || games.length === 0) return null;

  return (
    <div style={{
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      justifyContent: "center",
    }}>
      {games.map(game => {
        const isActive = game.slug === currentSlug;
        const icon = GAME_ICONS[game.slug] || "\uD83C\uDFB4";
        const shortName = GAME_SHORT_NAMES[game.slug] || game.name;

        return (
          <button
            key={game.slug}
            onClick={() => onSelect(game.slug)}
            style={{
              padding: "8px 20px",
              background: isActive
                ? `linear-gradient(135deg, ${withAlpha(themeColors.primary, 0.2)}, ${withAlpha(themeColors.primary, 0.08)})`
                : "rgba(255,255,255,0.03)",
              border: isActive
                ? `1.5px solid ${withAlpha(themeColors.primary, 0.5)}`
                : "1px solid rgba(255,255,255,0.08)",
              color: isActive ? themeColors.primary : "rgba(255,255,255,0.4)",
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontWeight: isActive ? 700 : 400,
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.borderColor = withAlpha(themeColors.primary, 0.3);
                e.currentTarget.style.color = withAlpha(themeColors.primary, 0.7);
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              }
            }}
          >
            {icon} {shortName}
          </button>
        );
      })}
    </div>
  );
}

function withAlpha(color, alpha) {
  if (!color) return "transparent";
  if (color.startsWith("rgba")) return color.replace(/[\d.]+\)$/, `${alpha})`);
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color;
}
