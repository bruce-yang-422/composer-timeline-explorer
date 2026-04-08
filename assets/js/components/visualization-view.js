import { setHtml } from "../utils/dom.js";

export function renderVisualizationView(model) {
  const root = document.querySelector("#visualization-view");
  if (!root) return;

  const typePills = Object.values(model.mappings.workTypeLabels)
    .map((label) => `<span class="chip">${label}</span>`)
    .join("");

  setHtml(
    root,
    `
      <div class="grid gap-4">
        <div class="note-box">
          這裡預留給主要視覺化圖表，例如 D3 甘特圖、群組條圖或 Canvas 型渲染。現階段先用 Tailwind 元件骨架維持資訊節奏與版面層次。
        </div>
        <div class="grid gap-3 rounded-[1.5rem] border border-stone-900/10 bg-stone-50/70 p-4">
          <div>
            <p class="text-sm font-semibold text-muted">目前已建立的作品分類</p>
            <p class="mt-1 text-sm leading-6 text-muted">後續可依這些類型做時間分布、數量統計與時期比較。</p>
          </div>
          <div class="flex flex-wrap gap-2">${typePills}</div>
        </div>
      </div>
    `
  );
}
