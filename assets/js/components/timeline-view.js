import { setState } from "../core/state.js";
import { setHtml } from "../utils/dom.js";

const PERIOD_LABELS = { early: "早期", middle: "中期", late: "晚期" };
const EVENT_TYPE_LABELS = {
  personal: "個人生涯",
  career: "職業發展",
  health: "健康",
  creative_shift: "創作轉向",
  family: "家庭",
};

// Extract the English portion from a bilingual title like "《Chinese》 English Title"
function englishTitle(title) {
  const idx = title.indexOf("》");
  return idx !== -1 ? title.slice(idx + 1).trim() : title;
}

// Extract the timeline-friendly event title while trimming trailing English translation.
function eventTitle(title) {
  const trimmed = title.trim();
  const withoutEnglish = trimmed.replace(/\s+[A-Za-z][A-Za-z0-9.'"-]*(?:\s+[A-Za-z0-9][A-Za-z0-9.'"-]*)*$/, "").trim();
  return withoutEnglish || trimmed;
}

export function renderTimelineView(model, rerender) {
  const root    = document.querySelector("#timeline-view");
  const filters = document.querySelector("#timeline-filters");
  if (!root) return;

  const { selectedComposerId, selectedProfileId, selectedWorkId, selectedEventId, selectedType, selectedPeriod, hideEvents } = model.state;

  const composer = model.composers.find(c => c.id === selectedComposerId);
  const isSiteIntro = selectedComposerId === "site-intro";
  const allWorks = model.works.filter(w => w.composerId === selectedComposerId);
  const events   = hideEvents ? [] : model.events.filter(e => e.composerId === selectedComposerId);
  const profileItem = hideEvents || !composer ? null : {
    id: composer.id,
    composerId: composer.id,
    year: composer.birth,
    age: 0,
    type: "profile",
    title: composer.name,
    timelineTitle: "個人資料",
    _kind: "profile"
  };

  if (isSiteIntro) {
    const featuredComposers = model.composers
      .filter(c => c.id !== "site-intro")
      .slice(0, 6);

    if (filters) {
      setHtml(filters, `
        <div style="display:flex;flex-wrap:wrap;gap:0.375rem;align-items:center">
          <span class="data-card-meta" style="margin-right:0.25rem">快速開始</span>
          ${featuredComposers.map(c => `<button class="filter-chip" data-intro-composer="${c.id}">${c.name}</button>`).join("")}
        </div>
      `);
    }

    setHtml(root, `
      <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
        <p class="data-card-meta">探索方式</p>
        <h3 style="font-family:var(--font-display);font-size:1rem;line-height:1.45;color:var(--color-ink)">從一位作曲家進入整體音樂史</h3>
        <p style="font-size:0.875rem;line-height:1.75;color:var(--color-muted)">選擇作曲家後，左側會出現生平記事，右側會出現代表作品；點任一節點，就能切換中央預覽與右側背景層。</p>
      </div>
    `);

    const filterRoot = filters ?? root;
    filterRoot.querySelectorAll("[data-intro-composer]").forEach(el => {
      el.addEventListener("click", () => {
        const newId = el.dataset.introComposer;
        setState({ selectedComposerId: newId, selectedWorkId: null, selectedChapterIndex: null, selectedProfileId: newId, selectedEventId: null });
        rerender();
      });
    });
    return;
  }

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
    ...(profileItem ? [profileItem] : []),
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
      const isProfile  = item._kind === "profile";
      const isEvent    = item._kind === "event";
      const isSelected = isProfile
        ? item.id === selectedProfileId
        : isEvent
          ? item.id === selectedEventId
          : item.id === selectedWorkId;
      const dotColor   = isSelected ? "#1C3D60" : (isProfile ? "#6C7A89" : (isEvent ? "#A09585" : "#4E7FAE"));
      const dot = isProfile
        ? `<div style="display:flex;justify-content:center;padding-top:0.42rem"><div style="width:10px;height:10px;background:${dotColor};border:2px solid white;box-shadow:0 0 0 1.5px ${dotColor};transform:rotate(45deg);flex-shrink:0"></div></div>`
        : `<div style="display:flex;justify-content:center;padding-top:0.45rem"><div style="width:9px;height:9px;border-radius:50%;background:${dotColor};border:2px solid white;box-shadow:0 0 0 1.5px ${dotColor};flex-shrink:0"></div></div>`;

      if (isProfile) {
        const borderColor = isSelected ? "#1C3D60" : "#6C5A45";
        const bg          = isSelected
          ? "linear-gradient(135deg, #EEF3FA 0%, #E5ECF5 100%)"
          : "linear-gradient(135deg, #F7F1E7 0%, #EFE7DB 100%)";
        const badgeBg     = isSelected ? "#DCE6F3" : "#E7D8C3";
        const badgeColor  = isSelected ? "#1C3D60" : "#6C4C2B";
        return `<div style="display:contents">
          <button type="button" data-profile-id="${item.id}"
            style="width:100%;padding:0.5rem 0.6rem;border:1px solid rgba(108,90,69,0.28);border-right:4px solid ${borderColor};border-radius:0.55rem;background:${bg};box-shadow:${isSelected ? "0 10px 24px rgba(28,61,96,0.10)" : "0 8px 18px rgba(108,90,69,0.08)"};display:flex;flex-direction:column;gap:0.24rem;cursor:pointer;transition:background 0.1s;text-align:right;position:relative;overflow:hidden">
            <div style="display:flex;justify-content:flex-end">
              <span style="display:inline-flex;align-items:center;padding:0.14rem 0.42rem;border-radius:999px;background:${badgeBg};color:${badgeColor};font-size:0.58rem;font-weight:700;letter-spacing:0.08em">作曲家檔案</span>
            </div>
            <p style="font-size:0.63rem;font-weight:600;color:var(--color-muted);white-space:nowrap">${composer.birth}–${composer.death} · ${composer.birthPlace ?? "作曲家"}</p>
            <h3 style="font-size:0.8rem;line-height:1.3;color:var(--color-ink);font-weight:700;text-align:right">${item.timelineTitle}</h3>
            <p style="font-size:0.66rem;line-height:1.4;color:var(--color-muted);font-family:var(--font-display);text-align:right">${composer.name}</p>
          </button>
          ${dot}
          <div></div>
        </div>`;
      }

      if (isEvent) {
        const borderColor = isSelected ? "#1C3D60" : "#A09585";
        const bg          = isSelected ? "#EEF3FA" : "#F5F1EC";
        const typeLabel   = EVENT_TYPE_LABELS[item.type] ?? item.type;
        return `<div style="display:contents">
          <button type="button" data-event-id="${item.id}"
            style="width:100%;padding:0.4rem 0.55rem;border:1px solid var(--color-border-light);border-right:2px solid ${borderColor};border-radius:0.375rem;background:${bg};display:flex;flex-direction:column;gap:0.18rem;cursor:pointer;transition:background 0.1s;text-align:right">
            <p style="font-size:0.63rem;font-weight:600;color:var(--color-muted);white-space:nowrap">${item.year}${item.age ? ` · ${item.age}歲` : ""} · ${typeLabel}</p>
            <h3 style="font-size:0.72rem;line-height:1.35;color:var(--color-ink);font-weight:500;text-align:right">${item.timelineTitle ?? eventTitle(item.title)}</h3>
          </button>
          ${dot}
          <div></div>
        </div>`;
      }

      const mediaFlag = item.media?.youtubeUrl ? `<span class="chip" style="font-size:0.62rem;padding:0.1rem 0.35rem">影片</span>` : "";
      return `<div style="display:contents">
        <div></div>
        ${dot}
        <button class="timeline-button${isSelected ? " is-active" : ""}" type="button" data-work-id="${item.id}"
          style="padding:0.35rem 0.5rem;border-left:2px solid var(--color-accent)">
          <p class="data-card-meta" style="font-size:0.63rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.year}${item.age ? ` · ${item.age}歲` : ""}</p>
          <h3 style="font-size:0.72rem;line-height:1.35;color:var(--color-ink);font-weight:500">${englishTitle(item.title)}</h3>
          ${mediaFlag ? `<div style="margin-top:0.15rem">${mediaFlag}</div>` : ""}
        </button>
      </div>`;
    }).join("");

    const empty = `<div style="grid-column:1/-1"><p class="note-box">目前篩選條件下無結果。</p></div>`;
    return `
      <div style="position:relative">
        <div style="position:absolute;left:50%;top:0;bottom:0;width:1.5px;background:var(--color-border-light);transform:translateX(-50%);z-index:0" aria-hidden="true"></div>
        <div style="display:grid;grid-template-columns:1fr 18px 1fr;gap:0.45rem 0;align-items:start;position:relative;z-index:1">
          <div style="font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--color-muted);text-align:right;padding-bottom:0.25rem">生平記事</div>
          <div></div>
          <div style="font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--color-muted);padding-bottom:0.25rem">作品</div>
          ${rows || empty}
        </div>
      </div>`;
  }

  // ── Layout B: single-column works only ──────────────────────────────────
  function renderWorksOnly() {
    const rows = filteredWorks.map(w => {
      const isActive  = w.id === selectedWorkId;
      const dotColor  = isActive ? "#1C3D60" : "#4E7FAE";
      const mediaFlag = w.media?.youtubeUrl ? `<span class="chip" style="font-size:0.62rem;padding:0.1rem 0.35rem">影片</span>` : "";
      return `
        <div style="display:flex;gap:0;align-items:stretch">
          <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:18px">
            <div style="width:1.5px;flex:1;background:var(--color-border-light)"></div>
            <div style="width:9px;height:9px;border-radius:50%;background:${dotColor};border:2px solid white;box-shadow:0 0 0 1.5px ${dotColor};flex-shrink:0;margin:2px 0"></div>
            <div style="width:1.5px;flex:1;background:var(--color-border-light)"></div>
          </div>
          <button class="timeline-button${isActive ? " is-active" : ""}" type="button" data-work-id="${w.id}"
            style="flex:1;margin-left:0;padding:0.35rem 0.5rem;border-left:2px solid var(--color-accent)">
            <p class="data-card-meta" style="font-size:0.63rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${w.year}${w.age ? ` · ${w.age}歲` : ""}</p>
            <h3 style="font-size:0.72rem;line-height:1.35;color:var(--color-ink);font-weight:500">${englishTitle(w.title)}</h3>
            ${mediaFlag ? `<div style="margin-top:0.15rem">${mediaFlag}</div>` : ""}
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

  root.querySelectorAll("[data-profile-id]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedProfileId: el.dataset.profileId, selectedEventId: null, selectedWorkId: null, selectedChapterIndex: null });
      rerender();
    });
  });

  // Event delegation — works (inside scroll area)
  root.querySelectorAll("[data-work-id]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedWorkId: el.dataset.workId, selectedChapterIndex: 0, selectedEventId: null, selectedProfileId: null });
      rerender();
    });
  });

  // Event delegation — life events (inside scroll area)
  root.querySelectorAll("[data-event-id]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedEventId: el.dataset.eventId, selectedWorkId: null, selectedChapterIndex: null, selectedProfileId: null });
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
