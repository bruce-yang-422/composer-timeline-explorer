import { setHtml } from "../utils/dom.js";

export function renderTimelineView(model) {
  const root = document.querySelector("#timeline-view");
  if (!root) return;

  const eventCards = model.events
    .slice(0, 3)
    .map(
      (event) => `
        <article class="card timeline-item">
          <p class="card__meta">${event.year} · ${event.type}</p>
          <h3>${event.title}</h3>
        </article>
      `
    )
    .join("");

  const workCards = model.works
    .slice(0, 3)
    .map(
      (work) => `
        <article class="card timeline-item timeline-item--work">
          <p class="card__meta">${work.year} · ${work.type}</p>
          <h3>${work.title}</h3>
        </article>
      `
    )
    .join("");

  setHtml(
    root,
    `
      <div class="stack">
        <div class="placeholder-note">
          後續可用 D3 或 SVG 將時間軸節點視覺化；目前先以清楚的資料結構與區塊骨架為主。
        </div>
        ${eventCards}
        ${workCards}
      </div>
    `
  );
}
