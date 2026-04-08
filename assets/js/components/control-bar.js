import { setHtml } from "../utils/dom.js";

export function renderControlBar(model) {
  const root = document.querySelector("#control-bar");
  if (!root) return;

  const composerOptions = model.composers
    .map(
      (composer) =>
        `<option value="${composer.id}">${composer.name}</option>`
    )
    .join("");

  setHtml(
    root,
    `
      <form class="toolbar">
        <div class="field">
          <label for="composer-select">音樂家</label>
          <select id="composer-select" name="composer">
            ${composerOptions}
          </select>
        </div>
        <div class="field">
          <label for="period-filter">時期</label>
          <select id="period-filter" name="period">
            <option value="all">全部時期</option>
            <option value="early">早期 Early</option>
            <option value="middle">中期 Middle</option>
            <option value="late">晚期 Late</option>
          </select>
        </div>
        <div class="field">
          <label for="search-input">搜尋</label>
          <input id="search-input" name="search" type="search" placeholder="搜尋作品或事件">
        </div>
      </form>
    `
  );
}
