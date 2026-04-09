import { setState } from "../core/state.js";
import { setHtml } from "../utils/dom.js";

const TYPE_COLORS = {
  symphony:        "#1C3D60",  // prussian navy
  piano_concerto:  "#5B2A82",  // deep violet
  violin_concerto: "#8B1A1A",  // deep crimson
  piano_sonata:    "#1A5C3A",  // deep forest
  string_quartet:  "#8B5C18",  // warm amber/gold
  bagatelle:       "#1A5A5A",  // deep teal
  variation_set:   "#482878",  // deep indigo
  opera:           "#8B1848",  // deep rose
  sacred_vocal:    "#5C3A18",  // warm sienna
};

const PERIOD_BANDS = [
  { label: "早期", end: 1799,  fill: "#EEF3FA", border: "#B4CDE6", text: "#1C3D60" },
  { label: "中期", end: 1815,  fill: "#FDF5E8", border: "#F0D09A", text: "#8B5C18" },
  { label: "晚期", end: Infinity, fill: "#F3EEF9", border: "#C8B4E8", text: "#5B2A82" },
];

const MUSIC_HISTORY_BANDS = [
  { label: "文藝復興", start: 1400, end: 1600,     fill: "rgba(120,92,40,0.11)",  text: "#7A5C28" },
  { label: "巴洛克",   start: 1600, end: 1750,     fill: "rgba(120,55,25,0.11)",  text: "#884020" },
  { label: "古典",     start: 1750, end: 1820,     fill: "rgba(28,61,96,0.11)",   text: "#1C3D60" },
  { label: "浪漫",     start: 1820, end: 1900,     fill: "rgba(139,24,72,0.11)",  text: "#8B1848" },
  { label: "現代",     start: 1900, end: Infinity, fill: "rgba(26,92,58,0.11)",   text: "#1A5C3A" },
];

export function renderGanttView(model, rerender) {
  const root = document.querySelector("#gantt-view");
  if (!root) return;

  const composer = model.composers.find(c => c.id === model.state.selectedComposerId);
  const works = model.works.filter(w => w.composerId === model.state.selectedComposerId);

  if (!composer || !works.length) {
    setHtml(root, `<p class="note-box">尚無資料可顯示甘特圖。</p>`);
    return;
  }

  const startYear = composer.birth;
  const endYear   = composer.death;
  const span      = endYear - startYear;

  const MHBH = 22;  // height of the music history band strip at the top

  const W   = 900;
  const H   = 140 + MHBH;
  const PL  = 10, PR = 10, PT = 26 + MHBH, PB = 44;
  const cW  = W - PL - PR;
  const cH  = H - PT - PB;
  const midY = PT + cH / 2;

  const xOf  = year => PL + ((year - startYear) / span) * cW;
  const ageOf = year => year - startYear;

  // ── Music history background band (top strip, separate layer) ──────────────
  const musicBands = MUSIC_HISTORY_BANDS.map(p => {
    const bStart = Math.max(p.start, startYear);
    const bEnd   = Math.min(p.end === Infinity ? endYear : p.end, endYear);
    if (bStart >= bEnd) return "";
    const x1  = xOf(bStart);
    const x2  = xOf(bEnd);
    const bW  = x2 - x1;
    const mx  = (x1 + x2) / 2;
    const labelEl = bW > 32
      ? `<text x="${mx}" y="${MHBH - 5}" text-anchor="middle" font-size="9" fill="${p.text}" font-weight="600" font-family="Segoe UI,sans-serif">${p.label}</text>`
      : "";
    const dividerEl = bEnd < endYear
      ? `<line x1="${x2}" y1="1" x2="${x2}" y2="${MHBH - 1}" stroke="${p.text}" stroke-width="0.5" opacity="0.35"/>`
      : "";
    return `
      <rect x="${x1}" y="1" width="${bW}" height="${MHBH - 1}" fill="${p.fill}"/>
      ${labelEl}
      ${dividerEl}
    `;
  }).join("");

  // Thin separator between music history band and composer period band
  const bandSeparator = `<line x1="${PL}" y1="${MHBH}" x2="${W - PR}" y2="${MHBH}" stroke="#C4C9D4" stroke-width="0.75" opacity="0.7"/>`;

  // ── Composer life period background bands ────────────────────────────────
  let bandStart = startYear;
  const bands = PERIOD_BANDS.map(p => {
    const bandEnd = Math.min(p.end, endYear);
    const x1 = xOf(bandStart);
    const x2 = xOf(bandEnd);
    const mx = (x1 + x2) / 2;
    const el = `
      <rect x="${x1}" y="${PT}" width="${x2 - x1}" height="${cH}" fill="${p.fill}" />
      <text x="${mx}" y="${PT + 13}" text-anchor="middle" font-size="11" fill="${p.text}" font-weight="600">${p.label}</text>
      ${bandEnd < endYear ? `<line x1="${x2}" y1="${PT}" x2="${x2}" y2="${PT + cH}" stroke="${p.border}" stroke-width="1" stroke-dasharray="4 3"/>` : ""}
    `;
    bandStart = bandEnd + 1;
    return el;
  }).join("");

  // Baseline
  const baseline = `<line x1="${PL}" y1="${midY}" x2="${W - PR}" y2="${midY}" stroke="#C0B4A4" stroke-width="1.5"/>`;

  // Year + age ticks
  const axisY    = PT + cH;       // baseline for tick stems
  const yearLblY = axisY + 15;    // year label row
  const ageLblY  = axisY + 28;    // age label row

  const firstTick = Math.ceil(startYear / 10) * 10;

  // Birth tick (year + 0歲)
  let ticks = `
    <text x="${xOf(startYear)}" y="${yearLblY}" text-anchor="middle" font-size="10" fill="#9E9487">${startYear}</text>
    <text x="${xOf(startYear)}" y="${ageLblY}"  text-anchor="middle" font-size="9.5" fill="#BEB2A4">0歲</text>
  `;

  for (let y = firstTick; y <= endYear; y += 10) {
    const x   = xOf(y);
    const age = ageOf(y);
    ticks += `
      <line x1="${x}" y1="${axisY}" x2="${x}" y2="${axisY + 5}" stroke="#C0B4A4" stroke-width="1"/>
      <text x="${x}" y="${yearLblY}" text-anchor="middle" font-size="10"   fill="#9E9487">${y}</text>
      <text x="${x}" y="${ageLblY}"  text-anchor="middle" font-size="9.5" fill="#BEB2A4">${age}歲</text>
    `;
  }

  // Death tick
  ticks += `
    <text x="${xOf(endYear)}" y="${yearLblY}" text-anchor="middle" font-size="10" fill="#9E9487">${endYear}</text>
    <text x="${xOf(endYear)}" y="${ageLblY}"  text-anchor="middle" font-size="9.5" fill="#BEB2A4">${ageOf(endYear)}歲</text>
  `;

  // Work markers
  const markers = works.map(work => {
    const x      = xOf(work.year);
    const active = work.id === model.state.selectedWorkId;
    const color  = TYPE_COLORS[work.type] ?? "#6B7280";
    const r      = active ? 8 : 6;
    return `
      ${active ? `<circle cx="${x}" cy="${midY}" r="${r + 5}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.35"/>` : ""}
      <circle
        cx="${x}" cy="${midY}" r="${r}"
        fill="${color}" opacity="${active ? 1 : 0.65}"
        stroke="${active ? "#fff" : "transparent"}" stroke-width="2.5"
        data-work-id="${work.id}"
        style="cursor:pointer"
      >
        <title>${work.year} · ${work.title}</title>
      </circle>
    `;
  }).join("");

  // Legend (only types present in data)
  const presentTypes = [...new Set(works.map(w => w.type))];
  const legend = presentTypes
    .filter(t => TYPE_COLORS[t])
    .map(t => `
      <span style="display:inline-flex;align-items:center;gap:5px;font-size:0.75rem;color:var(--color-muted)">
        <span style="width:8px;height:8px;border-radius:50%;background:${TYPE_COLORS[t]};flex-shrink:0"></span>
        ${model.mappings.workTypeLabels[t] ?? t}
      </span>
    `).join("");

  setHtml(root, `
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.75rem">${legend}</div>
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">
      ${musicBands}
      ${bandSeparator}
      ${bands}
      ${baseline}
      ${ticks}
      ${markers}
    </svg>
  `);

  root.querySelectorAll("[data-work-id]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedWorkId: el.dataset.workId, selectedProfileId: null, selectedEventId: null });
      rerender();
    });
  });
}
