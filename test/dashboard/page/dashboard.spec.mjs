// What a person does with the dashboard, checked in a real browser (Chromium), on the demo runs.
import { test, expect } from '@playwright/test';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, REPORTS } from './global-setup.mjs';

const indexData = () => { const w = {}; new Function('window', readFileSync(path.join(REPORTS, 'data', 'index.js'), 'utf8'))(w); return w.DASH_INDEX; };
const URL0 = pathToFileURL(path.join(REPORTS, 'index.html')).href;
const shot = async (page, name) => { await page.waitForTimeout(350); /* let the drawer finish sliding in */ return page.screenshot({ path: path.join(ROOT, '.dashboard-test', 'screenshots', `${test.info().project.name}-${name}.png`), fullPage: false }); };

// Every test fails if the page logs an error or a file fails to load
let problems = [];
test.beforeEach(async ({ page }) => {
  problems = [];
  page.on('pageerror', (e) => problems.push('page error: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FILE_NOT_FOUND.*\.mp4|Failed to load resource/.test(m.text())) problems.push('console: ' + m.text()); });
  page.on('requestfailed', (r) => { if (!/\.mp4$/.test(r.url())) problems.push('failed to load: ' + r.url()); });
});
test.afterEach(async () => {
  expect(problems, 'browser errors').toEqual([]);
});

// The newest demo run is the one that could not start; most tests look at the newest run that has tests.
const latestTour = () => indexData().runs.find((r) => r.summary.total > 1 && r.suites.includes('tour')); // skips the run whose session never started

test('opens from disk: verdict, 8 numbers, all-runs totals, triage and runs table', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latestTour().id}`);
  await expect(page.locator('.vbox .v')).toContainText('BLOCKED');
  await expect(page.locator('.kpi')).toHaveCount(8);
  await expect(page.locator('.cons .tile')).toHaveCount(6);
  await expect(page.locator('tbody tr.row[data-key]').first()).toBeVisible();
  await expect(page.locator('tr[data-run-row]')).toHaveCount(indexData().runs.length);
  await shot(page, 'triage');
});

test('no sideways scrolling on any screen', async ({ page }) => {
  for (const tab of ['triage', 'coverage', 'performance', 'devices', 'history', 'api']) {
    await page.goto(`${URL0}#/${tab}?run=${latestTour().id}`);
    await page.waitForTimeout(150);
    const [sw, cw] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(sw, `${tab} is wider than the screen`).toBeLessThanOrEqual(cw + 1);
  }
});

test('the newest run could not start: BLOCKED with the reason', async ({ page }) => {
  await page.goto(URL0);
  await expect(page.locator('.vbox .v')).toContainText('BLOCKED');
  await expect(page.locator('.vbox .why')).toContainText('No APK');
});

test('suite filter: only smoke runs, kept in the address and after reload', async ({ page }) => {
  await page.goto(URL0);
  await page.selectOption('#s-suite', 'smoke');
  await expect(page).toHaveURL(/suite=smoke/);
  const smokeRuns = indexData().runs.filter((r) => r.suites.includes('smoke')).length;
  await expect(page.locator('tr[data-run-row]')).toHaveCount(smokeRuns);
  await page.reload();
  await expect(page.locator('#s-suite')).toHaveValue('smoke');
  await expect(page.locator('tr[data-run-row]')).toHaveCount(smokeRuns);
});

test('triage: click a row opens the drawer; Esc closes it; the address follows', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latestTour().id}`);
  await page.locator('tbody tr.row[data-key]').first().click();
  await expect(page.locator('body')).toHaveClass(/drawer-open/);
  await expect(page).toHaveURL(/open=/);
  await expect(page.locator('#drawer')).toContainText('Steps to reproduce');
  await shot(page, 'drawer');
  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveClass(/drawer-open/);
  await expect(page).not.toHaveURL(/open=/);
});

test('keyboard: j moves, Enter opens, / goes to search', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latestTour().id}`);
  await page.locator('body').click({ position: { x: 5, y: 300 } });
  await page.keyboard.press('j');
  await expect(page.locator('tbody tr.row[data-key]').nth(1)).toHaveClass(/sel/);
  await page.keyboard.press('Enter');
  await expect(page.locator('body')).toHaveClass(/drawer-open/);
  await page.keyboard.press('Escape');
  await page.keyboard.press('/');
  await expect(page.locator('#q')).toBeFocused();
});

test('every secondary tab opens and shows its content', async ({ page }) => {
  const expectText = { coverage: 'Coverage by module', performance: 'App start', devices: 'Device matrix', history: 'Flakiness', api: 'API log', compare: 'Compare runs' };
  for (const [tab, text] of Object.entries(expectText)) {
    await page.goto(`${URL0}#/${tab}?run=${latestTour().id}`);
    await expect(page.locator('#app')).toContainText(text);
    if (tab === 'api' || tab === 'history' || tab === 'compare') await shot(page, tab);
  }
});

test('API tab: failures with reasons, call details, a link straight to one call', async ({ page }) => {
  const failing = indexData().runs.find((r) => (r.api?.topIssues || []).some((x) => /did not answer/.test(x.reason))); // the run whose search call timed out
  await page.goto(`${URL0}#/api?run=${failing.id}`);
  await expect(page.locator('#app')).toContainText('Problems (');
  await expect(page.locator('#app')).toContainText("did not answer within the app's time limit");
  await expect(page.locator('#app')).toContainText('Known');
  const call = page.locator('details.call').filter({ hasText: 'feed/featured' }).last();
  await call.locator('summary').first().click();
  await expect(call).toContainText('Response');
  await expect(call).toContainText('(hidden)');
  const id = await call.getAttribute('id');
  await page.goto(`${URL0}#/api?run=${failing.id}&call=${id}`);
  await page.reload();
  await expect(page.locator(`#${id}`)).toHaveAttribute('open', '');
});

test('run details: trigger, CI job link, tools, times', async ({ page }) => {
  const ci = indexData().runs.find((r) => r.details && r.details.ci);
  await page.goto(`${URL0}#/triage?run=${ci.id}`);
  await page.locator('[data-run-details]').click();
  await expect(page).toHaveURL(/open=run%3A|open=run:/);
  const d = page.locator('#drawer');
  await expect(d).toContainText('Where it came from');
  await expect(d).toContainText('GitHub Actions');
  await expect(d.locator('a', { hasText: 'open the job' })).toHaveAttribute('href', /actions\/runs\/1234567/);
  await expect(d).toContainText('Node.js');
  await shot(page, 'run-details');
});

test('drawer: filter the app log lines', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latestTour().id}&f=crash`);
  await page.locator('tbody tr.row[data-key]').first().click();
  await page.locator('#d-logq').fill('NullPointer');
  await expect(page.locator('#d-logq-n1')).toHaveText('1 match');
  await expect(page.locator('#d-log-err')).toContainText('NullPointerException');
  await page.locator('#d-logq').fill('nothing-like-this');
  await expect(page.locator('#d-log-err')).toHaveText('(no matching lines)');
});

test('a run in the old format (before versioning) still opens with its API calls', async ({ page }) => {
  await page.goto(`${URL0}#/api?run=20261109-090000`);
  await expect(page.locator('#app')).toContainText('feed/featured');
  await page.goto(`${URL0}#/triage?run=20261109-090000`);
  await page.locator('[data-run-details]').click();
  await expect(page.locator('#drawer')).toContainText('before run details were recorded');
});

test('auto-refresh: a rebuilt dashboard updates the open page by itself', async ({ page }) => {
  const own = mkdtempSync(path.join(os.tmpdir(), 'wikidash-live-'));
  cpSync(REPORTS, own, { recursive: true });
  await page.goto(pathToFileURL(path.join(own, 'index.html')).href);
  await expect(page.locator('.vbox')).toBeVisible();
  const latest = path.join(own, 'data', 'latest.js');
  writeFileSync(latest, readFileSync(latest, 'utf8').replace(/"generatedAt":"[^"]+"/, '"generatedAt":"2099-01-01T00:00:00.000Z"'));
  await expect(page.locator('#toast')).toBeVisible({ timeout: 8000 });
});

test('dark mode follows the system and the theme button switches it', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latestTour().id}`);
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const first = await bg();
  await page.locator('#theme').click();
  expect(await bg()).not.toBe(first);
});


// ---------------------------------------------------------------- phase 2: failure analysis
test('regression: passed on an older build with the same test code, fails on a newer one', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latestTour().id}&f=regressions`);
  const row = page.locator('tbody tr.row[data-key]').first();
  await expect(row).toContainText('TOUR-07');
  await expect(row).toContainText('REGRESSION');
  await expect(row).toContainText('Product bug');
  await row.click();
  const a = page.locator('#drawer section[aria-label="Analysis"]');
  await expect(a).toContainText(/Passed on build #3 \(run \S+\) and started failing in run \S+ \(build #4\) with the same test code \(a1b2c3d\)/);
  await shot(page, 'regression');
  await a.locator('a[data-compare]').click();
  await expect(page).toHaveURL(/#\/compare\?/);
  await expect(page.locator('#app')).toContainText('Newly failing in B');
});

test('flaky only when the same app build and test code gave both results', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latestTour().id}&f=flaky`);
  const row = page.locator('tbody tr.row[data-key]').filter({ hasText: 'TOUR-04' });
  await expect(row).toContainText('FLAKY');
  await row.click();
  await expect(page.locator('#drawer section[aria-label="Analysis"]')).toContainText(/Failed in run \S+ and passed in run \S+ with the same app build \(#5\) and the same test code \(a1b2c3d\)/);
});

test('categories: column, filter, and a reason in the drawer; a person can override', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latestTour().id}`);
  await expect(page.locator('table[aria-label="Triage table"] thead')).toContainText('Category');
  await page.selectOption('#s-cat', 'test');
  await expect(page).toHaveURL(/cat=test/);
  const row = page.locator('tbody tr.row[data-key]').first();
  await expect(row).toContainText('Test bug');
  await row.click();
  await expect(page.locator('#drawer section[aria-label="Analysis"]')).toContainText('The test code changed between the last pass');
  page.once('dialog', (d) => d.accept('checked the screenshot: app bug'));
  await page.selectOption('#a-cat', 'product');
  await expect(page.locator('.unsaved')).toContainText('saved only in this browser');
  await page.keyboard.press('Escape');
  await page.selectOption('#s-cat', 'product');
  await expect(page.locator('table[aria-label="Triage table"] tbody')).toContainText('feed_view');
});

test('quarantine: an expired one counts again and is called out; a new one takes the test out of the verdict', async ({ page }) => {
  // The demo triage file has TOUR-04 quarantined until 2026-11-01 (expired): it counts again and the verdict says so
  await page.goto(`${URL0}#/triage?run=${latestTour().id}&f=all`);
  await expect(page.locator('.vbox .why')).toContainText('quarantine expired for TOUR-04');
  await page.locator('tbody tr.row[data-key]').filter({ hasText: 'TOUR-04' }).click();
  await expect(page.locator('#drawer section[aria-label="Analysis"]')).toContainText('Expired on 2026-11-01: the failure counts again.');
  await page.keyboard.press('Escape');
  await page.goto(`${URL0}#/triage?run=${latestTour().id}&f=regressions`);
  await page.locator('tbody tr.row[data-key]').first().click();
  page.on('dialog', (d) => d.accept(d.message().startsWith('For how many') ? '7' : 'menu fix in progress'));
  await page.locator('#a-q').click();
  await expect(page.locator('#toast')).toContainText('TOUR-07 quarantined until');
  await page.keyboard.press('Escape');
  await page.goto(`${URL0}#/triage?run=${latestTour().id}&f=quarantined`);
  await expect(page.locator('tbody tr.row[data-key]').first()).toContainText('QUARANTINED');
  await expect(page.locator('.vbox .why')).toContainText('1 quarantined failure not counted');
  await expect(page.locator('.vbox .why')).not.toContainText('regression');
});

test('compare: two runs side by side, with build, test code and API differences', async ({ page }) => {
  const runs = indexData().runs.filter((r) => r.suites.includes('tour') && r.summary.total > 1);
  const [b, a] = [runs.find((r) => r.apk.build_number === '4'), runs.find((r) => r.apk.build_number === '3')];
  await page.goto(`${URL0}#/compare?a=${a.id}&b=${b.id}`);
  await expect(page.locator('#app')).toContainText('Newly failing in B (1)');
  await expect(page.locator('#app')).toContainText('REGRESSION');
  await expect(page.locator('#app')).toContainText('What changed around the tests');
  await expect(page.locator('#app a', { hasText: 'App code changes between A and B on GitHub' })).toHaveAttribute('href', /\/compare\//);
  await expect(page.locator('#app')).toContainText('API calls by API');
  await page.selectOption('select[data-cmp="a"]', runs[runs.length - 1].id);
  await expect(page).toHaveURL(new RegExp(`a=${runs[runs.length - 1].id}`));
});

// ---------------------------------------------------------------- API: every call from initiation to resolution, never a generic message
test('API: each call shows its timeline, outcome, response shape and body or the exact reason there is none', async ({ page }) => {
  const r = indexData().runs.find((x) => x.api && x.api.noResponse >= 2);
  await page.goto(`${URL0}#/api?run=${r.id}&af=all`);
  const ok = page.locator('details.call').filter({ hasText: 'feed/featured' }).filter({ hasText: '200' }).first();
  await ok.locator('summary').first().click();
  await expect(ok).toContainText('Request started: GET');
  await expect(ok).toContainText(/Response 200 received after \d+ ms/);
  await expect(ok).toContainText(/Response complete: \d+ bytes body/);
  await expect(ok).toContainText('Response holds');
  await expect(ok).toContainText('JSON with 4 fields: tfa');
  await expect(ok.locator('pre.log').last()).toContainText('"tfa"');
  for (const reason of ['The app crashed at', 'The test closed the app on purpose']) {
    await expect(page.locator('details.call').filter({ hasText: reason }).first()).toContainText('No response');
  }
  await page.locator('[data-af="noresp"]').click();
  await expect(page.locator('section', { hasText: 'Every call, in order' }).locator('details.call')).toHaveCount(r.api.noResponse);
});

test('API log section and api-log.txt: the whole run in order, with every outcome', async ({ page }) => {
  const r = indexData().runs.find((x) => x.api && x.api.calls > 5);
  await page.goto(`${URL0}#/api?run=${r.id}`);
  const log = page.locator('.apilog');
  await expect(log).toContainText('=== TOUR-01');
  await expect(log).toContainText('Request sent');
  await expect(log).toContainText('=> 200');
  await expect(log).toContainText('No response.');
  await expect(page.locator('a', { hasText: 'api-log.txt' })).toHaveAttribute('href', new RegExp(`runs/${r.id}/api-log.txt`));
});

test('no generic API messages: a run without calls and a test without calls say exactly why', async ({ page }) => {
  const session = indexData().runs.find((x) => x.problems.some((p) => p.id === 'SESSION'));
  await page.goto(`${URL0}#/api?run=${session.id}`);
  await expect(page.locator('#app')).toContainText('No API calls: the test session never started, so the app was not opened.');
  await expect(page.locator('#app')).toContainText('No emulator or phone was connected');
  await page.goto(`${URL0}#/triage?run=${latestTour().id}&f=all`);
  await page.locator('tbody tr.row[data-key]').filter({ hasText: 'TOUR-06' }).click();
  await expect(page.locator('#drawer')).toContainText("The app's network log contains no requests between the start of this test");
  await expect(page.locator('#drawer')).toContainText('Full API logging was on for this run.');
  for (const generic of ['screens that work from the phone', 'Body not logged for this call', 'They are read from']) await expect(page.locator('body')).not.toContainText(generic);
});

test('a session that could not start shows the reason from the WebdriverIO log', async ({ page }) => {
  const session = indexData().runs.find((x) => x.problems.some((p) => p.id === 'SESSION'));
  await page.goto(`${URL0}#/triage?run=${session.id}`);
  const row = page.locator('tbody tr.row[data-key]').first();
  await expect(row).toContainText('Infrastructure');
  await row.click();
  await expect(page.locator('#drawer')).toContainText('No emulator or phone was connected (adb sees no device)');
  await expect(page.locator('#drawer')).toContainText('Could not find a connected Android device');
});

test('every code shown comes with a one-line meaning: status codes, API codes, exit codes, severities', async ({ page }) => {
  const r = indexData().runs.find((x) => x.api && x.api.noResponse >= 2);
  await page.goto(`${URL0}#/api?run=${r.id}&af=all`);
  const codes = page.locator('section', { hasText: 'Codes in this run' });
  await expect(codes).toContainText('403');
  await expect(codes).toContainText('Forbidden: The server understood the request but refuses it');
  await expect(codes).toContainText('OK: The request worked');
  // the status chip explains itself on hover, and a 403 call says what 403 means
  await expect(page.locator('.http.s4').first()).toHaveAttribute('title', /^403 Forbidden: /);
  await expect(page.locator('details.call').filter({ hasText: '403' }).first()).toContainText('403 Forbidden means: The server understood the request but refuses it');
  const ok = page.locator('details.call').filter({ hasText: 'feed/featured' }).filter({ hasText: '200' }).first();
  await ok.locator('summary').first().click();
  await expect(ok).toContainText('Status 200');
  await expect(ok).toContainText('OK: The request worked and the answer is in the body.');
  // the session that never started explains its exit code; severities explain themselves
  const session = indexData().runs.find((x) => x.problems.some((p) => p.id === 'SESSION'));
  await page.goto(`${URL0}#/triage?run=${session.id}`);
  await page.locator('tbody tr.row[data-key]').first().click();
  await expect(page.locator('#drawer .codes')).toContainText('Exit code 1: Finished with errors');
  await expect(page.locator('#drawer .chip.sev-P0').first()).toHaveAttribute('title', /^P0: Blocker/);
});

// ---------------------------------------------------------------- Phase 3: budgets, trends, p50/p95, response formats
const lastTour = () => indexData().runs.find((r) => r.suites.includes('tour') && r.budget && r.budget.formats.some((f) => f.problems));

test('Performance: budgets and trends list what needs a look first, each with its numbers and a history chart', async ({ page }) => {
  const r = lastTour();
  await page.goto(`${URL0}#/performance?run=${r.id}`);
  const sec = page.locator('section', { hasText: 'Budgets and trends' });
  await expect(sec).toContainText(/\d+ over budget/);
  await expect(sec).toContainText(/\d+ slower than usual/);
  await expect(sec).toContainText('usual = median of earlier passing tour runs on sdk_gphone64_x86_64 · Android 14');
  const launch = sec.locator('tr', { hasText: 'App start (cold launch)' });
  await expect(launch).toContainText('slower than usual');
  await expect(launch).toContainText('4100 ms');
  await expect(launch).toContainText('+231%');
  await expect(launch.locator('svg.spark')).toHaveAttribute('aria-label', /App start \(cold launch\) launch time: .*4100 ms/);
  const api = sec.locator('tr', { hasText: 'generator=random' });
  await expect(api).toContainText('over budget');
  await expect(api).toContainText(/p95 \d+ ms over the 2000 ms budget/);
  // Known APIs (triage.json knownApi) never appear as a problem
  await expect(sec.locator('tr', { hasText: 'over budget' }).filter({ hasText: 'streamconfigs' })).toHaveCount(0);
  // "All" shows every budget, kept in the URL
  await sec.locator('[data-bf="all"]').click();
  await expect(page).toHaveURL(/bf=all/);
  await expect(sec.locator('tr', { hasText: 'TOUR-01' })).toContainText('within');
});

test('Performance: API response times with p50 / p95 / max per API, and response formats with the exact problem', async ({ page }) => {
  const r = lastTour();
  await page.goto(`${URL0}#/performance?run=${r.id}`);
  const times = page.locator('section', { hasText: 'API response times' });
  await expect(times.locator('thead')).toContainText('p50');
  await expect(times.locator('thead')).toContainText('p95');
  await expect(times.locator('tr', { hasText: 'streamconfigs' })).toContainText('(known API)');
  const formats = page.locator('section', { hasText: 'Response formats' });
  await expect(formats.locator('tr', { hasText: 'Featured content feed' })).toContainText('mostread.articles[0].title should be text but is a number.');
  await expect(formats.locator('tr', { hasText: 'On this day' })).toContainText('every checked field was there with the right type');
  // the same problem on the call itself, in the API tab
  await page.goto(`${URL0}#/api?run=${r.id}&af=failed`);
  const c = page.locator('details.call').filter({ hasText: 'feed/featured' }).first();
  await expect(c).toContainText('Response format (Featured content feed (Explore / Home)): 1 problem');
  await c.locator('summary').first().click();
  await expect(c.locator('dd', { hasText: 'problem' }).first()).toContainText('against "Featured content feed (Explore / Home)"');
  await expect(page.locator('section', { hasText: 'By API' }).locator('thead')).toContainText('p95');
});

test('a body cut by the Android log is not checked, and says exactly why', async ({ page }) => {
  const r = indexData().runs.find((x) => x.budget && x.budget.formats.some((f) => f.reasons.some((m) => /4,059-byte/.test(m))));
  await page.goto(`${URL0}#/performance?run=${r.id}`);
  await expect(page.locator('section', { hasText: 'Response formats' }).locator('tr', { hasText: 'Featured content feed' })).toContainText("longer than Android's 4,059-byte line limit");
  await page.goto(`${URL0}#/api?run=${r.id}&af=all`);
  const c = page.locator('details.call').filter({ hasText: 'feed/featured' }).first();
  await c.locator('summary').first().click();
  await expect(c).toContainText('JSON that lost text in the Android log');
  await expect(c).toContainText('Not checked ("Featured content feed (Explore / Home)")');
});

test('the run verdict mentions budget warnings, and the budget warnings make a passing run "with warnings"', async ({ page }) => {
  const r = lastTour();
  await page.goto(`${URL0}#/triage?run=${r.id}`);
  await expect(page.locator('#app')).toContainText(/\d+ performance \/ API budget warnings? \(Performance tab\)/);
});
