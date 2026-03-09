import { useState, useRef, useEffect, useCallback } from "react";

// ─── defaults ────────────────────────────────────────────────
const DEFAULT = {
    firstName: "Carlos",
    lastName: "Iglesias",
    archetype: "BLACK PONZA",
    event: "ONPLAY GAMES",
    fecha: "FECHA 1",
    date: "JUEVES 5 DE MARZO 2026",
    season: "CIRCUITO PREMODERN CHILE · SEASON I",
    leagueTitle: "PREMODERN LEAGUE",
    website: "premodernchile.cl",
    maindeck: `4 Dark Ritual\n4 Duress\n4 Choking Sands\n4 Icequake\n4 Rancid Earth\n4 Tangle Wire\n3 Phyrexian Arena\n3 Thrashing Wumpus\n2 Powder Keg\n2 Innocent Blood\n1 Bane of the Living\n1 Braids, Cabal Minion\n1 Contagion\n1 Diabolic Edict`,
    lands: `12 Swamp\n4 Rishadan Port\n3 Wasteland\n2 Mishra's Factory`,
    sideboard: `3 Engineered Plague\n2 Massacre\n2 Perish\n2 Tormod's Crypt\n1 Defense Grid\n1 Diabolic Edict\n1 Nevinyrral's Disk\n1 Phyrexian Furnace\n1 Planar Void\n1 Wasteland`,
};

function parseDeck(text) {
    return text.split("\n").map(line => {
        const m = line.trim().match(/^(\d+)\s+(.+)$/);
        return m ? [parseInt(m[1]), m[2]] : null;
    }).filter(Boolean);
}

// ─── canvas renderer ─────────────────────────────────────────
function renderCanvas(canvas, data, photoImg) {
    const W = 900, H = 560;
    const HEADER_H = 68, FOOTER_H = 36, PHOTO_W = 310;
    const PH = H - HEADER_H - FOOTER_H;
    const ctx = canvas.getContext("2d");

    const GOLD = "#C9A84C", GOLD_L = "#E8C97A", BG = "#0A0A0F";
    const CREAM = "#C8B898", WHITE = "#FAFAFA";
    const GREEN = "#9BB8A0", BLUE = "#7A9BB8";

    // ── bg
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    const g1 = ctx.createRadialGradient(W * 0.72, H * 0.4, 0, W * 0.72, H * 0.4, W * 0.55);
    g1.addColorStop(0, "rgba(201,168,76,0.08)");
    g1.addColorStop(1, "transparent");
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

    const g2 = ctx.createRadialGradient(W * 0.1, H * 0.85, 0, W * 0.1, H * 0.85, W * 0.4);
    g2.addColorStop(0, "rgba(139,26,26,0.09)");
    g2.addColorStop(1, "transparent");
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

    // ── header
    ctx.fillStyle = "rgba(10,10,15,0.85)";
    ctx.fillRect(0, 0, W, HEADER_H);
    ctx.strokeStyle = "rgba(201,168,76,0.22)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, HEADER_H); ctx.lineTo(W, HEADER_H); ctx.stroke();

    const gl = ctx.createLinearGradient(W / 2 - 80, 0, W / 2 + 80, 0);
    gl.addColorStop(0, "transparent"); gl.addColorStop(0.5, GOLD); gl.addColorStop(1, "transparent");
    ctx.fillStyle = gl; ctx.fillRect(W / 2 - 80, HEADER_H - 1, 160, 1.5);

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(201,168,76,0.6)";
    ctx.font = "600 9px 'Cinzel', serif";
    ctx.fillText(data.season, W / 2, 19);
    ctx.fillStyle = GOLD;
    ctx.font = "700 16px 'Cinzel Decorative', serif";
    ctx.fillText(`⚔  ${data.leagueTitle}  ⚔`, W / 2, 42);
    ctx.fillStyle = "rgba(201,168,76,0.45)";
    ctx.font = "600 8.5px 'Cinzel', serif";
    ctx.fillText(`${data.event}  ·  ${data.date}`, W / 2, 59);

    // ── photo
    if (photoImg) {
        ctx.save();
        ctx.beginPath(); ctx.rect(0, HEADER_H, PHOTO_W, PH); ctx.clip();
        const ir = photoImg.naturalWidth / photoImg.naturalHeight;
        let dw, dh, dx2, dy2;
        if (ir > PHOTO_W / PH) { dh = PH; dw = PH * ir; dx2 = -(dw - PHOTO_W) / 2; dy2 = HEADER_H; }
        else { dw = PHOTO_W; dh = PHOTO_W / ir; dx2 = 0; dy2 = HEADER_H; }
        ctx.filter = "contrast(1.05) saturate(0.88)";
        ctx.drawImage(photoImg, dx2, dy2, dw, dh);
        ctx.filter = "none";
        ctx.restore();
    } else {
        // placeholder
        const grad = ctx.createLinearGradient(0, HEADER_H, 0, HEADER_H + PH);
        grad.addColorStop(0, "#111120"); grad.addColorStop(1, "#0a0a15");
        ctx.fillStyle = grad; ctx.fillRect(0, HEADER_H, PHOTO_W, PH);
        ctx.fillStyle = "rgba(201,168,76,0.15)";
        ctx.font = "14px serif"; ctx.textAlign = "center";
        ctx.fillText("📷 Foto del ganador", PHOTO_W / 2, HEADER_H + PH / 2);
    }

    // right fade
    const fadeR = ctx.createLinearGradient(PHOTO_W - 90, 0, PHOTO_W, 0);
    fadeR.addColorStop(0, "transparent"); fadeR.addColorStop(1, BG);
    ctx.fillStyle = fadeR; ctx.fillRect(PHOTO_W - 90, HEADER_H, 90, PH);

    // bottom fade
    const fadeB = ctx.createLinearGradient(0, HEADER_H + PH - 130, 0, HEADER_H + PH);
    fadeB.addColorStop(0, "transparent");
    fadeB.addColorStop(0.4, "rgba(10,10,15,0.85)");
    fadeB.addColorStop(1, "rgba(10,10,15,0.99)");
    ctx.fillStyle = fadeB; ctx.fillRect(0, HEADER_H, PHOTO_W - 90, PH);

    // ── name
    const nameY = H - FOOTER_H - 55;
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgba(201,168,76,0.45)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(18, nameY + 2); ctx.lineTo(58, nameY + 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(172, nameY + 2); ctx.lineTo(222, nameY + 2); ctx.stroke();

    ctx.fillStyle = GOLD; ctx.font = "600 8px 'Cinzel', serif";
    ctx.fillText("GANADOR", PHOTO_W / 2 - 30, nameY - 4);
    ctx.fillStyle = WHITE; ctx.font = "900 23px 'Cinzel Decorative', serif";
    ctx.fillText(data.firstName, PHOTO_W / 2 - 30, nameY + 12);
    ctx.fillText(data.lastName, PHOTO_W / 2 - 30, nameY + 38);
    ctx.fillStyle = "rgba(201,168,76,0.65)"; ctx.font = "600 8px 'Cinzel', serif";
    ctx.fillText(data.archetype, PHOTO_W / 2 - 30, nameY + 55);

    // ── deck area
    const dx = PHOTO_W + 4, dy = HEADER_H + 16;
    const dw = W - dx - 18;
    const col1x = dx, col2x = dx + dw / 2 + 4;
    const LINE_H = 17;

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(201,168,76,0.55)"; ctx.font = "600 8px 'Cinzel', serif";
    ctx.fillText("DECKLIST", dx, dy + 12);
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(201,168,76,0.4)"; ctx.font = "700 9px 'Cinzel Decorative', serif";
    ctx.fillText("60 / 15", W - 20, dy + 12);
    ctx.strokeStyle = "rgba(201,168,76,0.15)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(dx, dy + 18); ctx.lineTo(W - 18, dy + 18); ctx.stroke();

    function sectionTitle(x, y, text) {
        ctx.textAlign = "left"; ctx.fillStyle = "rgba(201,168,76,0.38)";
        ctx.font = "600 7px 'Cinzel', serif"; ctx.fillText(text, x, y);
        ctx.strokeStyle = "rgba(201,168,76,0.08)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, y + 3); ctx.lineTo(x + 190, y + 3); ctx.stroke();
        return y + 13;
    }

    function cardLine(x, y, qty, name, color) {
        ctx.textAlign = "right"; ctx.fillStyle = GOLD;
        ctx.font = "700 12px 'Cinzel Decorative', serif";
        ctx.fillText(qty, x + 16, y);
        ctx.textAlign = "left"; ctx.fillStyle = color || CREAM;
        ctx.font = "400 13px 'Crimson Pro', serif";
        ctx.fillText(name, x + 22, y);
        return y + LINE_H;
    }

    let y1 = dy + 34, y2 = dy + 34;
    y1 = sectionTitle(col1x, y1, "MAZO PRINCIPAL");
    for (const [q, n] of parseDeck(data.maindeck)) y1 = cardLine(col1x, y1, q, n);

    y2 = sectionTitle(col2x, y2, "TIERRAS");
    for (const [q, n] of parseDeck(data.lands)) y2 = cardLine(col2x, y2, q, n, GREEN);

    y2 += 8;
    ctx.strokeStyle = "rgba(201,168,76,0.1)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(col2x, y2); ctx.lineTo(col2x + 195, y2); ctx.stroke();
    ctx.textAlign = "center"; ctx.fillStyle = "rgba(201,168,76,0.3)";
    ctx.font = "600 7px 'Cinzel', serif"; ctx.fillText("SIDEBOARD", col2x + 97, y2 - 3);
    y2 += 12;
    for (const [q, n] of parseDeck(data.sideboard)) y2 = cardLine(col2x, y2, q, n, BLUE);

    // ── trophy
    const tglow = ctx.createRadialGradient(W - 52, 100, 0, W - 52, 100, 50);
    tglow.addColorStop(0, "rgba(201,168,76,0.25)"); tglow.addColorStop(1, "transparent");
    ctx.fillStyle = tglow; ctx.fillRect(W - 102, 60, 100, 90);
    ctx.font = "40px serif"; ctx.textAlign = "center"; ctx.fillText("🏆", W - 52, 110);
    ctx.fillStyle = GOLD; ctx.font = "600 7.5px 'Cinzel', serif";
    ctx.fillText(data.fecha, W - 52, 124);

    // ── footer
    const fy = H - FOOTER_H;
    ctx.fillStyle = "rgba(201,168,76,0.025)"; ctx.fillRect(0, fy, W, FOOTER_H);
    ctx.strokeStyle = "rgba(201,168,76,0.12)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, fy); ctx.lineTo(W, fy); ctx.stroke();
    ctx.fillStyle = "rgba(201,168,76,0.4)"; ctx.font = "600 8px 'Cinzel', serif";
    ctx.textAlign = "left"; ctx.fillText(data.event, 22, fy + 22);
    ctx.textAlign = "center"; ctx.font = "700 9px 'Cinzel Decorative', serif";
    ctx.fillStyle = "rgba(201,168,76,0.5)"; ctx.fillText(data.leagueTitle, W / 2, fy + 22);
    ctx.textAlign = "right"; ctx.font = "600 8px 'Cinzel', serif";
    ctx.fillStyle = "rgba(201,168,76,0.4)"; ctx.fillText(data.website, W - 22, fy + 22);

    // ── border
    ctx.strokeStyle = "rgba(201,168,76,0.35)"; ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    const cs = 22;
    ctx.strokeStyle = "rgba(201,168,76,0.5)"; ctx.lineWidth = 1.5;
    [[8, 8, cs, cs], [W - 8, 8, -cs, cs], [8, H - 8, cs, -cs], [W - 8, H - 8, -cs, -cs]].forEach(([x, y, sx, sy]) => {
        ctx.beginPath(); ctx.moveTo(x, y + sy); ctx.lineTo(x, y); ctx.lineTo(x + sx, y); ctx.stroke();
    });
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
    const [data, setData] = useState(DEFAULT);
    const [photoImg, setPhotoImg] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [fontsReady, setFontsReady] = useState(false);
    const [activeTab, setActiveTab] = useState("info");
    const canvasRef = useRef(null);

    // load google fonts
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,400&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        document.fonts.ready.then(() => setFontsReady(true));
    }, []);

    // re-render canvas whenever data/photo/fonts change
    useEffect(() => {
        if (!fontsReady || !canvasRef.current) return;
        renderCanvas(canvasRef.current, data, photoImg);
    }, [data, photoImg, fontsReady]);

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
        const a = document.createElement("a");
        a.href = canvasRef.current.toDataURL("image/png");
        const name = `ganador-${data.lastName.toLowerCase().replace(/\s/g, "-")}-${data.fecha.toLowerCase().replace(/\s/g, "-")}.png`;
        a.download = name;
        a.click();
    };

    const tabs = ["info", "evento", "mazo"];

    return (
        <div style={{
            background: "#080810",
            minHeight: "100vh",
            fontFamily: "system-ui, sans-serif",
            color: "#C8B898",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px 16px 48px",
            gap: 24,
        }}>
            {/* header */}
            <div style={{ textAlign: "center", marginBottom: 4 }}>
                <div style={{ color: "rgba(201,168,76,0.5)", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", fontFamily: "'Cinzel', serif", marginBottom: 6 }}>
                    Circuito Premodern Chile
                </div>
                <h1 style={{ fontFamily: "'Cinzel Decorative', serif", color: "#C9A84C", fontSize: 22, fontWeight: 900, letterSpacing: 2, margin: 0 }}>
                    ⚔ Generador de Ganadores ⚔
                </h1>
            </div>

            {/* main layout */}
            <div style={{ display: "flex", gap: 28, width: "100%", maxWidth: 1200, flexWrap: "wrap", justifyContent: "center" }}>

                {/* ── FORM PANEL ── */}
                <div style={{
                    background: "rgba(10,10,20,0.95)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    width: 340, minWidth: 300, flexShrink: 0,
                    display: "flex", flexDirection: "column",
                }}>
                    {/* tabs */}
                    <div style={{ display: "flex", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
                        {tabs.map(t => (
                            <button key={t} onClick={() => setActiveTab(t)} style={{
                                flex: 1, padding: "10px 0",
                                background: activeTab === t ? "rgba(201,168,76,0.08)" : "transparent",
                                border: "none",
                                borderBottom: activeTab === t ? "2px solid #C9A84C" : "2px solid transparent",
                                color: activeTab === t ? "#C9A84C" : "rgba(201,168,76,0.4)",
                                fontFamily: "'Cinzel', serif",
                                fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                                cursor: "pointer", transition: "all .2s",
                            }}>
                                {t === "info" ? "Ganador" : t === "evento" ? "Evento" : "Mazo"}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>

                        {/* GANADOR TAB */}
                        {activeTab === "info" && <>
                            {/* photo drop */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={e => e.preventDefault()}
                                style={{
                                    border: "1px dashed rgba(201,168,76,0.3)",
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
                                        <div style={{ color: "rgba(201,168,76,0.5)", fontSize: 11, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>
                                            Arrastra o haz click
                                        </div>
                                        <div style={{ color: "rgba(201,168,76,0.3)", fontSize: 10, marginTop: 4 }}>JPG, PNG, WEBP</div>
                                    </>
                                }
                                {photoUrl && (
                                    <div style={{
                                        position: "absolute", bottom: 0, left: 0, right: 0,
                                        background: "rgba(10,10,15,0.7)", padding: "5px",
                                        color: "rgba(201,168,76,0.6)", fontSize: 9, fontFamily: "'Cinzel', serif",
                                        textAlign: "center", letterSpacing: 1,
                                    }}>
                                        CLICK PARA CAMBIAR
                                    </div>
                                )}
                            </div>
                            <input id="photoInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />

                            <Field label="Nombre" value={data.firstName} onChange={set("firstName")} />
                            <Field label="Apellido" value={data.lastName} onChange={set("lastName")} />
                            <Field label="Arquetipo / Mazo" value={data.archetype} onChange={set("archetype")} />
                        </>}

                        {/* EVENTO TAB */}
                        {activeTab === "evento" && <>
                            <Field label="Título liga" value={data.leagueTitle} onChange={set("leagueTitle")} />
                            <Field label="Circuito / Season" value={data.season} onChange={set("season")} />
                            <Field label="Local" value={data.event} onChange={set("event")} />
                            <Field label="Fecha texto" value={data.date} onChange={set("date")} />
                            <Field label="Fecha etiqueta" value={data.fecha} onChange={set("fecha")} placeholder="FECHA 1" />
                            <Field label="Sitio web" value={data.website} onChange={set("website")} />
                        </>}

                        {/* MAZO TAB */}
                        {activeTab === "mazo" && <>
                            <TextArea label="Mazo Principal" value={data.maindeck} onChange={set("maindeck")} rows={14} hint="4 Dark Ritual" />
                            <TextArea label="Tierras" value={data.lands} onChange={set("lands")} rows={5} />
                            <TextArea label="Sideboard" value={data.sideboard} onChange={set("sideboard")} rows={10} />
                        </>}
                    </div>

                    {/* download button */}
                    <button onClick={download} style={{
                        margin: "0 20px 20px",
                        padding: "12px 0",
                        background: "linear-gradient(135deg, #8B6914, #C9A84C)",
                        border: "none",
                        color: "#0A0A0F",
                        fontFamily: "'Cinzel', serif",
                        fontWeight: 700, fontSize: 11,
                        letterSpacing: 3, textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "filter .2s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
                        onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                    >
                        ⬇ Descargar PNG
                    </button>
                </div>

                {/* ── CANVAS PREVIEW ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                    <div style={{ color: "rgba(201,168,76,0.35)", fontSize: 9, letterSpacing: 3, fontFamily: "'Cinzel', serif" }}>
                        PREVIEW — 900 × 560 px
                    </div>
                    <div style={{ position: "relative", boxShadow: "0 0 60px rgba(201,168,76,0.08), 0 4px 40px rgba(0,0,0,0.8)" }}>
                        {!fontsReady && (
                            <div style={{
                                position: "absolute", inset: 0, zIndex: 2,
                                background: "rgba(10,10,15,0.9)", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                color: "#C9A84C", fontFamily: "'Cinzel', serif",
                                fontSize: 12, letterSpacing: 3,
                            }}>
                                Cargando fuentes...
                            </div>
                        )}
                        <canvas ref={canvasRef} width={900} height={560}
                            style={{ display: "block", maxWidth: "min(900px, calc(100vw - 380px))", height: "auto" }}
                        />
                    </div>
                    <div style={{ color: "rgba(201,168,76,0.2)", fontSize: 9, letterSpacing: 2, fontFamily: "'Cinzel', serif" }}>
                        premodernchile.cl
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── tiny helpers
function Field({ label, value, onChange, placeholder }) {
    return (
        <div>
            <label style={{ display: "block", color: "rgba(201,168,76,0.5)", fontSize: 9, letterSpacing: 2, fontFamily: "'Cinzel', serif", marginBottom: 5, textTransform: "uppercase" }}>
                {label}
            </label>
            <input value={value} onChange={onChange} placeholder={placeholder}
                style={{
                    width: "100%", background: "rgba(201,168,76,0.05)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    color: "#C8B898", padding: "7px 10px", fontSize: 13,
                    fontFamily: "system-ui, sans-serif", outline: "none", boxSizing: "border-box",
                    transition: "border-color .2s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.15)"}
            />
        </div>
    );
}

function TextArea({ label, value, onChange, rows, hint }) {
    return (
        <div>
            <label style={{ display: "block", color: "rgba(201,168,76,0.5)", fontSize: 9, letterSpacing: 2, fontFamily: "'Cinzel', serif", marginBottom: 5, textTransform: "uppercase" }}>
                {label}
            </label>
            {hint && <div style={{ color: "rgba(201,168,76,0.2)", fontSize: 9, marginBottom: 4, fontFamily: "monospace" }}>ej: {hint}</div>}
            <textarea value={value} onChange={onChange} rows={rows}
                style={{
                    width: "100%", background: "rgba(201,168,76,0.05)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    color: "#C8B898", padding: "7px 10px", fontSize: 12,
                    fontFamily: "monospace", outline: "none", resize: "vertical",
                    boxSizing: "border-box", lineHeight: 1.6,
                    transition: "border-color .2s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.15)"}
            />
        </div>
    );
}