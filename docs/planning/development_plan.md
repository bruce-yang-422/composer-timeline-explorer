# 音樂家時間軸系統｜開發企畫書（Development Plan）

## 一、專案概述

### 1. 專案名稱
Timeline of Music

### 2. 專案形式
- 靜態網站（Static Site）
- 純前端渲染
- 部署目標為 GitHub Pages
- 無後端 API、無登入系統

### 3. 目前開發階段
目前屬於「可運作原型」階段，但已超過最初骨架版，進入「可閱讀、可切換模式、可擴充資料」的內容型原型。

---

## 二、目前專案目標

現階段目標不是一次完成所有作曲家與完整圖表，而是先完成：
- 單一作曲家（Beethoven）的完整示範
- 從個人資料進入的閱讀路徑
- 生平、作品、背景三種內容的穩定整合
- 可擴充的 JSON 資料模型
- 為多作曲家擴充預留明確結構

---

## 三、目前技術架構

| 層級 | 技術 |
|------|------|
| 結構 | HTML |
| 互動 | Vanilla JavaScript |
| 樣式 | 標準 CSS + CSS variables + inline utility-like styling |
| 資料 | JSON |
| 媒體 | YouTube 連結 / iframe / fallback 外部開啟 |
| 部署 | GitHub Pages |

### 架構特性
- 所有資料以本地 JSON 管理
- 前端啟動時一次載入 composers / works / events / contexts / mappings
- 以 shared state 驅動畫面更新
- 目前主要透過 `bootstrap.js` 與各 component 組合頁面

---

## 四、目前專案結構

```text
/project-root
├── index.html
├── README.md
├── .gitignore
├── /assets
│   ├── /css
│   └── /js
│       ├── /components
│       ├── /core
│       └── /utils
├── /data
│   ├── /content
│   │   ├── composers.json
│   │   ├── works.json
│   │   ├── events.json
│   │   └── contexts.json
│   └── /mappings
│       ├── period_colors.json
│       └── work_type_labels.json
└── /docs
    ├── /planning
    ├── beethoven_comprehensive_guide.md
    └── introduction_to_beethoven_google.md
```

---

## 五、目前資料設計狀態

### 已建立的資料類型
- `composers.json`
- `works.json`
- `events.json`
- `contexts.json`
- `work_type_labels.json`
- `period_colors.json`

### 已完成的資料特性
- Beethoven 主資料已補完整
- `composers.json` 已加入個人資料、`tags` 與 `portrait`
- `works.json` 已加入代表作集合，且已補齊九大交響曲
- `events.json` 已加入 `timelineTitle`
- `works.json` / `events.json` 已加入 `sources`
- `works` / `events` 已加入 `age`
- `composer` 已加入 `ageAtDeath`
- 部分作品已支援媒體欄位與 fallback 顯示邏輯

### 目前仍缺少的 mapping / metadata
- `event_type_labels.json`
- `context_type_labels.json`
- 更細的排序、重要程度與推薦欄位
- 更完整的作曲家圖片與來源策略

---

## 六、目前功能狀態

### 已完成
- 首頁 Hero + 主內容區 + 背景層骨架
- Beethoven 資料載入
- 預設進入作曲家個人資料模式
- Composer 切換已可更新資料
- Era select 已可作用，並已補入中世紀選項
- Timeline 可顯示個人資料、生平事件、作品
- 個人資料卡在時間軸中已特殊化
- 點擊作品、事件、個人資料可更新中央內容
- Preview 已支援個人資料 / 事件 / 作品三種模式
- 作品導聆與分析區塊已能在個人資料模式下清空
- Context Panel 已支援個人資料 / 事件 / 作品三種模式
- Gantt 分布圖可點擊作品
- YouTube 可嵌入與不可嵌入 fallback

### 部分完成
- Timeline 的作品 type / period 篩選可作用
- 生平顯示可切換隱藏
- 中央視覺已具備第一版分布圖，但仍非最終分析圖表
- 來源欄位已進資料層，但前台尚未顯示

### 尚未完成
- 搜尋功能
- 第二位作曲家資料導入
- 更完整的事件 / 背景 type mapping
- URL state 與分享能力
- 正式測試流程與 build pipeline

---

## 七、目前互動邏輯

### 狀態模型
```js
const state = {
  selectedComposerId: null,
  selectedProfileId: null,
  selectedWorkId: null,
  selectedEventId: null,
  selectedContextId: null,
  selectedType: "all",
  selectedPeriod: "all",
  selectedEra: "all",
  hideEvents: false,
  searchTerm: "",
  timeRange: null
};
```

### 現有事件流
```text
載入資料
-> 設定預設 composer
-> 預設進入 selectedProfileId
-> render control bar / gantt / timeline / preview / visualization / context

點擊個人資料
-> 更新 selectedProfileId
-> 清空 selectedWorkId / selectedEventId
-> 重新 render 相關區塊

點擊事件
-> 更新 selectedEventId
-> 清空 selectedProfileId / selectedWorkId
-> 重新 render 相關區塊

點擊作品
-> 更新 selectedWorkId
-> 清空 selectedProfileId / selectedEventId
-> 重新 render 相關區塊
```

### 後續互動目標
- 搜尋真正作用於資料
- 更明確的時間排序與視覺優先級
- 來源資訊的前台顯示策略
- 多作曲家切換後的資料密度控制

---

## 八、目前 UI 實作策略

### 現階段策略
- 保持輕量、可直接執行
- 先用標準 CSS 與 inline style 建立穩定閱讀層次
- 先把資料與模式切換做對，再逐步強化圖表與動態效果

### 主要模組
- `control-bar.js`
- `timeline-view.js`
- `gantt-view.js`
- `visualization-view.js`
- `preview-panel.js`
- `context-panel.js`
- `bootstrap.js`
- `state.js`

### 媒體策略
- 可嵌入影片：iframe
- 不可嵌入影片：提示 + 外部連結
- 無影片：保持純閱讀模式

---

## 九、部署方式

### 部署平台
- GitHub Pages

### 網站網址
- https://bruce-yang-422.github.io/composer-timeline-explorer/

### 本機開發注意事項
- 前端使用 `fetch()` 載入 JSON
- 需透過 local server 開發
- 不建議直接雙擊 `index.html`

---

## 十、目前風險與限制

| 風險項目 | 說明 | 對策 |
|------|------|------|
| 單一作曲家偏重 | 目前主要以 Beethoven 為示範，資料模型仍需第二位作曲家驗證 | 導入第二位作曲家做壓力測試 |
| 資料量增加 | Timeline 卡片可能過長 | 保持 mode 切換、篩選與排序策略 |
| 外部媒體依賴 | YouTube 可能不可嵌入 | 長期保留 fallback |
| 外部圖片依賴 | 目前 portrait 使用 Wikimedia 圖片連結 | 之後可考慮改成本地資產或更完整來源策略 |
| 文件與實作落差 | 更新不及會失真 | 每次功能明顯變更後同步修文檔 |

---

## 十一、下一階段開發優先順序

### Phase 1
- 導入第二位作曲家
- 補齊 event / context type mappings
- 決定 `sources` 前台顯示策略

### Phase 2
- 加入搜尋功能
- 強化 timeline 分層與排序
- 改善主視覺分析圖表

### Phase 3
- URL state 與分享能力
- 多作曲家資料驗證
- 視需求升級工具鏈與測試流程

---

## 十二、結論

目前專案已經不只是「能點作品的頁面」，而是具備人物入口、事件與作品切換、背景聯動與來源欄位的閱讀型原型。下一步最重要的事不是再堆更多零散功能，而是讓這套資料模型與閱讀邏輯在更多作曲家身上也能成立。
