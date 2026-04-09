import { setState } from "../core/state.js";
import { setHtml } from "../utils/dom.js";

const PERIOD_LABELS = { early: "早期", middle: "中期", late: "晚期" };

export function renderTimelineView(model, rerender) {
  const root    = document.querySelector("#timeline-view");
  const filters = document.querySelector("#timeline-filters");
  if (!root) return;

  const { selectedComposerId, selectedWorkId, selectedType, selectedPeriod, hideEvents } = model.state;

  const allWorks = model.works.filter(w => w.composerId === selectedComposerId);
  const events   = hideEvents ? [] : model.events.filter(e => e.composerId === selectedComposerId);

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

  const toggleBtn = `
    <button
      class="filter-chip${hideEvents ? " is-on" : ""}"
      data-toggle-events
      style="margin-left:auto"
    >${hideEvents ? "▶ 顯示生平" : "▼ 隱藏生平"}</button>
  `;

  const filterRow2 = `
    <div style="display:flex;flex-wrap:wrap;gap:0.375rem">
      ${periodChips}
      ${selectedType !== "all" || (selectedPeriod && selectedPeriod !== "all")
        ? `<button class="filter-chip" data-filter-reset>清除篩選</button>`
        : ""}
    </div>
  `;

  // ── Layout A: zigzag (events + works) ───────────────────────────────────
  function renderZigzag() {
    const rows = items.map(item => {
      const isEvent  = item._kind === "event";
      const isActive = item.id === selectedWorkId;
      const dotColor = isActive ? "#1C3D60" : (isEvent ? "#A09585" : "#4E7FAE");
      const dot = `<div style="display:flex;justify-content:center;padding-top:0.45rem"><div style="width:9px;height:9px;border-radius:50%;background:${dotColor};border:2px solid white;box-shadow:0 0 0 1.5px ${dotColor};flex-shrink:0"></div></div>`;

      if (isEvent) {
        return `<div style="display:contents">
          <article style="padding:0.4rem 0.5rem;border:1px solid var(--color-border-light);border-right:2px solid #A09585;border-radius:0.375rem;background:#F5F1EC;display:flex;flex-direction:column;gap:0.2rem">
            <p style="font-size:0.67rem;font-weight:600;color:var(--color-muted);text-align:right;white-space:nowrap">${item.year}${item.age ? ` · ${item.age}歲` : ""}</p>
            <h3 style="font-size:0.775rem;line-height:1.4;color:var(--color-ink);text-align:right">${item.title}</h3>
            ${item.summary ? `<p style="font-size:0.67rem;line-height:1.5;color:var(--color-muted);text-align:right">${item.summary}</p>` : ""}
          </article>
          ${dot}
          <div></div>
        </div>`;
      }
      const mediaFlag = item.media?.youtubeUrl ? `<span class="chip" style="font-size:0.64rem;padding:0.1rem 0.375rem">影片</span>` : "";
      return `<div style="display:contents">
        <div></div>
        ${dot}
        <button class="timeline-button${isActive ? " is-active" : ""}" type="button" data-work-id="${item.id}" style="padding:0.4rem 0.5rem;border-left:2px solid var(--color-accent)">
          <p class="data-card-meta" style="font-size:0.67rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.year}${item.age ? ` · ${item.age}歲` : ""} · ${model.mappings.workTypeLabels[item.type] ?? item.type}</p>
          <h3 style="font-size:0.775rem;line-height:1.4;color:var(--color-ink)">${item.title}</h3>
          ${mediaFlag ? `<div style="margin-top:0.2rem">${mediaFlag}</div>` : ""}
        </button>
      </div>`;
    }).join("");

    const empty = `<div style="grid-column:1/-1"><p class="note-box">目前篩選條件下無結果。</p></div>`;
    return `
      <div style="position:relative">
        <div style="position:absolute;left:50%;top:0;bottom:0;width:1.5px;background:var(--color-border-light);transform:translateX(-50%);z-index:0" aria-hidden="true"></div>
        <div style="display:grid;grid-template-columns:1fr 18px 1fr;gap:0.45rem 0;align-items:start;position:relative;z-index:1">
          <div style="font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--color-muted);text-align:right;padding-bottom:0.25rem">生平</div>
          <div></div>
          <div style="font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--color-muted);padding-bottom:0.25rem">作品</div>
          ${rows || empty}
        </div>
      </div>`;
  }

  // ── Layout B: single-column works only ──────────────────────────────────
  function renderWorksOnly() {
    const rows = filteredWorks.map(w => {
      const isActive = w.id === selectedWorkId;
      const dotColor = isActive ? "#1C3D60" : "#4E7FAE";
      const mediaFlag = w.media?.youtubeUrl ? `<span class="chip" style="font-size:0.64rem;padding:0.1rem 0.375rem">影片</span>` : "";
      return `
        <div style="display:flex;gap:0;align-items:stretch">
          <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:18px">
            <div style="width:1.5px;flex:1;background:var(--color-border-light)"></div>
            <div style="width:9px;height:9px;border-radius:50%;background:${dotColor};border:2px solid white;box-shadow:0 0 0 1.5px ${dotColor};flex-shrink:0;margin:2px 0"></div>
            <div style="width:1.5px;flex:1;background:var(--color-border-light)"></div>
          </div>
          <button class="timeline-button${isActive ? " is-active" : ""}" type="button" data-work-id="${w.id}" style="flex:1;margin-left:0;padding:0.4rem 0.5rem;border-left:2px solid var(--color-accent)">
            <p class="data-card-meta" style="font-size:0.67rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${w.year}${w.age ? ` · ${w.age}歲` : ""} · ${model.mappings.workTypeLabels[w.type] ?? w.type}</p>
            <h3 style="font-size:0.775rem;line-height:1.4;color:var(--color-ink)">${w.title}</h3>
            ${mediaFlag ? `<div style="margin-top:0.2rem">${mediaFlag}</div>` : ""}
          </button>
        </div>`;
    }).join("");
    return rows || `<p class="note-box">目前篩選條件下無結果。</p>`;
  }

  if (filters) {
    setHtml(filters, `
      <div style="display:flex;flex-direction:column;gap:0.375rem">
        <div style="display:flex;flex-wrap:wrap;gap:0.375rem;align-items:center">
          ${typeChips}
          ${toggleBtn}
        </div>
        ${filterRow2}
      </div>
    `);
  }

  setHtml(root, hideEvents ? renderWorksOnly() : renderZigzag());

  // Event delegation — works (inside scroll area)
  root.querySelectorAll("[data-work-id]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedWorkId: el.dataset.workId });
      rerender();
    });
  });

  // Event delegation — filters (outside scroll area)
  const filterRoot = filters ?? root;
  filterRoot.querySelectorAll("[data-filter-type]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedType: el.dataset.filterType });
      rerender();
    });
  });

  filterRoot.querySelectorAll("[data-filter-period]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedPeriod: el.dataset.filterPeriod });
      rerender();
    });
  });

  filterRoot.querySelectorAll("[data-filter-reset]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedType: "all", selectedPeriod: null });
      rerender();
    });
  });

  filterRoot.querySelectorAll("[data-toggle-events]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ hideEvents: !model.state.hideEvents });
      rerender();
    });
  });
}
