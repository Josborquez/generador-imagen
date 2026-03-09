import { useState, useRef, useEffect, useCallback } from "react";
import { renderCanvas } from "../utils/renderCanvas.js";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import FormPanel from "./FormPanel.jsx";

export default function App() {
  const [gameConfig, setGameConfig] = useState(null);
  const [gameSlug, setGameSlug] = useState("mtg-premodern");
  const [games, setGames] = useState([]);
  const [data, setData] = useState({});
  const [photoImg, setPhotoImg] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  // Fetch list of available games
  useEffect(() => {
    fetch("/api/games")
      .then(r => r.json())
      .then(setGames)
      .catch(() => setGames([]));
  }, []);

  // Fetch full config when game changes
  useEffect(() => {
    setLoading(true);
    setFontsReady(false);
    fetch(`/api/games/${gameSlug}`)
      .then(r => r.json())
      .then(config => {
        setGameConfig(config);
        setData(config.defaultData);
        loadFonts(config.fonts);
      })
      .catch(err => console.error("Failed to load game config:", err));
  }, [gameSlug]);

  function loadFonts(fontsConfig) {
    // Remove old font link if exists
    const oldLink = document.getElementById("game-fonts");
    if (oldLink) oldLink.remove();

    const link = document.createElement("link");
    link.id = "game-fonts";
    link.href = fontsConfig.url;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    document.fonts.ready.then(() => {
      setFontsReady(true);
      setLoading(false);
    });
  }

  // Re-render canvas
  useEffect(() => {
    if (!fontsReady || !canvasRef.current || !gameConfig) return;
    renderCanvas(canvasRef.current, data, photoImg, gameConfig);
  }, [data, photoImg, fontsReady, gameConfig]);

  const set = (k) => (e) => setData(d => ({ ...d, [k]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    const img = new Image();
    img.onload = () => setPhotoImg(img);
    img.src = url;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    const img = new Image();
    img.onload = () => setPhotoImg(img);
    img.src = url;
  }, []);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    const slug = gameSlug.replace(/[^a-z0-9]/g, "-");
    const name = `ganador-${slug}-${data.lastName.toLowerCase().replace(/\s/g, "-")}-${data.fecha.toLowerCase().replace(/\s/g, "-")}.png`;
    a.download = name;
    a.click();
  };

  const downloadInstagram = () => {
    if (!canvasRef.current || !gameConfig) return;
    const src = canvasRef.current;
    const colors = gameConfig.theme.colors;
    const IG = 1080;
    const igCanvas = document.createElement("canvas");
    igCanvas.width = IG;
    igCanvas.height = IG;
    const igCtx = igCanvas.getContext("2d");

    igCtx.fillStyle = colors.bg;
    igCtx.fillRect(0, 0, IG, IG);

    const glow = igCtx.createRadialGradient(IG / 2, IG / 2, 0, IG / 2, IG / 2, IG * 0.6);
    glow.addColorStop(0, withAlpha(colors.primary, 0.06));
    glow.addColorStop(1, "transparent");
    igCtx.fillStyle = glow;
    igCtx.fillRect(0, 0, IG, IG);

    const scale = IG / src.width;
    const scaledH = src.height * scale;
    const offsetY = (IG - scaledH) / 2;

    igCtx.drawImage(src, 0, offsetY, IG, scaledH);

    const topFade = igCtx.createLinearGradient(0, offsetY, 0, offsetY + 40);
    topFade.addColorStop(0, colors.bg);
    topFade.addColorStop(1, "transparent");
    igCtx.fillStyle = topFade;
    igCtx.fillRect(0, 0, IG, offsetY + 40);

    const btmFade = igCtx.createLinearGradient(0, offsetY + scaledH - 40, 0, offsetY + scaledH);
    btmFade.addColorStop(0, "transparent");
    btmFade.addColorStop(1, colors.bg);
    igCtx.fillStyle = btmFade;
    igCtx.fillRect(0, offsetY + scaledH - 40, IG, IG - (offsetY + scaledH - 40));

    igCtx.strokeStyle = withAlpha(colors.primary, 0.25);
    igCtx.lineWidth = 2;
    igCtx.strokeRect(20, 20, IG - 40, IG - 40);

    const cs = 30;
    igCtx.strokeStyle = withAlpha(colors.primary, 0.4);
    igCtx.lineWidth = 2;
    [[28, 28, cs, cs], [IG - 28, 28, -cs, cs], [28, IG - 28, cs, -cs], [IG - 28, IG - 28, -cs, -cs]].forEach(([x, y, sx, sy]) => {
      igCtx.beginPath(); igCtx.moveTo(x, y + sy); igCtx.lineTo(x, y); igCtx.lineTo(x + sx, y); igCtx.stroke();
    });

    igCtx.textAlign = "center";
    igCtx.fillStyle = withAlpha(colors.primary, 0.4);
    igCtx.font = "600 11px 'Cinzel', sans-serif";
    igCtx.fillText(data.season, IG / 2, offsetY - 16);

    igCtx.fillStyle = withAlpha(colors.primary, 0.3);
    igCtx.font = "600 10px 'Cinzel', sans-serif";
    igCtx.fillText(data.website, IG / 2, offsetY + scaledH + 28);

    const a = document.createElement("a");
    a.href = igCanvas.toDataURL("image/png");
    const slug = gameSlug.replace(/[^a-z0-9]/g, "-");
    const name = `ganador-ig-${slug}-${data.lastName.toLowerCase().replace(/\s/g, "-")}-${data.fecha.toLowerCase().replace(/\s/g, "-")}.png`;
    a.download = name;
    a.click();
  };

  const handleGameChange = (slug) => {
    setGameSlug(slug);
    setPhotoImg(null);
    setPhotoUrl(null);
    setActiveTab("info");
  };

  const themeColors = gameConfig?.theme?.colors || {
    primary: "#C9A84C",
    bg: "#0A0A0F",
    text: "#C8B898",
  };

  const canvasSize = gameConfig?.theme?.layout?.canvas || { width: 900, height: 560 };

  return (
    <div style={{
      background: themeColors.bg,
      minHeight: "100vh",
      fontFamily: "system-ui, sans-serif",
      color: themeColors.text,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "24px 16px 48px",
      gap: 24,
      transition: "background 0.4s ease",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{
          color: withAlpha(themeColors.primary, 0.5),
          fontSize: 10,
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 6,
        }}>
          TCG Winner Image Generator
        </div>
        <h1 style={{
          color: themeColors.primary,
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: 2,
          margin: 0,
          transition: "color 0.4s ease",
        }}>
          Generador de Ganadores
        </h1>
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher
        games={games}
        currentSlug={gameSlug}
        onSelect={handleGameChange}
        themeColors={themeColors}
      />

      {/* Main layout */}
      <div style={{
        display: "flex",
        gap: 28,
        width: "100%",
        maxWidth: 1200,
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        {/* Form Panel */}
        <FormPanel
          data={data}
          set={set}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          photoUrl={photoUrl}
          handlePhoto={handlePhoto}
          handleDrop={handleDrop}
          download={download}
          downloadInstagram={downloadInstagram}
          themeColors={themeColors}
          deckStructure={gameConfig?.deckStructure}
          gameSlug={gameSlug}
        />

        {/* Canvas Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div style={{
            color: withAlpha(themeColors.primary, 0.35),
            fontSize: 9,
            letterSpacing: 3,
          }}>
            PREVIEW — {canvasSize.width} x {canvasSize.height} px
          </div>
          <div style={{
            position: "relative",
            boxShadow: `0 0 60px ${withAlpha(themeColors.primary, 0.08)}, 0 4px 40px rgba(0,0,0,0.8)`,
          }}>
            {(loading || !fontsReady) && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 2,
                background: withAlpha(themeColors.bg, 0.9),
                display: "flex",
                alignItems: "center", justifyContent: "center",
                color: themeColors.primary,
                fontSize: 12, letterSpacing: 3,
              }}>
                Cargando...
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              style={{
                display: "block",
                maxWidth: "min(900px, calc(100vw - 380px))",
                height: "auto",
              }}
            />
          </div>
          <div style={{
            color: withAlpha(themeColors.primary, 0.2),
            fontSize: 9,
            letterSpacing: 2,
          }}>
            {data.website || ""}
          </div>
        </div>
      </div>
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
