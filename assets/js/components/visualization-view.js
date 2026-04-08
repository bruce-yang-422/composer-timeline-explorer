import { setHtml } from "../utils/dom.js";

export function renderVisualizationView(model) {
  const root = document.querySelector("#visualization-view");
  if (!root) return;

  const typePills = Object.values(model.mappings.workTypeLabels)
    .map((label) => `<span class="pill">${label}</span>`)
    .join("");

  setHtml(
    root,
    `
      <div class="stack">
        <div class="placeholder-note">
          這裡預留給主要視覺化圖表，例如 D3 甘特圖、群組條圖或 Canvas 型渲染。
        </div>
        <div class="pill-row">${typePills}</div>
      </div>
    `
  );
}
