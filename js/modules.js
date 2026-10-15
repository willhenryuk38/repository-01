/* 已開放嘅實驗模組（加新模組：喺 modules/ 加檔案，再喺度 import 同加入 MODULES） */
import salt from '../modules/salt.js';
import rust from '../modules/rust.js';
import acidprops from '../modules/acidprops.js';
import alkali from '../modules/alkali.js';
import indicators from '../modules/indicators.js';
import neutral from '../modules/neutral.js';

export const MODULES = [salt, rust, acidprops, alkali, indicators, neutral];
