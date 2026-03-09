/**
 * FormPanel — Panel de formulario con pestanas (Ganador, Evento, Mazo)
 *
 * Se adapta dinamicamente al juego seleccionado:
 * - Los campos del mazo cambian segun deckStructure
 * - Los colores del panel siguen el tema activo
 */

export default function FormPanel({
  data, set, activeTab, setActiveTab,
  photoUrl, handlePhoto, handleDrop, download, downloadInstagram,
  themeColors, deckStructure, gameSlug, layoutConfig,
  logoImg, onLogoUpload,
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

        {/* POSICION TAB — editor manual de posicionamiento */}
        {activeTab === "posicion" && <>
          <PositionEditor data={data} set={set} colors={themeColors} layoutConfig={layoutConfig} logoImg={logoImg} onLogoUpload={onLogoUpload} />
        </>}
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

/**
 * PositionEditor — Editor visual para ajustar posicionamiento
 * del nombre del ganador y el nombre del decklist (arquetipo).
 *
 * Los valores se guardan en data._pos y son leidos por renderCanvas
 * como sobreescrituras de los valores por defecto del tema.
 *
 * Controles disponibles:
 *   - Offset desde abajo: distancia vertical del bloque completo desde el footer
 *   - Desplazamiento X: mueve el bloque horizontalmente (negativo = izquierda)
 *   - Espacio entre lineas: separacion entre firstName y lastName
 *   - Offset etiqueta Y: posicion vertical de "GANADOR"/"WANTED"/"CAMPEON"
 *   - Offset nombre Y: posicion vertical de la primera linea del nombre
 *   - Offset arquetipo Y: posicion vertical del nombre del mazo
 */
function PositionEditor({ data, set, colors, layoutConfig, logoImg, onLogoUpload }) {
  const pos = data._pos || {};
  const defaults = {
    nameOffsetFromBottom: layoutConfig?.name?.offsetFromBottom ?? 55,
    nameXShift: -30,
    nameLineSpacing: layoutConfig?.name?.lineSpacing ?? 26,
    labelOffsetY: -4,
    firstNameOffsetY: 12,
    archetypeOffsetY: 55,
    lineLeftLen: 40,
    lineRightLen: 50,
    lineLeftX: 18,
    lineRightX: 172,
    nameFontSize: 23,
    nameBold: false,
    logoX: 10,
    logoY: 10,
    logoSize: 60,
    logoCorner: "top-left",
  };

  const update = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : parseFloat(e.target.value);
    set("_pos")({ target: { value: { ...pos, [key]: val } } });
  };

  const reset = () => {
    set("_pos")({ target: { value: {} } });
  };

  const handleLogoFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onLogoUpload(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{
        color: withAlpha(colors.primary, 0.4),
        fontSize: 9, letterSpacing: 1, textAlign: "center",
        borderBottom: `1px solid ${withAlpha(colors.primary, 0.1)}`,
        paddingBottom: 8,
      }}>
        POSICION DEL NOMBRE DEL GANADOR
      </div>

      <SliderWithInput
        label="Offset desde abajo"
        value={pos.nameOffsetFromBottom ?? defaults.nameOffsetFromBottom}
        min={0} max={200} step={1}
        onChange={update("nameOffsetFromBottom")}
        colors={colors}
        hint="Distancia vertical desde el footer"
      />
      <SliderWithInput
        label="Desplazamiento X"
        value={pos.nameXShift ?? defaults.nameXShift}
        min={-150} max={150} step={1}
        onChange={update("nameXShift")}
        colors={colors}
        hint="Negativo = izquierda, Positivo = derecha"
      />
      <SliderWithInput
        label="Espacio entre lineas"
        value={pos.nameLineSpacing ?? defaults.nameLineSpacing}
        min={10} max={60} step={1}
        onChange={update("nameLineSpacing")}
        colors={colors}
        hint="Separacion entre nombre y apellido"
      />

      <div style={{
        color: withAlpha(colors.primary, 0.4),
        fontSize: 9, letterSpacing: 1, textAlign: "center",
        borderBottom: `1px solid ${withAlpha(colors.primary, 0.1)}`,
        paddingBottom: 8, marginTop: 4,
      }}>
        OFFSETS VERTICALES INDIVIDUALES
      </div>

      <SliderWithInput
        label='Offset etiqueta Y ("GANADOR")'
        value={pos.labelOffsetY ?? defaults.labelOffsetY}
        min={-40} max={40} step={1}
        onChange={update("labelOffsetY")}
        colors={colors}
        hint="Posicion de la etiqueta respecto al bloque"
      />
      <SliderWithInput
        label="Offset nombre Y"
        value={pos.firstNameOffsetY ?? defaults.firstNameOffsetY}
        min={-20} max={60} step={1}
        onChange={update("firstNameOffsetY")}
        colors={colors}
        hint="Posicion de la primera linea del nombre"
      />
      <SliderWithInput
        label="Offset arquetipo Y"
        value={pos.archetypeOffsetY ?? defaults.archetypeOffsetY}
        min={20} max={120} step={1}
        onChange={update("archetypeOffsetY")}
        colors={colors}
        hint="Posicion del nombre del mazo"
      />

      {/* LINEAS DECORATIVAS */}
      <div style={{
        color: withAlpha(colors.primary, 0.4),
        fontSize: 9, letterSpacing: 1, textAlign: "center",
        borderBottom: `1px solid ${withAlpha(colors.primary, 0.1)}`,
        paddingBottom: 8, marginTop: 4,
      }}>
        LINEAS DECORATIVAS
      </div>

      <SliderWithInput
        label="Linea izq. — inicio X"
        value={pos.lineLeftX ?? defaults.lineLeftX}
        min={0} max={200} step={1}
        onChange={update("lineLeftX")}
        colors={colors}
      />
      <SliderWithInput
        label="Linea izq. — largo"
        value={pos.lineLeftLen ?? defaults.lineLeftLen}
        min={0} max={200} step={1}
        onChange={update("lineLeftLen")}
        colors={colors}
      />
      <SliderWithInput
        label="Linea der. — inicio X"
        value={pos.lineRightX ?? defaults.lineRightX}
        min={0} max={400} step={1}
        onChange={update("lineRightX")}
        colors={colors}
      />
      <SliderWithInput
        label="Linea der. — largo"
        value={pos.lineRightLen ?? defaults.lineRightLen}
        min={0} max={200} step={1}
        onChange={update("lineRightLen")}
        colors={colors}
      />

      {/* TIPOGRAFIA */}
      <div style={{
        color: withAlpha(colors.primary, 0.4),
        fontSize: 9, letterSpacing: 1, textAlign: "center",
        borderBottom: `1px solid ${withAlpha(colors.primary, 0.1)}`,
        paddingBottom: 8, marginTop: 4,
      }}>
        TIPOGRAFIA DEL NOMBRE
      </div>

      <SliderWithInput
        label="Tamano de fuente"
        value={pos.nameFontSize ?? defaults.nameFontSize}
        min={10} max={60} step={1}
        onChange={update("nameFontSize")}
        colors={colors}
        hint="Tamano en pixeles del nombre del ganador"
      />

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{
          color: withAlpha(colors.primary, 0.5),
          fontSize: 9, letterSpacing: 1, textTransform: "uppercase", flex: 1,
        }}>
          Negrita
        </label>
        <input
          type="checkbox"
          checked={pos.nameBold ?? defaults.nameBold}
          onChange={update("nameBold")}
          style={{ accentColor: colors.primary, width: 16, height: 16 }}
        />
      </div>

      {/* LOGO DE TIENDA */}
      <div style={{
        color: withAlpha(colors.primary, 0.4),
        fontSize: 9, letterSpacing: 1, textAlign: "center",
        borderBottom: `1px solid ${withAlpha(colors.primary, 0.1)}`,
        paddingBottom: 8, marginTop: 4,
      }}>
        LOGO DE TIENDA
      </div>

      <div
        style={{
          border: `1px dashed ${withAlpha(colors.primary, 0.3)}`,
          borderRadius: 2,
          padding: logoImg ? 6 : "12px",
          textAlign: "center",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => document.getElementById("logoInput").click()}
      >
        {logoImg
          ? <img src={logoImg.src} alt="logo" style={{ maxWidth: "100%", maxHeight: 60, objectFit: "contain" }} />
          : <div style={{ color: withAlpha(colors.primary, 0.4), fontSize: 10, letterSpacing: 1 }}>
              Click para subir logo
            </div>
        }
      </div>
      <input id="logoInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoFile} />

      {logoImg && <>
        <div style={{ display: "flex", gap: 6 }}>
          {["top-left", "top-right", "bottom-left", "bottom-right"].map(corner => (
            <button
              key={corner}
              onClick={() => set("_pos")({ target: { value: { ...pos, logoCorner: corner } } })}
              style={{
                flex: 1, padding: "5px 2px",
                background: (pos.logoCorner ?? defaults.logoCorner) === corner
                  ? withAlpha(colors.primary, 0.2) : withAlpha(colors.primary, 0.05),
                border: (pos.logoCorner ?? defaults.logoCorner) === corner
                  ? `1px solid ${withAlpha(colors.primary, 0.5)}`
                  : `1px solid ${withAlpha(colors.primary, 0.15)}`,
                color: (pos.logoCorner ?? defaults.logoCorner) === corner
                  ? colors.primary : withAlpha(colors.primary, 0.4),
                fontSize: 7, letterSpacing: 0.5, textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {corner.replace("-", " ")}
            </button>
          ))}
        </div>
        <SliderWithInput
          label="Tamano del logo"
          value={pos.logoSize ?? defaults.logoSize}
          min={20} max={200} step={1}
          onChange={update("logoSize")}
          colors={colors}
        />
        <SliderWithInput
          label="Logo offset X"
          value={pos.logoX ?? defaults.logoX}
          min={0} max={200} step={1}
          onChange={update("logoX")}
          colors={colors}
        />
        <SliderWithInput
          label="Logo offset Y"
          value={pos.logoY ?? defaults.logoY}
          min={0} max={200} step={1}
          onChange={update("logoY")}
          colors={colors}
        />
      </>}

      <button onClick={reset} style={{
        marginTop: 8,
        padding: "8px 0",
        background: withAlpha(colors.primary, 0.08),
        border: `1px solid ${withAlpha(colors.primary, 0.2)}`,
        color: withAlpha(colors.primary, 0.6),
        fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
        cursor: "pointer",
      }}>
        Restaurar valores por defecto
      </button>
    </div>
  );
}

function SliderWithInput({ label, value, min, max, step, onChange, colors, hint }) {
  const handleNumberChange = (e) => {
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      onChange({ target: { value: String(Math.min(max, Math.max(min, num))), type: "range" } });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
        <label style={{
          color: withAlpha(colors.primary, 0.5),
          fontSize: 9, letterSpacing: 1, textTransform: "uppercase",
        }}>
          {label}
        </label>
        <input
          type="number"
          value={value}
          min={min} max={max} step={step}
          onChange={handleNumberChange}
          style={{
            width: 52,
            background: withAlpha(colors.primary, 0.08),
            border: `1px solid ${withAlpha(colors.primary, 0.25)}`,
            color: colors.primary,
            fontSize: 11, fontFamily: "monospace", fontWeight: 700,
            textAlign: "center", padding: "2px 4px",
            outline: "none", boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = withAlpha(colors.primary, 0.5)}
          onBlur={e => e.target.style.borderColor = withAlpha(colors.primary, 0.25)}
        />
      </div>
      {hint && <div style={{ color: withAlpha(colors.primary, 0.25), fontSize: 8, marginBottom: 3 }}>{hint}</div>}
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          accentColor: colors.primary,
          height: 4,
        }}
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
