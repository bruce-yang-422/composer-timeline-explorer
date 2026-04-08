import { setState } from "../core/state.js";
import { setHtml } from "../utils/dom.js";

const PERIOD_LABELS = { early: "早期", middle: "中期", late: "晚期" };

export function renderTimelineView(model, rerender) {
  const root = document.querySelector("#timeline-view");
  if (!root) return;

  const { selectedComposerId, selectedWorkId, selectedType, selectedPeriod } = model.state;

  const allWorks = model.works.filter(w => w.composerId === selectedComposerId);
  const events   = model.events.filter(e => e.composerId === selectedComposerId);

  // Derive available types
  const allTypes = [...new Set(allWorks.map(w => w.type))];

  // Filter works
  const filteredWorks = allWorks.filter(w => {
    const typeOk   = !selectedType   || selectedType   === "all" || w.type   === selectedType;
    const periodOk = !selectedPeriod || selectedPeriod === "all" || w.period === selectedPeriod;
    return typeOk && periodOk;
  });

  // Combine and sort all items by year
  const items = [
    ...events.map(e => ({ ...e, _kind: "event" })),
    ...filteredWorks.map(w => ({ ...w, _kind: "work" })),
  ].sort((a, b) => a.year - b.year);

  // Filter chips — type
  const typeChips = [
    `<button class="filter-chip${!selectedType || selectedType === "all" ? " is-on" : ""}" data-filter-type="all">全部</button>`,
    ...allTypes.map(t =>
      `<button class="filter-chip${selectedType === t ? " is-on" : ""}" data-filter-type="${t}">${model.mappings.workTypeLabels[t] ?? t}</button>`
    ),
  ].join("");

  // Filter chips — period
  const periodChips = Object.entries(PERIOD_LABELS).map(([key, label]) =>
    `<button class="filter-chip${selectedPeriod === key ? " is-on" : ""}" data-filter-period="${key}">${label}</button>`
  ).join("");

  // Timeline items
  const cards = items.map(item => {
    if (item._kind === "event") {
      return `
        <article class="timeline-event grid gap-1">
          <p class="data-card-meta">${item.year}${item.age ? ` · 年齡 ${item.age}` : ""} · ${item.type}</p>
          <h3 class="font-display" style="font-size:0.9375rem;line-height:1.4">${item.title}</h3>
          ${item.summary ? `<p style="font-size:0.8rem;line-height:1.65;color:var(--color-muted)">${item.summary}</p>` : ""}
        </article>
      `;
    }
    const isActive = item.id === selectedWorkId;
    const mediaFlag = item.media?.youtubeUrl
      ? `<span class="chip">影片</span>`
      : "";
    return `
      <button
        class="timeline-button${isActive ? " is-active" : ""}"
        type="button"
        data-work-id="${item.id}"
      >
        <p class="data-card-meta">${item.year}${item.age ? ` · ${item.age} 歲` : ""} · ${model.mappings.workTypeLabels[item.type] ?? item.type} · ${PERIOD_LABELS[item.period] ?? item.period}</p>
        <h3 class="font-display" style="font-size:0.9375rem;line-height:1.4">${item.title}</h3>
        <p style="font-size:0.8rem;line-height:1.65;color:var(--color-muted)">${item.summary ?? ""}</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.375rem">${mediaFlag}</div>
      </button>
    `;
  }).join("");

  setHtml(root, `
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <div style="display:flex;flex-wrap:wrap;gap:0.375rem">
        ${typeChips}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:0.375rem">
        ${periodChips}
        ${selectedType !== "all" || (selectedPeriod && selectedPeriod !== "all")
          ? `<button class="filter-chip" data-filter-reset>清除篩選</button>`
          : ""}
      </div>
      <div style="display:flex;flex-direction:column;gap:0.625rem">
        ${cards || `<p class="note-box">目前篩選條件下無結果。</p>`}
      </div>
    </div>
  `);

  // Event delegation
  root.querySelectorAll("[data-work-id]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedWorkId: el.dataset.workId });
      rerender();
    });
  });

  root.querySelectorAll("[data-filter-type]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedType: el.dataset.filterType });
      rerender();
    });
  });

  root.querySelectorAll("[data-filter-period]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedPeriod: el.dataset.filterPeriod });
      rerender();
    });
  });

  root.querySelectorAll("[data-filter-reset]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedType: "all", selectedPeriod: null });
      rerender();
    });
  });
}
