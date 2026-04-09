import { setState } from "../core/state.js";
import { setHtml } from "../utils/dom.js";

const PERIOD_LABELS = { early: "早期", middle: "中期", late: "晚期" };

const GENERIC_PERIOD_DESCRIPTIONS = {
  early: "作曲生涯早期作品，通常較接近技術建立、風格成形與個人語法逐步清晰的階段。",
  middle: "作曲生涯中期作品，常可見更穩定的成熟語法、更鮮明的代表性風格，以及對結構或表現力的進一步擴張。",
  late:  "作曲生涯晚期作品，往往更濃縮、更內省，或在和聲、形式與情感表達上展現更高度的個人化特徵。",
};

const COMPOSER_PERIOD_DESCRIPTIONS = {
  beethoven: {
    early: "早期（約 1770–1799）貝多芬在波昂與維也納奠定技術基礎，深受海頓、莫扎特影響，已展現個人風格雛形。",
    middle: "英雄期（約 1800–1815）聽力惡化後反而爆發更宏大的創作能量，戲劇性、動機發展與英雄敘事達到高峰。",
    late: "晚期（約 1816–1827）幾近全聾的他轉向更內省、複雜的語法，弦樂四重奏與奏鳴曲探索前所未有的精神深度。",
  },
};

export function renderVisualizationView(model, rerender) {
  const root = document.querySelector("#guide-panel");
  if (!root) return;

  if (model.state.selectedComposerId === "site-intro") {
    setHtml(root, `<p class="note-box">選擇作曲家並點選一首作品後，這裡會顯示作品時期、學術解析與同時期其他作品。</p>`);
    return;
  }

  if (model.state.selectedProfileId) {
    setHtml(root, `<p class="note-box">個人資料模式下沒有音樂說明與導聆資料。</p>`);
    return;
  }

  const selectedWork = model.works.find(w => w.id === model.state.selectedWorkId)
    ?? model.works.find(w => w.composerId === model.state.selectedComposerId);
  const composer = model.composers.find(c => c.id === model.state.selectedComposerId);

  if (!selectedWork) {
    setHtml(root, `<p class="note-box">請先在時間軸點選一首作品。</p>`);
    return;
  }

  const period      = selectedWork.period;
  const periodLabel = PERIOD_LABELS[period] ?? period;
  const periodDesc  = COMPOSER_PERIOD_DESCRIPTIONS[composer?.id]?.[period]
    ?? GENERIC_PERIOD_DESCRIPTIONS[period]
    ?? "";

  // Same-period works (excluding selected)
  const relatedWorks = model.works
    .filter(w => w.composerId === model.state.selectedComposerId && w.period === period && w.id !== selectedWork.id)
    .slice(0, 4);

  const relatedItems = relatedWorks.length
    ? relatedWorks.map(w => `
        <li>
          <button
            data-work-id="${w.id}"
            style="width:100%;text-align:left;padding:0.5rem 0;border:0;background:transparent;cursor:pointer;border-bottom:1px solid var(--color-border);display:flex;gap:0.5rem;align-items:baseline"
          >
            <span style="font-size:0.75rem;font-weight:600;color:var(--color-accent);flex-shrink:0">${w.year}</span>
            <span style="font-size:0.8rem;line-height:1.55;color:var(--color-muted)">${w.title}</span>
          </button>
        </li>
      `).join("")
    : `<li style="font-size:0.8rem;color:var(--color-muted)">同時期無其他作品。</li>`;

  const scholarlyBlock = selectedWork.scholarly_analysis ? `
    <div class="data-card" style="display:flex;flex-direction:column;gap:0.625rem">
      <p class="data-card-meta" style="display:flex;align-items:center;gap:0.4rem">
        <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--color-accent)"></span>
        學術解析
      </p>
      <p style="font-size:0.8rem;line-height:1.8;color:var(--color-ink);font-family:var(--font-display);letter-spacing:0.01em">${selectedWork.scholarly_analysis}</p>
    </div>
  ` : "";

  setHtml(root, `
    <div style="display:flex;flex-direction:column;gap:1rem">

      <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
        <p class="data-card-meta">作品時期</p>
        <p style="font-size:1rem;font-weight:700;color:var(--color-ink)">${periodLabel}</p>
        <p style="font-size:0.8rem;line-height:1.65;color:var(--color-muted)">${periodDesc}</p>
      </div>

      <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
        <p class="data-card-meta">作品資訊</p>
        <p style="font-size:0.8rem;line-height:1.6;color:var(--color-muted)">
          創作年份：${selectedWork.year}<br>
          ${selectedWork.age ? `作曲年齡：${selectedWork.age} 歲<br>` : ""}
          類型：${model.mappings.workTypeLabels[selectedWork.type] ?? selectedWork.type}
        </p>
      </div>

      ${scholarlyBlock}

      <div class="data-card" style="display:flex;flex-direction:column;gap:0.5rem">
        <p class="data-card-meta">同時期其他作品</p>
        <ul style="list-style:none;padding:0;margin:0">
          ${relatedItems}
        </ul>
      </div>

    </div>
  `);

  root.querySelectorAll("[data-work-id]").forEach(el => {
    el.addEventListener("click", () => {
      setState({ selectedWorkId: el.dataset.workId, selectedProfileId: null, selectedEventId: null });
      rerender();
    });
  });
}
