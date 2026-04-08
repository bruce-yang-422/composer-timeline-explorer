import { setHtml } from "../utils/dom.js";

export function renderContextPanel(model) {
  const root = document.querySelector("#context-panel");
  if (!root) return;

  const contextCards = model.contexts
    .slice(0, 3)
    .map(
      (item) => `
        <article class="card timeline-item timeline-item--context">
          <p class="card__meta">${item.start}-${item.end} · ${item.type}</p>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </article>
      `
    )
    .join("");

  setHtml(root, `<div class="stack">${contextCards}</div>`);
}
