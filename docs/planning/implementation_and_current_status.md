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

目前專案屬於「可運作的閱讀型原型」。

已具備：
- Beethoven 作為完整示範作曲家
- 作曲家個人資料模式
- 生平記事與作品雙欄時間軸
- 第一版甘特分布圖
- 中央詳細預覽
- 時代背景層
- 來源欄位與肖像欄位的資料基礎

尚未具備：
- 搜尋功能
- 第二位作曲家資料整合
- 最終版分析圖表
- URL state 與分享能力

---

## 三、目前已完成項目

### 1. 專案基礎結構
- 已建立靜態網站專案結構
- 已建立 `index.html` 作為入口頁
- 已建立 `assets/`、`data/`、`docs/` 等主要資料夾
- 已建立 README 與 planning 文件

### 2. 前端骨架
- 已建立首頁 Hero 區塊
- 已建立 Timeline / Preview / Context / Gantt 的基本版面
- 已建立可閱讀的卡片式內容原型

### 3. 前端模組
- 已建立 `bootstrap.js`
- 已建立 shared state
- 已建立下列 component：
  - `control-bar.js`
  - `timeline-view.js`
  - `gantt-view.js`
  - `visualization-view.js`
  - `preview-panel.js`
  - `context-panel.js`

### 4. Beethoven 資料
- `composers.json` 已包含 Beethoven 主資料
- `composers.json` 已加入 `portrait`
- `works/*.json` 已擴充為代表作集合
- `works/*.json` 已補齊九大交響曲
- `events/*.json` 已整理為可展示的生平時間線
- `events/*.json` 已加入 `timelineTitle`
- `works/*.json` / `events/*.json` 已加入 `sources`
- `works` / `events` 已加入 `age`
- `composer` 已加入 `ageAtDeath`

### 5. 顯示與互動
- 已能預設載入 Beethoven
- 已能預設選取作曲家個人資料
- 已能點擊作品卡片更新 Preview
- 已能點擊事件卡片更新 Preview
- 已能點擊時間軸個人資料卡更新 Preview
- 已能顯示作品摘要、導聆、分析與媒體區塊
- 已能顯示作曲家肖像與個人資料
- 已能顯示背景卡片

### 6. 模式切換
- 個人資料模式下，音樂說明與導聆區塊不再顯示作品內容
- 個人資料模式下，背景層改為顯示作曲家生涯相關背景
- 作品模式與事件模式維持各自對應的內容與背景邏輯

### 7. 媒體 fallback
- 已處理 YouTube 可嵌入與不可嵌入兩種情況
- 若無法嵌入，會顯示外部觀看按鈕

---

## 四、目前部分完成項目

### 1. Top Control Bar
目前已完成：
- Era select
- Composer select
- Era 範圍已包含中世紀、文藝復興、巴洛克、古典、浪漫、現代
- Composer 切換已可更新到對應個人資料模式

目前未完成：
- 搜尋輸入欄
- 更細的全域篩選系統

### 2. Timeline
目前已完成：
- 生平記事卡
- 個人資料入口卡
- 作品卡
- active 狀態切換
- 作品時期 / 類型篩選
- 生平顯示切換

目前未完成：
- 更成熟的時間軸標尺
- 分組與折疊
- 更細的排序與重要度邏輯

### 3. Main Visualization / Gantt
目前已完成：
- 第一版作品分布圖
- 可點擊作品 marker
- 音樂史時期背景帶
- 作曲家創作時期背景帶

目前未完成：
- 更進一步的分析圖表
- 真正的比較視圖
- 多作曲家可視化

### 4. Preview Panel
目前已完成：
- 個人資料模式
- 事件模式
- 作品模式
- 作品媒體、導聆、分析、學術解析

目前未完成：
- 來源資訊前台呈現
- 個人資料模式的更多延伸資訊

---

## 五、目前尚未完成項目

### 1. 多作曲家支援
- 目前只有 Beethoven 真正完成資料整合
- 系統結構已預留多作曲家可能性，但尚未驗證第二位作曲家流程

### 2. 搜尋
- 尚未建立搜尋 UI 與資料過濾邏輯

### 3. 類型映射完整度
目前仍缺少：
- `event_type_labels.json`
- `context_type_labels.json`

### 4. 來源呈現策略
- `works` / `events` 已有 `sources`
- 前台尚未提供查看來源的互動

### 5. URL 狀態與分享能力
- 尚未建立可分享視圖狀態

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
- `deathAgeLabel`
- `birthPlace`
- `primaryLocation`
- `nationality`
- `era`
- `periods`
- `tags`
- `portrait`
- `summary`
- `intro`
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
- `sources`
- `media`

#### events
- `id`
- `composerId`
- `year`
- `age`
- `type`
- `title`
- `timelineTitle`
- `summary`
- `sources`

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
- 已可支援人物入口模式
- 已可支援來源追蹤
- 已可支援媒體顯示與 fallback

### 目前資料設計缺口
- type mapping 尚未完整獨立化
- importance / ordering 欄位尚未建立
- 關聯作品欄位尚未建立
- `sources` 尚未形成統一前台呈現規則

---

## 七、已知限制與風險

### 1. 目前 UI 仍屬原型
雖然已可閱讀與操作，但仍非最終版資訊架構與視覺系統。

### 2. YouTube 媒體不可完全控制
嵌入限制、影片失效、地區限制都可能出現，因此 fallback 必須長期保留。

### 3. 外部圖片來源仍依賴第三方
目前 composer portrait 使用 Wikimedia 連結，之後可能需要更穩定的資產策略。

### 4. 單一作曲家資料完成度高，但跨作曲家擴充尚未驗證
目前資料模型看起來可擴充，但還沒經過第二位作曲家的實作驗證。

---

## 八、下一步優先事項

### Priority 1
- 導入第二位作曲家
- 補齊 event / context type mappings
- 規劃 `sources` 的前台呈現策略

### Priority 2
- 加入搜尋功能
- 強化 timeline 的排序與分層
- 優化主視覺分析圖表

### Priority 3
- 建立 URL state
- 評估分享功能
- 驗證多作曲家擴充流程

---

## 九、目前一句話總結

目前專案已經從「Beethoven 作品展示頁」進一步成長為「以人物為入口、可在時間中閱讀作品與背景」的互動原型。
