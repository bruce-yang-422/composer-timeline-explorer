import { setHtml } from "../utils/dom.js";

export function renderContextPanel(model) {
  const root = document.querySelector("#context-panel");
  if (!root) return;

  const contextCards = model.contexts
    .slice(0, 6)
    .map(
      (item) => `
        <article class="context-card grid gap-2">
          <p class="data-card-meta">${item.start}-${item.end} · ${item.type}</p>
          <h3 class="font-display text-xl tracking-[0.02em]">${item.title}</h3>
          <p class="text-sm leading-7 text-muted">${item.summary}</p>
        </article>
      `
    )
    .join("");

  setHtml(root, `<div class="grid gap-4 lg:grid-cols-2">${contextCards}</div>`);
}
