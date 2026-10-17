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

## 檔案結構

```
index.html          入口：載入 CDN 同 js/main.js
css/app.css         少量自訂樣式（版面、動畫）
js/
  main.js           App、開始畫面、路由
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
  salt.js           1.2 / 9.1 海水變食鹽
  metalrace.js      3.2 金屬冒泡大比拼
  rust.js           3.4 鐵釘生鏽偵探
  acidprops.js      4.1 酸性大發現
  alkali.js         4.2 鹼性大發現
  indicators.js     4.3 酸鹼偵探：指示劑同 pH
  neutral.js        4.4 中和魔法：酸鹼變鹽
  lemon.js          5.1 檸檬電池
  flametest.js      9.2 焰色反應：煙花顏色嘅秘密
```

## 點樣加一個新實驗（開發說明）

1. 複製一個最接近嘅模組，例如 `modules/alkali.js`，改名做 `modules/<id>.js`。
2. 喺 `js/modules.js` 加 `import`，再將佢加入 `MODULES`。
3. 喺 `js/syllabus.js` 對應課題加 `modules: ['<id>']`；如果有 `next`，要刪走。

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

- 第一輪（已完成）：1.2 / 9.1 海水變食鹽、3.4 鐵釘生鏽偵探、4.1 酸性大發現、4.2 鹼性大發現、4.3 酸鹼偵探、4.4 中和魔法
- 第二輪（已完成）：3.2 金屬冒泡大比拼、5.1 檸檬電池、9.2 焰色反應：煙花顏色嘅秘密
- 下一步：每個已開放實驗加「升中挑戰」層，用正式名詞同文字方程式（例如 3.2 嘅活潑性序列同置換反應、5.1 嘅 LED 正負極、9.2 嘅鈷藍玻璃）；再揀下一批課題
