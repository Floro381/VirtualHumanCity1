// Checks the built-in rounds against the answer maps: node check.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const logic = html.match(/<script id="logic">([\s\S]*?)<\/script>/)[1];
const ctx = {};
vm.runInNewContext(logic + ';Object.assign(this,{analyze,grade,points,toCSV,parseCSV,DEF_ROUNDS,DEF_ROADS,at});', ctx);
const { analyze, grade, points, toCSV, parseCSV, DEF_ROUNDS, DEF_ROADS, at } = ctx;
const assert = (ok, msg) => { if (!ok) { console.error('FAIL', msg); process.exitCode = 1; } };

// 1. Every default command is clear or open (no unclear, no contradictions).
DEF_ROUNDS.forEach((R, i) => analyze(R, DEF_ROADS).forEach((r, j) => {
  console.log(`R${i + 1}.${j + 1} [${'✓ℹ⚠✖'[r.lvl]}] ${r.notes.map(n => n[1]).join(' ')}`);
  assert(r.lvl <= 1, `round ${i + 1} command ${j + 1}: ${R.cmds[j]}`);
}));

// 2. The checker catches bad instructions.
const lvl = (cmds, answer) => analyze({ cmds, answer }, DEF_ROADS).map(r => r.lvl);
assert(lvl(['Place the bank on the corner of Main Street and Park Road.'], { bank: at(0, 5) })[0] === 3, 'parallel roads have no corner');
assert(lvl(['Place the bank on Main Street.'], { bank: at(2, 0) })[0] === 3, 'answer map off the named road');
assert(lvl(['Place the bakery next to the museum.', 'Place the museum at the center of the city.'], { bakery: at(5, 5), museum: at(6, 5) })[0] === 2, 'reference used before placement');
const museum = 'Place the museum at the center of the city.';
assert(lvl([museum, 'Starting at the museum, go straight along Main Street.', 'Turn left onto Maple Avenue.'], { museum: at(6, 5) })[2] === 2, 'turn without a direction is unclear');
assert(lvl([museum, 'Starting at the museum, go straight along Main Street towards Hospital Street.', 'Turn left onto Maple Avenue.'], { museum: at(6, 5) })[2] === 3, 'turning onto a road behind you');
assert(lvl([museum, 'Starting at the museum, go straight along Park Road.'], { museum: at(6, 5) })[1] === 3, 'start point not on the road');
assert(lvl(['Place the school on the corner of Main Street and School Street.'], { school: at(4, 5) })[0] === 1, 'corner has 4 open spots');

// 3. Scores.
const R1 = DEF_ROUNDS[0];
let g = grade(R1, DEF_ROADS, { ...R1.answer });
assert(g.correct === 6 && g.total === 6, 'answer map scores 6 of 6');
g = grade(R1, DEF_ROADS, { ...R1.answer, museum: at(7, 4), bakery: at(7, 3), park: at(8, 3), school: at(4, 4), library: at(5, 4), hospital: at(8, 2) });
assert(g.correct >= 3, `a different but valid city still earns credit (${g.correct}/6)`);
g = grade(R1, DEF_ROADS, { ...R1.answer, school: at(0, 0) });
assert(g.correct === 5, 'one wrong landmark costs one point');
assert(grade(R1, DEF_ROADS, {}).correct === 0, 'empty map scores 0');
assert(points({ correct: 6, total: 6 }, 30, 'speed') === 690, 'speed bonus: 600 + (100 - 10)');
assert(points({ correct: 3, total: 6 }, 30, 'speed') === 345, 'bonus scaled by share correct');
assert(points({ correct: 6, total: 6 }, 30, 'correct') === 600 && points({ correct: 6, total: 6 }, 30, 'off') === 0, 'modes');
assert(points({ correct: 0, total: 6 }, 0, 'speed') === 0, 'fast empty map earns nothing');

// 4. CSV survives commas, quotes, Thai names and blocks Excel formulas.
const rows = [{ name: 'Somchai "Tom", ก', class: 'M1/2', number: '7', round: 1, correct: 5, total: 6, seconds: 83, score: 572, date: '2026-10-14 23:50' }, { name: '=HYPERLINK("x")', class: '', number: '', round: 2, correct: 0, total: 4, seconds: '', score: 0, date: '' }];
const back = parseCSV('﻿' + toCSV(rows));
assert(back.length === 2 && back[0].name === rows[0].name && back[0].score === '572', 'CSV round trip');
assert(back[1].name.startsWith("'="), 'formula neutralised');
console.log(process.exitCode ? 'FAILED' : 'All checks passed.');
