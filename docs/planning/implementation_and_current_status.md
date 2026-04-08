# 實作與目前狀態（Implementation and Current Status）

## 一、文件目的

本文件用來記錄目前專案的實作狀態，明確區分：
- 已完成
- 部分完成
- 尚未完成
- 下一步優先事項

這份文件的角色不是描述理想中的最終系統，而是忠實反映目前 repository 的真實狀態。

---

## 二、目前專案定位

目前專案屬於「可運作原型」階段。

已具備：
- 可開啟的首頁原型
- Beethoven 作為第一位完整示範作曲家
- JSON 資料模型
- 基本互動流程
- 基本媒體顯示與 fallback

尚未具備：
- 完整的資料視覺化圖表
- 完整可用的篩選與搜尋
- 多作曲家切換流程
- 完整的 timeline 與 context 聯動

---

## 三、目前已完成項目

### 1. 專案基礎結構
- 已建立靜態網站專案結構
- 已建立 `index.html` 作為入口頁
- 已建立 `assets/`、`data/`、`docs/` 等主要資料夾
- 已建立 `.gitignore`
- 已建立 README 與 planning 文件

### 2. 前端骨架
- 已建立首頁 Hero 區塊
- 已建立三欄式主畫面骨架
- 已建立底部 Context Layer
- 已將畫面整理為可閱讀的卡片式原型

### 3. 前端模組
- 已建立 `bootstrap.js`
- 已建立共用 state
- 已建立下列 component：
  - `control-bar.js`
  - `timeline-view.js`
  - `visualization-view.js`
  - `preview-panel.js`
  - `context-panel.js`

### 4. Beethoven 資料
- 已建立 `composers.json` 的 Beethoven 主資料
- 已擴充 `works.json`，包含多首代表作品
- 已擴充 `events.json`，包含生平記事
- 已擴充 `contexts.json`，包含歷史、文化與音樂趨勢背景
- 已加入 `ageAtDeath`
- 已加入作品與事件的 `age`

### 5. 顯示與互動
- 已能預設載入 Beethoven
- 已能預設選取作品
- 已能點擊作品卡片更新 Preview
- 已能顯示作品摘要與媒體區塊
- 已能顯示背景卡片

### 6. 媒體 fallback
- 已處理 YouTube 可嵌入與不可嵌入兩種情況
- 若無法嵌入，會顯示「在 YouTube 上觀看」按鈕

---

## 四、目前部分完成項目

### 1. Top Control Bar
目前已完成 UI，但互動尚未完全串接：
- Composer select 已顯示
- Period filter 已顯示
- Search input 已顯示

尚未完成：
- Composer 切換後真正更新資料
- Period filter 真正篩選作品
- Search 真正影響顯示結果

### 2. Timeline
目前已可顯示事件與作品，但仍是卡片式原型，不是完整時間視覺化。

已完成：
- 事件卡片
- 作品卡片
- 點擊切換
- active 狀態

尚未完成：
- 完整時間排序策略
- 分組與折疊
- 視覺化時間軸標尺
- 與 Context 的時間聯動

### 3. Main Visualization
目前中央區塊仍是主視覺保留區。

已完成：
- 區塊位置與標題
- 作品類型 chip
- 說明卡

尚未完成：
- Gantt / timeline / D3 圖表
- 真正的分布與比較功能

### 4. Preview Panel
目前已能顯示作品內容，但仍是作品模式為主。

已完成：
- 顯示年份
- 顯示作品類型
- 顯示摘要
- 顯示媒體或 fallback

尚未完成：
- 顯示更多 metadata
- 顯示 age
- 事件模式 / 背景模式

---

## 五、目前尚未完成項目

### 1. 多作曲家支援
- 目前只有 Beethoven 真正完成資料整合
- 系統結構雖預留多作曲家可能性，但尚未驗證第二位作曲家流程

### 2. 篩選與搜尋
- UI 存在
- 邏輯未完整接上

### 3. 類型映射完整度
目前仍缺少：
- `event_type_labels.json`
- `context_type_labels.json`

### 4. 完整主視覺圖表
- 尚未實作時間分布圖
- 尚未建立真正的 Gantt / distribution layer

### 5. URL 狀態與分享能力
- 尚未建立可分享的視圖狀態

---

## 六、目前資料設計狀態

### 已採用的欄位方向

#### composers
- `id`
- `name`
- `fullName`
- `birth`
- `death`
- `ageAtDeath`
- `summary`
- `sourceDocs`

#### works
- `id`
- `composerId`
- `title`
- `year`
- `age`
- `type`
- `period`
- `summary`
- `media`

#### events
- `id`
- `composerId`
- `year`
- `age`
- `type`
- `title`
- `summary`

#### contexts
- `id`
- `start`
- `end`
- `type`
- `title`
- `summary`

### 目前資料設計優點
- 已可支援內容導讀
- 已可支援時間對照
- 已可支援年齡維度
- 已可支援媒體顯示與 fallback

### 目前資料設計缺口
- type mapping 尚未完整
- importance / ordering 欄位尚未建立
- 關聯作品欄位尚未建立

---

## 七、已知限制與風險

### 1. 目前 UI 是原型，不是最終版
若後續直接把目前卡片式 Timeline 當成最終方案，會限制真正的時間視覺化能力。

### 2. YouTube 媒體不可完全控制
嵌入限制、影片失效、地區限制都可能出現，因此 fallback 設計必須長期保留。

### 3. 文件與實作可能再度脫節
若之後只改程式不改文件，planning 文件會很快失去參考價值。

### 4. 單一作曲家資料完成度高，但跨作曲家擴充尚未驗證
目前資料模型看起來可擴充，但還沒真正經過第二位作曲家的實作驗證。

---

## 八、下一步優先事項

### Priority 1
- 讓 Composer / Period / Search 生效
- 在 Timeline 與 Preview 顯示 age
- 補齊 event / context type mappings

### Priority 2
- 建立中央區塊第一版時間分布圖
- 建立 Timeline 與 Context 的聯動規則
- 整理排序與顯示優先度

### Priority 3
- 導入第二位作曲家
- 驗證多作曲家資料結構
- 規劃 URL state 與分享能力

---

## 九、目前一句話總結

目前專案已經從概念規劃進入「可操作的 Beethoven 原型」，下一步的重點不是再堆更多資料，而是把現有資料、互動與畫面真正串成一致的使用體驗。
