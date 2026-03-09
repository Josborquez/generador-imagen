/**
 * renderCanvas — Motor de renderizado dinamico para imagenes de ganadores TCG
 *
 * Acepta un objeto de tema (theme) completo que define colores, tipografia,
 * layout y decoraciones. No contiene ningun valor hardcodeado de estilo.
 */

import { parseDeck } from "./deckParser.js";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Object} data - Datos del formulario (nombre, evento, mazo, etc.)
 * @param {Image|null} photoImg - Imagen cargada del jugador
 * @param {Object} gameConfig - Configuracion completa del juego (theme, deckStructure, etc.)
 */
export function renderCanvas(canvas, data, photoImg, gameConfig, logoImg) {
  const { theme, deckStructure } = gameConfig;
  const { colors, typography: typo, layout, decorations: deco } = theme;

  const W = layout.canvas.width;
  const H = layout.canvas.height;
  const HEADER_H = layout.header.height;
  const FOOTER_H = layout.footer.height;
  const PHOTO_W = layout.photo.width;
  const PH = H - HEADER_H - FOOTER_H;
  const LINE_H = layout.deck.lineHeight;

  const ctx = canvas.getContext("2d");
  canvas.width = W;
  canvas.height = H;

  // ── Background ──────────────────────────────────────────────
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, W, H);

  // Glow central
  const g1 = ctx.createRadialGradient(W * 0.72, H * 0.4, 0, W * 0.72, H * 0.4, W * 0.55);
  g1.addColorStop(0, colors.glowCenter);
  g1.addColorStop(1, "transparent");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  // Glow secundario
  const g2 = ctx.createRadialGradient(W * 0.1, H * 0.85, 0, W * 0.1, H * 0.85, W * 0.4);
  g2.addColorStop(0, colors.glowSecondary);
  g2.addColorStop(1, "transparent");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  // ── Header ──────────────────────────────────────────────────
  ctx.fillStyle = colors.bgOverlay;
  ctx.fillRect(0, 0, W, HEADER_H);

  // Header bottom line
  ctx.strokeStyle = deco.separatorColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, HEADER_H);
  ctx.lineTo(W, HEADER_H);
  ctx.stroke();

  // Header center glow line
  const gl = ctx.createLinearGradient(W / 2 - 80, 0, W / 2 + 80, 0);
  gl.addColorStop(0, "transparent");
  gl.addColorStop(0.5, colors.primary);
  gl.addColorStop(1, "transparent");
  ctx.fillStyle = gl;
  ctx.fillRect(W / 2 - 80, HEADER_H - 1, 160, 1.5);

  // Header text
  ctx.textAlign = "center";

  ctx.fillStyle = typo.season.color;
  ctx.font = typo.season.font;
  ctx.fillText(data.season, W / 2, 19);

  ctx.fillStyle = typo.leagueTitle.color;
  ctx.font = typo.leagueTitle.font;
  ctx.fillText(`${deco.headerIcon}  ${data.leagueTitle}  ${deco.headerIcon}`, W / 2, 44);

  ctx.fillStyle = typo.eventDate.color;
  ctx.font = typo.eventDate.font;
  ctx.fillText(`${data.event}  \u00b7  ${data.date}`, W / 2, HEADER_H - 7);

  // ── Photo ───────────────────────────────────────────────────
  if (photoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, HEADER_H, PHOTO_W, PH);
    ctx.clip();
    const ir = photoImg.naturalWidth / photoImg.naturalHeight;
    let dw, dh, dx2, dy2;
    if (ir > PHOTO_W / PH) {
      dh = PH; dw = PH * ir; dx2 = -(dw - PHOTO_W) / 2; dy2 = HEADER_H;
    } else {
      dw = PHOTO_W; dh = PHOTO_W / ir; dx2 = 0; dy2 = HEADER_H;
    }
    ctx.filter = layout.photo.filter;
    ctx.drawImage(photoImg, dx2, dy2, dw, dh);
    ctx.filter = "none";
    ctx.restore();
  } else {
    const grad = ctx.createLinearGradient(0, HEADER_H, 0, HEADER_H + PH);
    grad.addColorStop(0, colors.bg);
    grad.addColorStop(1, colors.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, HEADER_H, PHOTO_W, PH);
    ctx.fillStyle = colors.primaryDim;
    ctx.font = "14px serif";
    ctx.textAlign = "center";
    ctx.fillText(deco.photoPlaceholder, PHOTO_W / 2, HEADER_H + PH / 2);
  }

  // Right fade on photo
  const fadeR = ctx.createLinearGradient(PHOTO_W - 90, 0, PHOTO_W, 0);
  fadeR.addColorStop(0, "transparent");
  fadeR.addColorStop(1, colors.bg);
  ctx.fillStyle = fadeR;
  ctx.fillRect(PHOTO_W - 90, HEADER_H, 90, PH);

  // Bottom fade on photo — covers full photo width with extended height
  const fadeB = ctx.createLinearGradient(0, HEADER_H + PH - 220, 0, HEADER_H + PH);
  fadeB.addColorStop(0, "transparent");
  fadeB.addColorStop(0.3, withAlpha(colors.bg, 0.5));
  fadeB.addColorStop(0.6, withAlpha(colors.bg, 0.85));
  fadeB.addColorStop(1, withAlpha(colors.bg, 0.99));
  ctx.fillStyle = fadeB;
  ctx.fillRect(0, HEADER_H, PHOTO_W, PH);

  // ── One Piece "Wanted" frame ────────────────────────────────
  if (deco.wantedFrame) {
    drawWantedFrame(ctx, PHOTO_W, HEADER_H, PH, colors, deco);
  }

  // ── Pokemon pokeball decoration ─────────────────────────────
  if (deco.pokeball) {
    drawPokeball(ctx, W, H, colors);
  }

  // ── Winner Name ─────────────────────────────────────────────
  // Posicionamiento del bloque del ganador (nombre + arquetipo).
  // Se calcula desde el borde inferior del canvas, restando el footer
  // y un offset configurable. Los valores se pueden sobreescribir
  // desde el editor de posicion (data._pos) para ajuste manual.
  //
  // Valores por defecto del tema:
  //   layout.name.offsetFromBottom -> distancia desde el borde inferior (sin footer) hacia arriba
  //   layout.name.lineSpacing     -> separacion vertical entre firstName y lastName
  //
  // Estructura vertical del bloque (desde nameY hacia abajo):
  //   nameY - 4    -> etiqueta "GANADOR" / "WANTED" / "CAMPEON"
  //   nameY + 12   -> primera linea del nombre (firstName)
  //   nameY + 12 + lineSpacing -> segunda linea del nombre (lastName)
  //   nameY + 55   -> arquetipo / nombre del mazo (ej: "BLACK PONZA")
  //
  // Eje X: centrado en el area de la foto (PHOTO_W / 2) con un
  //   desplazamiento horizontal (nameXShift) para compensacion visual.

  // -- Leer sobreescrituras del editor de posicion (si existen) --
  const pos = data._pos || {};
  const nameOffBottom = pos.nameOffsetFromBottom ?? layout.name.offsetFromBottom;
  const nameXShift    = pos.nameXShift ?? 0;              // desplazamiento horizontal desde el centro de la foto
  const nameLineSpace = pos.nameLineSpacing ?? layout.name.lineSpacing;
  const labelOffsetY  = pos.labelOffsetY ?? -4;          // offset Y de la etiqueta "GANADOR" respecto a nameY
  const firstNameOffY = pos.firstNameOffsetY ?? 12;      // offset Y del firstName respecto a nameY
  const archOffsetY   = pos.archetypeOffsetY ?? 55;      // offset Y del arquetipo respecto a nameY

  // nameY: coordenada Y base para todo el bloque del ganador
  const nameY = H - FOOTER_H - nameOffBottom;
  // nameCX: coordenada X central del bloque del ganador
  const nameCX = PHOTO_W / 2 + nameXShift;

  ctx.textAlign = "center";

  // Lineas decorativas horizontales a los costados de la etiqueta (configurables)
  // Centradas simetricamente respecto a nameCX
  const lineLeftX   = pos.lineLeftX ?? (nameCX - 90);
  const lineLeftLen = pos.lineLeftLen ?? 40;
  const lineRightX  = pos.lineRightX ?? (nameCX + 50);
  const lineRightLen = pos.lineRightLen ?? 40;

  ctx.strokeStyle = withAlpha(colors.primary, 0.45);
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(lineLeftX, nameY + 2); ctx.lineTo(lineLeftX + lineLeftLen, nameY + 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lineRightX, nameY + 2); ctx.lineTo(lineRightX + lineRightLen, nameY + 2); ctx.stroke();

  // Etiqueta superior: "GANADOR", "WANTED", "CAMPEON" (segun el juego)
  ctx.fillStyle = typo.winnerLabel.color;
  ctx.font = typo.winnerLabel.font;
  ctx.fillText(deco.winnerLabel, nameCX, nameY + labelOffsetY);

  // Nombre del ganador (dos lineas: firstName + lastName)
  // Soporte para tamano de fuente y negrita configurables
  const nameFontSize = pos.nameFontSize ?? 23;
  const nameBold = pos.nameBold ?? false;
  const baseFontStr = typo.winnerName.font;
  // Reemplazar tamano de fuente en el string de font
  const customFont = baseFontStr.replace(/\d+px/, `${nameFontSize}px`);
  // Aplicar negrita si esta activado (forzar weight 900)
  const finalFont = nameBold
    ? customFont.replace(/^\d+\s/, "900 ").replace(/^(normal|bold|[1-9]00)\s/, "900 ")
    : customFont;

  ctx.fillStyle = typo.winnerName.color;
  ctx.font = finalFont;
  ctx.fillText(data.firstName, nameCX, nameY + firstNameOffY);
  ctx.fillText(data.lastName, nameCX, nameY + firstNameOffY + nameLineSpace);

  // Arquetipo / nombre del mazo (ej: "BLACK PONZA", "RED/GREEN LUFFY")
  ctx.fillStyle = typo.archetype.color;
  ctx.font = typo.archetype.font;
  ctx.fillText(data.archetype, nameCX, nameY + archOffsetY);

  // ── Deck Area ───────────────────────────────────────────────
  const dx = PHOTO_W + 4;
  const dy = HEADER_H + 16;
  const dw = W - dx - 18;
  const col1x = dx;
  const col2x = dx + dw / 2 + 4;

  // Deck header
  ctx.textAlign = "left";
  ctx.fillStyle = typo.deckLabel.color;
  ctx.font = typo.deckLabel.font;
  ctx.fillText("DECKLIST", dx, dy + 12);

  ctx.textAlign = "right";
  ctx.fillStyle = typo.deckCount.color;
  ctx.font = typo.deckCount.font;
  ctx.fillText(deckStructure.totalDisplay, col2x - 10, dy + 12);

  ctx.strokeStyle = deco.separatorColor;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(dx, dy + 18); ctx.lineTo(W - 18, dy + 18); ctx.stroke();

  // Section renderer helpers
  function sectionTitle(x, y, text) {
    ctx.textAlign = "left";
    ctx.fillStyle = typo.sectionHeader.color;
    ctx.font = typo.sectionHeader.font;
    ctx.fillText(text, x, y);
    ctx.strokeStyle = withAlpha(colors.primary, 0.08);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y + 3); ctx.lineTo(x + 190, y + 3); ctx.stroke();
    return y + 13;
  }

  function cardLine(x, y, qty, name, color) {
    ctx.textAlign = "right";
    ctx.fillStyle = typo.cardQty.color;
    ctx.font = typo.cardQty.font;
    ctx.fillText(qty, x + layout.deck.qtyOffset, y);
    ctx.textAlign = "left";
    ctx.fillStyle = color || typo.cardName.color;
    ctx.font = typo.cardName.font;
    ctx.fillText(name, x + layout.deck.nameOffset, y);
    return y + LINE_H;
  }

  // Render each deck section
  let y1 = dy + 34;
  let y2 = dy + 34;

  for (const section of deckStructure.sections) {
    const sectionData = data[section.key];
    if (!sectionData) continue;

    const cards = parseDeck(sectionData);
    const colX = section.column === 0 ? col1x : col2x;
    let yRef = section.column === 0 ? y1 : y2;

    // Separator before section if flagged
    if (section.separated) {
      yRef += 8;
      ctx.strokeStyle = withAlpha(colors.primary, 0.1);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(colX, yRef); ctx.lineTo(colX + 195, yRef); ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillStyle = withAlpha(colors.primary, 0.3);
      ctx.font = typo.sectionHeader.font;
      ctx.fillText(section.label, colX + 97, yRef - 3);
      yRef += 12;
    } else {
      yRef = sectionTitle(colX, yRef, section.label);
    }

    const cardColor = section.colorKey ? colors[section.colorKey] : undefined;
    for (const [q, n] of cards) {
      yRef = cardLine(colX, yRef, q, n, cardColor);
    }

    if (section.column === 0) y1 = yRef;
    else y2 = yRef;
  }

  // ── Trophy / Badge — positioned below deck header to avoid overlap
  const trophyX = W - 48;
  const trophyY = HEADER_H + 48;
  const tglow = ctx.createRadialGradient(trophyX, trophyY, 0, trophyX, trophyY, 40);
  tglow.addColorStop(0, withAlpha(colors.primary, 0.18));
  tglow.addColorStop(1, "transparent");
  ctx.fillStyle = tglow;
  ctx.fillRect(trophyX - 40, trophyY - 30, 80, 70);

  ctx.font = deco.trophySize.replace(/\d+px/, "28px");
  ctx.textAlign = "center";
  ctx.fillText(deco.trophyIcon, trophyX, trophyY + 6);

  ctx.fillStyle = typo.trophyLabel.color;
  ctx.font = typo.trophyLabel.font;
  ctx.fillText(data.fecha, trophyX, trophyY + 18);

  // ── Footer ──────────────────────────────────────────────────
  const fy = H - FOOTER_H;
  ctx.fillStyle = withAlpha(colors.primary, 0.025);
  ctx.fillRect(0, fy, W, FOOTER_H);

  ctx.strokeStyle = withAlpha(colors.primary, 0.12);
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, fy); ctx.lineTo(W, fy); ctx.stroke();

  ctx.fillStyle = typo.footer.color;
  ctx.font = typo.footer.font;
  ctx.textAlign = "left";
  ctx.fillText(data.event, 22, fy + 22);

  ctx.textAlign = "center";
  ctx.font = typo.footerCenter.font;
  ctx.fillStyle = typo.footerCenter.color;
  ctx.fillText(data.leagueTitle, W / 2, fy + 22);

  ctx.textAlign = "right";
  ctx.font = typo.footer.font;
  ctx.fillStyle = typo.footer.color;
  ctx.fillText(data.website, W - 22, fy + 22);

  // ── Logo de tienda ────────────────────────────────────────────
  if (logoImg) {
    const logoSize   = pos.logoSize ?? 60;
    const logoOffX   = pos.logoX ?? 10;
    const logoOffY   = pos.logoY ?? 10;
    const logoCorner = pos.logoCorner ?? "top-left";

    // Mantener proporcion del logo
    const logoAspect = logoImg.naturalWidth / logoImg.naturalHeight;
    const lw = logoSize;
    const lh = logoSize / logoAspect;

    let lx, ly;
    if (logoCorner === "top-left")     { lx = logoOffX; ly = logoOffY; }
    else if (logoCorner === "top-right")    { lx = W - lw - logoOffX; ly = logoOffY; }
    else if (logoCorner === "bottom-left")  { lx = logoOffX; ly = H - lh - logoOffY; }
    else /* bottom-right */                 { lx = W - lw - logoOffX; ly = H - lh - logoOffY; }

    // Activar suavizado de alta calidad para evitar logo pixelado
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(logoImg, lx, ly, lw, lh);
    ctx.restore();
  }

  // ── Border ──────────────────────────────────────────────────
  ctx.strokeStyle = deco.borderColor;
  ctx.lineWidth = deco.borderWidth;
  ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

  // Corner accents
  const cs = deco.cornerSize;
  ctx.strokeStyle = deco.cornerColor;
  ctx.lineWidth = deco.cornerWidth;
  [
    [8, 8, cs, cs],
    [W - 8, 8, -cs, cs],
    [8, H - 8, cs, -cs],
    [W - 8, H - 8, -cs, -cs],
  ].forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + sy);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx, y);
    ctx.stroke();
  });
}

// ── Helper: convert hex/rgb to rgba with alpha ───────────────
function withAlpha(color, alpha) {
  if (color.startsWith("rgba")) {
    return color.replace(/[\d.]+\)$/, `${alpha})`);
  }
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color;
}

// ── One Piece "Wanted" style inner frame ─────────────────────
function drawWantedFrame(ctx, photoW, headerH, ph, colors, deco) {
  const margin = 12;
  const x = margin;
  const y = headerH + margin;
  const w = photoW - margin * 2 - 40;
  const h = ph - margin * 2;

  ctx.save();
  ctx.strokeStyle = withAlpha(colors.primary, 0.3);
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
  ctx.restore();
}

// ── Pokemon pokeball subtle background decoration ────────────
function drawPokeball(ctx, W, H, colors) {
  const cx = W - 80;
  const cy = H - 80;
  const r = 45;

  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 2;

  // Outer circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Middle line
  ctx.beginPath();
  ctx.moveTo(cx - r, cy);
  ctx.lineTo(cx + r, cy);
  ctx.stroke();

  // Inner circle
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}
