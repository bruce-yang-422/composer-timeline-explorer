# 音樂家時間軸系統｜開發企畫書（Development Plan）

## 一、專案概述

### 1. 專案名稱
音樂家時間軸探索（Composer Timeline Explorer）

### 2. 專案形式
- 靜態網站（Static Site）
- 純前端渲染
- 部署目標為 GitHub Pages
- 無後端 API、無登入系統

### 3. 目前開發階段
目前屬於「可運作原型」階段，已完成第一版前端骨架、Beethoven 資料整合與基本互動，但尚未完成完整視覺化與篩選流程。

---

## 二、目前專案目標

現階段目標不是一次做完所有作曲家與完整圖表，而是先完成：
- 單一作曲家（Beethoven）的完整資料示範
- 可閱讀的時間軸與預覽體驗
- 生平、作品、背景三種資料的基本整合
- 穩定的 JSON 資料模型
- 後續可擴充的前端結構

---

## 三、目前技術架構

| 層級 | 技術 |
|------|------|
| 結構 | HTML |
| 互動 | Vanilla JavaScript |
| 樣式 | Tailwind utility class + 標準 CSS 元件樣式 |
| 資料 | JSON |
| 媒體 | YouTube 連結 / iframe / fallback 外部開啟 |
| 部署 | GitHub Pages |

### 架構特性
- 所有資料以本地 JSON 管理
- 前端啟動時一次載入 composers / works / events / contexts / mappings
- 目前主要以 `bootstrap.js` 與各區塊 component 渲染畫面
- 使用 shared state 驅動畫面更新

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
- 作品清單已擴充為代表作集合
- 生平事件已整理成可展示時間線
- 背景資料已可支援 Context 區塊
- `works` / `events` 已加入 `age`
- `composer` 已加入 `ageAtDeath`
- 部分作品已支援媒體欄位與 fallback 顯示邏輯

### 目前仍缺少的 mapping
- `event_type_labels.json`
- `context_type_labels.json`
- 更細的排序、重要程度與推薦欄位

---

## 六、目前功能狀態

### 已完成
- 首頁 Hero + 三欄 + 底部背景層骨架
- Beethoven 資料載入
- 預設選取作品
- 點擊作品卡片更新 Preview
- Preview 媒體區塊與 YouTube fallback
- Context 資料載入與卡片顯示
- 文件與 README 初步同步

### 部分完成
- Control Bar UI 已存在
- 主題與版面樣式已建立
- 中央主視覺區已作為保留區

### 尚未完成
- Composer 切換真正生效
- 搜尋與篩選真正生效
- 中央主視覺圖表實作
- Timeline 與 Context 聯動
- 事件 / 背景顯示 mapping
- 第二位作曲家資料導入

---

## 七、目前互動邏輯

### 狀態模型
```js
const state = {
  selectedComposerId: null,
  selectedWorkId: null,
  selectedEventId: null,
  selectedContextId: null,
  selectedType: "all",
  selectedPeriod: "all",
  searchTerm: "",
  timeRange: null
};
```

### 現有事件流
```text
載入資料
-> 設定預設 composer
-> 選取預設作品
-> render control bar / timeline / visualization / preview / context

點擊作品卡片
-> 更新 selectedWorkId
-> 重新 render 相關區塊
```

### 後續互動目標
- Composer 切換後重設內容
- Filter 與 Search 真正作用於資料
- Context 根據目前作品或時間範圍更新

---

## 八、目前 UI 實作策略

### 現階段策略
- 保持輕量、可直接執行
- 先用 utility class 與少量標準 CSS 建立畫面層次
- 先讓資料與內容關係清楚，再補強真正圖表

### 模組劃分
- `control-bar.js`
- `timeline-view.js`
- `visualization-view.js`
- `preview-panel.js`
- `context-panel.js`
- `bootstrap.js`
- `state.js`

### 媒體策略
- 可嵌入影片：iframe
- 不可嵌入影片：提示 + 外部連結
- 無影片：placeholder

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
| 無後端支援 | 無法即時更新與多人編修 | 先以 JSON 維護流程降低複雜度 |
| 資料量增加 | 卡片式 timeline 容易過長 | 後續加入 filter、排序與分組 |
| 外部媒體依賴 | YouTube 可能不可嵌入 | 保留 fallback 設計 |
| 主視覺未完成 | 中央區塊尚未承擔分析任務 | 先保留區塊，再逐步視覺化 |
| 文件與實作落差 | 規劃若不更新會失真 | 持續以目前 repo 狀態修正文檔 |

---

## 十一、下一階段開發優先順序

### Phase 1
- 讓 Composer / Period / Search 生效
- 顯示 age 與更多 metadata
- 補齊事件與背景 type mapping

### Phase 2
- 將中央區塊做成第一版時間分布圖
- 讓 Context 跟年份與作品聯動
- 補排序與推薦邏輯

### Phase 3
- 導入第二位作曲家
- 評估 URL state 分享功能
- 視需求升級為正式 Tailwind build 或其他工具鏈

---

## 十二、結論

目前專案最重要的事不是再增加更多零散功能，而是讓資料模型、文件、互動邏輯與畫面展示維持一致。只要這個基礎穩定，後續要擴充更多作曲家、更多視覺化與更深的教學內容都會更容易。
