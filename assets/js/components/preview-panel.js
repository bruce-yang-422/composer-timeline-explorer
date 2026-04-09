import { setHtml } from "../utils/dom.js";

const EVENT_TYPE_LABELS = {
  personal:       "個人生涯",
  career:         "職業發展",
  health:         "健康",
  creative_shift: "創作轉向",
  family:         "家庭",
};

export function renderPreviewPanel(model) {
  const root = document.querySelector("#preview-panel");
  if (!root) return;

  if (model.state.selectedProfileId) {
    const composer = model.composers.find(c => c.id === model.state.selectedProfileId);
    if (composer) {
      if (composer.id === "site-intro") {
        const tags = Array.isArray(composer.tags) && composer.tags.length
          ? `<div style="display:flex;flex-wrap:wrap;gap:0.375rem">${composer.tags.map(tag => `<span class="chip">${tag}</span>`).join("")}</div>`
          : "";

        setHtml(root, `
          <article style="display:flex;flex-direction:column;gap:1rem">
            <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
              <p class="data-card-meta">網站導覽</p>
              <h3 style="font-family:var(--font-display);font-size:1.125rem;line-height:1.4;color:var(--color-ink)">${composer.fullName}</h3>
              <p style="font-size:0.875rem;line-height:1.8;color:var(--color-muted)">${composer.summary}</p>
              <p style="font-size:0.875rem;line-height:1.8;color:var(--color-ink)">${composer.intro}</p>
              ${tags}
            </div>

            <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
              <p class="data-card-meta">如何開始</p>
              <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">1. 從右上角下拉選單選擇一位作曲家。</p>
              <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">2. 先看個人資料與生平記事，再點時間軸上的作品節點。</p>
              <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">3. 中央可看影音、導聆、分析與延伸補充，下方可對照時代背景。</p>
            </div>
          </article>
        `);
        return;
      }

      const tags = Array.isArray(composer.tags) && composer.tags.length
        ? `<div style="display:flex;flex-wrap:wrap;gap:0.375rem">${composer.tags.map(tag => `<span class="chip">${tag}</span>`).join("")}</div>`
        : "";
      const portraitBlock = composer.portrait?.imageUrl ? `
        <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem;overflow:hidden;padding:0">
          <div style="aspect-ratio:4/3;overflow:hidden;background:#e9e1d6">
            <img
              src="${composer.portrait.imageUrl}"
              alt="${composer.portrait.alt ?? composer.fullName ?? composer.name}"
              loading="lazy"
              referrerpolicy="no-referrer"
              style="display:block;width:100%;height:100%;object-fit:cover;object-position:center 18%"
            >
          </div>
          ${composer.portrait.caption ? `<div style="padding:0 1rem 1rem"><p class="data-card-meta">${composer.portrait.caption}</p></div>` : ""}
        </div>
      ` : "";

      setHtml(root, `
        <article style="display:flex;flex-direction:column;gap:1rem">
          ${portraitBlock}

          <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
            <p class="data-card-meta">${composer.birth}–${composer.death} · ${composer.deathAgeLabel ?? ""}</p>
            <h3 style="font-family:var(--font-display);font-size:1.0625rem;line-height:1.45;color:var(--color-ink)">${composer.fullName ?? composer.name}</h3>
            <p style="font-size:0.875rem;line-height:1.8;color:var(--color-muted)">${composer.summary}</p>
            ${composer.intro ? `<p style="font-size:0.875rem;line-height:1.8;color:var(--color-ink)">${composer.intro}</p>` : ""}
          </div>

          <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
            <p class="data-card-meta">個人資料</p>
            <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">出生地：${composer.birthPlace ?? "—"}</p>
            <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">主要活動地：${composer.primaryLocation ?? "—"}</p>
            <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">國籍：${composer.nationality ?? "—"}</p>
            <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">時代位置：${composer.era ?? "—"}</p>
            ${tags}
          </div>
        </article>
      `);
      return;
    }
  }

  // ── Event detail view ───────────────────────────────────────────────────
  if (model.state.selectedEventId) {
    const ev = model.events.find(e => e.id === model.state.selectedEventId);
    if (ev) {
      const typeLabel = EVENT_TYPE_LABELS[ev.type] ?? ev.type;
      setHtml(root, `
        <article style="display:flex;flex-direction:column;gap:1rem">
          <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
            <p class="data-card-meta">${ev.year}${ev.age ? ` · ${ev.age} 歲` : ""} · ${typeLabel}</p>
            <h3 style="font-family:var(--font-display);font-size:1.0625rem;line-height:1.45;color:var(--color-ink)">${ev.title}</h3>
            <p style="font-size:0.875rem;line-height:1.8;color:var(--color-muted)">${ev.summary}</p>
          </div>
        </article>
      `);
      return;
    }
  }

  // ── Work detail view ────────────────────────────────────────────────────
  const selectedWork = model.works.find(w => w.id === model.state.selectedWorkId)
    ?? model.works.find(w => w.composerId === model.state.selectedComposerId);

  if (!selectedWork) {
    setHtml(root, `<p class="note-box">請從時間軸點選作品或生平事件。</p>`);
    return;
  }

  const typeLabel   = model.mappings.workTypeLabels[selectedWork.type] ?? selectedWork.type;
  const periodMap   = { early: "早期", middle: "中期", late: "晚期" };
  const periodLabel = periodMap[selectedWork.period] ?? selectedWork.period;

  // --- Media block ---
  let mediaBlock = "";

  if (selectedWork.media?.youtubeId && selectedWork.media.embeddable !== false) {
    mediaBlock = `
      <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
        <p class="data-card-meta">影音</p>
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
      </div>
    `;
  } else if (selectedWork.media?.youtubeUrl) {
    mediaBlock = `
      <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
        <p class="data-card-meta">影音</p>
        <div class="note-box" style="display:flex;flex-direction:column;gap:0.5rem">
          <p class="data-card-meta">此影片需前往 YouTube 原站觀看</p>
          ${selectedWork.performers ? `<p style="font-size:0.8rem;color:var(--color-muted)">${selectedWork.performers}</p>` : ""}
          <a class="button-link" href="${selectedWork.media.youtubeUrl}" target="_blank" rel="noreferrer">在 YouTube 上觀看</a>
        </div>
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

  // --- Cultural note block ---
  const culturalNoteBlock = selectedWork.cultural_note ? `
    <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
      <p class="data-card-meta">延伸補充</p>
      <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">${selectedWork.cultural_note}</p>
    </div>
  ` : "";

  setHtml(root, `
    <article style="display:flex;flex-direction:column;gap:1rem">

      ${mediaBlock}

      <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
        <p class="data-card-meta">${selectedWork.year}${selectedWork.age ? ` · ${selectedWork.age} 歲` : ""} · ${typeLabel} · ${periodLabel}</p>
        <h3 style="font-family:var(--font-display);font-size:1.0625rem;line-height:1.45;color:var(--color-ink)">${selectedWork.title}</h3>
        <p style="font-size:0.875rem;line-height:1.75;color:var(--color-muted)">${selectedWork.summary}</p>
      </div>

      ${guideBlock}
      ${analysisBlock}
      ${culturalNoteBlock}

    </article>
  `);
}
