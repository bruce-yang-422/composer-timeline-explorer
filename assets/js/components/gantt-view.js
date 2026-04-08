import { setState } from "../core/state.js";
import { setHtml } from "../utils/dom.js";

const TYPE_COLORS = {
  symphony:        "#1D4ED8",
  piano_concerto:  "#7C3AED",
  violin_concerto: "#B91C1C",
  piano_sonata:    "#059669",
  string_quartet:  "#D97706",
  bagatelle:       "#0891B2",
  variation_set:   "#6366F1",
  opera:           "#BE185D",
  sacred_vocal:    "#92400E",
};

const PERIOD_BANDS = [
  { label: "早期", end: 1799,  fill: "#EFF6FF", border: "#BFDBFE", text: "#3B82F6" },
  { label: "中期", end: 1815,  fill: "#FFF7ED", border: "#FED7AA", text: "#EA580C" },
  { label: "晚期", end: Infinity, fill: "#F5F3FF", border: "#DDD6FE", text: "#7C3AED" },
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

  const W   = 900;
  const H   = 140;
  const PL  = 10, PR = 10, PT = 26, PB = 44;
  const cW  = W - PL - PR;
  const cH  = H - PT - PB;
  const midY = PT + cH / 2;

  const xOf  = year => PL + ((year - startYear) / span) * cW;
  const ageOf = year => year - startYear;

  // Period background bands
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
  const baseline = `<line x1="${PL}" y1="${midY}" x2="${W - PR}" y2="${midY}" stroke="#D1D5DB" stroke-width="1.5"/>`;

  // Year + age ticks
  const axisY    = PT + cH;       // baseline for tick stems
  const yearLblY = axisY + 15;    // year label row
  const ageLblY  = axisY + 28;    // age label row

  const firstTick = Math.ceil(startYear / 10) * 10;

  // Birth tick (year + 0歲)
  let ticks = `
    <text x="${xOf(startYear)}" y="${yearLblY}" text-anchor="middle" font-size="10" fill="#9CA3AF">${startYear}</text>
    <text x="${xOf(startYear)}" y="${ageLblY}"  text-anchor="middle" font-size="9.5" fill="#C4B9D0">0歲</text>
  `;

  for (let y = firstTick; y <= endYear; y += 10) {
    const x   = xOf(y);
    const age = ageOf(y);
    ticks += `
      <line x1="${x}" y1="${axisY}" x2="${x}" y2="${axisY + 5}" stroke="#D1D5DB" stroke-width="1"/>
      <text x="${x}" y="${yearLblY}" text-anchor="middle" font-size="10"   fill="#9CA3AF">${y}</text>
      <text x="${x}" y="${ageLblY}"  text-anchor="middle" font-size="9.5" fill="#C4B9D0">${age}歲</text>
    `;
  }

  // Death tick
  ticks += `
    <text x="${xOf(endYear)}" y="${yearLblY}" text-anchor="middle" font-size="10" fill="#9CA3AF">${endYear}</text>
    <text x="${xOf(endYear)}" y="${ageLblY}"  text-anchor="middle" font-size="9.5" fill="#C4B9D0">${ageOf(endYear)}歲</text>
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
      ${bands}
      ${baseline}
      ${ticks}
      ${markers}
    </svg>
  `);

  root.querySelectorAll("[data-work-id]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedWorkId: el.dataset.workId });
      rerender();
    });
  });
}
