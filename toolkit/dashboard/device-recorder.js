// Worker side, around every test: the app's Android log (errors, crashes, stuck screen, launch times), the app's API
// calls (when it logs them), memory and frame stats, a screen recording of failed tests, and warnings from all of
// it. Called by hooks.js; the result goes into the test's entry in workers/<cid>.json as `extra` (see recorder.end).
// Everything is defensive: a problem here is noted on the test, never fails it.
import fs from 'node:fs';
import path from 'node:path';
import { options, PROJECT_ROOT } from './options.js';
import { NetworkLog } from './lib/network.js';
import { classifyLogcat, deviceWarnings, launchTimesIn } from './lib/logcat.js';
import { loadBudgets, testLimitMs } from './lib/budgets.js';
import * as adb from './lib/device.js';
import { APP_PACKAGE, testIdOf } from './egenome-run.js';

const MAX_LOG_ITEMS = 40;      // error / warning lines kept in the test entry (all of them are in the log file)
const MAX_LOGCAT_LINES = 20000; // per test, in logcat/<test>.txt
const BODY_PREVIEW = 6000;      // characters of each response kept in the entry (the whole body is in network/)

const state = {
  runDir: null,
  cid: '0-0',
  pkg: APP_PACKAGE,
  udid: null,
  pid: null,
  network: null,
  pendingLines: [], // log lines between tests (e.g. the app starting before the first test): go to the next test
  pendingCalls: [],
  logcatOk: null,
  video: false,
  started: 0,
  seq: 0,
  budgets: null,
  lastEntry: null, // { file, index } of the last test written, for calls that finish after it
};

const slug = (s) => String(s).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 80);

export function initDevice({ runDir, cid, udid, pkg = APP_PACKAGE }) {
  Object.assign(state, { runDir, cid: cid || '0-0', udid: udid || null, pkg, network: new NetworkLog({ pkg }), pendingLines: [], pendingCalls: [], seq: 0 });
}

/** New Android log lines since the last read ([] when the driver does not offer logcat, or DASHBOARD_LOGCAT=false). */
async function readLogcat() {
  if (state.logcatOk === null) state.logcatOk = options.logcat;
  if (!state.logcatOk || typeof driver === 'undefined') return [];
  try {
    return ((await driver.getLogs('logcat')) || []).map((l) => (typeof l === 'string' ? l : l.message)).filter(Boolean);
  } catch {
    state.logcatOk = false; // not supported by this driver/session
    return [];
  }
}

/** Read what the app logged so far into the buffers the next test gets (API calls are parsed as they come). */
async function absorb() {
  const lines = await readLogcat();
  state.pendingLines.push(...lines);
  state.pendingCalls.push(...state.network.parse(lines));
}

/** Process id of the app: from Android's "Start proc" line if seen, else from adb. */
async function refreshPid(lines) {
  const re = new RegExp(`Start proc (\\d+):${state.pkg.replace(/\./g, '\\.')}[/:]`);
  for (const l of lines) { const m = l.match(re); if (m) state.pid = m[1]; }
  if (!state.pid && options.perf) state.pid = await adb.pidOf(state.udid, state.pkg);
}

export async function beforeTest() {
  await absorb();
  state.started = Date.now();
  if (options.perf) await adb.resetFrames(state.udid, state.pkg); // frame stats for this test only
  state.video = false;
  if (options.video !== 'off' && typeof driver !== 'undefined') {
    try { await driver.startRecordingScreen({ timeLimit: '180', bitRate: '1500000', forceRestart: true }); state.video = true; } catch {}
  }
}

/** The test (or its setup) is about to close or clear the app: calls still waiting were cut off on purpose. */
export async function appClosing(how) {
  try { await absorb(); } catch {}
  state.network.expectStop(`The test ${how} on purpose while this call was still waiting for its response.`);
}

/** Keep each API call in the entry (body preview) and its whole response in network/<test>-<n>.<ext>. */
function saveCalls(calls, name) {
  if (!calls.length) return [];
  const dir = path.join(state.runDir, 'network');
  fs.mkdirSync(dir, { recursive: true });
  return calls.map((c, i) => {
    let bodyFile = null;
    if (c.body) {
      const ext = /json/.test(c.contentType) || /^[{[]/.test(c.body.trim()) ? 'json' : /html/.test(c.contentType) ? 'html.txt' : 'txt';
      bodyFile = `network/${name}-${String(i + 1).padStart(3, '0')}.${ext}`;
      fs.writeFileSync(path.join(state.runDir, bodyFile), c.body);
    }
    const { body, ...rest } = c;
    if (!body && c.status != null && !c.bodyNote) {
      rest.bodyMissing = Object.keys(c.resHeaders || {}).length
        ? (c.bytes === 0 ? `The server sent an empty body (0 bytes) with status ${c.status}.` : `The app logged headers but no body for this response (${c.bytes != null ? c.bytes + ' bytes' : 'size unknown'}): it may read it straight into a file or image without passing it through the logger.`)
        : 'Response body not recorded: the app logged this call at OkHttp level BASIC (status line only). Level BODY in the app\'s HttpLoggingInterceptor adds headers and bodies.';
    }
    let preview = body;
    try { if (body && /^[{[]/.test(body.trim())) preview = JSON.stringify(JSON.parse(body), null, 2); } catch {}
    return { ...rest, bodyPreview: preview ? preview.slice(0, BODY_PREVIEW) : null, bodyLength: body ? body.length : 0, bodyFile };
  });
}

/**
 * After a test: everything the device says about it. Returns { extra, tail } - `extra` goes into the entry,
 * `tail` (failed tests only) keeps eGenome's old "Device log" lines for the deliverables.
 */
export async function afterTest(test, { passed, duration }) {
  const extra = { warnings: [], notes: [] };
  if (!state.runDir) return { extra };
  state.seq += 1;
  const name = `${state.cid}-${String(state.seq).padStart(3, '0')}-${slug(test.title)}`;

  // Screen recording: kept for failures (or every test with DASHBOARD_VIDEO=all)
  if (state.video) {
    try {
      const b64 = await driver.stopRecordingScreen();
      if (b64 && (options.video === 'all' || !passed)) {
        fs.mkdirSync(path.join(state.runDir, 'videos'), { recursive: true });
        fs.writeFileSync(path.join(state.runDir, 'videos', `${name}.mp4`), Buffer.from(b64, 'base64'));
        extra.video = `videos/${name}.mp4`;
      }
    } catch (e) {
      extra.notes.push(`No video: ${String(e.message || e).split('\n')[0]}`);
    }
  }

  // The app's Android log during this test (and just before it, e.g. the app starting)
  const fresh = await readLogcat();
  const lines = [...state.pendingLines, ...fresh];
  state.pendingLines = [];
  await refreshPid(lines);
  const calls = [...state.pendingCalls, ...state.network.parse(fresh)];
  state.pendingCalls = [];
  extra.api = saveCalls(calls, name);
  if (lines.length) {
    fs.mkdirSync(path.join(state.runDir, 'logcat'), { recursive: true });
    fs.writeFileSync(path.join(state.runDir, 'logcat', `${name}.txt`), lines.slice(-MAX_LOGCAT_LINES).join('\n'));
    extra.logcatFile = `logcat/${name}.txt`;
  }
  const log = classifyLogcat(lines, state.pkg, state.pid);
  extra.logcat = { pid: state.pid || null, errors: log.errors.slice(-MAX_LOG_ITEMS), errorCount: log.errors.length, warnings: log.warnings.slice(-MAX_LOG_ITEMS), warningCount: log.warnings.length };
  extra.warnings.push(...deviceWarnings(log));
  if (log.errors.some((e) => e.includes('AndroidRuntime'))) {
    extra.warnings.unshift({ source: 'app', message: 'The app CRASHED during this test (AndroidRuntime FATAL). See the app log below.' });
  } else if (log.errors.length) {
    extra.warnings.push({ source: 'app', message: `The app logged ${log.errors.length} error line(s) during this test.` });
  }

  // Performance: launch times from Android's "Displayed" lines, memory and frames through adb
  extra.perf = { launches: launchTimesIn(lines, state.pkg) };
  if (options.perf) {
    extra.perf.memoryPssKb = await adb.memoryPssKb(state.udid, state.pkg);
    const frames = await adb.frameStats(state.udid, state.pkg);
    if (frames && frames.total != null) extra.perf.frames = frames;
  }

  // Slow test: limit per test ID in test/budgets.json (or DASHBOARD_SLOW_MS)
  state.budgets = state.budgets || loadBudgets(process.env.DASHBOARD_BUDGETS_FILE ? path.resolve(process.env.DASHBOARD_BUDGETS_FILE) : path.join(PROJECT_ROOT, 'test', 'budgets.json'));
  const limit = testLimitMs(state.budgets, testIdOf(test.title));
  if (duration > limit) extra.warnings.push({ source: 'timing', message: `Slow test: ${(duration / 1000).toFixed(1)} s (limit ${limit / 1000} s, test/budgets.json).` });

  // eGenome's old "Device log" lines on failed tests (also read by the deliverables)
  const own = state.pkg ? state.pkg.split('.').filter((p) => p.length > 3 && !['android', 'google'].includes(p)).pop() : 'egenome';
  const relevant = lines.filter((l) => /ReactNativeJS|AndroidRuntime|FATAL|Exception/i.test(l) || (own && l.toLowerCase().includes(own.toLowerCase())));
  const tail = passed ? [] : (relevant.length ? relevant.slice(-80) : lines.slice(-50));
  return { extra, tail };
}

/** Remember which entry was written last, so calls that finish after the last test can be added to it. */
export function rememberLast(file, index) { state.lastEntry = { file, index }; }

/**
 * End of the session: calls that finished after the last test, and calls that never got a response, are added
 * to the last test with the reason.
 */
export async function finishSession() {
  if (!state.lastEntry || !fs.existsSync(state.lastEntry.file)) return;
  try { await absorb(); } catch {}
  const leftover = [...state.pendingCalls, ...state.network.abandonOpen(
    `No response was logged before the test session ended at ${new Date().toLocaleTimeString()} (computer time). The Android log shows no network error, crash or app stop for this call, so it was still waiting when the session closed.`,
    { level: 'warn' })];
  state.pendingCalls = [];
  if (!leftover.length) return;
  try {
    const w = JSON.parse(fs.readFileSync(state.lastEntry.file, 'utf8'));
    const e = w.entries.find((x) => x.index === state.lastEntry.index);
    if (!e) return;
    const extra = saveCalls(leftover, `${state.cid}-after-session`).map((c) => ({ ...c, afterTestEnded: true }));
    e.extra = e.extra || {};
    e.extra.api = [...(e.extra.api || []), ...extra];
    e.extra.notes = [...(e.extra.notes || []), `${extra.length} API call(s) finished or were cut off after this test ended (marked "after the test").`];
    fs.writeFileSync(state.lastEntry.file, JSON.stringify(w));
  } catch {}
}
