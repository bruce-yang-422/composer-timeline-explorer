import { setHtml } from "../utils/dom.js";

export function renderPreviewPanel(model) {
  const root = document.querySelector("#preview-panel");
  if (!root) return;

  const selectedWork = model.works.find(
    (work) => work.id === model.state.selectedWorkId
  ) ?? model.works[0];

  let mediaBlock = `
    <div class="note-box">
      目前這首作品尚未加入影片來源。後續可補上 YouTube、音訊試聽或樂譜連結。
    </div>
  `;

  if (selectedWork.media?.youtubeId && selectedWork.media.embeddable !== false) {
    mediaBlock = `
      <div class="grid gap-3">
        <div class="video-frame">
          <iframe
            src="${selectedWork.media.embedUrl}"
            title="${selectedWork.media.sourceTitle}"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <p class="data-card-meta">${selectedWork.media.sourceTitle}</p>
        <p class="text-sm leading-7 text-muted">${selectedWork.performers ?? ""}</p>
        <p><a href="${selectedWork.media.youtubeUrl}" target="_blank" rel="noreferrer">在 YouTube 上觀看</a></p>
      </div>
    `;
  } else if (selectedWork.media?.youtubeUrl) {
    mediaBlock = `
      <div class="grid gap-3 rounded-2xl bg-accent/6 p-4">
        <p class="data-card-meta">此影片目前不支援嵌入播放</p>
        <p class="text-sm leading-7 text-muted">${selectedWork.media.embedNote ?? "此影片目前需前往 YouTube 原站觀看。"}</p>
        <p class="text-sm leading-7 text-muted">${selectedWork.performers ?? ""}</p>
        <p><a class="button-link" href="${selectedWork.media.youtubeUrl}" target="_blank" rel="noreferrer">在 YouTube 上觀看</a></p>
      </div>
    `;
  }

  setHtml(
    root,
    `
      <article class="grid gap-4">
        <div class="data-card grid gap-3">
          <p class="data-card-meta">${selectedWork.year} · ${model.mappings.workTypeLabels[selectedWork.type] ?? selectedWork.type}</p>
          <h3 class="font-display text-2xl tracking-[0.02em]">${selectedWork.title}</h3>
          <p class="text-sm leading-7 text-muted">${selectedWork.summary}</p>
        </div>
        <div class="data-card grid gap-3">
          <p class="data-card-meta">媒體</p>
          ${mediaBlock}
        </div>
      </article>
    `
  );
}
