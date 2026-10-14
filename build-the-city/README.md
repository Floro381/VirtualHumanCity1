# Build the City

An English speaking game for giving directions. Students build a city on their own tablet while the teacher reads commands over Zoom. Everything is in one offline file, `index.html`. There is no server and no database. Scores travel as small CSV text files.

## Start a class

1. Teacher opens the game and taps **👩‍🏫 I am the teacher**. The first time, create a 4 to 8 digit PIN. Next time, type the same PIN.
2. Choose the **Score** setting: Off, Correct landmarks, or Correct landmarks + speed bonus.
3. Press **🔗 Create game link for students** and paste the link in Zoom chat. The link carries your rounds, answers, road names and score setting.
4. Students open the link, type their full name, class and number, then press **Start playing**.

## How a round works

1. Teacher reads each command with **Next command ▶**. Students drag landmarks onto their map, or tap a landmark and then tap a spot.
2. After the last command the teacher says "Go!". Every student presses **⏱️ Start 10-second countdown**. At zero the map locks and shows *Your city is ready! Time to give directions.*
3. If scores are on, the student sees "✅ 5 of 6 correct · ⏱️ 1:23 · ⭐ 572 points".
4. Teacher calls any student, or uses **Pick a student**. That student shares their screen and presses **🎤 Present my city** (speaking guide and 30/60/90/120 s timer).
5. Teacher uses **Reveal next** or **Show answer map** to compare.

## Scores

- 100 points for each landmark in a correct spot. A spot is correct when it fits the command, measured from the student's own landmarks, so open answers count.
- Speed bonus (optional): up to 100 points, minus 1 point for every 3 seconds, multiplied by the share of correct landmarks.
- After each round the student presses **💾 Save my scores**. The file `BuildTheCity_<class>_<number>_<name>.csv` holds every round they played. They send it to you on LINE or Google Classroom.
- In Teacher view open **Class scores**, load all the files at once, and see one ranked list per round. **⬇️ Download class list** saves one CSV that opens in Excel or Google Sheets. Loading the same file twice adds nothing.

## Teacher tools

- The command list checks every command against the answer map: ✓ one clear answer, ℹ open answer, ⚠ unclear, ✖ contradiction.
- **✏️ Edit round, roads and answers**: change titles and commands, drag landmarks to set answers, rename roads. Make a new game link after editing.
- **Forgot PIN?** resets the PIN and deletes edited rounds and class scores on that device.
- The PIN keeps students out of Teacher view by accident. It is stored in the browser, so it is not real security. Devices opened from a game link have no teacher login button.

## Publish it online (pick one)

**Netlify Drop (1 minute)**: go to https://app.netlify.com/drop, drag the `build-the-city` folder onto the page, and use the URL it gives you.

**GitHub Pages**: works on public repositories (private ones need a paid GitHub plan). Settings → Pages → Deploy from a branch → `main`, `/ (root)`. The game is then at `https://<username>.github.io/<repo>/build-the-city/`.

**Fully offline**: send `index.html` to students. Game links also work from a file, but each student must open the link with the same file name and folder.

## Checks

- `node check.mjs`: direction checker over all 5 rounds, scoring, and CSV files.
- `python3 smoke.py`: browser test of login, game link, playing, scoring, saving and loading score files (needs Playwright).
