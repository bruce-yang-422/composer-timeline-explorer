# UI 架構與互動邏輯設計（UI Architecture & Interaction Model）

## 一、整體資訊架構（Information Architecture）

### 1. 核心結構：3 個主視圖 + 1 個控制層

```text
┌──────────────────────────────────────────────────────────────┐
│ Top Control Bar（全域控制列）                                │
├───────────────┬──────────────────────────────┬───────────────┤
│ Timeline      │ Gantt / Main Visualization   │ Preview Panel │
│（時間軸）      │（主視覺 / 分布圖）             │（內容面板）      │
├───────────────┴──────────────────────────────┴───────────────┤
│ Context Layer（時代背景層，可展開）                           │
└──────────────────────────────────────────────────────────────┘
```

此架構的核心原則是：控制集中、內容分區、互動聯動。

---

## 二、各區塊功能定義（Component Responsibilities）

### 1. Top Control Bar（全域控制列）

#### 主要功能
- 切換音樂家
- 篩選作品類型
- 篩選創作時期
- 搜尋作品或事件
- 切換視圖模式

#### UI 元件示意
```text
[Composer ▼] [作品類型 Filter] [時期 Filter] [搜尋] [視圖切換]
```

#### 互動邏輯
- 更換 Composer：重新載入該音樂家的資料與預設視圖狀態
- 調整 Filter：同步影響 Timeline、Gantt 與 Preview 的可見內容
- 使用搜尋：高亮相關節點，必要時自動捲動到對應位置

---

### 2. Timeline（左側：多層時間軸）

#### 資訊結構
```text
年份軸
├─ 個人層（生平 / 作品）
│  ├─ ● 人生事件
│  └─ ◆ 作品節點
├─ 時代層（歷史事件）
│  └─ ▲ 戰爭 / 政治 / 社會
└─ 音樂層（趨勢）
   └─ ▬ 風格區段（如古典 -> 浪漫）
```

#### 視覺語意
| 元素 | 含義 |
|------|------|
| ● | 生平事件 |
| ◆ | 作品 |
| ▲ | 時代事件 |
| ▬ | 音樂趨勢區段 |

#### 互動邏輯
- Hover 節點：顯示 Tooltip，提供簡短資訊
- Click 作品節點：更新 Preview，並同步高亮 Gantt
- Click 事件節點：更新 Context Layer 或切換 Preview 內容
- Scroll / Zoom：沿時間軸移動，必要時搭配虛擬化渲染

---

### 3. Gantt / 主視覺區（中央）

#### 主要功能
以「作品類型 × 時間分布」為核心，呈現創作活動的集中區段與演變節奏。

#### 結構示意
```text
Y 軸：作品類型
X 軸：時間

交響曲        ███████
鋼琴奏鳴曲    █████████████
弦樂四重奏        ███    ███
```

#### 視覺編碼
| 屬性 | 表示內容 |
|------|------|
| 顏色 | 時期（早 / 中 / 晚） |
| 長度 | 創作跨度或作品群分布 |
| 位置 | 年份 |
| 高亮 | 使用者目前聚焦的內容 |

#### 互動邏輯
- Hover bar：顯示該區段的作品摘要
- Click 類型區段：聚焦特定作品類型，並同步影響 Timeline
- Click 單一作品：更新 Preview
- Brush 拖曳：選取時間區間，縮小目前觀察範圍

---

### 4. Preview Panel（右側：內容面板）

#### 主要功能
顯示使用者目前選取的核心內容，包含作品、事件或背景資訊。

#### 狀態模式

##### （1）作品模式
```text
[標題]
Symphony No. 5

[影音]
YouTube Player

[描述]
作品背景

[分析]
曲式 / 技法

[Metadata]
年份 / 類型 / 時期
```

##### （2）事件模式
```text
[事件名稱]
Heiligenstadt Testament

[說明]
歷史背景

[影響]
對創作的影響
```

##### （3）背景模式
```text
[主題]
Napoleonic Wars

[類型]
歷史事件

[影響]
文化與音樂環境變化
```

#### 互動邏輯
- 切換節點時不跳頁，直接替換內容
- 可支援分頁模式，如 `Overview`、`Analysis`、`Media`
- 可延伸顯示 Related Works 或延伸閱讀

---

### 5. Context Layer（底部：時代背景層）

#### 主要功能
集中呈現與個別作品不同層級的背景資訊，包括：
- 歷史事件
- 文化環境
- 音樂風格趨勢

#### 顯示方式示意
```text
[可收合區域]

1800-1815
- 拿破崙戰爭
- 維也納音樂中心興起
- 古典 -> 浪漫轉型
```

#### 互動邏輯
- 點擊 Timeline 的背景節點時展開對應內容
- 可與時間軸的目前區段保持同步
- 在行動裝置上可改為獨立分頁或抽屜式面板

---

## 三、核心互動模型（Interaction Model）

### 1. Linked Views（視圖聯動）

系統互動應遵循以下原則：

```text
User Action -> State Update -> All Relevant Views Sync
```

例如點擊作品後：
- Timeline 高亮對應節點
- Gantt 高亮相關區塊
- Preview 顯示作品內容
- Context Layer 可顯示對應時代背景

---

### 2. 狀態模型（State Model）

```json
{
  "selectedComposer": "Beethoven",
  "selectedWork": "Symphony No. 5",
  "selectedPeriod": "Middle",
  "selectedTypes": ["Symphony"],
  "timeRange": [1800, 1810]
}
```

#### 建議狀態原則
- 選取狀態與篩選狀態分開管理
- 不要讓元件私下持有互相衝突的狀態
- 若支援 URL 分享，需定義可序列化的狀態欄位

---

### 3. 事件流（Event Flow）

#### Flow A：探索作品
```text
Click Timeline Node
-> setSelectedWork()
-> updatePreview()
-> highlightGantt()
-> syncContext()
```

#### Flow B：調整篩選
```text
Select Filter
-> updateState()
-> filterData()
-> rerenderTimeline()
-> rerenderGantt()
```

#### Flow C：分析時間區間
```text
Brush Gantt
-> updateTimeRange()
-> filterTimeline()
-> updateContextLayer()
```

---

## 四、UI 行為設計（Micro-interactions）

### 1. Hover
- 顯示精簡資訊，避免遮擋主視圖
- Tooltip 內容應簡短且一致

### 2. Click
- 明確改變選取狀態
- 高亮與內容更新必須同步

### 3. Transition
- 時間縮放應平順，但不可拖慢操作反應
- Preview 切換可使用淡入淡出或滑動效果
- 動畫應服務理解，不應造成干擾

---

## 五、響應式設計（Responsive Behavior）

### Desktop
- 採三欄主布局，優先呈現完整資訊聯動

### Tablet
```text
上：Gantt
下：Timeline / Preview 切換
```

### Mobile
```text
Tab Navigation
[Timeline] [Gantt] [Detail] [Context]
```

#### 響應式原則
- 手機版優先保留核心內容，不強求一次呈現全部資訊
- 互動重點應從「同時並列」改為「可快速切換」

---

## 六、效能與實作考量（Technical Considerations）

### 1. 大量資料處理
- Timeline 可考慮虛擬滾動或節點折疊
- Gantt 若資料量過大，可評估 Canvas 或其他高效渲染方式

### 2. 狀態管理
- 初期可使用簡單全域 state
- 若互動複雜度上升，再考慮更完整的狀態管理模式
- URL state 應視為可選擴充，不一定納入第一版

### 3. 媒體載入
- YouTube 採 lazy load
- 使用 Intersection Observer 延後載入非立即可見區塊

---

## 七、警告與設計注意事項（Warnings）

### 1. 三視圖聯動是核心，不是附加功能
如果 Timeline、Gantt 與 Preview 只是並排展示，卻沒有真正同步，整體產品價值會大幅下降。聯動規則必須在實作初期就先定義清楚。

### 2. 不要讓 Timeline 承擔過多資訊密度
時間軸很容易變成最擁擠的區塊。若缺少層級控制、節點抽樣與篩選機制，使用者會先被資訊量壓垮，而不是被幫助理解。

### 3. Gantt 圖不應只追求圖表形式
若圖表無法清楚回答「什麼時候創作最多」、「哪種作品集中在哪個階段」，那就只是形式化視覺。圖表設計應回到分析價值本身。

### 4. Preview Panel 不能只是資訊堆疊欄
若右側面板只是一長串文字與嵌入影片，會削弱整體使用節奏。內容需要有明確層次，先給結論，再補細節。

### 5. 行動裝置不適合照搬桌面布局
桌面版強調多欄對照，但手機不適合同時呈現太多面板。若直接縮小桌面介面，會讓互動成本過高。

### 6. 效能問題會直接影響理解體驗
這類產品的價值建立在快速探索之上。只要點擊、過濾或切換有明顯延遲，使用者就會失去探索節奏，因此效能不是後期優化項，而是核心體驗的一部分。

---

## 八、設計重點總結

1. 以單一時間主軸整合個人、時代與音樂三層資訊。
2. 以三視圖聯動建立探索與比較能力。
3. 以 Preview 與 Context Layer 補足內容理解深度。
4. 以一致的視覺語意降低認知成本。
5. 以響應式與效能策略維持不同裝置上的可用性。
