import { setState } from "../core/state.js";
import { setHtml } from "../utils/dom.js";

const EVENT_TYPE_LABELS = {
  personal:       "個人生涯",
  career:         "職業發展",
  health:         "健康",
  creative_shift: "創作轉向",
  family:         "家庭",
};

function parseTimestampToSeconds(timestamp) {
  if (typeof timestamp !== "string" || !timestamp.trim()) return null;
  const parts = timestamp.trim().split(":").map(Number);
  if (parts.some(Number.isNaN)) return null;
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return (minutes * 60) + seconds;
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return (hours * 3600) + (minutes * 60) + seconds;
  }
  return null;
}

function appendQueryParam(url, key, value) {
  if (!url) return "";
  return `${url}${url.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(value)}`;
}

function buildStartUrl(url, seconds) {
  if (!url) return "";
  return appendQueryParam(url, "start", seconds);
}

function buildYoutubeTimeUrl(url, seconds) {
  if (!url) return "";
  return appendQueryParam(url, "t", seconds);
}

export function renderPreviewPanel(model, rerender) {
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
  const chapters = Array.isArray(selectedWork.media?.chapters) ? selectedWork.media.chapters : [];
  const canEmbedMedia = Boolean(selectedWork.media?.youtubeId && selectedWork.media?.embeddable !== false && selectedWork.media?.embedUrl);
  const chapterIndex = chapters.length
    ? Math.min(Math.max(model.state.selectedChapterIndex ?? 0, 0), chapters.length - 1)
    : null;
  const activeChapter = chapterIndex === null ? null : chapters[chapterIndex];
  const activeChapterSeconds = activeChapter ? parseTimestampToSeconds(activeChapter.start) : null;
  const activeEmbedUrl = activeChapterSeconds !== null
    ? buildStartUrl(selectedWork.media?.embedUrl, activeChapterSeconds)
    : selectedWork.media?.embedUrl;

  // --- Media block ---
  let mediaBlock = "";

  if (canEmbedMedia) {
    mediaBlock = `
      <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
        <p class="data-card-meta">影音</p>
        <div style="display:flex;flex-direction:column;gap:0.5rem">
          <div class="video-frame">
            <iframe
              src="${activeEmbedUrl}"
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

  const chapterBlock = chapters.length ? `
    <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
      <p class="data-card-meta">章節導覽</p>
      <div style="display:flex;flex-direction:column;gap:0.5rem">
        ${chapters.map((chapter) => {
          const movements = Array.isArray(chapter.movements) && chapter.movements.length
            ? `<p style="font-size:0.8rem;line-height:1.65;color:var(--color-muted)">${chapter.movements.join(" · ")}</p>`
            : "";
          const isActive = chapterIndex !== null && chapters[chapterIndex] === chapter;
          const seconds = parseTimestampToSeconds(chapter.start);

          if (canEmbedMedia) {
            return `
              <button
                type="button"
                data-chapter-index="${chapters.indexOf(chapter)}"
                style="display:block;width:100%;padding:0.75rem 0.875rem;border:1px solid ${isActive ? "var(--color-accent)" : "var(--color-line)"};border-radius:12px;text-align:left;color:inherit;background:${isActive ? "rgba(95, 70, 40, 0.08)" : "var(--color-paper)"};cursor:pointer"
              >
                <div style="display:flex;justify-content:space-between;gap:0.75rem;align-items:baseline">
                  <p style="font-size:0.875rem;font-weight:600;line-height:1.5;color:var(--color-ink)">${chapter.title}</p>
                  <p class="data-card-meta" style="white-space:nowrap">${chapter.start}</p>
                </div>
                ${movements}
              </button>
            `;
          }

          const fallbackUrl = selectedWork.media?.youtubeUrl
            ? buildYoutubeTimeUrl(selectedWork.media.youtubeUrl, seconds ?? 0)
            : "#";

          return `
            <a
              href="${fallbackUrl}"
              target="_blank"
              rel="noreferrer"
              style="display:block;padding:0.75rem 0.875rem;border:1px solid var(--color-line);border-radius:12px;text-decoration:none;color:inherit;background:var(--color-paper)"
            >
              <div style="display:flex;justify-content:space-between;gap:0.75rem;align-items:baseline">
                <p style="font-size:0.875rem;font-weight:600;line-height:1.5;color:var(--color-ink)">${chapter.title}</p>
                <p class="data-card-meta" style="white-space:nowrap">${chapter.start}</p>
              </div>
              ${movements}
            </a>
          `;
        }).join("")}
      </div>
      ${selectedWork.media?.youtubeUrl ? `
        <p style="font-size:0.8rem;line-height:1.6;color:var(--color-muted)">
          若播放器載入或定位異常，請改用
          <a href="${activeChapterSeconds !== null ? buildYoutubeTimeUrl(selectedWork.media.youtubeUrl, activeChapterSeconds) : selectedWork.media.youtubeUrl}" target="_blank" rel="noreferrer">YouTube 對應章節</a>
        </p>
      ` : ""}
    </div>
  ` : "";

  // --- Listening guide block ---
  const guideBlock = selectedWork.listening_guide ? `
    <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
      <p class="data-card-meta">聆聽導引</p>
      <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink);white-space:pre-line">${selectedWork.listening_guide}</p>
    </div>
  ` : "";

  // --- Analysis block ---
  const analysisBlock = selectedWork.analysis ? `
    <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
      <p class="data-card-meta">樂曲分析</p>
      <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink);white-space:pre-line">${selectedWork.analysis}</p>
    </div>
  ` : "";

  // --- Cultural note block ---
  const culturalNoteBlock = selectedWork.cultural_note ? `
    <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
      <p class="data-card-meta">延伸補充</p>
      <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink);white-space:pre-line">${selectedWork.cultural_note}</p>
    </div>
  ` : "";

  setHtml(root, `
    <article style="display:flex;flex-direction:column;gap:1rem">

      ${mediaBlock}
      ${chapterBlock}

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

  if (rerender && chapters.length) {
    root.querySelectorAll("[data-chapter-index]").forEach((el) => {
      el.addEventListener("click", () => {
        setState({ selectedChapterIndex: Number(el.dataset.chapterIndex) });
        rerender();
      });
    });
  }
}
