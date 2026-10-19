/* 升中挑戰（第 9 階段）：每個實驗一個 challenge/<id>.js，3D 場景同動作沿用基礎層
   加新挑戰：喺 challenge/ 加檔案，再喺度 import 同加入 CHALLENGES */
import metalrace from '../challenge/metalrace.js';
import lemon from '../challenge/lemon.js';
import plating from '../challenge/plating.js';
import flametest from '../challenge/flametest.js';

export const CHALLENGES = { metalrace, lemon, plating, flametest };
