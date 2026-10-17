/* 程式入口：設定、開始畫面、路由 */
import { html, ReactDOM, useState, useEffect, useMemo, Ctx, settings, useStore, makeT, VOICE_LANG } from './lib.js';
import { Speech } from './speech.js';
import { NowPlaying, VoiceToast, Fireworks, Lily } from './ui.js';
import { Home } from './home.js';
import { LessonView } from './lesson.js';
import { MODULES } from './modules.js';

function StartOverlay({ onStart, t }) {
  return html`<div className="fixed inset-0 z-[70] grid place-items-center bg-sky-900/40 backdrop-blur-sm p-4" onClick=${() => onStart(true)}>
    <div className="pop-in w-[min(94vw,480px)] rounded-[2rem] bg-white shadow-2xl p-6 text-center space-y-4" onClick=${(e) => e.stopPropagation()}>
      <div className="w-32 mx-auto lily-float"><${Lily} className="w-full" /></div>
      <h2 className="text-2xl font-black text-slate-800">${t('startTitle')}</h2>
      <p className="text-slate-600 leading-relaxed">${t('startText')}</p>
      <button type="button" onClick=${() => onStart(true)} className="w-full min-h-14 rounded-2xl bg-emerald-500 text-white text-xl font-black shadow-lg active:scale-[.98]">${t('startAuto')}</button>
      <button type="button" onClick=${() => onStart(false)} className="w-full min-h-11 rounded-2xl bg-white ring-2 ring-slate-200 text-slate-600 font-bold active:scale-[.98]">${t('startSelf')}</button>
    </div>
  </div>`;
}

// 網址路由：每個實驗都有自己嘅網址，例如 …/#/lemon（可以直接分享；iPad「返回」會返主頁）
const idFromHash = () => { const id = decodeURIComponent(location.hash.replace(/^#\/?/, '')); return MODULES.some((m) => m.id === id) ? id : null; };

function App() {
  const st = useStore(settings);
  const lang = st.lang === 'en' ? 'en' : 'zh';
  const [readMode, setReadMode] = useState(false);
  const [lessonId, setLessonId] = useState(idFromHash);
  const [started, setStarted] = useState(false);
  const [tourSignal, setTourSignal] = useState(0);

  const ctx = useMemo(() => {
    const t = makeT(lang);
    const pick = (o) => (o ? (o[lang] ?? o.zh) : '');
    const say = (id, text, opts) => Speech.say(id, text, VOICE_LANG[lang], opts);
    const setLang = (l) => { Speech.stop(); settings.set({ lang: l }); };
    const setAutoplay = (v) => settings.set({ autoplay: v });
    return { lang, setLang, readMode, setReadMode, t, pick, say, autoplay: st.autoplay, setAutoplay };
  }, [lang, readMode, st.autoplay]);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en-GB';
    document.title = lang === 'zh' ? '小麗博士化學實驗室' : "Dr. Lily's Chemistry Lab";
  }, [lang]);

  const onStart = (auto) => {
    Speech.unlock();
    settings.set({ autoplay: auto });
    setStarted(true);
    if (auto) setTourSignal((n) => n + 1);
  };
  // 瀏覽器「上一頁」或者手動改網址
  useEffect(() => {
    const sync = () => { Speech.stop(); setLessonId(idFromHash()); };
    window.addEventListener('popstate', sync); window.addEventListener('hashchange', sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync); };
  }, []);
  const open = (id) => { Speech.stop(); history.pushState({ fromHome: true }, '', '#/' + id); setLessonId(id); };
  const back = () => {
    // 由主頁入嚟就退返一頁；直接用網址打開嘅就換走個網址
    if (history.state && history.state.fromHome) history.back();
    else { Speech.stop(); history.replaceState(null, '', location.pathname + location.search); setLessonId(null); }
  };

  const mod = MODULES.find((m) => m.id === lessonId);
  return html`<${Ctx.Provider} value=${ctx}>
    <div className=${readMode ? 'readmode-on' : ''}>
      ${mod
        ? html`<${LessonView} key=${mod.id} mod=${mod} onBack=${back} />`
        : html`<${Home} onOpen=${open} tourSignal=${tourSignal} />`}
      <${NowPlaying} />
      <${VoiceToast} />
      <${Fireworks} />
      ${!started ? html`<${StartOverlay} onStart=${onStart} t=${ctx.t} />` : null}
    </div>
  <//>`;
}

ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
