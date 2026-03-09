/**
 * PositionEditor — Editor visual para ajustar posiciones del nombre del ganador,
 * label y arquetipo en el canvas.
 *
 * Cada slider controla un valor de posicion que se pasa a renderCanvas
 * a traves de data.positions.
 */

export default function PositionEditor({ positions, onChange, themeColors, layout }) {
  const nameLayout = layout?.name || { offsetFromBottom: 55, lineSpacing: 26 };
  const photoW = layout?.photo?.width || 310;

  // Valores actuales con defaults
  const vals = {
    nameOffsetFromBottom: positions.nameOffsetFromBottom ?? nameLayout.offsetFromBottom,
    nameCenterX: positions.nameCenterX ?? (photoW / 2 - 30),
    labelOffsetY: positions.labelOffsetY ?? -4,
    nameFirstY: positions.nameFirstY ?? 12,
    nameLineSpacing: positions.nameLineSpacing ?? nameLayout.lineSpacing,
    archetypeOffsetY: positions.archetypeOffsetY ?? 55,
    decoLineLeftStart: positions.decoLineLeftStart ?? 18,
    decoLineLeftEnd: positions.decoLineLeftEnd ?? 58,
    decoLineRightStart: positions.decoLineRightStart ?? 172,
    decoLineRightEnd: positions.decoLineRightEnd ?? 222,
  };

  const set = (key) => (e) => {
    onChange({ ...positions, [key]: Number(e.target.value) });
  };

  const reset = () => onChange({});

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 4,
      }}>
        <span style={{
          color: withAlpha(themeColors.primary, 0.6),
          fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
        }}>
          Posicionamiento
        </span>
        <button onClick={reset} style={{
          background: withAlpha(themeColors.primary, 0.1),
          border: `1px solid ${withAlpha(themeColors.primary, 0.2)}`,
          color: withAlpha(themeColors.primary, 0.6),
          fontSize: 8, letterSpacing: 1, padding: "3px 8px",
          cursor: "pointer", textTransform: "uppercase",
        }}>
          Reset
        </button>
      </div>

      <SectionLabel text="Bloque del nombre" colors={themeColors} />
      <Slider label="Distancia desde abajo" value={vals.nameOffsetFromBottom}
        min={0} max={200} onChange={set("nameOffsetFromBottom")} colors={themeColors} />
      <Slider label="Centro horizontal (X)" value={vals.nameCenterX}
        min={0} max={photoW} onChange={set("nameCenterX")} colors={themeColors} />

      <SectionLabel text="Label (GANADOR)" colors={themeColors} />
      <Slider label="Offset vertical label" value={vals.labelOffsetY}
        min={-40} max={40} onChange={set("labelOffsetY")} colors={themeColors} />

      <SectionLabel text="Nombre (firstName / lastName)" colors={themeColors} />
      <Slider label="Offset vertical nombre" value={vals.nameFirstY}
        min={-20} max={60} onChange={set("nameFirstY")} colors={themeColors} />
      <Slider label="Espacio entre lineas" value={vals.nameLineSpacing}
        min={10} max={50} onChange={set("nameLineSpacing")} colors={themeColors} />

      <SectionLabel text="Arquetipo / Decklist" colors={themeColors} />
      <Slider label="Offset vertical arquetipo" value={vals.archetypeOffsetY}
        min={20} max={100} onChange={set("archetypeOffsetY")} colors={themeColors} />

      <SectionLabel text="Lineas decorativas" colors={themeColors} />
      <Slider label="Linea izq. inicio" value={vals.decoLineLeftStart}
        min={0} max={100} onChange={set("decoLineLeftStart")} colors={themeColors} />
      <Slider label="Linea izq. fin" value={vals.decoLineLeftEnd}
        min={0} max={150} onChange={set("decoLineLeftEnd")} colors={themeColors} />
      <Slider label="Linea der. inicio" value={vals.decoLineRightStart}
        min={100} max={300} onChange={set("decoLineRightStart")} colors={themeColors} />
      <Slider label="Linea der. fin" value={vals.decoLineRightEnd}
        min={100} max={350} onChange={set("decoLineRightEnd")} colors={themeColors} />
    </div>
  );
}

function SectionLabel({ text, colors }) {
  return (
    <div style={{
      color: withAlpha(colors.primary, 0.4),
      fontSize: 8, letterSpacing: 2, textTransform: "uppercase",
      borderBottom: `1px solid ${withAlpha(colors.primary, 0.1)}`,
      paddingBottom: 3, marginTop: 4,
    }}>
      {text}
    </div>
  );
}

function Slider({ label, value, min, max, onChange, colors }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{
          color: withAlpha(colors.primary, 0.5),
          fontSize: 9, letterSpacing: 1,
        }}>
          {label}
        </label>
        <input
          type="number"
          value={value}
          onChange={onChange}
          style={{
            width: 50, textAlign: "right",
            background: withAlpha(colors.primary, 0.05),
            border: `1px solid ${withAlpha(colors.primary, 0.15)}`,
            color: colors.text,
            padding: "2px 4px", fontSize: 10,
            fontFamily: "monospace",
            outline: "none",
          }}
        />
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
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
