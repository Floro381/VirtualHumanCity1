# Rjan repo

Classroom projects by Recie (MEP teacher, M1–M2). One folder per project.

## build-the-city/
- Single offline `index.html` (HTML + CSS + vanilla JS). No server, database or sync.
- `<script id="logic">` holds the city model, direction checker, grading and CSV helpers with no DOM use; `check.mjs` runs it under Node.
- Map grid: 14 × 10 lots, 5 north–south roads (index 0–4) and 5 east–west roads (index 5–9). Center = road 2 × road 7.
- No login: opens on the student map; header "Teacher" button toggles Teacher view.
- `Code.gs` serves index.html as a Google Apps Script web app (Google Drive hosting).
- Teacher's game link `#g=` = deflate + base64url of {roads, rounds, mode}; `checkGame()` validates it.
- Scores: student downloads a CSV of their rounds; teacher loads the files into Class scores. Formula cells get a leading `'`.

## Which step to use
- New feature: plan once, edit only the touched function, then run `node build-the-city/check.mjs`.
- Changed rounds or the checker: `node build-the-city/check.mjs` must print "All checks passed."
- Changed login, link, drag, lock, timer or score code: `python3 build-the-city/smoke.py` must print "All browser checks passed."
- One review pass before commit. No multi-agent reviews.
