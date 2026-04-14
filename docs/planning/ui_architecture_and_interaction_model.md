# UI 架構與互動邏輯設計（UI Architecture & Interaction Model）

## 一、目前畫面架構

### 1. 已落地版面

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

目前實作已包含：
- 上方 Hero 與控制列
- 左側事件 / 作品卡片區
- 中央主視覺保留區
- 右側 Preview
- 下方 Context 背景區塊

這是一個可運作原型，而不是最終版完整資料視覺化系統。

---

## 二、各區塊目前狀態

### 1. Hero / Top Control Bar

#### 已完成
- 主題標題與簡介
- composer / period / search 欄位 UI

#### 尚未完成
- composer 切換資料流
- period filter 實際作用
- search 實際作用

#### 目前定位
控制列目前已建立外觀與輸入元件，但仍屬半完成狀態。

---

### 2. Timeline（左側）

#### 已完成
- 顯示 Beethoven 生平事件卡片
- 顯示 Beethoven 作品卡片
- 點擊作品卡片可切換 Preview
- active 作品有高亮狀態

#### 目前形式
目前不是圖形時間軸，而是卡片式 timeline 原型。這樣的做法能先驗證資料模型、閱讀順序與內容結構。

#### 下一步
- 補上事件與作品排序規則
- 顯示 `age` 與更多 metadata
- 支援 filter / search / composer 聯動

---

### 3. Main Visualization（中央）

#### 已完成
- 預留主要圖表區塊
- 顯示作品類型 chip 與說明資訊

#### 尚未完成
- 真正的時間分布圖
- Gantt / D3 / grouped visualization
- 與 Timeline / Preview 的深度互動

#### 目前定位
目前是保留區，不是完整分析圖表。

---

### 4. Preview Panel（右側）

#### 已完成
- 顯示目前選中的作品
- 顯示年份、類型、摘要
- 顯示影片或 fallback 按鈕

#### 媒體邏輯
- 可嵌入 -> iframe
- 不可嵌入 -> `在 YouTube 上觀看`
- 無媒體 -> placeholder

#### 下一步
- 顯示 `age`
- 顯示更多 metadata，例如 performers、period、來源資訊
- 之後支援事件模式與背景模式

---

### 5. Context Layer（底部）

#### 已完成
- 顯示歷史、文化與音樂趨勢背景卡片
- 可讀取 `contexts/all.json`

#### 尚未完成
- 根據作品或時間範圍動態篩選
- 類型顯示 mapping
- 與 Timeline / Preview 更明確聯動

#### 目前定位
目前是靜態載入背景資訊的區塊，尚未成為真正的時間聯動背景層。

---

## 三、目前互動模型

### 1. 狀態模型
```json
{
  "selectedComposerId": "beethoven",
  "selectedWorkId": "beethoven-violin-concerto-op-61",
  "selectedEventId": null,
  "selectedContextId": null,
  "selectedType": "all",
  "selectedPeriod": "all",
  "searchTerm": "",
  "timeRange": null
}
```

### 2. 已實作流程
```text
載入 JSON
-> 選出預設 composer
-> 選出預設作品
-> render 全部區塊

點擊作品卡片
-> 更新 selectedWorkId
-> render Timeline / Preview / Context
```

### 3. 尚未完成流程
```text
切換 composer
-> 重設 selectedWorkId
-> 重新載入當前 composer 作品 / 事件 / 背景

調整 filter / search
-> 篩選 timeline / preview / visualization / context
```

---

## 四、視覺系統與樣式策略

### 1. 目前做法
- 使用 Tailwind utility class 控制 layout 與 spacing
- 使用標準 CSS class 管理重複元件樣式
- 畫面以卡片式階層為主

### 2. 視覺語意
- Timeline 作品卡片：可點擊、可高亮
- Timeline 事件卡片：與作品卡片做層級區分
- Context 卡片：獨立色系與區塊感
- Chip：類型與媒體標記

### 3. 目前評估
這種做法適合原型階段，能快速調整；但未來若要做正式可視化，中央區塊與 timeline 呈現都需要升級。

---

## 五、目前問題與風險

### 1. Timeline 還不是完整 timeline
現在是卡片式近似方案，並非最終版視覺化時間軸。

### 2. 中央主視覺尚未有真正分析能力
目前只是保留區，還沒有提供分布、比較與縮放功能。

### 3. Control Bar 的功能完成度落後於 UI 完成度
畫面看起來已有功能，但實際互動尚未串完，容易造成使用落差。

### 4. Context 仍偏靜態
目前尚未依作品或年份動態收斂背景內容。

### 5. 媒體依賴外部平台限制
影片嵌入限制不是例外情況，而是需要被預期的產品條件。

---

## 六、下一步 UI 優先順序

1. 讓 Composer / Period / Search 真正生效。
2. 在 Timeline 與 Preview 顯示年齡與更完整 metadata。
3. 加入事件與背景的 type mapping。
4. 把中央主視覺保留區做成第一版時間分布圖。
5. 建立作品、記事、背景之間更清楚的聯動規則。
