# Timeline of Music
# 音樂中的時間軸探索

An interactive static website for exploring composers through time by connecting biography, works, and historical context.  
這是一個以「時間」為核心的互動式靜態網站，透過整合作曲家生平、作品與歷史背景，幫助使用者在脈絡中理解音樂。

Live Site: [Timeline of Music](https://bruce-yang-422.github.io/composer-timeline-explorer/)  
網站網址：[Timeline of Music](https://bruce-yang-422.github.io/composer-timeline-explorer/)

## Overview
## 專案簡介

This project focuses on timeline-based music learning and exploration.  
本專案以時間軸為主體，結合音樂史、作品資料與互動介面設計。

The current implementation uses a static frontend architecture with HTML, Vanilla JavaScript, Tailwind utility class, and JSON-based content.  
目前專案採靜態前端架構，使用 HTML、Vanilla JavaScript、Tailwind utility class 與 JSON 資料內容。

The current prototype already includes a first Beethoven data set with works, life events, historical context, age metadata, and media fallback handling.  
目前原型已包含第一批 Beethoven 資料，涵蓋作品、生平記事、時代背景、年齡欄位與媒體 fallback 顯示邏輯。

## Current Status
## 目前狀態

### Already implemented
### 已完成

- Static project structure and GitHub Pages deployment target.  
  靜態專案結構與 GitHub Pages 部署目標已建立。

- A working homepage prototype with Hero, Timeline, Main Visualization placeholder, Preview Panel, and Context Layer.  
  已建立可運作首頁原型，包含 Hero、Timeline、主視覺保留區、Preview 與 Context Layer。

- Beethoven content expanded across composers, works, events, and contexts.  
  Beethoven 的作曲家、作品、記事與背景資料已擴充完成。

- Age metadata added to works and events for timeline interpretation.  
  作品與記事已加入年齡欄位，支援時間軸閱讀。

- Media fallback handling for YouTube videos that cannot be embedded.  
  已處理 YouTube 無法嵌入時的 fallback 顯示邏輯。

### In progress / not yet completed
### 進行中 / 尚未完成

- Composer switching is not fully wired to data flow yet.  
  Composer 切換尚未完整串接資料流。

- Search and period filtering are not active yet.  
  搜尋與時期篩選尚未正式生效。

- The center visualization area is still a placeholder, not the final chart system.  
  中央主視覺區仍是保留區，尚未完成正式圖表系統。

- Timeline and Context do not yet have full time-linked synchronization.  
  Timeline 與 Context 尚未完成真正的時間聯動。

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

## Current Stack
## 目前技術組成

- HTML  
  頁面結構。

- Vanilla JavaScript  
  狀態、渲染與模組化互動邏輯。

- Tailwind utility class + standard CSS component styling  
  版面與元件樣式。

- JSON content files  
  composers、works、events、contexts 與 mappings。

- GitHub Pages  
  部署平台。

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

## Documents
## 文件位置

- [design_principles.md](./docs/planning/design_principles.md)
- [development_plan.md](./docs/planning/development_plan.md)
- [ui_architecture_and_interaction_model.md](./docs/planning/ui_architecture_and_interaction_model.md)
