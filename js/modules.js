/* 已開放嘅實驗模組（加新模組：喺 modules/ 加檔案，再喺度 import 同加入 MODULES） */
import salt from '../modules/salt.js';
import metalrace from '../modules/metalrace.js';
import rust from '../modules/rust.js';
import acidprops from '../modules/acidprops.js';
import alkali from '../modules/alkali.js';
import indicators from '../modules/indicators.js';
import neutral from '../modules/neutral.js';
import lemon from '../modules/lemon.js';
import flametest from '../modules/flametest.js';

export const MODULES = [salt, metalrace, rust, acidprops, alkali, indicators, neutral, lemon, flametest];
