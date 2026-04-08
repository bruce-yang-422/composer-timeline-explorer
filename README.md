# Composer Timeline Explorer
# 音樂家時間軸探索

An interactive static website for exploring composers through time by connecting biography, works, and historical context.  
這是一個以「時間」為核心的互動式靜態網站，透過整合作曲家生平、作品與歷史背景，幫助使用者在脈絡中理解音樂。

Live Site: [composer-timeline-explorer](https://bruce-yang-422.github.io/composer-timeline-explorer/)  
網站網址：[composer-timeline-explorer](https://bruce-yang-422.github.io/composer-timeline-explorer/)

## Overview
## 專案簡介

This project focuses on timeline-based music learning and exploration.  
本專案以時間軸為主體，結合音樂史、作品資料與互動介面設計。

The current implementation uses a static frontend architecture with HTML, Vanilla JavaScript, Tailwind utility classes, and JSON-based content.  
目前專案採靜態前端架構，使用 HTML、Vanilla JavaScript、Tailwind utility class 與 JSON 資料內容。

The site is designed for a Traditional Chinese interface, while composer names, work titles, and specialist terms are presented in Traditional Chinese together with the original wording when appropriate.  
網站介面以繁體中文為主，作曲家、作品名稱與專有名詞採「繁中 + 原文」呈現。

The current prototype already includes a first Beethoven data set with works, life events, historical context, age metadata, and media fallback handling.  
目前原型已包含第一批 Beethoven 資料，涵蓋作品、生平記事、時代背景、年齡欄位與媒體 fallback 顯示邏輯。

## Goals
## 專案目標

- Build a timeline-first interface for understanding music history.  
  建立以時間為優先的介面，幫助使用者理解音樂史脈絡。

- Connect works to life events, historical background, and musical trends.  
  將作品與生平事件、歷史背景及音樂發展趨勢串接起來。

- Create a maintainable static-site structure suitable for future expansion.  
  建立一套易維護、可持續擴充的靜態網站架構。

## Project Structure
## 專案結構

```text
music_in_time/
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
│   └── mappings/
└── docs/
    ├── planning/
    ├── beethoven_comprehensive_guide.md
    └── introduction_to_beethoven_google.md
```

- `index.html`  
  Main site entry point.  
  網站主入口頁面。

- `assets/js/`  
  Frontend logic for state, rendering, and UI components.  
  前端邏輯層，包含狀態管理、畫面渲染與元件模組。

- `data/content/`  
  Core content such as composers, works, events, and contexts.  
  核心內容資料，例如音樂家、作品、事件與背景資訊。

- `data/mappings/`  
  UI-facing mappings such as labels and color definitions.  
  提供給介面使用的映射資料，例如標籤與色彩對應。

- `docs/planning/`  
  Planning, design, and development documents.  
  規劃、設計與開發相關文件。

- `docs/beethoven_comprehensive_guide.md` and `docs/introduction_to_beethoven_google.md`  
  Reference documents currently used to enrich Beethoven content.  
  目前用於整理 Beethoven 內容的參考文件。

## Current Stack
## 目前技術組成

- HTML for structure.  
  使用 HTML 建立結構。

- Vanilla JavaScript for state, rendering, and modular frontend logic.  
  使用原生 JavaScript 處理狀態、渲染與模組化邏輯。

- Tailwind utility classes plus standard CSS component styling.  
  使用 Tailwind utility class 搭配標準 CSS 元件樣式。

- JSON files for structured content and mappings.  
  使用 JSON 作為結構化內容與映射設定來源。

- GitHub Pages as the deployment target.  
  以 GitHub Pages 作為部署目標。

## Language Rules
## 語言規範

- UI labels, descriptions, and interface copy should be written in Traditional Chinese.  
  介面按鈕、區塊標題與說明文案應以繁體中文為主。

- Names of works, composers, events, and music terms should use Traditional Chinese plus the original wording when appropriate.  
  作品名、作曲家名、事件名與音樂術語，適合時應使用「繁中 + 原文」格式。

- Internal keys, IDs, and programmatic field values should remain in English for consistency and maintainability.  
  內部程式使用的 key、id 與欄位值建議維持英文，以利維護與擴充。

## Development Notes
## 開發說明

This project currently loads JSON from the client side.  
目前專案由前端直接讀取 JSON 資料。

Use a local server during development instead of opening `index.html` directly from the filesystem.  
開發時請使用本機伺服器，不要直接雙擊 `index.html` 開啟，否則瀏覽器可能阻擋資料載入。

The current implementation includes media fallback handling for YouTube videos that cannot be embedded.  
目前已實作 YouTube 影片無法嵌入時的 fallback 顯示邏輯。

The current prototype has not yet completed full filter, search, composer switching, or timeline visualization behavior.  
目前原型尚未完成完整的篩選、搜尋、作曲家切換與主時間視覺化功能。

## Documents
## 文件位置

- [design_principles.md](./docs/planning/design_principles.md)
- [development_plan.md](./docs/planning/development_plan.md)
- [ui_architecture_and_interaction_model.md](./docs/planning/ui_architecture_and_interaction_model.md)

## Status
## 目前狀態

- Project structure has been initialized.  
  專案資料夾結構已建立完成。

- Core frontend scaffolding is in place.  
  前端基礎骨架已建立。

- Beethoven content has been expanded across composer, works, events, and contexts.  
  Beethoven 的作曲家、作品、記事與背景資料已擴充完成。

- Work and event data now include age metadata for timeline interpretation.  
  作品與記事資料已加入年齡欄位，可支援時間軸閱讀。

- The current UI is a working prototype, not the final visualization system.  
  目前 UI 屬於可運作原型，尚非最終版資料視覺化系統。
