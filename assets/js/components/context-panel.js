import { setHtml } from "../utils/dom.js";

const TYPE_LABELS = {
  historical:    "歷史",
  cultural:      "文化",
  musical_trend: "音樂趨勢",
};
const SCOPE_LABELS = {
  music_internal: "音樂內部脈絡",
  external_context: "外部社會背景",
};

export function renderContextPanel(model) {
  const root = document.querySelector("#context-panel");
  if (!root) return;

  if (model.state.selectedComposerId === "site-intro") {
    setHtml(root, `
      <div class="note-box" style="display:flex;flex-direction:column;gap:0.5rem">
        <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">這個區塊會根據你目前查看的作曲家、事件或作品年份，自動顯示對應的歷史、文化與音樂趨勢背景。</p>
        <p style="font-size:0.8rem;line-height:1.7;color:var(--color-muted)">例如選到蕭邦作品時，這裡會出現浪漫主義、沙龍文化、民族主義與半音化等相關背景資料。</p>
      </div>
    `);
    return;
  }

  const selectedComposer = model.composers.find(c => c.id === model.state.selectedComposerId);
  const selectedEvent = model.events.find(e => e.id === model.state.selectedEventId);
  const selectedWork = model.works.find(w => w.id === model.state.selectedWorkId);
  const isProfileMode = Boolean(model.state.selectedProfileId);
  const isLifetimeMode = Boolean(selectedComposer) && (isProfileMode || (!selectedEvent && !selectedWork));

  // Profile mode or no explicit event/work selection:
  // show contexts overlapping the composer's lifetime.
  // Otherwise use event year first, then selected work year.
  const refYear = isLifetimeMode ? null : (selectedEvent?.year ?? selectedWork?.year ?? null);

  const relevant = isLifetimeMode
    ? model.contexts.filter(c =>
        selectedComposer &&
        c.start <= selectedComposer.death &&
        c.end >= selectedComposer.birth
      )
    : refYear !== null
      ? model.contexts.filter(c => c.start <= refYear && c.end >= refYear)
      : model.contexts.slice(0, 6);

  const sortedRelevant = [...relevant].sort((a, b) => {
    if (isLifetimeMode) {
      if (a.start !== b.start) return a.start - b.start;
      return a.end - b.end;
    }

    const aSpan = a.end - a.start;
    const bSpan = b.end - b.start;
    if (aSpan !== bSpan) return aSpan - bSpan;

    const aMidpoint = (a.start + a.end) / 2;
    const bMidpoint = (b.start + b.end) / 2;
    const aDistance = Math.abs(aMidpoint - refYear);
    const bDistance = Math.abs(bMidpoint - refYear);
    if (aDistance !== bDistance) return aDistance - bDistance;

    if (a.start !== b.start) return a.start - b.start;
    return a.end - b.end;
  });

  const label = isLifetimeMode
    ? `顯示 ${selectedComposer?.name ?? "此作曲家"} 生涯相關的時代背景`
    : selectedEvent
      ? `顯示 ${selectedEvent.year} 年前後的時代背景`
      : selectedWork
        ? `顯示 ${selectedWork.year} 年前後的時代背景`
        : "全部背景";

  const cards = sortedRelevant.length
      ? sortedRelevant.map(item => `
        <article class="context-card grid gap-1">
          <p class="data-card-meta">${item.start}–${item.end} · ${SCOPE_LABELS[item.scope] ?? item.scope ?? "背景"} · ${TYPE_LABELS[item.type] ?? item.type}</p>
          <h3 class="font-display" style="font-size:0.9375rem;line-height:1.4">${item.title}</h3>
          <p style="font-size:0.8rem;line-height:1.65;color:var(--color-muted)">${item.summary}</p>
        </article>
      `).join("")
    : isLifetimeMode
      ? `<p class="note-box">此作曲家生涯區間目前無對應背景資料。</p>`
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
