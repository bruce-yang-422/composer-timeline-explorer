# Timeline of Music
# 音樂中的時間軸探索

An interactive static website for exploring composers through time by connecting personal profile, biography, works, and historical context.  
這是一個以「時間」為核心的互動式靜態網站，透過整合作曲家個人資料、生平、作品與歷史背景，幫助使用者在脈絡中理解音樂。

Live Site: [Timeline of Music](https://bruce-yang-422.github.io/composer-timeline-explorer/)  
網站網址：[Timeline of Music](https://bruce-yang-422.github.io/composer-timeline-explorer/)

## Overview
## 專案簡介

This project focuses on timeline-based music learning and exploration.  
本專案以時間軸為主體，結合音樂史、作品資料、人物資料與互動介面設計。

The current implementation uses a static frontend architecture with HTML, Vanilla JavaScript, CSS, and JSON-based content.  
目前專案採靜態前端架構，使用 HTML、Vanilla JavaScript、CSS 與 JSON 資料內容。

The current prototype now supports Beethoven, Chopin, Puccini, Rachmaninoff, Tchaikovsky, and Vivaldi in the content layer, with composer profile mode, life events, major works, historical context, age metadata, source metadata, portrait image, and media fallback handling.  
目前原型已在內容層納入 Beethoven、Chopin、Puccini、Rachmaninoff、Tchaikovsky 與 Vivaldi，並支援作曲家個人資料模式、生平記事、代表作品、時代背景、年齡欄位、來源欄位、肖像圖片與媒體 fallback 顯示邏輯。

## Current Status
## 目前狀態

### Already implemented
### 已完成

- Static project structure and GitHub Pages deployment target.  
  靜態專案結構與 GitHub Pages 部署目標已建立。

- A working homepage prototype with Hero, Timeline, Gantt distribution view, Preview Panel, and Context Layer.  
  已建立可運作首頁原型，包含 Hero、Timeline、Gantt 分布圖、Preview 與 Context Layer。

- Composer content has been expanded across composers, works, events, and contexts.  
  作曲家資料已擴充到 composers、works、events 與 contexts 四個層次。

- Works and events are now split by composer for easier maintenance and faster loading.  
  works 與 events 已依作曲家拆分，方便維護與載入。

- Default entry now opens the selected composer profile instead of a work.  
  目前首頁預設先顯示作曲家個人資料，而不是先顯示作品。

- Beethoven’s nine symphonies are included in the Beethoven work dataset.  
  貝多芬九大交響曲已收錄在 Beethoven 的作品資料中。

- Source metadata added to works and events for future traceability.  
  `works` 與 `events` 已加入 `sources` 欄位，作為後續追溯與顯示基礎。

- Media fallback handling for YouTube videos that cannot be embedded.  
  已處理 YouTube 無法嵌入時的 fallback 顯示邏輯。

### In progress / not yet completed
### 進行中 / 尚未完成

- Search is not implemented yet.  
  搜尋功能尚未完成。

- Beethoven is still the most mature composer profile in the UI, while the content layer now also includes Chopin, Puccini, Rachmaninoff, Tchaikovsky, and Vivaldi.  
  UI 目前仍以 Beethoven 最成熟，但內容層也已納入 Chopin、Puccini、Rachmaninoff、Tchaikovsky 與 Vivaldi。

- Source metadata is stored in JSON but not yet shown in the frontend.  
  `sources` 已進資料層，但前台尚未顯示。

- The visualization layer is usable but not yet the final chart system.  
  主視覺區已可操作，但仍非最終圖表系統。

## Project Structure
## 專案結構

```text
composer-timeline-explorer/
├── index.html
├── README.md
├── .gitignore
├── assets/
│   ├── css/
│   └── js/
│       ├── components/
│       ├── core/
│       └── utils/
├── data/
│   ├── content/
│   │   ├── composers.json
│   │   ├── contexts.json
│   │   ├── works.json
│   │   ├── events.json
│   │   ├── works/
│   │   │   ├── beethoven.json
│   │   │   ├── chopin.json
│   │   │   ├── puccini.json
│   │   │   ├── rachmaninoff.json
│   │   │   ├── tchaikovsky.json
│   │   │   └── vivaldi.json
│   │   └── events/
│   │       ├── beethoven.json
│   │       ├── chopin.json
│   │       ├── puccini.json
│   │       ├── rachmaninoff.json
│   │       ├── tchaikovsky.json
│   │       └── vivaldi.json
│   └── mappings/
│       ├── period_colors.json
│       └── work_type_labels.json
└── docs/
    ├── planning/
    ├── beethoven/
    ├── chopin/
    ├── Puccini/
    ├── Rachmaninoff/
    ├── Tchaikovsky/
    └── Vivaldi/
```

## Current Stack
## 目前技術組成

- HTML  
  頁面結構。

- Vanilla JavaScript  
  狀態、渲染與模組化互動邏輯。

- CSS  
  CSS variables、元件樣式與輕量 inline styling。

- JSON content files  
  composers、works、events、contexts 與 mappings。

- GitHub Pages  
  部署平台。

## Data Notes
## 資料設計補充

- `composers.json`  
  作曲家主資料，已包含 `portrait`、`summary`、`intro`、`tags`。

- `events.json`  
  生平記事索引資料，主資料改由 `data/content/events/<composer>.json` 分檔維護。

- `works.json`  
  作品索引資料，主資料改由 `data/content/works/<composer>.json` 分檔維護。

- `data/content/events/<composer>.json`  
  依作曲家拆分的生平記事資料，便於擴充與來源追蹤。

- `data/content/works/<composer>.json`  
  依作曲家拆分的作品資料，便於長篇作品分析與維護。

- `sources`  
  目前只存在資料層，前台尚未顯示。

## Language Rules
## 語言規範

- UI text should be written in Traditional Chinese.  
  UI 文案以繁體中文為主。

- Composer names, work titles, and specialist terms should use Traditional Chinese plus original wording when appropriate.  
  作曲家名、作品名與專有名詞採繁中 + 原文。

- Internal keys and IDs remain in English for maintainability.  
  內部欄位、ID 與程式鍵值維持英文。

## Development Notes
## 開發說明

Use a local server during development instead of opening `index.html` directly from the filesystem.  
開發時請使用 local server，不要直接雙擊 `index.html`。

The current project is a working prototype, not the final visualization product.  
目前專案是可運作原型，尚非最終版資料視覺化產品。

The app now loads content from `assets/js/core/config.js` and the split composer data files under `data/content/works/` and `data/content/events/`.  
應用程式目前會透過 `assets/js/core/config.js` 載入拆分後的作曲家資料檔。

## Documents
## 文件位置

- [design_principles.md](./docs/planning/design_principles.md)
- [development_plan.md](./docs/planning/development_plan.md)
- [implementation_and_current_status.md](./docs/planning/implementation_and_current_status.md)
- [ui_architecture_and_interaction_model.md](./docs/planning/ui_architecture_and_interaction_model.md)
