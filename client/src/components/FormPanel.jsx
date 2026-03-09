/**
 * FormPanel — Panel de formulario con pestanas (Ganador, Evento, Mazo, Posicion)
 *
 * Se adapta dinamicamente al juego seleccionado:
 * - Los campos del mazo cambian segun deckStructure
 * - Los colores del panel siguen el tema activo
 * - La pestana "Posicion" permite ajustar posiciones del nombre/arquetipo
 */

import PositionEditor from "./PositionEditor.jsx";

export default function FormPanel({
  data, set, activeTab, setActiveTab,
  photoUrl, handlePhoto, handleDrop, download, downloadInstagram,
  themeColors, deckStructure, gameSlug, layout, onPositionsChange,
}) {
  const tabs = ["info", "evento", "mazo", "posicion"];
  const tabLabels = { info: "Ganador", evento: "Evento", mazo: "Mazo", posicion: "Posicion" };

  return (
    <div style={{
      background: withAlpha(themeColors.bg, 0.95),
      border: `1px solid ${withAlpha(themeColors.primary, 0.2)}`,
      width: 340, minWidth: 300, flexShrink: 0,
      display: "flex", flexDirection: "column",
      transition: "border-color 0.4s ease",
    }}>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${withAlpha(themeColors.primary, 0.15)}` }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            flex: 1, padding: "10px 0",
            background: activeTab === t ? withAlpha(themeColors.primary, 0.08) : "transparent",
            border: "none",
            borderBottom: activeTab === t
              ? `2px solid ${themeColors.primary}`
              : "2px solid transparent",
            color: activeTab === t ? themeColors.primary : withAlpha(themeColors.primary, 0.4),
            fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
            cursor: "pointer", transition: "all .2s",
          }}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>

        {/* GANADOR TAB */}
        {activeTab === "info" && <>
          {/* Photo drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            style={{
              border: `1px dashed ${withAlpha(themeColors.primary, 0.3)}`,
              borderRadius: 2,
              padding: photoUrl ? 0 : "20px",
              textAlign: "center",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              minHeight: photoUrl ? 140 : "auto",
            }}
            onClick={() => document.getElementById("photoInput").click()}
          >
            {photoUrl
              ? <img src={photoUrl} alt="preview" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
              : <>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                <div style={{ color: withAlpha(themeColors.primary, 0.5), fontSize: 11, letterSpacing: 1 }}>
                  Arrastra o haz click
                </div>
                <div style={{ color: withAlpha(themeColors.primary, 0.3), fontSize: 10, marginTop: 4 }}>JPG, PNG, WEBP</div>
              </>
            }
            {photoUrl && (
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: withAlpha(themeColors.bg, 0.7),
                padding: "5px",
                color: withAlpha(themeColors.primary, 0.6),
                fontSize: 9, textAlign: "center", letterSpacing: 1,
              }}>
                CLICK PARA CAMBIAR
              </div>
            )}
          </div>
          <input id="photoInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />

          <Field label="Nombre" value={data.firstName || ""} onChange={set("firstName")} colors={themeColors} />
          <Field label="Apellido" value={data.lastName || ""} onChange={set("lastName")} colors={themeColors} />
          <Field label="Arquetipo / Mazo" value={data.archetype || ""} onChange={set("archetype")} colors={themeColors} />
        </>}

        {/* EVENTO TAB */}
        {activeTab === "evento" && <>
          <Field label="Titulo liga" value={data.leagueTitle || ""} onChange={set("leagueTitle")} colors={themeColors} />
          <Field label="Circuito / Season" value={data.season || ""} onChange={set("season")} colors={themeColors} />
          <Field label="Local" value={data.event || ""} onChange={set("event")} colors={themeColors} />
          <Field label="Fecha texto" value={data.date || ""} onChange={set("date")} colors={themeColors} />
          <Field label="Fecha etiqueta" value={data.fecha || ""} onChange={set("fecha")} placeholder="FECHA 1" colors={themeColors} />
          <Field label="Sitio web" value={data.website || ""} onChange={set("website")} colors={themeColors} />
        </>}

        {/* MAZO TAB — dynamic sections based on deckStructure */}
        {activeTab === "mazo" && deckStructure && <>
          {deckStructure.sections.map(section => (
            <TextArea
              key={section.key}
              label={section.label}
              value={data[section.key] || ""}
              onChange={set(section.key)}
              rows={section.maxCards === 1 ? 2 : section.column === 0 ? 12 : 8}
              hint={getHint(gameSlug, section.key)}
              colors={themeColors}
            />
          ))}
        </>}

        {/* POSICION TAB — editor de posicionamiento del nombre y arquetipo */}
        {activeTab === "posicion" && (
          <PositionEditor
            positions={data.positions || {}}
            onChange={onPositionsChange}
            themeColors={themeColors}
            layout={layout}
          />
        )}
      </div>

      {/* Download buttons */}
      <div style={{ margin: "0 20px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={download} style={{
          padding: "12px 0",
          background: `linear-gradient(135deg, ${withAlpha(themeColors.primary, 0.7)}, ${themeColors.primary})`,
          border: "none",
          color: themeColors.bg,
          fontWeight: 700, fontSize: 11,
          letterSpacing: 3, textTransform: "uppercase",
          cursor: "pointer",
          transition: "filter .2s",
        }}
          onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
        >
          Descargar PNG
        </button>
        <button onClick={downloadInstagram} style={{
          padding: "10px 0",
          background: `linear-gradient(135deg, ${withAlpha(themeColors.primary, 0.15)}, ${withAlpha(themeColors.primary, 0.25)})`,
          border: `1px solid ${withAlpha(themeColors.primary, 0.35)}`,
          color: themeColors.primary,
          fontWeight: 700, fontSize: 10,
          letterSpacing: 2, textTransform: "uppercase",
          cursor: "pointer",
          transition: "all .2s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
          onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.2)"; e.currentTarget.style.borderColor = withAlpha(themeColors.primary, 0.6); }}
          onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.borderColor = withAlpha(themeColors.primary, 0.35); }}
        >
          <span style={{ fontSize: 13 }}>&#9638;</span> Instagram 1080x1080
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, colors }) {
  return (
    <div>
      <label style={{
        display: "block",
        color: withAlpha(colors.primary, 0.5),
        fontSize: 9, letterSpacing: 2, marginBottom: 5, textTransform: "uppercase",
      }}>
        {label}
      </label>
      <input value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: "100%",
          background: withAlpha(colors.primary, 0.05),
          border: `1px solid ${withAlpha(colors.primary, 0.15)}`,
          color: colors.text,
          padding: "7px 10px", fontSize: 13,
          fontFamily: "system-ui, sans-serif",
          outline: "none", boxSizing: "border-box",
          transition: "border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = withAlpha(colors.primary, 0.4)}
        onBlur={e => e.target.style.borderColor = withAlpha(colors.primary, 0.15)}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows, hint, colors }) {
  return (
    <div>
      <label style={{
        display: "block",
        color: withAlpha(colors.primary, 0.5),
        fontSize: 9, letterSpacing: 2, marginBottom: 5, textTransform: "uppercase",
      }}>
        {label}
      </label>
      {hint && <div style={{ color: withAlpha(colors.primary, 0.2), fontSize: 9, marginBottom: 4, fontFamily: "monospace" }}>ej: {hint}</div>}
      <textarea value={value} onChange={onChange} rows={rows}
        style={{
          width: "100%",
          background: withAlpha(colors.primary, 0.05),
          border: `1px solid ${withAlpha(colors.primary, 0.15)}`,
          color: colors.text,
          padding: "7px 10px", fontSize: 12,
          fontFamily: "monospace",
          outline: "none", resize: "vertical",
          boxSizing: "border-box", lineHeight: 1.6,
          transition: "border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = withAlpha(colors.primary, 0.4)}
        onBlur={e => e.target.style.borderColor = withAlpha(colors.primary, 0.15)}
      />
    </div>
  );
}

function getHint(gameSlug, sectionKey) {
  const hints = {
    "mtg-premodern": { maindeck: "4 Dark Ritual", lands: "4 Wasteland", sideboard: "2 Tormod's Crypt" },
    "onepiece": { leader: "1 Monkey.D.Luffy (OP01-003) L", characters: "4 Roronoa Zoro (OP01-025)", events: "4 Gum-Gum Jet Pistol (OP01-026)", stages: "4 Thousand Sunny (OP01-024)" },
    "pokemon": { pokemon: "3 Charizard ex (OBF 125)", trainers: "4 Rare Candy (SVI 191)", energy: "3 Fire Energy" },
  };
  return hints[gameSlug]?.[sectionKey] || null;
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
