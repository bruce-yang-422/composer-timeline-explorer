# UI 架構與互動邏輯設計（UI Architecture & Interaction Model）

## 一、目前整體架構（Current Information Architecture）

### 1. 已落地版面結構

```text
┌──────────────────────────────────────────────────────────────┐
│ Hero / Top Control Bar                                       │
├───────────────┬──────────────────────────────┬───────────────┤
│ Timeline      │ Main Visualization           │ Preview Panel │
│（時間軸）      │（主視覺保留區）               │（內容預覽）      │
├───────────────┴──────────────────────────────┴───────────────┤
│ Context Layer（時代背景層）                                   │
└──────────────────────────────────────────────────────────────┘
```

目前畫面已實作為：
- 上方 Hero 區塊與控制列
- 左側作品 / 記事時間軸卡片區
- 中央主視覺保留區
- 右側內容預覽區
- 下方背景卡片區

---

## 二、各區塊功能（Component Responsibilities）

### 1. Hero / Top Control Bar

#### 目前用途
- 顯示專案主題與導覽說明
- 顯示 composer select、period filter、search 欄位

#### 目前狀態
- UI 已存在
- Composer 下拉已顯示資料
- 互動邏輯尚未完全接通

#### 下一步
- composer 切換時重設選取作品
- 篩選與搜尋真正影響內容

---

### 2. Timeline（左側）

#### 目前內容
- Beethoven 的生平事件卡片
- Beethoven 的作品卡片
- 作品卡片可點擊
- 點擊後可更新 Preview

#### 目前呈現方式
目前不是圖形時間軸，而是以時間排序的卡片式清單呈現，這是一種原型階段可維護且可快速驗證資料結構的做法。

#### 目前互動
- Click 作品卡片 -> 更新 `selectedWorkId`
- Active 卡片有視覺高亮

#### 下一步
- 補上依年份排序與更完整的 timeline grouping
- 顯示事件與作品的 age 資訊
- 支援 filter / search / period 聯動

---

### 3. Main Visualization（中央）

#### 目前狀態
- 為主視覺保留區
- 使用說明卡與作品類型 chip 呈現目前資料分類

#### 角色
- 作為未來 Gantt、分布圖或 D3 圖表的預留位置
- 暫時負責顯示資料分類與分析方向

#### 下一步
- 以 `type`、`period`、`year` 建立第一版可視化
- 評估 D3 甘特圖或簡化時間分布視圖

---

### 4. Preview Panel（右側）

#### 目前內容
- 顯示目前選中的作品
- 顯示年份、類型、摘要
- 若有影片則顯示媒體區塊

#### 目前媒體邏輯
- 可嵌入影片 -> 顯示 iframe
- 不可嵌入影片 -> 顯示說明與 `在 YouTube 上觀看` 按鈕
- 無影片 -> 顯示 placeholder 提示

#### 下一步
- 顯示作曲家年齡欄位
- 顯示更多 metadata，例如 period、performers、source title
- 後續支援事件模式與背景模式

---

### 5. Context Layer（底部）

#### 目前內容
- 顯示歷史、文化與音樂趨勢背景卡片
- 已可載入 `contexts.json`

#### 目前作用
- 提供 Beethoven 所處時代的背景脈絡
- 作為未來時間聯動的基礎區塊

#### 下一步
- 依時間範圍或選中作品動態篩選背景卡片
- 顯示更清楚的類型名稱 mapping

---

## 三、目前狀態模型（State Model）

```json
{
  "selectedComposerId": "beethoven",
  "selectedWorkId": "violin-concerto-op-61",
  "selectedEventId": null,
  "selectedContextId": null,
  "selectedType": "all",
  "selectedPeriod": "all",
  "searchTerm": "",
  "timeRange": null
}
```

### 設計原則
- 選取狀態與篩選狀態分開
- 由 `bootstrap.js` 建立初始預設值
- 目前以重新 render 各區塊的方式維持同步

---

## 四、目前互動流程（Current Interaction Flow）

### 1. 初始載入
```text
Load JSON
-> Select default composer
-> Choose default work
-> Render all sections
```

### 2. 點擊作品卡片
```text
Click work card
-> Update selectedWorkId
-> Re-render Timeline
-> Re-render Preview
-> Preserve shared state
```

### 3. 媒體顯示
```text
If embeddable video exists
-> Render iframe
Else if video URL exists
-> Render fallback external link
Else
-> Render media placeholder
```

---

## 五、視覺系統（Visual System）

### 1. 目前做法
- 整體畫面採卡片式層次
- Tailwind utility class 控制 layout 與 spacing
- 標準 CSS class 控制共用元件樣式

### 2. 視覺語意
- 左側作品卡片：強調可點擊與選取狀態
- 事件卡片：使用 timeline 樣式區分於作品
- 背景卡片：使用不同色系區別 context 層
- chip：作為類型與媒體標記

### 3. 已有優勢
- 原型階段可快速調整
- 與 JSON 結構高度對應
- 不需要先引入大型框架即可驗證流程

---

## 六、響應式與實作考量（Responsive and Technical Considerations）

### 目前狀態
- 主布局已採 responsive grid
- Hero 區塊在小螢幕會改為上下排列
- 主內容區於窄螢幕下自然改成單欄堆疊

### 後續注意事項
- 手機版需要重新定義閱讀順序
- Timeline 與 Preview 在小螢幕上不宜過度拉長
- 若資料量擴大，需加入篩選與折疊機制

---

## 七、目前問題與風險（Warnings）

### 1. Timeline 還不是完整的時間視覺化
目前是卡片式原型，不是最終版 timeline / gantt 呈現。

### 2. 中央主視覺尚未真正承擔分析任務
現在仍是保留區，還沒有提供真正的時間分布比較能力。

### 3. Control Bar 已有 UI，但還未完成互動串接
若不持續補齊，會造成介面看起來完整但實際功能不一致。

### 4. Context 與 Timeline 還未形成真正聯動
目前背景卡片是靜態載入，尚未根據作品或年份動態切換。

### 5. 媒體依賴仍受 YouTube 嵌入限制
因此 Preview 一定要保留 fallback 邏輯，不能假設所有影片都能嵌入。

---

## 八、下一步 UI 實作優先順序（Next UI Priorities）

1. 讓 Composer、Period、Search 控制列真正生效。
2. 在 Timeline / Preview 顯示 age 與更多 metadata。
3. 為 events 和 contexts 加入 type label mapping。
4. 將中央區塊從保留區升級為第一版時間分布圖。
5. 建立作品、事件、背景之間更清楚的聯動規則。
