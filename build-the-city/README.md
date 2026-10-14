# Build the City

An English speaking game for giving directions. Students build a city on their own tablet while the teacher reads commands over Zoom. Everything is in one offline file, `index.html`. There is no login, no database, no scores and no syncing between devices.

## How a round works

1. Teacher opens the game, presses **👩‍🏫 Teacher**, picks the round and shares the screen on Zoom.
2. Teacher reads each command aloud with **Next command ▶**. Students drag landmarks onto their own map (or tap a landmark, then tap a spot).
3. After the last command the teacher says "Go!". Every student presses **⏱️ Start 10-second countdown**. At zero the map locks and shows *Your city is ready! Time to give directions.*
4. Teacher calls any student (or uses **Pick a student**). That student shares their screen and presses **🎤 Present my city**, which shows their name, map, a speaking guide and a speaking timer (30, 60, 90 or 120 s, gentle warning at 10 s, +15 s and reset buttons).
5. Teacher asks follow-up questions, then uses **Reveal next** or **Show answer map** to compare.
6. Students press **Next round ▶** for the next city.

## Teacher tools

- The command list checks every command against the answer map: ✓ one clear answer, ℹ open answer (several spots fit), ⚠ unclear, ✖ contradiction.
- **✏️ Edit round, roads and answers**: change the title and commands (one per line), drag landmarks to set the answer spots, and rename roads. Renaming a road also changes it in every command.
- **Show build time to students** (off by default): each student sees how long they took, from their first landmark to pressing the countdown. There is no ranking.
- Edits are saved in the teacher's browser only. If you rename roads, press **🔗 Copy student link** and send that link, so students' maps show the same road names.

## Publish it online (pick one)

**Netlify Drop (no account needed for a test, 1 minute)**
1. Go to https://app.netlify.com/drop
2. Drag the `build-the-city` folder onto the page.
3. Copy the URL it gives you and share it with students.

**GitHub Pages**
GitHub Pages works on public repositories (private repositories need a paid GitHub plan).
1. Put this folder in a public repository.
2. Repository → Settings → Pages → Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)` → Save.
3. After about a minute the game is at `https://<your-username>.github.io/<repo-name>/build-the-city/`

**Fully offline**
Send `index.html` to students (Google Drive, LINE, email). It opens in any browser with no internet.

## Check the built-in rounds

`node check.mjs` runs the direction checker over all 5 rounds and a few broken commands.
