// Test results recorder: everything the dashboard shows comes from here.
//
// Launcher side (wdio.conf.js onPrepare / onComplete):  startRun(), finishRun()
// Worker side (wdio.conf.js hooks):                     recordDevice(), beforeEachTest(), afterEachTest()
// Page objects / tests:                                 note('...'), warn('...')
//
// Files written per run:   reports/runs/<runId>/
//   (format: docs/RESULTS-FORMAT.md, version in schema.js)
//   run.json               app version (build receipt), suite, start/end, exit code, run details
//   device-<cid>.json      device the tests ran on
//   tests/<n>.json         one per test: status, duration, error, warnings, notes, screenshot, logcat
//   screenshots/<n>.png    screenshot at the end of each test (all tests, or failures only)
//   logcat/<n>.txt         the app's Android log during that test
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeBuildDashboard } from './dashboard.mjs';
import { NetworkLog, enableHttpBodyLogging, openApp } from './network.js';
import { SCHEMA_VERSION } from './schema.js';
import { classifyLogcat as classifyLines, deviceWarnings, launchTimesIn } from './logcat.js';
import { loadBudgets, testLimitMs } from './budgets.js';
import { runDetails, deviceDetails } from './run-details.js';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
// DASHBOARD_REPORTS_DIR is only for the dashboard's own tests (fixtures in a temporary folder)
export const REPORTS_DIR = process.env.DASHBOARD_REPORTS_DIR ? path.resolve(process.env.DASHBOARD_REPORTS_DIR) : path.join(PROJECT_ROOT, 'reports');

// Test duration limits: test/budgets.json (per test ID, or its default), DASHBOARD_SLOW_MS overrides the default
const BUDGETS_FILE = process.env.DASHBOARD_BUDGETS_FILE ? path.resolve(process.env.DASHBOARD_BUDGETS_FILE) : path.join(PROJECT_ROOT, 'test', 'budgets.json');
let budgets = null;
const slowLimitMs = (id) => testLimitMs((budgets = budgets || loadBudgets(BUDGETS_FILE)), id);
const SCREENSHOTS = process.env.DASHBOARD_SCREENSHOTS || 'all'; // all | failed
const MAX_LOG_ITEMS = 40;
const VIDEO = process.env.DASHBOARD_VIDEO || 'failed'; // failed | all | off
const PERF = (process.env.DASHBOARD_PERF || 'on') !== 'off'; // memory, frames, launch time
const API_BODIES = (process.env.DASHBOARD_API_BODIES || 'on') !== 'off'; // log full API responses
const MAX_LOGCAT_LINES = 20000; // per test
const BODY_PREVIEW = 6000; // characters of each response kept in the test record (the full body is in a file)

const runDir = () => process.env.RUN_DIR;
const appId = () => process.env.APP_ID || '';
export const apkInfo = () => {
  try { return JSON.parse(process.env.APK_INFO || '{}'); } catch { return {}; }
};

/** Short version label used everywhere: "v50616-dev-2026-11-11 · build 20261111-164210-57644dbeea". */
export function versionLabel(info = apkInfo()) {
  return `v${info.version_name || '?'} · build ${info.build_id || (info.commit || '?').slice(0, 10)}`;
}

// ------------------------------------------------------------------ launcher side
export function startRun({ suites = [], apk = {}, setupError = null, now = new Date() } = {}) {
  const pad = (n) => String(n).padStart(2, '0');
  const runId = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const dir = path.join(REPORTS_DIR, 'runs', runId);
  for (const sub of ['tests', 'screenshots', 'logcat']) mkdirSync(path.join(dir, sub), { recursive: true });
  process.env.RUN_ID = runId;
  process.env.RUN_DIR = dir;
  process.env.APK_INFO = JSON.stringify(apk.info || {});
  writeFileSync(path.join(dir, 'run.json'), JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    runId,
    suites,
    startedAt: now.toISOString(),
    apk: { path: apk.path, ...(apk.info || {}) },
    env: process.env.TEST_ENV || (process.env.CI ? 'ci' : 'local'),
    details: runDetails(PROJECT_ROOT),
    ...(setupError ? { setupError, endedAt: now.toISOString(), exitCode: 1 } : {}),
  }, null, 2));
  return { runId, dir };
}

export function finishRun(exitCode, endedAt = new Date()) {
  const file = path.join(runDir(), 'run.json');
  const run = JSON.parse(readFileSync(file, 'utf8'));
  run.endedAt = endedAt.toISOString();
  run.exitCode = exitCode;
  writeFileSync(file, JSON.stringify(run, null, 2));
  // Keep this run's WebdriverIO / Appium logs with the run (reports/logs is reused by the next run)
  try {
    if (existsSync(LOGS_DIR)) {
      mkdirSync(path.join(runDir(), 'logs'), { recursive: true });
      for (const f of readdirSync(LOGS_DIR)) if (/\.log$/.test(f)) writeFileSync(path.join(runDir(), 'logs', f), readFileSync(path.join(LOGS_DIR, f)));
    }
  } catch {}
  return run;
}

export const LOGS_DIR = path.join(REPORTS_DIR, 'logs'); // WebdriverIO and Appium write their own logs here (wdio.conf.js)

/**
 * Why a test session could not start, read from WebdriverIO's and Appium's own logs, with what it usually means.
 * Returns { message, evidence[] }.
 */
export function sessionFailureReason(cid, logsDir = LOGS_DIR) {
  const read = (f) => { try { return readFileSync(path.join(logsDir, f), 'utf8').split(/\r?\n/); } catch { return []; } };
  const wdio = read(`wdio-${cid}.log`);
  const appium = read('wdio-appium.log').concat(read('appium.log'));
  const clean = (l) => l.replace(/\x1b\[[0-9;]*m/g, '').replace(/^\S+\s+/, '').trim();
  const errors = [...wdio.filter((l) => /\bERROR\b/.test(l)), ...appium.filter((l) => /Error|error:|Original error|<-- POST \/session.* 5\d\d/.test(l))].map(clean).filter(Boolean);
  const evidence = [...new Set(errors)].slice(-8);
  const text = evidence.join('\n');
  const rules = [
    [/Could not find a connected Android device|no devices|device .* not found|adb: device offline/i, 'No emulator or phone was connected (adb sees no device). Start the emulator and check `adb devices`.'],
    [/ECONNREFUSED.*4723|connect ECONNREFUSED|Unable to connect to "http:\/\/(localhost|127\.0\.0\.1):4723/i, 'WebdriverIO could not reach Appium on port 4723: Appium did not start or stopped. See reports/logs/wdio-appium.log.'],
    [/INSTALL_FAILED_[A-Z_]+/i, `Android refused to install the APK (${(text.match(/INSTALL_FAILED_[A-Z_]+/) || [''])[0]}). For UPDATE_INCOMPATIBLE run: adb uninstall org.wikipedia.dev`],
    [/Could not find a driver for automationName|driver .*uiautomator2.* not installed/i, 'The UiAutomator2 driver is not installed for this Appium. Run: npm run appium:setup'],
    [/insecure feature|allow-insecure/i, 'Appium refused an insecure feature setting. Check allowInsecure in wdio.conf.js.'],
    [/ANDROID_HOME|ANDROID_SDK_ROOT|Neither ANDROID_HOME/i, 'Appium could not find the Android SDK: set ANDROID_HOME.'],
    [/JAVA_HOME|java.*not found/i, 'Appium could not find Java: set JAVA_HOME.'],
    [/instrumentation process is not running|UiAutomator2 server.*(crashed|not running)|cannot be proxied to UiAutomator2/i, 'The UiAutomator2 helper app on the emulator stopped. Restart the emulator; if it repeats, uninstall io.appium.uiautomator2.server(.test).'],
    [/timed out|timeout/i, 'Starting the session took too long (install or app launch timed out). The emulator may be slow or still booting.'],
  ];
  const hit = rules.find(([re]) => re.test(text));
  const first = evidence.find((l) => /Original error|ERROR/.test(l)) || evidence[0];
  let message;
  if (hit) message = `${hit[1]}${first ? ` First error: ${first.slice(0, 300)}` : ''}`;
  else if (first) message = `The session failed with: ${first.slice(0, 400)}`;
  else message = `Worker ${cid} stopped before any test ran, and neither reports/logs/wdio-${cid}.log nor the Appium log contains an error line. Check the terminal output of this run.`;
  return { message, evidence };
}

/** Record a worker that died without running tests (e.g. Appium could not start the app). */
export function recordWorkerFailure(cid, exitCode) {
  const dir = runDir();
  if (!dir) return;
  const testsDir = path.join(dir, 'tests');
  const hasTests = existsSync(testsDir) && readdirSync(testsDir).some((f) => f.includes(`-w${cid}-`));
  if (exitCode !== 0 && !hasTests) {
    writeFileSync(path.join(testsDir, `${Date.now()}-w${cid}-session.json`), JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      id: 'SESSION', finishedAt: new Date().toISOString(), title: 'Test session could not start', suite: `worker ${cid}`,
      state: 'failed', durationMs: 0,
      error: (() => { const why = sessionFailureReason(cid); return { message: `The test session could not start (worker ${cid}, exit code ${exitCode}). ${why.message}`, stack: why.evidence.join('\n') }; })(),
      warnings: [], notes: [], logcat: { errors: [], warnings: [] },
    }, null, 2));
  }
}

// ------------------------------------------------------------------ worker side
let current = { warnings: [], notes: [], steps: [], startedAt: Date.now() };
let pendingLaunches = []; // app launch times seen between tests (e.g. the launch before the first test)
let shellBlocked = false;
const network = new NetworkLog({ pkg: process.env.APP_ID || 'org.wikipedia.dev' });
let setupWarning = null; // a test-setup problem to show on the first test (e.g. the app could not be opened)
let apiLogging = { level: 'BASIC', reason: 'Full API logging was not set up for this session (prepareApp did not run).' };
let lastTestFile = null; // the newest tests/*.json, to attach calls that finish after the last test
let pendingCalls = []; // API calls seen between tests (e.g. while the app starts before the first test)
let pendingLines = [];  // and their log lines
let appPid = null;
let seq = 0;

/** Something unexpected but not failing, e.g. a slow step. Shown in amber. */
export function warn(message, details) {
  current.warnings.push({ source: 'test', message, details });
}

/** One user-visible action (tap, type, back...). Becomes "steps to reproduce" on the dashboard. */
export function step(text) {
  current.steps.push({ atMs: Date.now() - current.startedAt, text });
}

/** Something worth knowing, e.g. a pop-up that was closed. Shown in grey. */
export function note(message) {
  current.notes.push(message);
}

/** Read the Android log gathered so far into the pending buffers (API calls, launch times, raw lines). */
async function absorbLogs() {
  const lines = await readLogcat();
  findAppPid(lines);
  pendingLaunches.push(...launchTimes(lines));
  pendingCalls.push(...network.parse(lines));
  pendingLines.push(...lines);
}

/**
 * Once per session, before the first test: switch on full API logging while the app is still closed, then open
 * the app (wdio.conf.js sets appium:autoLaunch false). Notes the logging level (and why, if not BODY) on the run.
 * If the app cannot be opened, the terminal says so and the first test carries the reason as a setup warning.
 */
export async function prepareApp(cid) {
  let result = { level: 'BASIC', reason: 'Switched off with DASHBOARD_API_BODIES=off: API calls are recorded with address, status code, time and size, without response headers and bodies.' };
  if (API_BODIES) result = await enableHttpBodyLogging(appId());
  result.open = await openApp(appId());
  if (!result.open.ok) {
    setupWarning = `The test setup could not open the app: ${result.open.error}. Tests that expect the app on screen fail until it is opened.`;
    console.error(`[wikiApp] ${setupWarning}`);
  } else {
    console.log(`[wikiApp] App opened (${result.open.how}).`);
  }
  apiLogging = result;
  if (runDir()) writeFileSync(path.join(runDir(), `network-${cid}.json`), JSON.stringify({ schemaVersion: SCHEMA_VERSION, ...result, at: new Date().toISOString() }, null, 2));
  console.log(`[wikiApp] API responses: ${result.level}${result.reason ? ' - ' + result.reason : ''}`);
}

/** wdio.conf.js beforeCommand: the test is about to close the app (terminateApp). */
export async function appClosingByTest() {
  try { await absorbLogs(); } catch {}
  const lastStep = current.steps[current.steps.length - 1];
  network.expectStop(`The test closed the app on purpose (step "${lastStep ? lastStep.text : 'Close the app'}") while this call was still waiting for its response.`);
}

/**
 * wdio.conf.js after hook (end of the session): calls that finished after the last test, and calls that never
 * got a response, are added to the last test with the reason.
 */
export async function finishSession() {
  if (!lastTestFile || !existsSync(lastTestFile)) return;
  try { await absorbLogs(); } catch {}
  const lastStep = current.steps[current.steps.length - 1];
  const leftover = [...pendingCalls, ...network.abandonOpen(
    `No response was logged before the test session ended at ${new Date().toLocaleTimeString()} (computer time). Last test: ${current.title || 'unknown'}${lastStep ? `; last step: ${lastStep.text}` : ''}. The Android log shows no network error, crash or app stop for this call, so it was still waiting when the session closed.`,
    { level: 'warn' })];
  pendingCalls = [];
  if (!leftover.length) return;
  const rec = JSON.parse(readFileSync(lastTestFile, 'utf8'));
  const name = path.basename(lastTestFile, '.json');
  const dir = path.dirname(path.dirname(lastTestFile));
  const extra = saveCalls(leftover, dir, `${name}-after`).map((c) => ({ ...c, afterTestEnded: true }));
  rec.api = [...(rec.api || []), ...extra];
  rec.notes = [...(rec.notes || []), `${extra.length} API call(s) finished or were cut off after this test ended (marked "after the test").`];
  writeFileSync(lastTestFile, JSON.stringify(rec, null, 2));
  safeBuildDashboard();
}

export async function recordDevice(cid) {
  const c = driver.capabilities || {};
  const device = {
    cid,
    platformVersion: c.platformVersion || c['appium:platformVersion'],
    deviceName: c.deviceName || c['appium:deviceName'],
    deviceModel: c.deviceModel || c['appium:deviceModel'],
    deviceManufacturer: c.deviceManufacturer || c['appium:deviceManufacturer'],
    udid: c.udid || c['appium:udid'],
    screen: c.deviceScreenSize || c['appium:deviceScreenSize'],
    apiLevel: c.deviceApiLevel || c['appium:deviceApiLevel'],
  };
  Object.assign(device, await deviceDetails()); // emulator?, Android build, WebView (needs adb shell)
  if (runDir()) writeFileSync(path.join(runDir(), `device-${cid}.json`), JSON.stringify({ schemaVersion: SCHEMA_VERSION, ...device }, null, 2));
}

// logcat "threadtime" line: 11-11 10:42:01.123  1234  1250 E Tag: message

async function readLogcat() {
  try {
    return (await driver.getLogs('logcat')).map((e) => e.message);
  } catch {
    return [];
  }
}

function findAppPid(lines) {
  for (const l of lines) {
    const m = l.match(new RegExp(`Start proc (\\d+):${appId().replace(/\./g, '\\.')}[/:]`));
    if (m) appPid = m[1];
  }
}

function classifyLogcat(lines) {
  return classifyLines(lines, appId(), appPid);
}

// "Displayed org.wikipedia.dev/org.wikipedia.main.MainActivity: +1s234ms" = Android's own launch time
function launchTimes(lines) {
  return launchTimesIn(lines, appId());
}

async function shell(command, args) {
  if (shellBlocked) return null;
  try {
    return await driver.execute('mobile: shell', { command, args });
  } catch (e) {
    shellBlocked = true; // adb_shell not allowed by Appium: skip frame stats for the rest of the run
    return null;
  }
}

async function collectPerf(launches) {
  const perf = { launches };
  try {
    const data = await driver.getPerformanceData(appId(), 'memoryinfo', 5);
    const i = data?.[0]?.indexOf('totalPss');
    if (i > -1 && data[1]) perf.memoryPssKb = Number(data[1][i]) || null;
  } catch {}
  const gfx = await shell('dumpsys', ['gfxinfo', appId()]);
  if (gfx) {
    const n = (re) => { const m = String(gfx).match(re); return m ? Number(m[1]) : null; };
    const total = n(/Total frames rendered:\s*(\d+)/);
    const janky = n(/Janky frames:\s*(\d+)/);
    perf.frames = { total, janky, jankyPct: total ? Math.round((janky / total) * 1000) / 10 : null, p90Ms: n(/90th percentile:\s*(\d+)ms/) };
  }
  return perf;
}

export async function beforeEachTest(test) {
  current = { warnings: [], notes: [], steps: [], startedAt: Date.now(), title: test.title };
  if (setupWarning) { current.warnings.push({ source: 'setup', message: setupWarning }); setupWarning = null; }
  const lines = await readLogcat(); // flush: only this test's log is kept afterwards
  findAppPid(lines);
  pendingLaunches.push(...launchTimes(lines));
  pendingCalls.push(...network.parse(lines));
  pendingLines.push(...lines);
  if (VIDEO !== 'off') {
    try { await driver.startRecordingScreen({ timeLimit: '180', bitRate: '1500000', forceRestart: true }); current.video = true; } catch { current.video = false; }
  }
  if (PERF) await shell('dumpsys', ['gfxinfo', appId(), 'reset']); // frame stats for this test only
  // Shows the app version next to every test in the terminal
  console.log(`[app ${versionLabel()}] ▶ ${test.title}`);
}

const slug = (s) => String(s).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 80);

/** Keep each API call in the test record (body preview) and its full response in network/<test>-<n>.<ext>. */
function saveCalls(calls, dir, name) {
  if (!calls.length) return [];
  mkdirSync(path.join(dir, 'network'), { recursive: true });
  return calls.map((c, i) => {
    let bodyFile = null;
    if (c.body) {
      const ext = /json/.test(c.contentType) || /^[{[]/.test(c.body.trim()) ? 'json' : /html/.test(c.contentType) ? 'html.txt' : 'txt';
      bodyFile = `network/${name}-${String(i + 1).padStart(3, '0')}.${ext}`;
      writeFileSync(path.join(dir, bodyFile), c.body);
    }
    const { body, ...rest } = c;
    // Say exactly why a response has no body to show
    if (!body && c.status != null && !c.bodyNote) {
      rest.bodyMissing = apiLogging.level !== 'BODY'
        ? `Response body not recorded: ${apiLogging.reason}`
        : c.bytes === 0 ? `The server sent an empty body (0 bytes) with status ${c.status}.`
        : `Full API logging was on, but the app logged no body for this response (${c.bytes != null ? c.bytes + ' bytes' : 'size unknown'}): the app may read it straight into a file or image without passing it through the logger.`;
    }
    let preview = body;
    try { if (body && /^[{[]/.test(body.trim())) preview = JSON.stringify(JSON.parse(body), null, 2); } catch {} // readable even when cut short
    return { ...rest, bodyPreview: preview ? preview.slice(0, BODY_PREVIEW) : null, bodyLength: body ? body.length : 0, bodyFile };
  });
}

export async function afterEachTest(test, { error, passed, duration, retries }, cid) {
  const dir = runDir();
  if (!dir) return;
  seq += 1;
  const name = `${String(seq).padStart(3, '0')}-w${cid}-${slug(test.title)}`;

  // screenshot
  let screenshot = null;
  if (SCREENSHOTS === 'all' || !passed) {
    try {
      await browser.saveScreenshot(path.join(dir, 'screenshots', `${name}.png`));
      screenshot = `screenshots/${name}.png`;
    } catch (e) {
      current.warnings.push({ source: 'report', message: `Screenshot failed: ${e.message}` });
    }
  }

  // screen recording: kept for failures (or every test with DASHBOARD_VIDEO=all)
  let video = null;
  if (current.video) {
    try {
      const b64 = await driver.stopRecordingScreen();
      if (b64 && (VIDEO === 'all' || !passed)) {
        mkdirSync(path.join(dir, 'videos'), { recursive: true });
        writeFileSync(path.join(dir, 'videos', `${name}.mp4`), Buffer.from(b64, 'base64'));
        video = `videos/${name}.mp4`;
      }
    } catch (e) {
      current.notes.push(`No video: ${e.message.split('\n')[0]}`);
    }
  }

  // the app's log during this test
  const fresh = await readLogcat();
  const lines = [...pendingLines, ...fresh]; // includes the log from just before this test (app start etc.)
  pendingLines = [];
  findAppPid(lines);
  const calls = [...pendingCalls, ...network.parse(fresh)];
  pendingCalls = [];
  const apiCalls = saveCalls(calls, dir, name);
  const launches = [...pendingLaunches, ...launchTimes(fresh)];
  pendingLaunches = [];
  const perf = PERF ? await collectPerf(launches) : { launches };
  const logcat = classifyLogcat(lines);
  let logcatFile = null;
  if (lines.length) {
    writeFileSync(path.join(dir, 'logcat', `${name}.txt`), lines.slice(-MAX_LOGCAT_LINES).join('\n'));
    logcatFile = `logcat/${name}.txt`;
  }
  current.warnings.push(...deviceWarnings(logcat));
  if (logcat.errors.some((e) => e.includes('AndroidRuntime'))) {
    current.warnings.unshift({ source: 'app', message: 'The app CRASHED during this test (AndroidRuntime FATAL). See the app log below.' });
  } else if (logcat.errors.length) {
    current.warnings.push({ source: 'app', message: `The app logged ${logcat.errors.length} error line(s) during this test.` });
  }

  const slowMs = slowLimitMs((test.title.match(/^([A-Z]+-\d+)/) || [])[1]);
  if (duration > slowMs) {
    current.warnings.push({ source: 'timing', message: `Slow test: ${(duration / 1000).toFixed(1)} s (limit ${slowMs / 1000} s, test/budgets.json).` });
  }
  if (retries?.attempts > 0) {
    current.warnings.push({ source: 'flaky', message: `Passed only after ${retries.attempts} retr${retries.attempts === 1 ? 'y' : 'ies'}: flaky.` });
  }

  const idMatch = test.title.match(/^([A-Z]+-\d+)/);
  const record = {
    schemaVersion: SCHEMA_VERSION,
    seq,
    id: idMatch ? idMatch[1] : '',
    title: test.title,
    suite: test.parent,
    file: test.file ? path.relative(PROJECT_ROOT, test.file) : '',
    state: passed ? 'passed' : 'failed',
    durationMs: duration,
    startedAt: new Date(current.startedAt).toISOString(),
    finishedAt: new Date().toISOString(),
    error: error ? { message: String(error.message || error), stack: String(error.stack || '') } : null,
    warnings: current.warnings,
    notes: current.notes,
    screenshot,
    video,
    steps: current.steps,
    api: apiCalls,
    perf,
    logcatFile,
    logcat: { errors: logcat.errors.slice(-MAX_LOG_ITEMS), errorCount: logcat.errors.length, warnings: logcat.warnings.slice(-MAX_LOG_ITEMS), warningCount: logcat.warnings.length },
  };
  writeFileSync(path.join(dir, 'tests', `${name}.json`), JSON.stringify(record, null, 2));
  lastTestFile = path.join(dir, 'tests', `${name}.json`);
  safeBuildDashboard(); // live update: an open dashboard refreshes within a few seconds
}
