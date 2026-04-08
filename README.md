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

The current implementation uses plain HTML, CSS, and JavaScript.  
目前以前端靜態架構為主，使用 HTML、CSS 與 JavaScript 開發。

The site is designed for a Traditional Chinese interface, while composer names, work titles, and specialist terms are presented in Traditional Chinese together with the original wording when appropriate.  
網站介面以繁體中文為主，作曲家、作品名稱與專有名詞採「繁中 + 原文」呈現。

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
│   ├── images/
│   └── js/
├── data/
│   ├── content/
│   └── mappings/
└── docs/
    └── planning/
```

- `index.html`  
  Main site entry point.  
  網站主入口頁面。

- `assets/`  
  Frontend assets, including styles, scripts, and images.  
  前端資源資料夾，包含樣式、腳本與圖片。

- `data/content/`  
  Core project content such as composers, works, events, and contexts.  
  核心內容資料，例如音樂家、作品、事件與背景資訊。

- `data/mappings/`  
  UI-facing mappings such as labels and color definitions.  
  提供給介面使用的映射資料，例如標籤與色彩對應。

- `docs/planning/`  
  Planning, design, and development documents.  
  規劃、設計與開發相關文件。

## Current Stack
## 目前技術組成

- HTML for document structure.  
  使用 HTML 建立文件結構。

- CSS for layout, components, and visual language.  
  使用 CSS 管理版面、元件與視覺樣式。

- Vanilla JavaScript for state, rendering, and modular frontend logic.  
  使用原生 JavaScript 處理狀態、渲染與模組化邏輯。

- JSON files for structured content and configuration-like mappings.  
  使用 JSON 作為結構化內容與映射設定來源。

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

The current project skeleton is intentionally lightweight and is ready for future integration with visualization libraries such as D3.  
目前骨架刻意保持輕量，後續可再接入 D3 等視覺化函式庫。

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

- Initial content and mappings are prepared for further UI implementation.  
  初步內容資料與映射檔已準備，可繼續往 UI 與互動功能開發。
