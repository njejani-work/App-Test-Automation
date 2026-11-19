// The moved logic gives the same answers as the old page. Both pages are opened on the same demo runs (eGenome's
// test/dashboard/fixtures.mjs: failures, a crash, a regression, flaky, quarantine, a failed setup...) and for EVERY run
// the verdict, its reason, the 8 numbers and the root causes (key + status) must be identical.
// Needs: the built page (npm run build) and Playwright (installed at the workspace root).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const egenome = path.resolve(here, '../../../../apps/egenome');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dash-parity-'));
let browser, page, runIds;

before(async () => {
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  execFileSync(process.execPath, [path.join(egenome, 'test/dashboard/fixtures.mjs'), dir], { cwd: egenome, env, stdio: 'ignore', timeout: 120000 });
  assert.ok(fs.existsSync(path.join(dir, 'next.html')), 'the new page was copied next to index.html (run npm run build first)');
  globalThis.window = {};
  new Function(fs.readFileSync(path.join(dir, 'data/index.js'), 'utf8'))();
  runIds = window.DASH_INDEX.runs.map((r) => r.id);
  browser = await chromium.launch();
  page = await browser.newPage();
});
after(async () => { await browser?.close(); fs.rmSync(dir, { recursive: true, force: true }); });

const url = (file, hash) => pathToFileURL(path.join(dir, file)).href + hash;

async function oldPage(id) {
  await page.goto(url('index.html', `#/triage?run=${id}&f=failures`));
  await page.waitForSelector('.vbox');
  return page.evaluate(() => ({
    verdict: document.querySelector('.vbox .v').textContent.replace(/^[^A-Z]+/, '').trim(),
    why: document.querySelector('.vbox .why').textContent.trim(),
    kpis: [...document.querySelectorAll('.kpis .kpi .n')].map((n) => n.textContent.trim()),
    groups: [...document.querySelectorAll('table[aria-label="Triage table"] tr.row')].map((r) => `${r.dataset.key} ${r.querySelector('.chip[class*="st-"]').className.match(/st-(\w+)/)[1]}`).sort(),
  }));
}

async function newPage(id) {
  await page.goto(url('next.html', `#/overview?run=${id}`));
  await page.waitForSelector('[data-testid=verdict]');
  return page.evaluate(() => ({
    verdict: document.querySelector('[data-testid=verdict]').textContent.trim(),
    why: document.querySelector('[data-testid=why]').textContent.trim(),
    kpis: [...document.querySelectorAll('[data-kpi]')].map((n) => n.dataset.value),
    groups: JSON.parse(document.querySelector('[data-testid=groups]').dataset.keys).sort(),
  }));
}

test('every demo run: same verdict, reason, numbers and root causes as the old page', async (t) => {
  assert.ok(runIds.length >= 5, 'the demo has several runs');
  for (const id of runIds) {
    const [a, b] = [await oldPage(id), await newPage(id)];
    t.diagnostic(`${id}: ${b.verdict} · ${b.kpis.join(' ')} · ${b.groups.length} open root cause(s)`);
    assert.deepEqual(b, a, `run ${id}`);
  }
});

// The same on the real recorded runs of each app (a copy of reports/: the app's own folder is never written to)
const nextPage = path.resolve(here, '../../template/next/index.html');
const oldPageFile = path.resolve(here, '../../template/index.html'); // what every reports/index.html is a copy of
for (const app of ['egenome', 'wikipedia', 'instagram']) {
  const reports = path.resolve(here, `../../../../apps/${app}/reports`);
  test(`${app}: its latest runs give the same answers in both pages`, { skip: !fs.existsSync(path.join(reports, 'data/index.js')) && 'no runs recorded' }, async (t) => {
    const copy = fs.mkdtempSync(path.join(os.tmpdir(), `dash-${app}-`));
    try {
      fs.cpSync(path.join(reports, 'data'), path.join(copy, 'data'), { recursive: true });
      fs.copyFileSync(oldPageFile, path.join(copy, 'index.html'));
      fs.copyFileSync(nextPage, path.join(copy, 'next.html'));
      globalThis.window = {};
      new Function(fs.readFileSync(path.join(copy, 'data/index.js'), 'utf8'))();
      const at = (file, hash) => pathToFileURL(path.join(copy, file)).href + hash;
      for (const r of window.DASH_INDEX.runs.slice(0, 3)) {
        await page.goto(at('index.html', `#/triage?run=${r.id}&f=failures`)); await page.waitForSelector('.vbox');
        const a = await page.evaluate(() => ({ verdict: document.querySelector('.vbox .v').textContent.replace(/^[^A-Z]+/, '').trim(), why: document.querySelector('.vbox .why').textContent.trim(), kpis: [...document.querySelectorAll('.kpis .kpi .n')].map((n) => n.textContent.trim()) }));
        await page.goto(at('next.html', `#/overview?run=${r.id}`)); await page.waitForSelector('[data-testid=verdict]');
        const b = await page.evaluate(() => ({ verdict: document.querySelector('[data-testid=verdict]').textContent.trim(), why: document.querySelector('[data-testid=why]').textContent.trim(), kpis: [...document.querySelectorAll('[data-kpi]')].map((n) => n.dataset.value) }));
        t.diagnostic(`${r.id}: ${b.verdict} · ${b.why}`);
        assert.deepEqual(b, a, `run ${r.id}`);
      }
    } finally { fs.rmSync(copy, { recursive: true, force: true }); }
  });
}
