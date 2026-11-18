// What a person does with the eGenome dashboard, checked in a real browser (Chromium), on the demo runs
// (test/dashboard/fixtures.mjs: recorded with the real recorder and a pretend device).
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, REPORTS } from './global-setup.mjs';

const indexData = () => { const w = {}; new Function('window', readFileSync(path.join(REPORTS, 'data', 'index.js'), 'utf8'))(w); return w.DASH_INDEX; };
const URL0 = pathToFileURL(path.join(REPORTS, 'index.html')).href;
const shot = async (page, name) => { await page.waitForTimeout(350); return page.screenshot({ path: path.join(ROOT, '.dashboard-test', 'screenshots', `${test.info().project.name}-${name}.png`), fullPage: false }); };

// Every test fails if the page logs an error or a file fails to load
let problems = [];
test.beforeEach(async ({ page }) => {
  problems = [];
  page.on('pageerror', (e) => problems.push('page error: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/\.mp4|Failed to load resource/.test(m.text())) problems.push('console: ' + m.text()); });
  page.on('requestfailed', (r) => { if (!/\.mp4$/.test(r.url())) problems.push('failed to load: ' + r.url()); });
});
test.afterEach(async () => { expect(problems, 'browser errors').toEqual([]); });

const runs = () => indexData().runs;
// Newest smoke run with tests (the newest run of all could not start)
const latest = () => runs().find((r) => r.summary.total > 1 && r.suites.includes('smoke'));

test('opens from disk with the eGenome name: verdict, numbers, triage table, runs table', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latest().id}`);
  await expect(page).toHaveTitle('eGenome.ai App Tests');
  await expect(page.locator('#brandName')).toHaveText('eGenome.ai App Tests');
  await expect(page.locator('.vbox .v')).toContainText('BLOCKED');
  await expect(page.locator('.kpi')).toHaveCount(8);
  await expect(page.locator('tbody tr.row[data-key]').first()).toBeVisible();
  await expect(page.locator('tr[data-run-row]')).toHaveCount(runs().length);
  await shot(page, 'triage');
});

test('no sideways scrolling on any screen', async ({ page }) => {
  for (const tab of ['triage', 'coverage', 'performance', 'devices', 'history', 'api', 'compare']) {
    await page.goto(`${URL0}#/${tab}?run=${latest().id}`);
    await page.waitForTimeout(150);
    const [sw, cw] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(sw, `${tab} is wider than the screen`).toBeLessThanOrEqual(cw + 1);
  }
});

test('a session that could not start says why (adb saw no device)', async ({ page }) => {
  await page.goto(URL0);
  await expect(page.locator('.vbox .v')).toContainText('BLOCKED');
  await page.locator('tbody tr.row[data-key]').first().click();
  await expect(page.locator('#drawer')).toContainText('No emulator or phone was connected (adb sees no device)');
  await expect(page.locator('#drawer')).toContainText('Infrastructure');
});

test('regression: SMK-05 passed on app 2.3.0 and fails on 2.4.0 with the same test code', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latest().id}`);
  const row = page.locator('tbody tr.row[data-key]', { hasText: 'SMK-05' });
  await expect(row).toContainText('REGRESSION');
  await row.click();
  await expect(page.locator('#drawer')).toContainText(/Passed on build 2\.3\.0-a3f1c2d4/);
});

test('flaky: SMK-06 failed and passed on the same build and test code', async ({ page }) => {
  const flakyRun = runs().find((r) => r.problems.some((p) => p.id === 'SMK-06' && p.status === 'failed'));
  await page.goto(`${URL0}#/triage?run=${flakyRun.id}`);
  await expect(page.locator('tbody tr.row[data-key]', { hasText: 'SMK-06' })).toContainText('FLAKY');
});

test('test details: eGenome steps with screenshots, actions and the layout checks of each screen', async ({ page }) => {
  const r = runs().find((x) => x.problems.some((p) => p.id === 'SMK-03' && p.status === 'failed'));
  await page.goto(`${URL0}#/triage?run=${r.id}`);
  await page.locator('tbody tr.row[data-key]', { hasText: 'SMK-03' }).click();
  const d = page.locator('#drawer');
  await expect(d).toContainText('Steps (2)'); // the layout failure in step 2 ends the test
  await expect(d.locator('table.egsteps > tbody > tr')).toHaveCount(2);
  await expect(d.locator('table.egsteps')).toContainText('HomePage.verifyLayout()');
  const lay = d.locator('details.lay').first();
  await expect(lay).toContainText('Layout "Home"');
  await expect(lay).toContainText('2 failed');
  await expect(lay).toContainText('weightCard moved/resized: y 21.7% (expected 16.3% ±2.0%)');
  await d.locator('[role="tab"]', { hasText: 'Steps' }).click();
  await expect(d.locator('img.thumb')).toHaveCount(2);
  await shot(page, 'test-steps');
});

test('screenshot viewer: every step of the test, arrows to move, layout boxes drawn on the screen', async ({ page }) => {
  const r = runs().find((x) => x.problems.some((p) => p.id === 'SMK-03' && p.status === 'failed'));
  await page.goto(`${URL0}#/triage?run=${r.id}`);
  await page.locator('tbody tr.row[data-key]', { hasText: 'SMK-03' }).click();
  await page.locator('#drawer [role="tab"]', { hasText: 'Steps' }).click();
  await page.locator('#drawer img.thumb').nth(1).click();
  const lb = page.locator('#lb');
  await expect(lb).toHaveClass(/open/);
  await expect(lb.locator('.cap')).toContainText('2. Home · Verify layout');
  await expect(lb.locator('.cap')).toContainText('2 / 2');
  await expect(lb.locator('.ov i.act-failed')).toHaveCount(1);
  await expect(lb.locator('.ov i.exp')).toHaveCount(1);
  await expect(lb.locator('.tools')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(lb.locator('.cap')).toContainText('1 / 2');
  await shot(page, 'viewer');
  await page.keyboard.press('Escape');
  await expect(lb).not.toHaveClass(/open/);
  await expect(page.locator('#drawer')).toBeVisible();
});

test('a failed setup hook and the tests it skipped', async ({ page }) => {
  const r = runs().find((x) => x.suites.includes('regression'));
  expect(r.summary.skipped).toBe(3);
  await page.goto(`${URL0}#/triage?run=${r.id}`);
  const row = page.locator('tbody tr.row[data-key]', { hasText: 'Setup: "before all" hook (Login)' });
  await expect(row).toBeVisible();
  await row.click();
  await expect(page.locator('#drawer')).toContainText('OnboardingPage did not open within 30000ms');
  // the pass rate leaves skipped tests out
  await expect(page.locator('.kpi', { hasText: 'Pass rate' })).toContainText('0%');
});

test('app crash: found in the app log, a blocker, with the exception', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latest().id}`);
  const row = page.locator('tbody tr.row[data-key]', { hasText: 'SMK-04' });
  await expect(row).toContainText('CRASH');
  await row.click();
  await expect(page.locator('#drawer')).toContainText('The app CRASHED during this test');
  await expect(page.locator('#drawer')).toContainText("JavascriptException: TypeError: undefined is not an object (evaluating 'plan.price')");
});

test('another process crashing (WebView) is a device warning, not an app crash', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latest().id}&f=all`);
  await page.locator('tbody tr.row[data-key]', { hasText: 'SMK-02' }).click();
  await expect(page.locator('#drawer')).toContainText('Another process crashed, not the app: com.google.android.webview:sandboxed_process0');
});

test('API calls: from request to outcome, server error, known issue, format problem, secret headers hidden', async ({ page }) => {
  await page.goto(`${URL0}#/api?run=${latest().id}&af=all`);
  await expect(page.locator('section', { hasText: 'Codes in this run' })).toContainText('Internal Server Error');
  const err = page.locator('details.call').filter({ hasText: '/v1/reports/r1/summary' }).first();
  await expect(err).toContainText('HTTP 500');
  const list = page.locator('details.call').filter({ hasText: '/v1/reports?profile=me' }).first();
  await expect(list).toContainText('Response format (Reports list): 1 problem');
  await list.locator('summary').first().click();
  await expect(list).toContainText('data[0].title should be text but is a number.');
  await expect(list).toContainText('authorization: (hidden)');
  await expect(page.locator('details.call').filter({ hasText: 'analytics.staging.example' }).first()).toContainText('Known issue');
  // a call still waiting when the session ended says so
  await expect(page.locator('details.call').filter({ hasText: '/v1/notifications' }).first()).toContainText('No response was logged before the test session ended');
  await shot(page, 'api');
});

test('API tab when the app logs no calls: says exactly why and what would be needed', async ({ page }) => {
  const r = runs().find((x) => x.apiLevel === 'NONE' && x.summary.total > 1 && x.suites.includes('smoke'));
  await page.goto(`${URL0}#/api?run=${r.id}`);
  await expect(page.locator('#app')).toContainText('The app wrote no API calls to its Android log in this run (no "OkHttp" lines from com.egenome.app)');
  await expect(page.locator('#app')).toContainText('HttpLoggingInterceptor');
});

test('Performance: app start slower than usual, memory over budget, p50/p95 per API', async ({ page }) => {
  await page.goto(`${URL0}#/performance?run=${latest().id}&bf=all`);
  const sec = page.locator('section', { hasText: 'Budgets and trends' });
  await expect(sec.locator('tr', { hasText: 'App start (cold launch)' })).toContainText('slower than usual');
  await expect(sec.locator('tr', { hasText: 'Peak memory (PSS)' })).toContainText('over budget');
  await expect(sec).toContainText('usual = median of earlier passing smoke runs on sdk_gphone64_x86_64 · Android 15');
  await expect(page.locator('section', { hasText: 'API response times' }).locator('thead')).toContainText('p95');
  await expect(page.locator('section', { has: page.locator('h2', { hasText: 'Response formats' }) })).toContainText('data[0].title should be text but is a number.');
  await shot(page, 'performance');
});

test('run details: app version and installed APK fingerprint, device read through adb', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latest().id}`);
  await page.locator('.vbox [data-run-details]').click();
  const d = page.locator('#drawer');
  await expect(d).toContainText('v2.4.0');
  await expect(d).toContainText('Installed APK');
  await expect(d).toContainText('sha256 b7e9d0f1a2');
  await expect(d).toContainText('Android build');
  await expect(d).toContainText('google/sdk_gphone64_x86_64/emu64xa:15');
});

test('codes explained: status codes, exit codes and severities in one line each', async ({ page }) => {
  await page.goto(URL0);
  await page.locator('tbody tr.row[data-key]').first().click();
  await expect(page.locator('#drawer .codes')).toContainText('Exit code 1: Finished with errors');
  await page.goto(`${URL0}#/api?run=${latest().id}&af=all`);
  await expect(page.locator('.http.s5').first()).toHaveAttribute('title', /^500 Internal Server Error: /);
});

test('coverage by eGenome module, from test/triage.json', async ({ page }) => {
  await page.goto(`${URL0}#/coverage?run=${latest().id}`);
  for (const m of ['Onboarding & Login', 'Home', 'Reports', 'Payments', 'Settings & Profile']) await expect(page.locator('#app')).toContainText(m);
});

test('keyboard: j/k move, Enter opens, Esc closes', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latest().id}`);
  await page.keyboard.press('j');
  await page.keyboard.press('Enter');
  await expect(page.locator('body')).toHaveClass(/drawer-open/);
  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveClass(/drawer-open/);
});

test('API calls per step and screen: each step lists its calls, each call names its step, a "By screen" table', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latest().id}`);
  await page.locator('tbody tr.row[data-key]', { hasText: 'SMK-05' }).click();
  const d = page.locator('#drawer');
  await d.locator('[role="tab"]', { hasText: 'Steps' }).click();
  const stepApi = d.locator('table.egsteps details.stepapi');
  await expect(stepApi).toHaveCount(1); // only step 2 (Reports opening) made calls
  await expect(stepApi).toContainText('2 API calls');
  await expect(stepApi).toContainText('2 failed'); // a 500, and a list whose response format is wrong
  await expect(stepApi).toHaveAttribute('open', ''); // opened because a call failed
  const failed = stepApi.locator('details.call', { hasText: '/v1/reports/r1/summary' });
  await expect(failed).toContainText('HTTP 500');
  await failed.locator('summary').first().click();
  await expect(failed).toContainText('step 2 (Reports · Wait for open) · Reports');
  await shot(page, 'step-api');
  await page.goto(`${URL0}#/api?run=${latest().id}&af=all`);
  const byScreen = page.locator('section', { has: page.locator('h2', { hasText: 'By screen' }) });
  await expect(byScreen.locator('tr', { hasText: 'Reports' })).toContainText('2 failed');
  await expect(byScreen.locator('tr', { hasText: 'Onboarding' })).toContainText('SMK-01 step 1');
  await expect(page.locator('details.call', { hasText: '/v1/config' }).first()).toContainText('step 1 · Onboarding');
  await shot(page, 'api-by-screen');
});

test('test details in tabs: one section at a time, kept in the address bar, arrow keys move between tabs', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latest().id}`);
  await page.locator('tbody tr.row[data-key]', { hasText: 'SMK-05' }).click();
  const d = page.locator('#drawer');
  const tabs = d.locator('[role="tablist"] [role="tab"]');
  await expect(tabs).toHaveText([/Summary/, /Steps/, /Screen/, /App log/, /API calls/, /History/]);
  // a failed test opens on its summary; the error is there
  await expect(d.locator('[role="tab"][aria-selected="true"]')).toContainText('Summary');
  await expect(d.locator('.tpane:not([hidden])')).toContainText('ReportsPage did not open within 20000ms');
  await expect(d.locator('[role="tab"]', { hasText: 'API calls' })).toContainText('2 failed'); // the count is a label, not only a colour
  // a tab click shows only that section and goes into the address bar
  await d.locator('[role="tab"]', { hasText: 'API calls' }).click();
  await expect(d.locator('.tpane:not([hidden])')).toHaveCount(1);
  await expect(d.locator('.tpane:not([hidden]) details.call')).toHaveCount(2);
  expect(page.url()).toContain('dt=api');
  // keyboard: arrow keys move to the next tab, Home to the first
  await d.locator('[role="tab"][aria-selected="true"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(d.locator('[role="tab"][aria-selected="true"]')).toContainText(/history/i);
  await page.keyboard.press('Home');
  await expect(d.locator('[role="tab"][aria-selected="true"]')).toContainText('Summary');
  // a link with the tab opens on it
  await page.goto(`${URL0}#/triage?run=${latest().id}&open=${encodeURIComponent(await d.evaluate(() => new URLSearchParams(location.hash.split('?')[1]).get('open')))}&dt=log`);
  await expect(page.locator('#drawer [role="tab"][aria-selected="true"]')).toContainText('App log');
  // each tab is short: no long scroll inside the details
  for (const name of ['Summary', 'Steps', 'Screen', 'App log', 'API calls']) {
    await page.locator('#drawer [role="tab"]', { hasText: name }).click();
    const h = await page.evaluate(() => document.querySelector('#drawer .db').scrollHeight);
    expect(h, `${name} tab height`).toBeLessThan(1500);
  }
  await shot(page, 'drawer-tabs');
});

test('long pages in tabs: urgent first, sections one at a time, kept in the address bar', async ({ page }) => {
  await page.goto(`${URL0}#/triage?run=${latest().id}`);
  const t = page.locator('#app [role="tablist"]');
  await expect(t.locator('[role="tab"]')).toHaveText([/Triage/, /Overview/, /All runs/]);
  await expect(t.locator('[role="tab"]').first()).toContainText('open'); // count with a word, not only a colour
  await expect(page.locator('#app .tpane:not([hidden]) tbody tr.row[data-key]').first()).toBeVisible(); // triage table first
  await t.locator('[role="tab"]', { hasText: 'All runs' }).click();
  await expect(page.locator('#app .tpane:not([hidden]) tr[data-run-row]')).toHaveCount(runs().length);
  expect(page.url()).toContain('sec=runs');
  // another page starts on its own first section
  await page.locator('.tabs a[data-tab="api"]').click();
  await expect(page.locator('#app [role="tab"][aria-selected="true"]')).toContainText('Problems');
  expect(page.url()).not.toContain('sec=runs');
  for (const [tab, first] of [['performance', 'Budgets'], ['compare', 'Numbers']]) {
    await page.goto(`${URL0}#/${tab}?run=${latest().id}`);
    await expect(page.locator('#app [role="tab"][aria-selected="true"]')).toContainText(first);
  }
  // a link to one API call opens the tab that holds it (a known call is only in "Every call")
  await page.goto(`${URL0}#/api?run=${latest().id}`);
  const id = await page.evaluate(() => [...document.querySelectorAll('#pane-sec-calls details.call')].find((c) => c.textContent.includes('analytics.staging.example')).id);
  await page.goto(`${URL0}#/api?run=${latest().id}&call=${encodeURIComponent(id)}`);
  await expect(page.locator('#app [role="tab"][aria-selected="true"]')).toContainText('Every call');
  await expect(page.locator('#' + id)).toBeVisible();
  await page.goto(`${URL0}#/triage?run=${latest().id}`);
  await shot(page, 'page-tabs');
});

test('phone: the filters fold behind a button that says how many are set; the header scrolls away', async ({ page }) => {
  test.skip(page.viewportSize().width > 700, 'phone layout only');
  await page.goto(`${URL0}#/triage?run=${latest().id}&suite=${encodeURIComponent(latest().suites.join('+'))}`);
  await expect(page.locator('#filterBar')).toBeHidden();
  await expect(page.locator('#fToggle')).toHaveText(/Filters · \d set/);
  await page.locator('#fToggle').click();
  await expect(page.locator('#filterBar')).toBeVisible();
  await expect(page.locator('#fToggle')).toHaveAttribute('aria-expanded', 'true');
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('header.top')).position)).toBe('static');
  await page.locator('#fToggle').click();
  await shot(page, 'phone-top');
});

test('Unit tests tab: verdict and numbers, failures first with expected vs actual, where it failed, messages', async ({ page }) => {
  await page.goto(`${URL0}#/unit`);
  await expect(page.locator('.vbox .v')).toContainText('FAILED');
  await expect(page.locator('.vbox .why')).toContainText('2 of 4 unit tests failed (2 new since the last run)');
  await expect(page.locator('.kpi', { hasText: 'Line coverage' })).toContainText('87.5%');
  await expect(page.locator('.kpi', { hasText: 'Line coverage' })).toContainText('limit 90%');
  await expect(page.locator('#app [role="tab"][aria-selected="true"]')).toContainText('Failures');
  const pane = page.locator('#app .tpane:not([hidden])');
  // an assertion: expected and actual side by side, the line in the test, the messages it attached (API data)
  const otp = pane.locator('details.ut', { hasText: 'OTP codes are masked in the report' });
  await expect(otp).toHaveAttribute('open', '');
  await expect(otp.locator('> summary')).toContainText('Failed');
  await expect(otp.locator('.uexp')).toContainText('Expected');
  await expect(otp.locator('.uexp > div').first()).toContainText('"••••••"');
  await expect(otp.locator('.uexp > div').nth(1)).toContainText('"482913"');
  await expect(otp).toContainText('Compared with assert.strictEqual');
  await expect(otp.locator('.links a')).toHaveText(/demo\.sample\.mjs:15$/);
  await expect(otp.locator('.links a')).toHaveAttribute('href', /^vscode:\/\/file\/.+demo\.sample\.mjs:15:\d+$/);
  await expect(otp).toContainText('Response body: {"token":"(hidden)","user":{"id":"u1"}}');
  await expect(otp.locator('> summary')).toContainText('NEW');
  // a thrown error points at the line in the code under test
  const box = pane.locator('details.ut', { hasText: 'position is a share of the screen height' });
  await expect(box.locator('> summary .uerr')).toContainText('Error thrown: screen size is missing'); // visible while closed
  await expect(box).not.toHaveAttribute('open', ''); // only the first failure is open (less scrolling)
  await pane.locator('[data-uopen]').click();
  await expect(box).toHaveAttribute('open', '');
  await expect(box).toContainText('Error thrown (TypeError): screen size is missing');
  await expect(box.locator('.links a')).toHaveText(/demo-lib\.mjs:5$/);
  await shot(page, 'unit-failures');
});

test('Unit tests tab: all tests by file, coverage, history, console output, run details; kept in the address bar', async ({ page }) => {
  await page.goto(`${URL0}#/unit`);
  const tab = (name) => page.locator('#app [role="tab"]', { hasText: name });
  const pane = page.locator('#app .tpane:not([hidden])');
  await tab('All tests').click();
  expect(page.url()).toContain('sec=tests');
  await expect(pane.locator('details.ufileg')).toHaveCount(1);
  await expect(pane.locator('details.ut')).toHaveCount(4);
  await expect(pane.locator('details.ut', { hasText: 'calendar on a 1440x3216 screen' }).locator('> summary')).toContainText('Skipped');
  await pane.locator('[data-uf="passed"]').click();
  await expect(page.locator('#app .tpane:not([hidden]) details.ut')).toHaveCount(1);
  expect(page.url()).toContain('uf=passed');
  await tab('Coverage').click();
  await expect(pane).toContainText('✖ under the 90% limit');
  await expect(pane.locator('tr', { hasText: 'demo-lib.mjs' })).toContainText('87.5%');
  await expect(pane.locator('tr', { hasText: 'demo-lib.mjs' })).toContainText('6'); // the uncovered line
  await tab('History').click();
  await expect(pane.locator('tr[data-urun]')).toHaveCount(2);
  await expect(pane).toContainText('Unstable tests (2)');
  await tab('Console output').click();
  await expect(pane).toContainText('checking the Home screen box');
  await tab('Run details').click();
  await expect(pane).toContainText('npm run test:unit');
  // the older (passing) run, from the run picker
  await page.selectOption('#u-run', '20261110-100500');
  await expect(page.locator('.vbox .v')).toContainText('PASS');
  await expect(page.locator('.vbox .why')).toContainText('All 3 unit tests passed, 1 skipped');
  expect(page.url()).toContain('urun=20261110-100500');
  await shot(page, 'unit-history');
});
