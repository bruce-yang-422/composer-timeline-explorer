import { setHtml } from "../utils/dom.js";

export function renderPreviewPanel(model) {
  const root = document.querySelector("#preview-panel");
  if (!root) return;

  const selectedWork = model.works.find(w => w.id === model.state.selectedWorkId)
    ?? model.works.find(w => w.composerId === model.state.selectedComposerId);

  if (!selectedWork) {
    setHtml(root, `<p class="note-box">請從時間軸選擇一首作品。</p>`);
    return;
  }

  const typeLabel   = model.mappings.workTypeLabels[selectedWork.type] ?? selectedWork.type;
  const periodMap   = { early: "早期", middle: "中期", late: "晚期" };
  const periodLabel = periodMap[selectedWork.period] ?? selectedWork.period;

  // --- Media block ---
  let mediaBlock = `<p class="note-box">此作品尚未加入影片來源。</p>`;

  if (selectedWork.media?.youtubeId && selectedWork.media.embeddable !== false) {
    mediaBlock = `
      <div style="display:flex;flex-direction:column;gap:0.5rem">
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
        ${selectedWork.media.sourceTitle ? `<p class="data-card-meta">${selectedWork.media.sourceTitle}</p>` : ""}
        ${selectedWork.performers ? `<p style="font-size:0.8rem;color:var(--color-muted)">${selectedWork.performers}</p>` : ""}
        <p style="font-size:0.8rem"><a href="${selectedWork.media.youtubeUrl}" target="_blank" rel="noreferrer">在 YouTube 上觀看</a></p>
      </div>
    `;
  } else if (selectedWork.media?.youtubeUrl) {
    mediaBlock = `
      <div class="note-box" style="display:flex;flex-direction:column;gap:0.5rem">
        <p class="data-card-meta">此影片需前往 YouTube 原站觀看</p>
        ${selectedWork.performers ? `<p style="font-size:0.8rem;color:var(--color-muted)">${selectedWork.performers}</p>` : ""}
        <a class="button-link" href="${selectedWork.media.youtubeUrl}" target="_blank" rel="noreferrer">在 YouTube 上觀看</a>
      </div>
    `;
  }

  // --- Listening guide block ---
  const guideBlock = selectedWork.listening_guide ? `
    <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
      <p class="data-card-meta">聆聽導引</p>
      <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">${selectedWork.listening_guide}</p>
    </div>
  ` : "";

  // --- Analysis block ---
  const analysisBlock = selectedWork.analysis ? `
    <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
      <p class="data-card-meta">樂曲分析</p>
      <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">${selectedWork.analysis}</p>
    </div>
  ` : "";

  setHtml(root, `
    <article style="display:flex;flex-direction:column;gap:1rem">

      <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
        <p class="data-card-meta">${selectedWork.year}${selectedWork.age ? ` · ${selectedWork.age} 歲` : ""} · ${typeLabel} · ${periodLabel}</p>
        <h3 style="font-family:var(--font-display);font-size:1.0625rem;line-height:1.45;color:var(--color-ink)">${selectedWork.title}</h3>
        <p style="font-size:0.875rem;line-height:1.75;color:var(--color-muted)">${selectedWork.summary}</p>
      </div>

      ${guideBlock}
      ${analysisBlock}

      <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
        <p class="data-card-meta">影音</p>
        ${mediaBlock}
      </div>

    </article>
  `);
}
