# 音樂家時間軸系統｜開發企畫書（Development Plan）

## 一、專案概述（Project Overview）

### 1. 專案名稱
音樂家時間軸探索（Composer Timeline Explorer）

### 2. 專案形式
- 靜態網站（Static Site）
- 主要部署於 GitHub Pages
- 採純前端渲染（Client-side Rendering）
- 無後端 API 與登入系統

### 3. 目前階段
目前專案已完成第一版前端骨架與 Beethoven 範例資料擴充，屬於可展示概念、可持續迭代的原型階段。

---

## 二、專案目標（Objectives）

建立一個以時間為主軸的音樂探索平台，整合：
- 作曲家基本資料
- 生平記事
- 作品資料
- 時代背景
- 媒體連結或嵌入內容

最終讓使用者能透過視覺化閱讀與互動切換，理解作品、人生與歷史脈絡之間的關係。

---

## 三、產品定位（Product Positioning）

### 類型
- 教育型資料視覺化網站
- 音樂史互動導讀工具
- 可延伸為教學展示與主題研究入口

### 核心特點
- 不需登入
- 可直接開啟與分享
- 以繁體中文介面為主
- 專有名詞採繁中 + 原文
- 支援作品、記事、背景與媒體的整合瀏覽

---

## 四、目前技術架構（Technical Architecture）

### 1. 技術選型

| 層級 | 技術 |
|------|------|
| 結構 | HTML |
| 互動 | Vanilla JavaScript |
| 樣式 | Tailwind utility class + 標準 CSS component layer |
| 資料 | JSON |
| 媒體 | YouTube 連結 / iframe / fallback 外部開啟 |
| 部署 | GitHub Pages |

### 2. 架構特性
- 無後端 API
- 所有資料儲存在 `data/` 下的 JSON 檔
- 前端於載入時讀取作曲家、作品、事件與背景資料
- 目前以單一作曲家 Beethoven 作為第一批完整資料示範

---

## 五、目前專案結構（Current Project Structure）

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

## 六、資料設計（Data Design）

### 1. 目前資料內容
目前已建立的資料類型包括：
- `composers.json`：作曲家基本資料、時代定位、摘要、來源文件
- `works.json`：作品名稱、年份、年齡、類型、時期、摘要、媒體資訊
- `events.json`：生平事件、年份、年齡、事件類型與摘要
- `contexts.json`：歷史背景、文化條件與音樂趨勢
- `work_type_labels.json`：作品類型顯示名稱映射

### 2. 已落地的資料原則
- 使用英文 `id` 與欄位鍵值，便於程式維護
- 對使用者顯示的文字內容以繁體中文為主
- 作品名與術語保留原文對照
- `age` 欄位已加入作品與記事，可支援年齡對照展示
- 媒體欄位支援嵌入與 fallback 外部連結

### 3. 後續建議補強
- 補 `event_type_labels.json`
- 補 `context_type_labels.json`
- 補作品排序與重要程度欄位
- 增加更多作曲家資料結構

---

## 七、目前功能狀態（Current MVP Status）

### 已完成
- 首頁三欄 + 背景層骨架
- Beethoven 資料載入與預設選取
- 點擊作品卡片更新 Preview
- 媒體嵌入與 YouTube fallback 邏輯
- Context 區塊卡片顯示
- README 與規劃文件整理

### 尚未完成
- Composer 切換實際互動
- 搜尋與篩選真正生效
- Gantt / 主視覺圖表實作
- Timeline 與 Context 的深度聯動
- URL state 分享功能

---

## 八、互動邏輯（Interaction Logic）

### 1. 目前狀態模型
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

### 2. 現有事件流
```text
載入 JSON -> 設定預設作曲家 -> 選出預設作品 -> 渲染各區塊

點擊作品卡片 -> 更新 selectedWorkId -> 重新渲染 Timeline / Preview / Context
```

### 3. 下一步互動目標
- Composer select 改變時，重設作品與預覽
- Period filter 實際影響作品列表
- 搜尋影響 Timeline 與 Preview 的顯示結果

---

## 九、UI 實作策略（UI Strategy）

### 1. 目前方向
- 使用 Tailwind utility class 建立快速原型
- 使用少量標準 CSS class 管理共用元件樣式
- 保持靜態網站可直接執行，不強制導入建置工具

### 2. 元件模組劃分
- `control-bar.js`
- `timeline-view.js`
- `visualization-view.js`
- `preview-panel.js`
- `context-panel.js`
- `bootstrap.js`
- `state.js`

### 3. 媒體策略
- 若影片可嵌入，使用 iframe 顯示
- 若影片不可嵌入，顯示提示與 `在 YouTube 上觀看` 按鈕

---

## 十、部署方式（Deployment）

### 1. 目標平台
- GitHub Pages

### 2. 網站網址
- https://bruce-yang-422.github.io/composer-timeline-explorer/

### 3. 注意事項
- 因前端使用 `fetch()` 載入 JSON，本機開發時需使用 local server
- 部署時需確認 JSON 路徑與資源路徑相對位置正確

---

## 十一、限制與風險（Constraints & Risks）

| 風險項目 | 說明 | 對策 |
|------|------|------|
| 無後端支援 | 無法即時更新資料與進行多人編輯 | 以 JSON 維護流程先降低複雜度 |
| 資料量增加 | 時間軸與卡片清單容易過長 | 後續加入篩選、排序、分頁或折疊 |
| 外部媒體依賴 | YouTube 影片可能無法嵌入或失效 | 保留 fallback 外部開啟策略 |
| 原型與正式版落差 | 目前採 CDN 與輕量實作 | 後續再決定是否升級建置流程 |
| 資料一致性 | 作品、記事、背景欄位若不一致會影響顯示 | 維持欄位規範與映射檔設計 |

---

## 十二、下一階段開發建議（Next Steps）

### Phase 1
- 補齊 Beethoven 顯示映射
- 讓 Composer / Period / Search 真正生效
- 調整 Timeline 與 Preview 顯示更多 metadata

### Phase 2
- 補上真正的主視覺圖表
- 建立事件類型與背景類型 mapping
- 增加作品排序與推薦邏輯

### Phase 3
- 支援第二位作曲家
- 建立 URL 狀態分享
- 規劃正式 Tailwind build 或更完整前端工具鏈

---

## 十三、結論（Conclusion）

本專案目前已經從概念文件進入可執行原型階段。下一步的關鍵不是再增加零散功能，而是讓資料模型、互動邏輯與前端展示逐步對齊，建立穩定、可擴充的音樂時間軸平台基礎。
