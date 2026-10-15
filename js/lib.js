/* 共用工具：React/htm、介面文字、設定同進度儲存、煙花訊號 */
export const React = window.React;
export const ReactDOM = window.ReactDOM;
export const { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext, useSyncExternalStore } = React;
export const html = window.htm.bind(React.createElement);

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const VOICE_LANG = { zh: 'zh-HK', en: 'en-GB' };

/* ---------- 細型儲存（localStorage；失敗時只存記憶體） ---------- */
export function createStore(key, initial) {
  let state = initial;
  try { const raw = localStorage.getItem(key); if (raw) state = { ...initial, ...JSON.parse(raw) }; } catch (e) { /* 私隱模式等 */ }
  const subs = new Set();
  return {
    get: () => state,
    set(patch) {
      state = typeof patch === 'function' ? patch(state) : { ...state, ...patch };
      try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) { /* ignore */ }
      subs.forEach((f) => f());
    },
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
  };
}
export const settings = createStore('chemlab.settings.v1', { autoplay: true, lang: 'zh', tipsSeen: false });
export const progress = createStore('chemlab.progress.v1', {});
export const useStore = (s) => useSyncExternalStore(s.subscribe, s.get);

// 進度：{ [moduleId]: { status: 'started' | 'done', stars: { finish, self, quiz } } }
export function markProgress(id, patch = {}) {
  progress.set((p) => {
    const cur = p[id] || { status: 'started', stars: {} };
    const next = { ...cur, ...patch, stars: { ...cur.stars, ...(patch.stars || {}) } };
    if (cur.status === 'done') next.status = 'done';
    // 星星只會加，唔會減
    Object.keys(cur.stars || {}).forEach((k) => { if (cur.stars[k]) next.stars[k] = true; });
    return { ...p, [id]: next };
  });
}
export const starCount = (rec) => (rec && rec.stars ? ['finish', 'self', 'quiz'].filter((k) => rec.stars[k]).length : 0);

/* ---------- 煙花訊號 ---------- */
const fxSubs = new Set();
export const fx = { fire(kind = 'big') { fxSubs.forEach((f) => f(kind)); }, on(f) { fxSubs.add(f); return () => fxSubs.delete(f); } };

/* ---------- App Context ---------- */
export const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export const joinSay = (lang, parts) => parts.filter(Boolean).map((s) => {
  s = String(s).trim(); return /[。！？.!?：:]$/.test(s) ? s : s + (lang === 'zh' ? '。' : '.');
}).join(lang === 'zh' ? '' : ' ');

/* ---------- 介面文字（中英） ---------- */
export const UI = {
  zh: {
    appTitle: '小麗博士化學實驗室',
    appSub: '動手玩 3D 實驗，用自己嘅說話講得出化學！',
    homeHello: '你好！我係小麗博士，一個好鍾意做實驗嘅科學家。化學，就係研究「啲嘢由咩組成、會點樣變」嘅學問。揀一個實驗，我哋一齊做小科學家啦！',
    start: '開始實驗', continue: '繼續實驗', replay: '再玩一次', back: '返回', prev: '上一步', next: '下一步',
    readMode: '點讀模式',
    readModeOnSay: '點讀模式已經開咗。而家撳任何按鈕或者 3D 物件，我都會讀出佢個名，唔會執行。想用返，就再撳一下點讀模式。',
    readModeOffSay: '點讀模式已經關咗。',
    autoplay: '自動播放',
    autoplayOnSay: '自動播放已經開咗。我會自動講解同示範，你只需要睇同聽。你亦可以隨時自己動手。',
    autoplayOffSay: '自動播放已經關咗。你可以自己慢慢做實驗。',
    pause: '暫停播放', resume: '繼續播放', stop: '停止', reading: '朗讀中', pausedTxt: '已暫停',
    speakerAria: '朗讀呢段文字',
    tools: '實驗工具', toolsHint: '你可以按住 3D 畫面入面嘅物件拖去用，或者撳下面嘅掣。',
    gestureTitle: '點樣玩 3D 實驗室？',
    g1: '單指喺空白位置拖動：轉動視角', g2: '雙指拖動：移動畫面', g3: '兩指捏合／滑鼠滾輪：放大縮小',
    g4: '按住物件拖去目標：搬動、倒嘢', g5: '輕輕一撳物件：睇介紹或者使用',
    gotIt: '知道喇', showTips: '操作提示', resetView: '重設視角',
    tag_intro: '開場', tag_try: '動手試', tag_observe: '觀察結果', tag_feynman: '費曼小教室',
    tag_first: '第一性原理', tag_life: '生活應用', tag_quiz: '思考挑戰', tag_event: '實驗發現',
    discovery: '實驗發現',
    quizTitle: '思考挑戰', correctTitle: '答啱喇！', wrongTitle: '差少少！', tryAgain: '再試一次',
    finishTitle: '實驗完成！', finishText: '好叻呀！你已經完成呢個實驗。返去主頁，再揀另一個實驗玩下啦！',
    backHome: '返回主頁', reset: '重新開始',
    safety: '安全提提你：真實做實驗一定要有大人陪同，實驗室入面嘅嘢千祈唔好放入口。',
    voiceMissingZh: '你部機好似未安裝廣東話（zh-HK）語音，讀出嚟可能唔係廣東話。iPad 或 iPhone 可以去「設定 › 輔助使用 › 朗讀內容 › 語音 › 中文」，加入「中文（香港）」語音。',
    voiceMissingEn: '你部機搵唔到英式英文（en-GB）語音，會用其他英文語音代替。',
    noTts: '呢個瀏覽器唔支援語音朗讀，建議用 Safari 或者 Chrome。',
    close: '關閉',
    noWebgl: '你部機唔支援 3D 畫面（WebGL）。你仍然可以用下面嘅掣同說明學習。',
    stepWord: '步驟',
    demo: '示範俾我睇', demoing: '小麗博士示範緊…',
    doItHint: '👆 跟住手指提示自己試下；唔識做嘅話，撳「示範俾我睇」。',
    actionDone: '做得好！撳「下一步」繼續。',
    startTitle: '準備好未？',
    startText: '撳一下任何地方，小麗博士就會開始自動講解。',
    startAuto: '▶ 開始（自動講解）', startSelf: '我想自己探索',
    tour: '▶ 自動介紹全頁',
    openNow: '開放中嘅實驗', roadmap: '完整課程地圖',
    roadmapIntro: '下面係成套化學課程嘅地圖，一共有九個主題。寫住「開放中」嘅課題可以即刻玩；寫住「下一批」嘅就快推出；有鎖頭嘅仲準備緊。玩完一個實驗，就會出現剔號同星星。',
    st_done: '已完成', st_open: '開放中', st_started: '進行中', st_next: '下一批', st_locked: '即將推出', st_new: '未開始',
    progressTxt: '已完成 {d} / {n} 個實驗', unlockedTxt: '已開放 {o} / {t} 個課題',
    star_finish: '完成實驗', star_self: '自己動手完成', star_quiz: '一次答啱',
    starsTitle: '星星收集', starsHow: '每個實驗有三粒星：完成實驗、全程自己動手（冇用示範）、思考挑戰一次答啱。',
    topicWord: '主題', openLesson: '打開', comingName: '預告：',
  },
  en: {
    appTitle: "Dr. Lily's Chemistry Lab",
    appSub: 'Play with 3D experiments and explain chemistry in your own words!',
    homeHello: "Hello! I'm Dr. Lily, a scientist who loves experiments. Chemistry is all about what things are made of and how they change. Pick an experiment and let's be young scientists together!",
    start: 'Start experiment', continue: 'Continue', replay: 'Play again', back: 'Back', prev: 'Previous', next: 'Next',
    readMode: 'Read-aloud mode',
    readModeOnSay: "Read-aloud mode is on. Now when you tap any button or 3D object, I'll read its name instead of doing it. Tap Read-aloud mode again to switch it off.",
    readModeOffSay: 'Read-aloud mode is off.',
    autoplay: 'Auto-play',
    autoplayOnSay: "Auto-play is on. I'll explain and show you everything. Just watch and listen, or join in whenever you like.",
    autoplayOffSay: 'Auto-play is off. You can do the experiments at your own pace.',
    pause: 'Pause', resume: 'Resume', stop: 'Stop', reading: 'Reading aloud', pausedTxt: 'Paused',
    speakerAria: 'Read this text aloud',
    tools: 'Lab tools', toolsHint: 'Press and drag the objects in the 3D lab, or tap the buttons below.',
    gestureTitle: 'How to play in the 3D lab',
    g1: 'Drag an empty space with one finger: turn the view', g2: 'Drag with two fingers: move the view', g3: 'Pinch / mouse wheel: zoom in and out',
    g4: 'Press and drag an object to a target: move or pour', g5: 'Tap an object: learn about it or use it',
    gotIt: 'Got it', showTips: 'Help', resetView: 'Reset view',
    tag_intro: 'Welcome', tag_try: 'Try it', tag_observe: 'What we found', tag_feynman: "Feynman's corner",
    tag_first: 'First principles', tag_life: 'Everyday life', tag_quiz: 'Thinking challenge', tag_event: 'Lab discovery',
    discovery: 'Lab discovery',
    quizTitle: 'Thinking challenge', correctTitle: "That's right!", wrongTitle: 'Nearly!', tryAgain: 'Try again',
    finishTitle: 'Experiment complete!', finishText: 'Well done! You have finished this experiment. Go back to the home page and pick another one!',
    backHome: 'Home page', reset: 'Start again',
    safety: 'Safety tip: always do real experiments with a grown-up, and never put anything from a lab in your mouth.',
    voiceMissingZh: 'No Cantonese (zh-HK) voice was found on this device, so the Chinese may not be read in Cantonese. On iPad or iPhone, go to Settings › Accessibility › Spoken Content › Voices › Chinese and add "Chinese (Hong Kong)".',
    voiceMissingEn: 'No British English (en-GB) voice was found on this device, so another English voice will be used.',
    noTts: 'This browser does not support reading aloud. Please try Safari or Chrome.',
    close: 'Close',
    noWebgl: 'This device cannot show 3D graphics (WebGL). You can still learn with the buttons and guide below.',
    stepWord: 'Step',
    demo: 'Show me', demoing: 'Dr. Lily is showing you…',
    doItHint: '👆 Follow the pointing hand and try it yourself. Stuck? Tap "Show me".',
    actionDone: 'Well done! Tap "Next" to carry on.',
    startTitle: 'Ready?',
    startText: 'Tap anywhere and Dr. Lily will start explaining everything.',
    startAuto: '▶ Start (auto-explain)', startSelf: "I'll explore by myself",
    tour: '▶ Tour this page',
    openNow: 'Experiments you can play now', roadmap: 'Full course map',
    roadmapIntro: 'Below is the map of the whole chemistry course, with nine big topics. Lessons marked "Open" can be played now. Lessons marked "Next" are coming soon. Lessons with a lock are still being prepared. When you finish an experiment, you get a tick and stars.',
    st_done: 'Done', st_open: 'Open', st_started: 'In progress', st_next: 'Next', st_locked: 'Coming soon', st_new: 'Not started',
    progressTxt: '{d} of {n} experiments done', unlockedTxt: '{o} of {t} lessons open',
    star_finish: 'Finished', star_self: 'Did it yourself', star_quiz: 'Right first time',
    starsTitle: 'Star collection', starsHow: 'Each experiment has three stars: finish it, do every step yourself (no "Show me"), and get the thinking challenge right first time.',
    topicWord: 'Topic', openLesson: 'Open', comingName: 'Coming: ',
  },
};
export const makeT = (lang) => (k, vars) => {
  let s = UI[lang][k] ?? k;
  if (vars) Object.entries(vars).forEach(([a, b]) => { s = s.split('{' + a + '}').join(b); });
  return s;
};
