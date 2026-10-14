// Checks the built-in rounds against the answer maps: node check.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const logic = html.match(/<script id="logic">([\s\S]*?)<\/script>/)[1];
const ctx = {};
vm.runInNewContext(logic + ';this.analyze=analyze;this.DEF_ROUNDS=DEF_ROUNDS;this.DEF_ROADS=DEF_ROADS;this.at=at;', ctx);
const { analyze, DEF_ROUNDS, DEF_ROADS, at } = ctx;
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
console.log(process.exitCode ? 'FAILED' : 'All checks passed.');
