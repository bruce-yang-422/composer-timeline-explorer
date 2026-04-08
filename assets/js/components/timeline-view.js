import { setState } from "../core/state.js";
import { setHtml } from "../utils/dom.js";

export function renderTimelineView(model, rerender) {
  const root = document.querySelector("#timeline-view");
  if (!root) return;

  const composerWorks = model.works.filter(
    (work) => work.composerId === model.state.selectedComposerId
  );

  const composerEvents = model.events.filter(
    (event) => event.composerId === model.state.selectedComposerId
  );

  const eventCards = composerEvents
    .slice(0, 4)
    .map(
      (event) => `
        <article class="timeline-event grid gap-2">
          <p class="data-card-meta">${event.year} · ${event.type}</p>
          <h3 class="font-display text-xl tracking-[0.02em]">${event.title}</h3>
          <p class="text-sm leading-7 text-muted">${event.summary ?? ""}</p>
        </article>
      `
    )
    .join("");

  const workCards = composerWorks
    .slice(0, 8)
    .map((work) => {
      const isActive = work.id === model.state.selectedWorkId;
      const mediaFlag = work.media?.youtubeUrl
        ? '<span class="chip">影片 YouTube</span>'
        : "";

      return `
        <button
          class="timeline-button${isActive ? " is-active" : ""}"
          type="button"
          data-work-id="${work.id}"
        >
          <p class="data-card-meta">${work.year} · ${model.mappings.workTypeLabels[work.type] ?? work.type}</p>
          <h3 class="font-display text-xl tracking-[0.02em]">${work.title}</h3>
          <p class="text-sm leading-7 text-muted">${work.summary}</p>
          <div class="flex flex-wrap gap-2">${mediaFlag}</div>
        </button>
      `;
    })
    .join("");

  setHtml(
    root,
    `
      <div class="grid gap-4">
        <div class="note-box">
          後續可用 D3 或 SVG 將時間軸節點視覺化；目前先以 Tailwind 元件骨架整理生平與作品。點擊作品卡片可同步更新右側內容預覽。
        </div>
        <div class="grid gap-4">${eventCards}</div>
        <div class="grid gap-4">${workCards}</div>
      </div>
    `
  );

  root.querySelectorAll("[data-work-id]").forEach((element) => {
    element.addEventListener("click", () => {
      setState({ selectedWorkId: element.dataset.workId });
      rerender();
    });
  });
}
