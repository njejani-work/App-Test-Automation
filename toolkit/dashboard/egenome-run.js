// Reads one run the way eGenome records it (reports/runs/<id>/meta.json + workers/<cid>.json, written by hooks.js
// and recorder.js) and returns it in the shape the analysis (analysis.mjs, shared with the Wikipedia project)
// works with: { run, devices, tests, net }.
//
// eGenome's step-by-step data stays as it is: every test keeps its steps (stepsDetail) with screenshots, actions,
// assertions and layout-check results; the analysis adds failure grouping, history, categories, budgets, the app log
// and API calls on top. Runs recorded before 13 Nov 2026 have no app log, performance or API data: those parts say
// so instead of showing zeros.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { classifyLogcat } from './lib/logcat.js';
import { logTime } from './lib/network.js';

import { APP_PACKAGE } from './options.js'; // com.egenome.app unless DASHBOARD_APP_PACKAGE says otherwise
export { APP_PACKAGE };
const readJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return null; } };
const iso = (ms) => (ms ? new Date(ms).toISOString() : undefined);
const slug = (s) => String(s).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 80);
const pad = (n) => String(n).padStart(3, '0');

/** Suites from the command line ("run ./wdio.conf.js --suite smoke --suite layout"); the default run is smoke + regression. */
export function suitesOf(meta = {}) {
  const args = String(meta.args || '');
  const named = [...args.matchAll(/--suite[ =](\S+)/g)].map((m) => m[1]);
  if (named.length) return named;
  const spec = args.match(/--spec[ =](\S+)/);
  if (spec) return [`spec ${path.basename(spec[1])}`];
  return ['smoke', 'regression'];
}

/** Run details for runs recorded before run-details.js was used (machine, user, Node only). */
function legacyDetails(meta) {
  const h = meta.host || {};
  return {
    trigger: meta.trigger === 'ci' ? 'CI' : 'manual (local)',
    startedBy: h.user || null,
    ci: null,
    project: null,
    host: { name: h.machine || null, os: h.os || null, arch: null },
    timeZone: null,
    utcOffsetMinutes: null,
    tools: { node: h.node || null },
  };
}

/** The test ID at the start of a title ("SMK-01 [P0] intro and login screen" -> "SMK-01"). */
export const testIdOf = (title) => (String(title).match(/^([A-Z]+-\d+)/) || [])[1] || '';

/**
 * Old runs kept the last Android log lines of a FAILED test as text ("10:01:19.037 ALL 10-28 15:31:18.241 30714 30802 W
 * ReactNativeJS: …"). Strip the first two columns to get real Android log lines, then read them like new runs do.
 */
function legacyLogcat(lines, pkg) {
  const real = lines.map((l) => String(l).replace(/^\d{2}:\d{2}:\d{2}\.\d{3}\s+\S+\s+/, ''));
  // The app's process: the one writing ReactNativeJS lines (only the app's JavaScript does)
  const pid = (real.map((l) => l.match(/^\s*\S+\s+\S+\s+(\d+)\s+\d+\s+[VDIWEF]\s+ReactNativeJS\s*:/)).find(Boolean) || [])[1] || null;
  const r = classifyLogcat(real, pkg, pid);
  return { errors: r.errors.slice(-40), warnings: r.warnings.slice(-40), errorCount: r.errors.length, warningCount: r.warnings.length, legacy: true };
}

/**
 * The recorder keeps only the last 40 error lines of a test. When it logged more, read every error line again from the
 * test's saved Android log (logcat/<test>.txt), so each one can be checked against the known issues instead of being
 * counted as "not checked". Kept only when it finds exactly the same number of error lines as the recorder did.
 */
function fullLogcat(lc, runDir, file, pkg) {
  if (!lc || !file || !(lc.errorCount > (lc.errors || []).length)) return lc;
  let lines;
  try { lines = readFileSync(path.join(runDir, file), 'utf8').split(/\r?\n/); } catch { return lc; }
  const pid = lc.pid || (lines.map((l) => l.match(/^\s*\S+\s+\S+\s+(\d+)\s+\d+\s+[VDIWEF]\s+ReactNativeJS\s*:/)).find(Boolean) || [])[1] || null;
  const r = classifyLogcat(lines, pkg, pid);
  return r.errors.length === lc.errorCount ? { ...lc, errors: r.errors } : lc;
}

/** Step warnings (layout checks, notes) as test warnings: { source, message }. */
function stepWarnings(steps = []) {
  const out = [];
  for (const s of steps) {
    for (const w of s.warnings || []) {
      out.push({ source: s.layout ? 'layout' : 'step', message: `Step ${s.n} (${s.title}): ${w}`, step: s.n });
    }
  }
  return out;
}

/** Layout checks of all verifyLayout() steps of a test, added up. */
function layoutTotals(steps = []) {
  const t = { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0, screens: [] };
  for (const s of steps) {
    const L = s.layout?.summary;
    if (!L) continue;
    for (const k of ['total', 'passed', 'failed', 'warnings', 'skipped']) t[k] += L[k] || 0;
    t.screens.push(s.layout.spec);
  }
  return t.total ? t : null;
}

/**
 * One eGenome entry (test, or a hook that failed) -> one test record.
 * `x` is what the dashboard hooks add since 13 Nov 2026: warnings, app log, performance, API calls, video.
 */
function toTest(e, cid, seq, runId, pkg, runDir, clockOffset = null) {
  const x = e.extra || {};
  const strip = (p) => (p && p.startsWith(`runs/${runId}/`) ? p.slice(`runs/${runId}/`.length) : p || null);
  const steps = e.steps || [];
  const lastShot = [...steps].reverse().find((s) => s.screenshot)?.screenshot;
  const isHook = e.type === 'hook';
  const title = isHook ? `Setup: ${e.title}${e.suite ? ` (${e.suite})` : ''}` : e.title;
  const logcat = (x.logcat && fullLogcat(x.logcat, runDir, x.logcatFile, pkg)) || (Array.isArray(e.logcat) && e.logcat.length ? legacyLogcat(e.logcat, pkg) : { errors: [], warnings: [], errorCount: 0, warningCount: 0, notRecorded: true });
  return {
    schemaVersion: 1,
    key: `${pad(seq)}-w${cid}-${slug(title)}`,
    seq,
    id: isHook ? '' : testIdOf(e.title),
    kind: e.type,
    title,
    suite: e.suite || '',
    file: e.file || '',
    // A test that skipped itself (this.skip()) was recorded as failed without an error before 13 Nov 2026
    state: e.status === 'skipped' || (e.status === 'failed' && !e.error && e.type === 'test') ? 'skipped' : e.status === 'passed' ? 'passed' : e.status === 'running' ? 'running' : 'failed',
    durationMs: e.durationMs || 0,
    startedAt: iso(e.start),
    finishedAt: e.durationMs != null && e.start ? iso(e.start + e.durationMs) : undefined,
    error: e.error ? { message: e.error.message || '', stack: e.error.stack || '' } : null,
    warnings: [...(x.warnings || []), ...stepWarnings(steps)],
    notes: x.notes || [],
    // "Steps to reproduce" for the shared views; the full eGenome steps are in stepsDetail
    steps: steps.map((s) => ({ atMs: s.start || 0, text: s.call || s.title, status: s.status })),
    stepsDetail: steps,
    failureScreenshot: e.failureScreenshot || null,
    screenshot: strip(e.failureScreenshot || lastShot),
    video: x.video || null,
    logcatFile: x.logcatFile || null,
    logcat,
    perf: x.perf || null,
    api: x.api || null,
    retries: e.retries || 0,
    layout: layoutTotals(steps),
    startMs: e.start || null,
    clockOffsetMs: clockOffset,
  };
}

function sessionFailure(seq, cid, message, at) {
  return {
    schemaVersion: 1, key: `${pad(seq)}-w${cid}-SESSION`, seq, id: 'SESSION', kind: 'session', title: 'Test session could not start',
    suite: `worker ${cid}`, file: '', state: 'failed', durationMs: 0, startedAt: iso(at), finishedAt: iso(at),
    error: { message, stack: '' }, warnings: [], notes: [], steps: [], stepsDetail: [], screenshot: null,
    logcat: { errors: [], warnings: [], errorCount: 0, warningCount: 0, notRecorded: true }, perf: null, api: null, layout: null,
  };
}

/** Device as the analysis names it, from the worker's device record (+ adb details when recorded). */
function toDevice(d = {}) {
  if (!d || !Object.keys(d).length) return null;
  return {
    platformVersion: d.platformVersion != null ? String(d.platformVersion) : undefined,
    apiLevel: d.apiLevel,
    deviceName: d.name,
    deviceModel: d.model,
    deviceManufacturer: d.manufacturer,
    udid: d.udid,
    screen: d.screen,
    ...(d.details || {}),
  };
}

/** The screen a step works on: its layout spec, else the page before " · " in its title ("Login · Request OTP" -> "Login"). */
export const screenOfStep = (s) => s.layout?.spec || String(s.title || '').split(' · ')[0] || null;

/**
 * Puts each API call of a test in the step that was running when the app started it (c.step = { n, title, screen,
 * when }), using the device clock offset read at the start of the session. `when` is "during" a step, "after" a step
 * (in the gap before the next one), or "before" the first step (e.g. the app starting). Without the offset (runs
 * recorded before 13 Nov 2026) the calls stay unplaced and say why.
 */
export function placeCalls(t) {
  const steps = t.stepsDetail || [];
  if (!t.api?.length || !steps.length) return;
  if (t.clockOffsetMs == null || !t.startMs) {
    for (const c of t.api) c.stepNote = 'Not matched to a step: this run did not record the device clock (recorded before 13 Nov 2026, or adb could not read it).';
    return;
  }
  const spans = steps.map((s) => ({ s, from: t.startMs + (s.start || 0), to: t.startMs + (s.start || 0) + (s.durationMs || 0) }));
  for (const c of t.api) {
    const lt = logTime(c.at);
    if (lt == null) continue;
    const at = lt - t.clockOffsetMs;
    let hit = spans.find((x) => at >= x.from && at <= x.to);
    let when = 'during';
    if (!hit) {
      hit = [...spans].reverse().find((x) => x.from <= at);
      when = hit ? 'after' : 'before';
      hit = hit || spans[0];
    }
    c.step = { n: hit.s.n, title: hit.s.title, screen: screenOfStep(hit.s), when };
  }
}

/** One run in the analysis' shape, or null when the folder has no meta.json. */
export function loadEgRun(runsDir, id, { pkg = APP_PACKAGE } = {}) {
  const dir = path.join(runsDir, id);
  const meta = readJson(path.join(dir, 'meta.json'));
  if (!meta) return null;
  const wdir = path.join(dir, 'workers');
  const workers = existsSync(wdir)
    ? readdirSync(wdir).filter((f) => f.endsWith('.json')).map((f) => readJson(path.join(wdir, f))).filter(Boolean)
      .sort((a, b) => String(a.cid).localeCompare(String(b.cid), undefined, { numeric: true }))
    : [];
  const tests = [];
  let seq = 0;
  for (const w of workers) {
    for (const e of w.entries || []) {
      if (e.type === 'hook' && e.status !== 'failed') continue; // passed setup hooks: their steps are in the raw file
      tests.push(toTest(e, w.cid, ++seq, id, pkg, dir, w.device?.clockOffsetMs ?? null));
    }
  }
  // Workers that ended before any test ran: one "session could not start" result each, with the reason
  for (const f of meta.workerFailures || []) {
    tests.push(sessionFailure(++seq, f.cid, `The test session could not start (worker ${f.cid}, exit code ${f.exitCode}). ${f.reason}`, f.at));
  }
  if (!tests.length && meta.finishedAt && meta.exitCode) {
    tests.push(sessionFailure(++seq, '0-0', `The test session could not start (exit code ${meta.exitCode}): no test ran. The reason was not captured: this run happened before the dashboard checked the device when a session fails (13 Nov 2026), and the terminal output was not saved.`, meta.finishedAt));
  }
  const run = {
    schemaVersion: 1,
    runId: id,
    suites: suitesOf(meta),
    startedAt: iso(meta.startedAt),
    endedAt: iso(meta.finishedAt),
    exitCode: meta.exitCode,
    setupError: meta.setupError || null,
    env: meta.environment || 'staging',
    apk: { application_id: pkg, ...(meta.app || {}) },
    details: meta.details || legacyDetails(meta),
    recordedWith: meta.recorder || 0,
    updatedAt: Math.max(meta.startedAt || 0, ...workers.map((w) => w.updatedAt || 0)),
  };
  const device = workers.map((w) => toDevice(w.device)).find(Boolean) || null;
  return { run, devices: device ? [device] : [], tests, net: meta.api || null, meta };
}
