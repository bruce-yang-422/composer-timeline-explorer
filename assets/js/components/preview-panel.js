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

let youtubeApiPromise = null;
let activeMediaPlayer = null;
let latestMediaRenderToken = 0;

function destroyActiveMediaPlayer() {
  if (activeMediaPlayer?.destroy) {
    try {
      activeMediaPlayer.destroy();
    } catch {
      // ignore teardown failures
    }
  }
  activeMediaPlayer = null;
}

function buildMediaSources(selectedWork) {
  const primarySource = selectedWork.media
    ? [{ ...selectedWork.media, label: "Video 1", isPrimary: true }]
    : [];
  const alternateSources = Array.isArray(selectedWork.media?.alternateRecordings)
    ? selectedWork.media.alternateRecordings.map((source, index) => ({
        ...source,
        label: `Video ${index + 2}`,
        isPrimary: false
      }))
    : [];

  return [...primarySource, ...alternateSources];
}

function isEmbeddableMediaSource(source) {
  return Boolean(source?.youtubeId && source?.embedUrl && source?.embeddable !== false);
}

function resolveMediaSourceIndex(mediaSources, preferredIndex) {
  if (!mediaSources.length) return null;
  const normalizedPreferredIndex = Number.isInteger(preferredIndex)
    ? Math.min(Math.max(preferredIndex, 0), mediaSources.length - 1)
    : 0;

  const forwardSearch = Array.from({ length: mediaSources.length }, (_, index) => (normalizedPreferredIndex + index) % mediaSources.length);
  const playableIndex = forwardSearch.find(index => isEmbeddableMediaSource(mediaSources[index]));
  return playableIndex ?? null;
}

function findNextPlayableMediaSourceIndex(mediaSources, currentIndex) {
  if (!mediaSources.length || !Number.isInteger(currentIndex)) return null;
  for (let nextIndex = currentIndex + 1; nextIndex < mediaSources.length; nextIndex += 1) {
    if (isEmbeddableMediaSource(mediaSources[nextIndex])) return nextIndex;
  }
  return null;
}

function getMediaSourceTitle(source, fallbackTitle) {
  return source?.sourceTitle ?? source?.label ?? fallbackTitle ?? "影音來源";
}

function loadYouTubeIframeApi() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === "function") previousReady();
      resolve(window.YT ?? null);
    };

    const existing = document.querySelector('script[data-youtube-iframe-api="true"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.dataset.youtubeIframeApi = "true";
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

function renderFallbackIframe(host, source, startSeconds) {
  host.innerHTML = `
    <iframe
      src="${startSeconds !== null ? buildStartUrl(source.embedUrl, startSeconds) : source.embedUrl}"
      title="${getMediaSourceTitle(source)}"
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      style="width:100%;height:100%;border:0"
    ></iframe>
  `;
}

async function mountMediaPlayer({ hostId, source, startSeconds, onError, token }) {
  if (token !== latestMediaRenderToken) return;
  const host = document.getElementById(hostId);
  if (!host) return;

  if (!isEmbeddableMediaSource(source)) {
    renderFallbackIframe(host, source, startSeconds);
    return;
  }

  const YT = await loadYouTubeIframeApi();
  if (token !== latestMediaRenderToken) return;

  if (!YT?.Player) {
    renderFallbackIframe(host, source, startSeconds);
    return;
  }

  destroyActiveMediaPlayer();
  host.innerHTML = "";
  activeMediaPlayer = new YT.Player(hostId, {
    videoId: source.youtubeId,
    playerVars: {
      autoplay: 0,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      ...(Number.isFinite(startSeconds) && startSeconds > 0 ? { start: startSeconds } : {})
    },
    events: {
      onReady: (event) => {
        if (Number.isFinite(startSeconds) && startSeconds > 0) {
          event.target.seekTo(startSeconds, true);
        }
      },
      onError: () => {
        if (typeof onError === "function") onError();
      }
    }
  });
}

export function renderPreviewPanel(model, rerender) {
  const root = document.querySelector("#preview-panel");
  if (!root) return;

  destroyActiveMediaPlayer();

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
              <p style="font-size:0.875rem;line-height:1.8;color:var(--color-ink);white-space:pre-line">${composer.intro}</p>
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

          <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
            <p class="data-card-meta">個人資料</p>
            <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">出生地：${composer.birthPlace ?? "—"}</p>
            <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">主要活動地：${composer.primaryLocation ?? "—"}</p>
            <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">國籍：${composer.nationality ?? "—"}</p>
            <p style="font-size:0.875rem;line-height:1.75;color:var(--color-ink)">時代位置：${composer.era ?? "—"}</p>
            ${tags}
          </div>

          <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
            <p class="data-card-meta">${composer.birth}–${composer.death} · ${composer.deathAgeLabel ?? ""}</p>
            <h3 style="font-family:var(--font-display);font-size:1.0625rem;line-height:1.45;color:var(--color-ink)">${composer.fullName ?? composer.name}</h3>
            <p style="font-size:0.875rem;line-height:1.8;color:var(--color-muted)">${composer.summary}</p>
            ${composer.intro ? `<p style="font-size:0.875rem;line-height:1.8;color:var(--color-ink);white-space:pre-line">${composer.intro}</p>` : ""}
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
  const selectedWork = model.works.find(w =>
    w.id === model.state.selectedWorkId &&
    w.composerId === model.state.selectedComposerId
  ) ?? model.works.find(w => w.composerId === model.state.selectedComposerId);

  if (!selectedWork) {
    setHtml(root, `<p class="note-box">請從時間軸點選作品或生平事件。</p>`);
    return;
  }

  const typeLabel   = model.mappings.workTypeLabels[selectedWork.type] ?? selectedWork.type;
  const periodMap   = { early: "早期", middle: "中期", late: "晚期" };
  const periodLabel = periodMap[selectedWork.period] ?? selectedWork.period;
  const mediaSources = buildMediaSources(selectedWork);
  const selectedMediaSourceIndex = mediaSources.length
    ? Math.min(Math.max(model.state.selectedMediaSourceIndex ?? 0, 0), mediaSources.length - 1)
    : null;
  const activeMediaSourceIndex = resolveMediaSourceIndex(mediaSources, selectedMediaSourceIndex ?? 0);
  const activeMediaSource = activeMediaSourceIndex !== null ? mediaSources[activeMediaSourceIndex] : null;
  const chapters = Array.isArray(activeMediaSource?.chapters) ? activeMediaSource.chapters : [];
  const canEmbedMedia = Boolean(activeMediaSource && isEmbeddableMediaSource(activeMediaSource));
  const chapterIndex = chapters.length
    ? Math.min(Math.max(model.state.selectedChapterIndex ?? 0, 0), chapters.length - 1)
    : null;
  const activeChapter = chapterIndex === null ? null : chapters[chapterIndex];
  const activeChapterSeconds = activeChapter ? parseTimestampToSeconds(activeChapter.start) : null;
  const sourceLabel = activeMediaSource
    ? `${activeMediaSource.label ?? `Video ${activeMediaSourceIndex + 1}`} · ${getMediaSourceTitle(activeMediaSource, selectedWork.title)}`
    : "";
  const playerHostId = `media-player-${selectedWork.id}`;

  // --- Media block ---
  let mediaBlock = "";

  if (canEmbedMedia) {
    const mediaSourceButtons = mediaSources.length > 1 ? `
      <div style="display:flex;flex-wrap:wrap;gap:0.375rem">
        ${mediaSources.map((source, index) => `
          <button
            type="button"
            data-media-source-index="${index}"
            class="filter-chip${index === activeMediaSourceIndex ? " is-on" : ""}"
            style="padding:0.22rem 0.55rem"
          >${source.label ?? `Video ${index + 1}`}</button>
        `).join("")}
      </div>
    ` : "";

    mediaBlock = `
      <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
        <p class="data-card-meta">影音</p>
        <div style="display:flex;flex-direction:column;gap:0.5rem">
          ${mediaSourceButtons}
          <div class="video-frame">
            <div id="${playerHostId}" style="width:100%;height:100%"></div>
          </div>
          ${sourceLabel ? `<p class="data-card-meta">${sourceLabel}</p>` : ""}
          ${activeMediaSource?.performers ? `<p style="font-size:0.8rem;color:var(--color-muted)">${activeMediaSource.performers}</p>` : ""}
          ${activeMediaSource?.youtubeUrl ? `<p style="font-size:0.8rem"><a href="${activeMediaSource.youtubeUrl}" target="_blank" rel="noreferrer">在 YouTube 上觀看</a></p>` : ""}
        </div>
      </div>
    `;
  } else if (activeMediaSource?.youtubeUrl || mediaSources.some(source => source.youtubeUrl)) {
    const fallbackSource = activeMediaSource ?? mediaSources.find(source => source.youtubeUrl);
    const mediaSourceButtons = mediaSources.length > 1 ? `
      <div style="display:flex;flex-wrap:wrap;gap:0.375rem">
        ${mediaSources.map((source, index) => `
          <button
            type="button"
            data-media-source-index="${index}"
            class="filter-chip${index === activeMediaSourceIndex ? " is-on" : ""}"
            style="padding:0.22rem 0.55rem"
          >${source.label ?? `Video ${index + 1}`}</button>
        `).join("")}
      </div>
    ` : "";

    mediaBlock = `
      <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
        <p class="data-card-meta">影音</p>
        <div style="display:flex;flex-direction:column;gap:0.5rem">
          ${mediaSourceButtons}
          <div class="note-box" style="display:flex;flex-direction:column;gap:0.5rem">
            <p class="data-card-meta">此來源暫不支援內嵌播放，請改用 YouTube 原站</p>
            ${fallbackSource?.performers ? `<p style="font-size:0.8rem;color:var(--color-muted)">${fallbackSource.performers}</p>` : ""}
            ${fallbackSource?.youtubeUrl ? `<a class="button-link" href="${fallbackSource.youtubeUrl}" target="_blank" rel="noreferrer">在 YouTube 上觀看</a>` : ""}
          </div>
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

          const fallbackUrl = activeMediaSource?.youtubeUrl
            ? buildYoutubeTimeUrl(activeMediaSource.youtubeUrl, seconds ?? 0)
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
      ${activeMediaSource?.youtubeUrl ? `
        <p style="font-size:0.8rem;line-height:1.6;color:var(--color-muted)">
          若播放器載入或定位異常，請改用
          <a href="${activeChapterSeconds !== null ? buildYoutubeTimeUrl(activeMediaSource.youtubeUrl, activeChapterSeconds) : activeMediaSource.youtubeUrl}" target="_blank" rel="noreferrer">YouTube 對應章節</a>
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

  const renderToken = ++latestMediaRenderToken;

  if (mediaSources.length && activeMediaSource) {
    mountMediaPlayer({
      hostId: playerHostId,
      source: activeMediaSource,
      startSeconds: activeChapterSeconds,
      token: renderToken,
      onError: () => {
        const nextIndex = findNextPlayableMediaSourceIndex(mediaSources, activeMediaSourceIndex ?? -1);
        if (nextIndex === null || nextIndex === activeMediaSourceIndex) return;
        destroyActiveMediaPlayer();
        setState({ selectedMediaSourceIndex: nextIndex });
        rerender();
      }
    });
  }

  root.querySelectorAll("[data-media-source-index]").forEach((el) => {
    el.addEventListener("click", () => {
      setState({
        selectedMediaSourceIndex: Number(el.dataset.mediaSourceIndex)
      });
      rerender();
    });
  });

  if (rerender && chapters.length) {
    root.querySelectorAll("[data-chapter-index]").forEach((el) => {
      el.addEventListener("click", () => {
        setState({ selectedChapterIndex: Number(el.dataset.chapterIndex) });
        rerender();
      });
    });
  }
}
