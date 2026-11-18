// Turns raw run data (reports/runs/<id>/meta.json + workers/*.json) into what the dashboard reads:
//   reports/runs/<id>/run.json      eGenome's run summary: totals, every test with its steps (used by the deliverables,
//                                   CI and other tools; same format as before 13 Nov 2026)
//   reports/data/…, reports/index.html   the dashboard itself, written by analysis.mjs (shared with the Wikipedia project)
import { writeUnitData } from './unit-report.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { configure, buildDashboard, printSummary } from './analysis.mjs';
import { writeAppsData } from './lib/apps.js';
import { options } from './options.js';

export { printSummary };

const ABORTED_AFTER_MS = 30 * 60 * 1000;

const readJson = (f, fallback = null) => {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return fallback; }
};

function writeFile(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, text);
  fs.renameSync(tmp, file);
}


function totalsOf(tests) {
  // warnings: tests (not hooks) with at least one warning (they also count as passed/failed);
  // warningMessages: every warning raised in the run
  const t = { tests: 0, passed: 0, failed: 0, skipped: 0, warnings: 0, passedWithWarnings: 0, warningMessages: 0, steps: 0, stepsFailed: 0, stepsPassed: 0, stepsWarned: 0, layoutChecks: 0, layoutPassed: 0, layoutFailed: 0, layoutWarnings: 0, layoutSkipped: 0, hooks: 0, hooksFailed: 0 };
  for (const e of tests) {
    t.warningMessages += e.warnings || 0;
    if (e.type !== 'hook' && e.warnings) { t.warnings++; if (e.status === 'passed') t.passedWithWarnings++; }
    if (e.type === 'hook') {
      t.hooks++;
      if (e.status === 'failed') t.hooksFailed++;
    } else {
      t.tests++;
      if (e.status === 'passed') t.passed++;
      else if (e.status === 'failed') t.failed++;
      else if (e.status === 'skipped') t.skipped++;
    }
    t.steps += e.steps.length;
    t.stepsFailed += e.steps.filter((s) => s.status === 'failed').length;
    t.stepsPassed += e.steps.filter((s) => s.status === 'passed').length;
    t.stepsWarned += e.steps.filter((s) => s.warnings?.length).length;
    // layout checks (Layer 1): every individual check inside verifyLayout() steps
    for (const s of e.steps) {
      const L = s.layout?.summary;
      if (!L) continue;
      t.layoutChecks += L.total || 0;
      t.layoutPassed += L.passed || 0;
      t.layoutFailed += L.failed || 0;
      t.layoutWarnings += L.warnings || 0;
      t.layoutSkipped += L.skipped || 0;
    }
  }
  return t;
}

/** Merge meta + worker files for one run. Returns the run object. */
export function buildRun(reportsDir, runId) {
  const runDir = path.join(reportsDir, 'runs', runId);
  const meta = readJson(path.join(runDir, 'meta.json'), { id: runId, startedAt: Date.now() });
  const workersDir = path.join(runDir, 'workers');
  const workers = fs.existsSync(workersDir)
    ? fs.readdirSync(workersDir).filter((f) => f.endsWith('.json')).map((f) => readJson(path.join(workersDir, f))).filter(Boolean)
    : [];
  workers.sort((a, b) => a.cid.localeCompare(b.cid, undefined, { numeric: true }));

  const tests = workers.flatMap((w) => w.entries.map((e) => ({ ...e, cid: w.cid, warnings: (e.steps || []).reduce((n, st) => n + (st.warnings?.length || 0), 0) })));
  const totals = totalsOf(tests);
  const updatedAt = Math.max(meta.startedAt || 0, ...workers.map((w) => w.updatedAt || 0));

  let status;
  if (meta.finishedAt) status = totals.failed || totals.hooksFailed || meta.exitCode ? 'failed' : 'passed';
  else status = Date.now() - updatedAt > ABORTED_AFTER_MS ? 'aborted' : 'running';

  const run = {
    ...meta,
    status,
    updatedAt,
    durationMs: (meta.finishedAt || updatedAt) - meta.startedAt,
    device: workers.find((w) => w.device && Object.keys(w.device).length)?.device || meta.device || {},
    specs: [...new Set(workers.flatMap((w) => w.specs))],
    totals,
    tests,
  };
  writeFile(path.join(runDir, 'run.json'), JSON.stringify(run, null, 1));
  return run;
}

function listRunIds(reportsDir) {
  const dir = path.join(reportsDir, 'runs');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((d) => fs.existsSync(path.join(dir, d, 'meta.json'))).sort().reverse();
}

/**
 * Rebuild the dashboard: each run's run.json (eGenome format), then the analysis and the page (analysis.mjs).
 * Runs beyond keepRuns are deleted. rebuildRuns = rewrite every run (npm run dashboard); otherwise only runs that
 * changed. Returns { runs: [run summaries, newest first], file } - never throws a dashboard problem at a test run.
 */
export function buildIndex(reportsDir, { keepRuns = 30, projectName = 'eGenome.ai App Tests', rebuildRuns = false, appsFile = options.appsFile } = {}) {
  const ids = listRunIds(reportsDir).slice(0, keepRuns);
  for (const id of ids) {
    const run = rebuildRuns ? null : readJson(path.join(reportsDir, 'runs', id, 'run.json'));
    if (!run || run.status === 'running' || !run.finishedAt) { try { buildRun(reportsDir, id); } catch {} }
  }
  configure({ reportsDir, keepRuns, projectName });
  try {
    const { file, runs } = buildDashboard({ all: rebuildRuns });
    try { writeUnitData(reportsDir, keepRuns); } catch (e) { console.warn(`[dashboard] unit test results not added: ${e.message}`); } // "Unit tests" tab
    if (appsFile) { try { writeAppsData(reportsDir, appsFile); } catch (e) { console.warn(`[dashboard] app switcher not added: ${e.message}`); } } // top-left app menu
    return { file, runs };
  } catch (e) {
    console.warn(`[dashboard] could not rebuild the page: ${e.message}`);
    return { file: path.join(reportsDir, 'index.html'), runs: [] };
  }
}

/** Copy the page template into a reports folder (kept for older callers; buildIndex does it). */
export function ensureTemplate(reportsDir) {
  configure({ reportsDir });
  return buildIndex(reportsDir, {});
}

/** Copy the dashboard with only the newest `count` runs into another folder (used for deliverables). */
export function exportSnapshot(reportsDir, outDir, { count = 5, projectName } = {}) {
  const ids = listRunIds(reportsDir).slice(0, count);
  // the newest unit test runs too ("Unit tests" tab)
  const unitDir = path.join(reportsDir, 'unit');
  if (fs.existsSync(unitDir)) {
    fs.mkdirSync(path.join(outDir, 'unit'), { recursive: true });
    for (const f of fs.readdirSync(unitDir).filter((x) => /^\d{8}-\d{6}\.json$/.test(x)).sort().reverse().slice(0, count)) fs.copyFileSync(path.join(unitDir, f), path.join(outDir, 'unit', f));
  }
  for (const id of ids) {
    const src = path.join(reportsDir, 'runs', id);
    const dst = path.join(outDir, 'runs', id);
    fs.mkdirSync(dst, { recursive: true });
    for (const f of ['meta.json', 'run.json', 'run.log', 'api-log.txt']) if (fs.existsSync(path.join(src, f))) fs.copyFileSync(path.join(src, f), path.join(dst, f));
    // steps and layout screenshots, the app's Android log, API response bodies, videos of failed tests
    for (const d of ['workers', 'screenshots', 'layout', 'logcat', 'network', 'videos']) {
      if (fs.existsSync(path.join(src, d))) fs.cpSync(path.join(src, d), path.join(dst, d), { recursive: true });
    }
  }
  buildIndex(outDir, { keepRuns: count, projectName, rebuildRuns: true, appsFile: null }); // a snapshot stands alone: no app menu
  configure({ reportsDir }); // back to the real reports folder for anything that runs after
  return ids;
}
