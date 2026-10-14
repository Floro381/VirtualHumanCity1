# Rjan repo

Classroom projects by Recie (MEP teacher, M1–M2). One folder per project.

## build-the-city/
- Single offline `index.html` (HTML + CSS + vanilla JS). No server, database, login, scores or sync.
- `<script id="logic">` holds the city model and the direction checker with no DOM use; `check.mjs` runs it under Node.
- Map grid: 14 × 10 lots, 5 north–south roads (index 0–4) and 5 east–west roads (index 5–9). Center = road 2 × road 7.
- Teacher edits live in the browser's localStorage; road names reach students through the `#roads=` link.

## Which step to use
- New feature: plan once, edit only the touched function, then run `node build-the-city/check.mjs`.
- Changed rounds or the checker: `node build-the-city/check.mjs` must print "All checks passed."
- Changed drag, lock or timer code: run a headless browser smoke test (Playwright) of that one flow.
- One review pass before commit. No multi-agent reviews.
