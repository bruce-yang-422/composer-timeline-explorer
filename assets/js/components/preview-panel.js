import { setHtml } from "../utils/dom.js";

export function renderPreviewPanel(model) {
  const root = document.querySelector("#preview-panel");
  if (!root) return;

  const featuredWork = model.works[0];

  setHtml(
    root,
    `
      <article class="stack">
        <div class="card">
          <p class="card__meta">${featuredWork.year} · ${featuredWork.type}</p>
          <h3>${featuredWork.title}</h3>
          <p>${featuredWork.summary}</p>
        </div>
        <div class="card">
          <p class="card__meta">媒體</p>
          <p>此區可放置 YouTube 嵌入、音樂試聽，或樂譜與延伸參考資料。</p>
        </div>
      </article>
    `
  );
}
