import { setHtml } from "../utils/dom.js";

const TYPE_LABELS = {
  historical:    "歷史",
  cultural:      "文化",
  musical_trend: "音樂趨勢",
};

export function renderContextPanel(model) {
  const root = document.querySelector("#context-panel");
  if (!root) return;

  const selectedWork = model.works.find(w => w.id === model.state.selectedWorkId)
    ?? model.works.find(w => w.composerId === model.state.selectedComposerId);

  const selectedEvent = model.events.find(e => e.id === model.state.selectedEventId);

  // Use selected work year; fall back to selected event year
  const refYear = selectedWork?.year ?? selectedEvent?.year ?? null;

  // Filter: contexts whose time range contains the ref year
  const relevant = refYear !== null
    ? model.contexts.filter(c => c.start <= refYear && c.end >= refYear)
    : model.contexts.slice(0, 6);

  const label = selectedWork
    ? `顯示 ${selectedWork.year} 年前後的時代背景`
    : "全部背景";

  const cards = relevant.length
    ? relevant.map(item => `
        <article class="context-card grid gap-1">
          <p class="data-card-meta">${item.start}–${item.end} · ${TYPE_LABELS[item.type] ?? item.type}</p>
          <h3 class="font-display" style="font-size:0.9375rem;line-height:1.4">${item.title}</h3>
          <p style="font-size:0.8rem;line-height:1.65;color:var(--color-muted)">${item.summary}</p>
        </article>
      `).join("")
    : `<p class="note-box">此年份（${refYear}）無對應背景資料。</p>`;

  setHtml(root, `
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <p style="font-size:0.75rem;color:var(--color-muted);font-weight:500">${label}</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:0.75rem">
        ${cards}
      </div>
    </div>
  `);
}
