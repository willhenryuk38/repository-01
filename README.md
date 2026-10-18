# 小麗博士化學實驗室 · Dr. Lily's Chemistry Lab

一個俾 6 至 12 歲小朋友玩嘅 3D 互動化學實驗 Web App。中英雙語，有廣東話（zh-HK）同英式英文（en-GB）朗讀，支援 iPad 觸控。

- 唔使任何構建工具：React 18 + htm、Three.js 0.169、Tailwind，全部經 CDN 載入
- 直接放上 GitHub Pages 就用得

## 放上 GitHub Pages

1. Repo 要係 **Public**。免費版 GitHub 唔支援 Private repo 開 Pages。
2. 去 **Settings → Pages**，Source 揀 **Deploy from a branch**，Branch 揀 `main` 同 `/ (root)`，然後撳 **Save**。
3. 等一兩分鐘，就可以用 `https://<用戶名>.github.io/<repo 名>/` 打開。

> ⚠️ 唔好直接雙擊 `index.html`。瀏覽器唔准用 `file://` 載入 JS 模組，會開唔到。
> 想喺自己部電腦測試，可以喺資料夾入面行 `python3 -m http.server 8000`，再打開 `http://localhost:8000`。

> GitHub Pages 只會顯示 `main` 分支。新實驗要 merge 入 `main` 之後，網站先會見到。

## 點樣打開實驗

`index.html` 係唯一入口：打開網站，主頁會列出所有開放中嘅實驗（「開放中嘅實驗」卡片），下面嘅「完整課程地圖」亦有每個課題嘅按鈕。

每個實驗都有自己嘅網址，可以直接分享俾學生（喺網址後面加 `#/實驗 id`）：

| 課題 | 實驗 | 網址 |
|---|---|---|
| 1.1 | 鐵絨食氧氣 | `…/#/airoxygen` |
| 1.2 / 9.1 | 海水變食鹽 | `…/#/salt` |
| 1.3 | 石灰石三變 | `…/#/limestone` |
| 3.1 | 由石頭變金屬 | `…/#/extract` |
| 3.2 | 金屬冒泡大比拼 | `…/#/metalrace` |
| 3.4 | 鐵釘生鏽偵探 | `…/#/rust` |
| 4.1 | 酸性大發現 | `…/#/acidprops` |
| 4.2 | 鹼性大發現 | `…/#/alkali` |
| 4.3 | 酸鹼偵探：指示劑同 pH | `…/#/indicators` |
| 4.4 | 中和魔法：酸鹼變鹽 | `…/#/neutral` |
| 5.1 | 檸檬電池 | `…/#/lemon` |
| 5.2 | 鐵釘變銅色 | `…/#/displace` |
| 5.4 | 電鍍魔法 | `…/#/plating` |
| 6.3 | 褪色魔術 | `…/#/bleach` |
| 7.4 | 酸雨侵蝕 | `…/#/acidrain` |
| 7.5 | 酵母吹氣球 | `…/#/yeast` |
| 8.2 | 肥皂同硬水 | `…/#/soap` |
| 9.2 | 焰色反應：煙花顏色嘅秘密 | `…/#/flametest` |

用網址打開都會先出「開始」畫面（iPad 要撳一下先可以出聲），撳完就直接入實驗；撳「返回」會返主頁。

## 檔案結構

```
index.html          入口：載入 CDN 同 js/main.js
css/app.css         少量自訂樣式（版面、動畫）
js/
  main.js           App、開始畫面、路由（#/實驗 id）
  lib.js            介面文字（中英）、設定同進度儲存（localStorage）、煙花訊號
  speech.js         語音朗讀（Web Speech API；截斷／排隊規則）
  ui.js             共用元件（喇叭、按鈕、小麗博士、頂部列、煙花…）
  home.js           主頁、進度、完整課程地圖、自動導覽
  lesson.js         實驗頁：步驟引擎、示範俾我睇、自動播放、思考挑戰
  stage.js          3D 舞台：鏡頭、點擊、拖放、提示手指
  kit3d.js          3D 工具箱：容器、液體、標籤、氣泡、沉澱、水流、電熱板…
  syllabus.js       完整課程大綱（課程地圖）
  modules.js        已開放嘅模組清單
modules/            每個實驗一個檔案
  airoxygen.js      1.1 鐵絨食氧氣
  salt.js           1.2 / 9.1 海水變食鹽
  limestone.js      1.3 石灰石三變
  extract.js        3.1 由石頭變金屬
  metalrace.js      3.2 金屬冒泡大比拼
  rust.js           3.4 鐵釘生鏽偵探
  acidprops.js      4.1 酸性大發現
  alkali.js         4.2 鹼性大發現
  indicators.js     4.3 酸鹼偵探：指示劑同 pH
  neutral.js        4.4 中和魔法：酸鹼變鹽
  lemon.js          5.1 檸檬電池
  displace.js       5.2 鐵釘變銅色
  plating.js        5.4 電鍍魔法
  bleach.js         6.3 褪色魔術
  acidrain.js       7.4 酸雨侵蝕
  yeast.js          7.5 酵母吹氣球
  soap.js           8.2 肥皂同硬水
  flametest.js      9.2 焰色反應：煙花顏色嘅秘密
```

## 點樣加一個新實驗（開發說明）

1. 複製一個最接近嘅模組，例如 `modules/alkali.js`，改名做 `modules/<id>.js`。
2. 喺 `js/modules.js` 加 `import`，再將佢加入 `MODULES`。
3. 喺 `js/syllabus.js` 對應課題加 `modules: ['<id>']`；如果有 `next`，要刪走。下一批課題就加 `next: {zh, en}`，課程地圖會顯示「下一批」。
4. 喺下面「點樣打開實驗」個表加返條網址，再更新路線圖。

### 模組格式

```js
export default {
  id, topics: ['3.2'], accent, dark, bg, theme?,   // 顏色、3D 房間主題
  title: {zh, en}, desc: {zh, en}, Art,            // 主頁卡片
  steps: [{ tag, zh, en, action?: { id, events: ['事件前綴'] } }],
  events: { key: {zh, en} },                       // 3D 場景發出嘅解說
  quiz: { q, options, correct, right, wrong },
  tools: [{ id, label, run: (ctrl) => … }],        // 下面嘅備用按鈕
  Panel,                                           // （選用）記錄表
  build(scene, api) { … return ctrl },             // 3D 場景
};
```

- `tag` 可以係：`intro`、`try`、`observe`、`feynman`、`first`、`life`、`quiz`。
- 有 `action` 嘅步驟：小朋友未做嗰陣，「下一步」會變做「示範俾我睇」。場景做完個動作，要 call `api.done(actionId)`。
- `build` 要 return 嘅 `ctrl`：
  - `cam: { pos, target, fitW }`
  - `demo(actionId)`：Promise，用嚟自動示範
  - `getHint(actionId)`：return `{ from: Vector3, to?: Vector3 }`，提示手指會由 from 去 to
  - `reset()`
  - （選用）`update(dt, t)`、`setStep(i, step)`
- `api` 提供：
  - `api.drag(obj, { label, targets, onDrop, onTap, enabled, lift })`：可以拖嘅物件。`onDrop` return `false` 嘅話，物件會自動返原位。
  - `api.tap(obj, fn, label)`
  - `api.label({zh, en})`
  - `api.emit(eventKey)`
  - `api.state(obj)`：傳資料俾 Panel
  - `api.waitSpeech()`
  - `api.tween`

### 語音規則（重要）

- **換階段要截斷舊語音，即刻讀新內容。**換階段包括：撳下一步、答題，或者發出屬於呢一步 `action.events` 前綴嘅事件。
- **同一階段入面隨意撳物件，唔會打斷老師。**物件嘅解說會排隊，等老師講完先讀。
- **一連串動作嘅解說要逐句讀完。**之間用 `await api.waitSpeech()`，等上一句讀完先觸發下一個事件。

### 內容原則

- 只寫基礎層，用廣東話口語，生活化，但要保持科學正確。「升中挑戰」層留待下一階段。
- 每個實驗都要跟呢個結構：開場 → 動手試 → 觀察 → 費曼小教室 → 第一性原理 →（生活應用）→ 思考挑戰。
- 有危險嘅地方要加安全提示。

## 路線圖

成個課程有 9 個主題、30 個課題。每一輪做 3 個實驗（基礎層），全部課題開放之後，再逐個實驗加「升中挑戰」層。

| 階段 | 內容 | 開放課題 | 狀態 |
|---|---|---|---|
| 第 1 輪 | 引擎、自動播放、拖放、課程地圖；1.2 / 9.1 海水變食鹽、3.4 鐵釘生鏽偵探、4.1 酸性大發現、4.2 鹼性大發現、4.3 酸鹼偵探、4.4 中和魔法 | 7 / 30 | ✅ 完成 |
| 第 2 輪 | 3.2 金屬冒泡大比拼、5.1 檸檬電池、9.2 焰色反應 | 10 / 30 | ✅ 完成 |
| 第 3 輪 | 5.4 電鍍魔法、7.5 酵母吹氣球、8.2 肥皂同硬水；每個實驗有自己網址；4.2 補充鐵(II)／鐵(III) 解釋 | 13 / 30 | ✅ 完成 |
| 第 4 輪 | 1.1 鐵絨食氧氣（空氣有五分一係氧）、5.2 鐵釘變銅色（置換反應）、7.4 酸雨侵蝕（大理石同植物） | 16 / 30 | ✅ 完成 |
| 第 5 輪 | 1.3 石灰石三變（石灰石 → 生石灰 → 熟石灰 → 石灰水）、3.1 由石頭變金屬（氧化銅＋碳）、6.3 褪色魔術（漂白劑） | 19 / 30 | ✅ 完成 |
| 第 6 輪 | 8.1 史萊姆（長鏈分子）、7.3 溴水褪色（烷同烯）、7.1 石油分層（分餾） | 22 / 30 | 🔜 下一批 |
| 第 7 輪 | 概念互動：2.1 原子樂高（砌首 20 個元素）、2.2 周期表拼圖、2.3 原子手拖手（離子鍵、共價鍵） | 25 / 30 | 計劃中 |
| 第 8 輪 | 3.3 化學天秤（質量守恆）、5.3 拆解乾電池、6.1 漂白水嘅秘密（氯）、6.2 濃硫酸搶水（老師示範）、7.2 碳鏈積木 | 30 / 30 | 計劃中 |
| 第 9 階段 | 每個實驗加「升中挑戰」層：正式名詞、文字方程式同化學式（例如 3.2 活潑性序列同置換、5.1 LED 正負極、5.4 電解、9.2 鈷藍玻璃） | — | 計劃中 |
| 第 10 階段 | 離線版（PWA）、教師模式（揀實驗、睇學生進度）、成就同證書、無障礙優化 | — | 計劃中 |

### 進度一覽（按主題）

| 主題 | 已完成 | 未做 |
|---|---|---|
| 1 地球 | 1.1 鐵絨食氧氣、1.2 海水變食鹽、1.3 石灰石三變 | — |
| 2 微觀世界 | — | 2.1、2.2、2.3（第 7 輪） |
| 3 金屬 | 3.1 由石頭變金屬、3.2 金屬冒泡大比拼、3.4 鐵釘生鏽偵探 | 3.3（第 8 輪） |
| 4 酸和鹼 | 4.1、4.2、4.3、4.4 | — |
| 5 化學電池和電解 | 5.1 檸檬電池、5.2 鐵釘變銅色、5.4 電鍍魔法 | 5.3（第 8 輪） |
| 6 重要工業過程的產品 | 6.3 褪色魔術 | 6.1、6.2（第 8 輪） |
| 7 化石燃料和碳化合物 | 7.4 酸雨侵蝕、7.5 酵母吹氣球 | 7.1、7.3（第 6 輪）、7.2（第 8 輪） |
| 8 塑膠和清潔劑 | 8.2 肥皂同硬水 | 8.1（第 6 輪） |
| 9 檢測和分析 | 9.1 海水變食鹽、9.2 焰色反應 | — |

每一輪完成之後：喺 `js/syllabus.js` 將嗰輪課題由 `next` 改成 `modules`，再將下一輪課題加 `next`；更新上面個表同「點樣打開實驗」。
