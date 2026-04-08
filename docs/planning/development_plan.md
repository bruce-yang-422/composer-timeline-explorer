# 音樂家時間軸系統｜開發企畫書（Static Site 版本）

## 一、專案概述（Project Overview）

### 1. 專案名稱
音樂家時間軸與作品探索系統（Composer Timeline Explorer）

### 2. 專案形式
- 靜態網站（Static Site）
- 部署於 GitHub Pages
- 採純前端渲染（Client-side Rendering）
- 不依賴後端伺服器

---

## 二、專案目標（Objectives）

建立一個以前端為核心的互動式平台，整合以下內容：
- 音樂家生平
- 作品時間分布
- 時代背景（歷史、文化環境、音樂趨勢）
- 音樂影音內容（如 YouTube）

最終目標是讓使用者能以「時間」為主軸，理解作品、作曲家與時代之間的關係。

---

## 三、產品定位（Product Positioning）

### 類型
- 教育型資料視覺化網站
- 音樂史互動探索工具

### 核心特點
- 無需登入
- 開啟即可使用
- 維護成本相對低
- 可透過 URL 分享指定視圖或狀態

---

## 四、技術架構（Technical Architecture）

### 1. 技術選型

| 層級 | 技術 |
|------|------|
| 結構 | HTML |
| 樣式 | Tailwind CSS |
| 邏輯 | Vanilla JavaScript |
| 視覺化 | D3.js 或其他圖表函式庫 |
| 媒體 | YouTube iframe |

### 2. 架構特性
- 無後端 API
- 所有資料以 JSON 檔案儲存
- 前端負責資料載入、篩選與渲染
- 部署後應可直接由靜態檔提供服務

---

## 五、專案結構（Project Structure）

```text
/project-root
├── index.html
├── /assets
│   ├── css/
│   ├── js/
│   └── images/
├── /data
│   ├── composers.json
│   ├── works.json
│   ├── events.json
│   └── context.json
├── /components
│   ├── timeline.js
│   ├── gantt.js
│   ├── preview.js
│   └── context.js
└── /utils
    ├── state.js
    └── helpers.js
```

---

## 六、資料設計（Data Design）

### 1. 資料來源
- 手動整理之 JSON
- 開放資料來源（如 Wikipedia、IMSLP 等）

### 2. JSON 結構示意

#### Composer
```json
{
  "id": "beethoven",
  "name": "Beethoven",
  "birth": 1770,
  "death": 1827
}
```

#### Work
```json
{
  "id": "sym5",
  "title": "Symphony No. 5",
  "year": 1808,
  "type": "Symphony",
  "period": "Middle",
  "youtubeId": "xxxx"
}
```

#### Event
```json
{
  "year": 1802,
  "type": "personal",
  "title": "Heiligenstadt Testament"
}
```

#### Context
```json
{
  "start": 1800,
  "end": 1815,
  "type": "historical",
  "title": "Napoleonic Wars"
}
```

### 3. 資料設計原則
- 欄位命名需一致，避免同義欄位並存
- 時間欄位需明確區分單點年份與區間
- 類型值需可枚舉，避免自由文字導致篩選困難
- 後續若需擴充多位音樂家，資料模型不可只綁定單一人物

---

## 七、核心功能（MVP）

### 1. Timeline（時間軸）
- 顯示生平事件
- 顯示作品節點
- 顯示時代背景的簡化資訊
- 支援點擊、hover 與高亮

### 2. Gantt / 分布視覺化
- 顯示作品類型與時間分布
- 支援基本互動（hover、click、時間區段選取）

### 3. Preview Panel
- 顯示當前選取的作品或事件
- 嵌入媒體內容
- 顯示簡要文字說明與關聯資訊

### 4. 篩選功能
- 依作品類型篩選
- 依創作時期篩選
- 預留搜尋與時間區間過濾能力

---

## 八、互動邏輯（Interaction Logic）

### 1. 全域狀態（Client-side State）

```js
const state = {
  composer: "beethoven",
  selectedWork: null,
  filters: {
    type: [],
    period: []
  },
  timeRange: null
};
```

### 2. 視圖同步（Linked Views）
互動流程原則如下：

```text
User Action -> Update State -> Re-render Related Views
```

例如：
- 點擊 Timeline 節點後，更新 `selectedWork`
- Preview 依狀態更新內容
- Gantt 與 Timeline 同步高亮

### 3. 事件流示意

#### Flow A：選擇作品
```text
click(work)
-> setState(selectedWork)
-> renderPreview()
-> highlightTimeline()
-> highlightGantt()
```

#### Flow B：調整篩選條件
```text
updateFilter()
-> filterData()
-> rerenderAll()
```

---

## 九、UI 實作策略（UI Strategy）

### 1. Tailwind 使用原則
- 主要處理 layout、spacing 與 responsive breakpoint
- 色彩系統需對應資料語意，不只為了美觀
- 元件樣式應避免過度分散在零碎 class 組合中

### 2. 模組拆分策略
- `timeline.js`：負責時間軸渲染與互動
- `gantt.js`：負責作品分布圖
- `preview.js`：負責內容面板
- `context.js`：負責背景資訊區塊
- `state.js`：集中管理共享狀態

### 3. 無框架策略
- 優先維持結構簡單與易懂
- 透過模組化與明確 state flow 控制複雜度
- 避免在多個元件中散落相同業務邏輯

---

## 十、部署方式（Deployment）

### 1. GitHub Pages
- 使用 `main` 或 `gh-pages` 分支部署
- 靜態檔可直接提供服務

### 2. 基本部署流程
1. 將專案推送至 GitHub
2. 啟用 GitHub Pages
3. 指定部署來源資料夾或分支
4. 驗證靜態資源與 JSON 路徑是否正確

---

## 十一、限制與風險（Constraints & Risks）

| 風險項目 | 說明 | 對策 |
|------|------|------|
| 無後端支援 | 無法即時更新資料或進行帳號功能 | 採用 JSON 維護流程，降低系統複雜度 |
| 資料量增加 | 節點過多時可能造成渲染壓力 | 分段渲染、延遲載入、必要時視覺簡化 |
| 外部媒體依賴 | YouTube 影片可能失效、下架或受地區限制 | 顯示備援提示，保留無影片時的純文字體驗 |
| 無框架維護風險 | 專案成長後可能出現事件流混亂 | 早期建立模組邊界與狀態管理規範 |
| 資料正確性 | 歷史資料來源可能不一致 | 增加來源註記與人工校對流程 |

---

## 十二、開發時程（Development Timeline）

### Week 1-2
- 建立基本 UI layout
- 設計 JSON 資料格式
- 釐清資料欄位與命名規則

### Week 3-4
- 完成 Timeline 基本渲染
- 建立 Preview Panel

### Week 5-6
- 完成 Gantt / 分布圖
- 建立 Filter 系統與視圖同步

### Week 7
- 補上 Context Layer
- 調整 UI 細節與互動一致性

### Week 8
- 測試、修正與部署

---

## 十三、未來擴展（Future Expansion）

- 支援多位音樂家切換
- URL state 與可分享視圖
- PWA 與離線瀏覽
- 元件化重構（例如 Web Components）
- 增加資料來源管理與編輯流程

---

## 十四、警告與實作注意事項（Warnings）

### 1. 靜態網站不代表結構可以鬆散
雖然專案採純前端與靜態部署，但互動邏輯並不簡單。若早期沒有整理 state 與模組責任，後期維護成本會快速上升。

### 2. 不要太早追求視覺華麗
在資料模型、互動流與資訊層級尚未穩定前，過度投入動畫與圖表細節容易造成返工。應先確保資料結構與操作流程正確。

### 3. 外部資料與影片必須視為不穩定依賴
開放資料與 YouTube 內容都可能變動，系統不能假設其永久可用。UI 需要預留缺資料、缺影片與資料不一致時的降級策略。

### 4. 無框架開發要特別注意事件綁定與重繪成本
若每次互動都完整重繪所有視圖，效能與除錯都會變差。需要明確區分哪些區域該局部更新、哪些狀態才需要全畫面刷新。

### 5. MVP 範圍必須守住
若一開始同時加入多音樂家、搜尋、複雜縮放、URL 狀態與完整背景資料，開發風險會大幅提高。建議先完成單一音樂家與核心三視圖的穩定體驗。

---

## 十五、結論（Conclusion）

本專案以靜態網站與純前端技術為基礎，目標不是建立一個資料堆疊頁面，而是打造一個能透過時間脈絡理解音樂的互動平台。

若能在早期確立清楚的資料模型、視圖聯動規則與資訊層級，後續無論是擴充音樂家、強化互動，或加入更多教學內容，都會有更穩定的基礎。
