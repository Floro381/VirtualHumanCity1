# Browser smoke test: python3 smoke.py  (needs: pip install playwright && playwright install chromium)
import pathlib, sys, tempfile
from playwright.sync_api import sync_playwright

URL = (pathlib.Path(__file__).parent / 'index.html').resolve().as_uri()
errors = []

def check(ok, msg):
    print(('ok   ' if ok else 'FAIL ') + msg)
    if not ok: errors.append(msg)

def lot_xy(page, c, r):
    return page.evaluate('([c,r])=>{const l=LOTS[at(c,r)],m=svg.getScreenCTM();const p=new DOMPoint(l.x,l.y).matrixTransform(m);return [p.x,p.y]}', [c, r])

def tap_place(page, key, c, r):
    page.click(f'.chip[data-k="{key}"]'); x, y = lot_xy(page, c, r); page.mouse.click(x, y)

with sync_playwright() as p:
    b = p.chromium.launch()
    # ---- teacher: create PIN, turn on scores, make a game link
    tctx = b.new_context(viewport={'width': 1366, 'height': 820}); t = tctx.new_page()
    t.on('pageerror', lambda e: errors.append('teacher pageerror: %s' % e))
    t.goto(URL)
    check(t.is_visible('#gate'), 'start screen shows first')
    t.click('[data-go="pin"]'); t.fill('#gPin', '12'); t.click('#gateBox [type=submit]')
    check('4 to 8' in t.inner_text('#gateErr'), 'short PIN rejected')
    t.fill('#gPin', '2468'); t.click('#gateBox [type=submit]')
    check(t.is_hidden('#gate') and t.evaluate('S.teacher'), 'teacher logged in with new PIN')
    t.click('#logoutBtn'); t.click('[data-go="pin"]'); t.fill('#gPin', '1111'); t.click('#gateBox [type=submit]')
    check('Wrong PIN' in t.inner_text('#gateErr'), 'wrong PIN rejected')
    t.fill('#gPin', '2468'); t.click('#gateBox [type=submit]')
    t.select_option('#scoreMode', 'speed'); t.click('#linkBtn')
    t.wait_for_selector('#linkOut:not([hidden])'); link = t.input_value('#linkOut')
    check('#g=' in link and len(link) < 4000, 'game link created (%d chars)' % len(link))
    t.click('#revAll'); check(t.locator('#lms .lm').count() == 6, 'answer map shows 6 landmarks')
    t.click('#editBtn'); t.fill('#eCmds', 'Place the bank on the corner of Main Street and Park Road.')
    check(t.locator('#cmdList li.l3').count() == 1, 'contradiction flagged while editing')
    t.once('dialog', lambda dlg: dlg.accept()); t.click('#resetRound')
    t.click('#doneEdit')

    # ---- student: open link, fill info, play round 1
    sctx = b.new_context(viewport={'width': 820, 'height': 1180}, has_touch=True, accept_downloads=True); s = sctx.new_page()
    s.on('pageerror', lambda e: errors.append('student pageerror: %s' % e))
    s.goto(link); s.wait_for_selector('#gName')
    check(s.locator('[data-go="pin"]').count() == 0, 'student link opens the info form, no teacher login')
    s.click('#gateBox [type=submit]'); check('type your name' in s.inner_text('#gateErr'), 'name is required')
    s.fill('#gName', 'Somchai Dee'); s.fill('#gCls', 'M1/2'); s.fill('#gNo', '7'); s.click('#gateBox [type=submit]')
    check(s.evaluate('S.mode') == 'speed' and 'Somchai' in s.inner_text('#who'), 'student playing with teacher settings')
    check(s.evaluate('location.hash') == '', 'link data removed from address bar')
    ans = s.evaluate('S.rounds[0].answer')
    for k, lot in ans.items(): tap_place(s, k, lot % 14, lot // 14)
    check(s.evaluate('Object.keys(S.placed).length') == 6, 'six landmarks placed by tapping')
    # drag swap still works
    x1, y1 = lot_xy(s, 6, 6); x2, y2 = lot_xy(s, 6, 5)
    s.mouse.move(x1, y1); s.mouse.down(); s.mouse.move(x2, y2, steps=8); s.mouse.up()
    check(s.evaluate('S.placed.bakery===at(6,5)&&S.placed.museum===at(6,6)'), 'drop on occupied spot swaps')
    s.mouse.move(x2, y2); s.mouse.down(); s.mouse.move(x1, y1, steps=8); s.mouse.up()  # swap back
    s.click('#cdBtn'); s.wait_for_timeout(10600)
    ov = s.inner_text('#ovBox')
    check('Your city is ready! Time to give directions.' in ov and '6 of 6 correct' in ov and 'points' in ov, 'lock shows score: ' + ov.replace('\n', ' | '))
    s.click('[data-act="present"]')
    check(s.inner_text('#pName') == 'Somchai Dee’s City' and 'points' in s.inner_text('#pTime'), 'presentation shows name and score')
    s.select_option('#tDur', '30'); s.click('#tStart'); s.wait_for_timeout(2200)
    check(s.inner_text('#tDisp') in ('0:28', '0:27'), 'speaking timer counts down')
    s.click('#backBtn')
    x, y = lot_xy(s, 6, 5); s.mouse.move(x, y); s.mouse.down(); s.mouse.move(*lot_xy(s, 0, 0), steps=6); s.mouse.up()
    check(s.evaluate('S.placed.museum===at(6,5)'), 'locked map cannot change')
    with s.expect_download() as d: s.click('#saveScores')
    path = pathlib.Path(tempfile.mkdtemp()) / d.value.suggested_filename; d.value.save_as(path)
    text = path.read_text(encoding='utf-8-sig')
    check(d.value.suggested_filename == 'BuildTheCity_M1_2_7_Somchai_Dee.csv' and 'Somchai Dee,M1/2,7,1,6,6' in text, 'score file saved: ' + d.value.suggested_filename)

    # ---- teacher loads the file
    t.once('dialog', lambda dlg: dlg.accept())
    t.click('text=Class scores')
    t.set_input_files('#scoreFiles', str(path)); t.wait_for_timeout(300)
    check('Somchai Dee' in t.inner_text('#scoreTable'), 'teacher sees the score in the class list')
    t.once('dialog', lambda dlg: dlg.accept()); t.set_input_files('#scoreFiles', str(path)); t.wait_for_timeout(300)
    check(t.evaluate('S.scores.length') == 1, 'loading the same file twice adds nothing')
    b.close()

print('ERRORS:', errors) if errors else print('All browser checks passed.')
sys.exit(1 if errors else 0)
