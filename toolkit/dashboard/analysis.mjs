// eGenome test dashboard: the analysis and data files behind reports/index.html.
// Shared with the Wikipedia app project (wikiApp_compileToTest/test/support/report/dashboard.mjs): failure grouping,
// regressions / flaky / quarantine, categories, history, the app's Android log, API calls (from request to outcome),
// budgets and trends, response formats and code meanings. Only the loader differs: eGenome runs are read by
// egenome-run.js from meta.json + workers/<cid>.json, which keep eGenome's step-by-step recording and layout checks.
//   reports/index.html            the dashboard (copied from ./template/index.html)
//   reports/data/index.js         every run + every test's history  -> Triage, Coverage, History, …
//   reports/data/runs/<id>.js     one run in full                   -> test details, API calls, Performance
//   reports/data/latest.js        a time stamp the open page checks every 3 s (auto-refresh)
//   reports/data/codes.js         one-line meanings of codes (HTTP, exit codes, signals, …)
//   reports/runs/<id>/api-log.txt every API call of the run, from request to outcome
// (reports/runs/<id>/run.json, eGenome's own run summary used by the deliverables, is written by builder.js.)
// Data files are scripts, not JSON, so the page also works when opened straight from disk (file://).
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, renameSync, copyFileSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { NetworkLog, issuesOf, resolutionOf, shapeOf, explainFailure, endpointOf } from './lib/network.js';
import { classifyLogcat, deviceWarnings } from './lib/logcat.js';
import { CODE_BOOK, httpMeaning, codesIn } from './lib/codes.js';
import { loadBudgets, apiLimits, runMetrics, checkBudgets, checkTrends, deviceKey } from './lib/budgets.js';
import { checkCall } from './lib/formats.js';
import { launchTimesIn } from './lib/logcat.js';
import { loadEgRun, placeCalls, APP_PACKAGE } from './egenome-run.js';

export const SCHEMA_VERSION = 1;

import { PROJECT_ROOT } from './options.js';
// Where to read and write, set by configure() (builder.js passes the dashboard options; exportSnapshot another folder).
// DASHBOARD_DIR / DASHBOARD_KEEP_RUNS / DASHBOARD_TITLE as in options.js; the *_FILE variables are for the dashboard's own tests.
const cfg = {
  reportsDir: path.resolve(PROJECT_ROOT, process.env.DASHBOARD_DIR || 'reports'),
  keepRuns: Number(process.env.DASHBOARD_KEEP_RUNS || 30),
  projectName: process.env.DASHBOARD_TITLE || 'eGenome.ai App Tests',
  get runsDir() { return path.join(this.reportsDir, 'runs'); },
  get dataDir() { return path.join(this.reportsDir, 'data'); },
};
export function configure({ reportsDir, keepRuns, projectName } = {}) {
  if (reportsDir) cfg.reportsDir = path.resolve(reportsDir);
  if (keepRuns != null) cfg.keepRuns = Number(keepRuns);
  if (projectName) cfg.projectName = projectName;
  return cfg;
}
const BUDGETS_FILE = process.env.DASHBOARD_BUDGETS_FILE ? path.resolve(process.env.DASHBOARD_BUDGETS_FILE) : path.join(PROJECT_ROOT, 'test', 'budgets.json');
const FORMATS_FILE = process.env.DASHBOARD_FORMATS_FILE ? path.resolve(process.env.DASHBOARD_FORMATS_FILE) : path.join(PROJECT_ROOT, 'test', 'api-formats.json');
const TRIAGE_FILE = process.env.DASHBOARD_TRIAGE_FILE ? path.resolve(process.env.DASHBOARD_TRIAGE_FILE) : path.join(PROJECT_ROOT, 'test', 'triage.json');
const TEMPLATE_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'template', 'index.html');

const readJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return null; } };

/** Turn stack-trace lines from this project into editor links (VS Code opens file:line:col). */
function stackLinks(stack = '') {
  const out = [];
  // file:///C:/Users/... (Windows) or file:///home/... (Linux/macOS)
  const re = /file:\/\/(\/[^\s)]+?):(\d+):(\d+)/g;
  let m;
  while ((m = re.exec(stack))) {
    const abs = decodeURIComponent(m[1]).replace(/^\/([A-Za-z]:)/, '$1');
    if (abs.includes('node_modules')) continue;
    const rel = path.relative(PROJECT_ROOT, path.resolve(abs.replace(/^\/([A-Za-z]:)/, '$1')));
    if (rel.startsWith('..')) continue;
    const label = `${rel.replace(/\\/g, '/')}:${m[2]}:${m[3]}`;
    if (!out.some((l) => l.label === label)) out.push({ label, href: `vscode://file/${abs.replace(/^\//, '')}:${m[2]}:${m[3]}` });
  }
  return out;
}

export function collectRuns() {
  if (!existsSync(cfg.runsDir)) return [];
  const triage = loadTriage();
  const budgets = loadBudgets(BUDGETS_FILE);
  const formatRules = (readJson(FORMATS_FILE) || {}).rules || [];
  const runs = readdirSync(cfg.runsDir)
    .filter((d) => existsSync(path.join(cfg.runsDir, d, 'meta.json')))
    .sort()
    .reverse()
    .slice(0, cfg.keepRuns)
    .map((id, index) => {
      const loaded = loadEgRun(cfg.runsDir, id);
      const { run, devices, tests } = loaded;
      const pkg = run.apk?.application_id || APP_PACKAGE;
      const apiLevel = apiLevelOf(loaded.net, run, tests);
      const allLogs = tests.map((x) => (x.logcatFile ? `runs/${id}/${x.logcatFile}` : null)).filter(Boolean);
      for (const t of tests) {
        const base = `runs/${id}/`;
        if (t.screenshot) t.screenshot = base + t.screenshot;
        if (t.logcatFile) t.logcatFile = base + t.logcatFile;
        if (t.video) t.video = base + t.video;
        // A test whose app log was saved but whose calls were not read (e.g. recorded with an older recorder)
        if (!t.api && t.logcatFile && existsSync(path.join(cfg.reportsDir, t.logcatFile))) {
          try {
            t.api = new NetworkLog({ pkg }).parse(readFileSync(path.join(cfg.reportsDir, t.logcatFile), 'utf8').split(/\r?\n/))
              .map(({ body, ...c }) => ({ ...c, bodyPreview: null, bodyLength: 0, bodyFile: null, fromLog: true }));
          } catch {}
        }
        for (const c of t.api || []) if (c.bodyFile) c.bodyFile = base + c.bodyFile;
        t.api = (t.api || []).map((c) => upgradeCall(c, apiLevel, budgets));
        placeCalls(t); // which step and screen each call happened in
        checkFormats(t, formatRules, pkg, allLogs);
        upgradeLaunches(t, pkg);
        upgradeDeviceWarnings(t, pkg);
        explainAppErrors(t, triage.knownApi, triage.knownLogLines);
        // Sessions that failed before the reason was read from WebdriverIO's log: say so instead of guessing
        if (t.id === 'SESSION' && t.error && /Usually: no emulator/.test(t.error.message || '')) {
          const cid = (t.error.message.match(/Worker (\S+) ended with exit code (\d+)/) || []);
          t.error = { ...t.error, message: `The test session could not start (worker ${cid[1] || '?'}, exit code ${cid[2] || '?'}). The reason was not captured: this run happened before the dashboard read WebdriverIO's and Appium's logs (added 13 Nov 2026), and the terminal output was not saved. From now on the reason is shown here.` };
        }
        t.links = t.error ? stackLinks(t.error.stack) : [];
      }
      const count = (s) => tests.filter((t) => t.state === s).length;
      const lay = tests.reduce((o, t) => { for (const k of ['total', 'passed', 'failed', 'warnings', 'skipped']) o[k] += t.layout?.[k] || 0; return o; }, { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0 });
      const summary = {
        total: tests.length,
        passed: count('passed'),
        failed: count('failed'),
        skipped: count('skipped'),
        steps: tests.reduce((n, t) => n + (t.stepsDetail?.length || 0), 0),
        stepsFailed: tests.reduce((n, t) => n + (t.stepsDetail || []).filter((x) => x.status === 'failed').length, 0),
        layout: lay,
        warnings: tests.reduce((n, t) => n + (t.warnings?.length || 0), 0),
        appErrors: tests.reduce((n, t) => n + unexplainedErrors(t), 0),
        knownAppErrors: tests.reduce((n, t) => n + (t.logcat?.explained?.known || 0) + (t.logcat?.explained?.framework || 0), 0),
        durationMs: run?.endedAt ? Date.parse(run.endedAt) - Date.parse(run.startedAt) : null,
      };
      summary.status = summary.failed > 0 || (run?.exitCode && run.exitCode !== 0) ? 'failed' : summary.warnings > 0 ? 'warning' : 'passed';
      if (!run?.endedAt) {
        // Not finished: the newest run is still going if it wrote something in the last 30 minutes; otherwise it was
        // stopped (Ctrl+C, crash, closed terminal)
        summary.status = index === 0 && !run?.setupError && Date.now() - (run.updatedAt || 0) < 30 * 60 * 1000 ? 'running' : 'incomplete';
      }
      if (run?.setupError) summary.status = 'failed';
      summary.lastActivity = [run?.startedAt, ...tests.map((t) => t.finishedAt)].filter(Boolean).sort().pop();
      return { id, run, device: devices[0] || null, tests, summary, apiLevel: apiLevel.level, apiLevelReason: apiLevel.reason, metrics: runMetrics({ tests }) };
    });
  addBudgets(runs, budgets, triage.knownApi);
  return runs;
}

/**
 * Budgets, trends and format checks of every run (test/budgets.json, test/api-formats.json). Trends compare with
 * OLDER runs on the same device and Android version that finished without a failed test. Each item over its
 * budget, each value much slower than usual and each API with format problems becomes a run-level warning
 * (r.budget.warnings); a run that passed then shows "passed with warnings". Test durations are not counted again
 * here: they are already a warning on the test itself.
 */
function addBudgets(runs, budgets, knownApi = []) {
  const knownOf = (ep) => (knownApi.find((k) => k.match && ep.includes(k.match)) || {}).reason || null;
  // Compare like with like: same device, same Android version, same suites
  const keyOf = (r) => `${(r.run?.suites || []).join(' + ') || 'all specs'} runs on ${deviceKey(r.device)}`;
  const history = runs.map((r) => ({ metrics: r.metrics, deviceKey: keyOf(r), ok: r.summary.failed === 0 && ['passed', 'warning'].includes(r.summary.status) }));
  runs.forEach((r, i) => {
    const items = checkBudgets(r.metrics, budgets);
    const trends = checkTrends(r.metrics, keyOf(r), history.slice(i + 1).filter((h) => h.ok), budgets);
    for (const x of [...items, ...trends]) if (x.area === 'api' && knownOf(x.name)) x.known = knownOf(x.name); // shown, never a warning
    const formatByRule = new Map();
    for (const t of r.tests) for (const c of t.api || []) {
      if (!c.format) continue;
      const f = formatByRule.get(c.format.rule) || { rule: c.format.rule, endpoint: c.endpoint, ok: 0, problems: 0, notChecked: 0, examples: [], reasons: [] };
      if (c.format.status === 'ok') f.ok++;
      else if (c.format.status === 'problems') { f.problems++; for (const p of c.format.problems) if (f.examples.length < 3 && !f.examples.includes(p.text)) f.examples.push(p.text); }
      else { f.notChecked++; if (!f.reasons.includes(c.format.reason)) f.reasons.push(c.format.reason); }
      formatByRule.set(c.format.rule, f);
    }
    const formats = [...formatByRule.values()];
    const warnings = [
      ...items.filter((x) => !x.ok && x.area !== 'test' && !x.known).map((x) => ({ kind: 'budget', key: x.key, text: `${x.area === 'api' ? x.name.replace(/^\S+ /, '') : x.name}: ${x.text}` })),
      ...trends.filter((x) => x.slower && !x.known).map((x) => ({ kind: 'trend', key: x.key, text: `${x.area === 'api' ? x.name.replace(/^\S+ /, '') : x.name}: ${x.text}` })),
      ...formats.filter((f) => f.problems).map((f) => ({ kind: 'format', key: f.rule, text: `${f.rule}: ${f.problems} response${f.problems === 1 ? '' : 's'} did not match test/api-formats.json. ${f.examples.join(' ')}` })),
    ];
    r.budget = { items, trends, formats, warnings, deviceKey: keyOf(r) };
    r.summary.budgetWarnings = warnings.length;
    if (r.summary.status === 'passed' && warnings.length) r.summary.status = 'warning';
  });
}

/** Runs recorded before 13 Nov 2026 missed launch times on Android 15+ ("… for user 0: +6s311ms"): re-read them. */
function upgradeLaunches(t, pkg) {
  if (!t.perf || (t.perf.launches || []).length || !t.logcatFile) return;
  const file = path.join(cfg.reportsDir, t.logcatFile);
  if (!existsSync(file)) return;
  try { t.perf = { ...t.perf, launches: launchTimesIn(readFileSync(file, 'utf8').split(/\r?\n/), pkg) }; } catch {}
}

/**
 * Check each API response against test/api-formats.json, using the whole body (its file) when there is one.
 * For runs recorded before body cuts were noted, the test's Android log is read again to find them.
 * Problems become a 'fail' issue on the call; the result is kept in call.format.
 */
function checkFormats(t, rules, pkg, logFiles = []) {
  if (!rules.length) return;
  let reparsed = null;
  for (const c of t.api || []) {
    let text = c.bodyPreview || null;
    if (c.bodyFile && existsSync(path.join(cfg.reportsDir, c.bodyFile))) { try { text = readFileSync(path.join(cfg.reportsDir, c.bodyFile), 'utf8'); } catch {} }
    if (c.bodyCut == null && text && c.status === 200 && t.logcatFile) {
      try { JSON.parse(text); } catch {
        // Its own test's log first; a call that ended after its test is in another test's log of the same run
        if (!reparsed) {
          reparsed = [];
          for (const f of [t.logcatFile, ...logFiles.filter((x) => x && x !== t.logcatFile)]) {
            try { reparsed.push(...new NetworkLog({ pkg }).parse(readFileSync(path.join(cfg.reportsDir, f), 'utf8').split(/\r?\n/))); } catch {}
          }
        }
        const same = reparsed.find((x) => x.url === c.url && x.at === c.at);
        if (same && same.bodyCut) {
          c.bodyCut = same.bodyCut;
          c.shape = shapeOf(text, c.contentType, c.bytes, c.bodyNote, c.bodyCut);
        }
      }
    }
    const f = checkCall(c, rules, text);
    if (!f) continue;
    c.format = f;
    if (f.status === 'problems') {
      c.issues = [...(c.issues || []), { level: 'fail', reason: `Response format (${f.rule}): ${f.problems.length} problem${f.problems.length === 1 ? '' : 's'}: ${f.problems.slice(0, 3).map((p) => p.text).join(' ')}${f.problems.length > 3 ? ` … and ${f.problems.length - 3} more` : ''}` }];
    }
  }
}

/**
 * How this run's API calls were recorded, with the reason when they were not. The eGenome app is read from its own
 * Android log, where OkHttp's HttpLoggingInterceptor writes each call ("OkHttp" lines). BODY = headers and bodies were
 * logged, BASIC = status lines only, NONE = the app logged no calls at all.
 */
export function apiLevelOf(net, run, tests = []) {
  const calls = tests.flatMap((t) => t.api || []);
  if (calls.some((c) => c.bodyPreview || c.bodyFile || Object.keys(c.resHeaders || {}).length)) return { level: 'BODY', reason: null };
  if (calls.length) return { level: 'BASIC', reason: 'The app logged its calls at OkHttp level BASIC (status lines only), so headers and response bodies are not available. Level BODY in the app\'s HttpLoggingInterceptor (debug/staging builds only) adds them.' };
  if (net && net.logcat === false) return { level: 'NONE', reason: 'The app\'s Android log was not read in this run (DASHBOARD_LOGCAT=false), so API calls could not be looked for.' };
  if (!run?.recordedWith) return { level: 'NONE', reason: 'This run was recorded before the dashboard read the app\'s Android log for every test (13 Nov 2026), so API calls were not looked for.' };
  return { level: 'NONE', reason: `The app wrote no API calls to its Android log in this run (no "OkHttp" lines from ${run.apk?.application_id || APP_PACKAGE}). The eGenome app is a React Native build that does not log its network traffic, so there is nothing to read. The API views fill in by themselves once the app logs its calls: the developers add OkHttp's HttpLoggingInterceptor (level BODY, staging builds only) to React Native's OkHttp client (OkHttpClientProvider) in MainApplication.` };
}

/**
 * Bring an API call recorded by any recorder version up to the current shape: a timeline of events,
 * a one-line resolution, the response shape, and an exact reason when there is no body or no response.
 */
/**
 * Runs recorded before 13 Nov 2026 (second fix) counted ANY process's crash as the app's (e.g. WebView's sandboxed
 * helper) and did not notice a stuck emulator screen. Re-read their saved app log: move other processes' crash
 * lines out of the app's errors, and add the device warnings the recorder now writes.
 */
function upgradeDeviceWarnings(t, pkg) {
  if ((t.warnings || []).some((w) => w.source === 'device') || !t.logcatFile) return;
  const file = path.join(cfg.reportsDir, t.logcatFile);
  if (!existsSync(file)) return;
  let r;
  try { r = classifyLogcat(readFileSync(file, 'utf8').split(/\r?\n/), pkg); } catch { return; }
  const extra = deviceWarnings(r);
  if (!extra.length) return;
  if (r.otherCrashes.length && t.logcat) {
    const others = new Set(r.otherCrashes.map((c) => c.pid));
    const lines = readFileSync(file, 'utf8').split(/\r?\n/).filter((l) => / AndroidRuntime\s*:/.test(l));
    const otherText = new Set(lines.filter((l) => others.has((l.match(/^\s*\S+\s+\S+\s+(\d+)/) || [])[1])).map((l) => l.replace(/^.*?AndroidRuntime\s*:\s/, '')));
    t.logcat = { ...t.logcat, errors: (t.logcat.errors || []).filter((e) => !(/AndroidRuntime/.test(e) && otherText.has(e.replace(/^[EF] AndroidRuntime: /, '')))) };
    if (!t.logcat.errors.some((e) => e.includes('AndroidRuntime'))) t.warnings = (t.warnings || []).filter((w) => !/CRASHED/.test(w.message));
  }
  t.warnings = [...(t.warnings || []), ...extra];
}

function upgradeCall(c, apiLevel, budgets) {
  const call = { ...c };
  if (call.status != null) call.statusMeaning = httpMeaning(call.status);
  if (!Array.isArray(call.events) || !call.events.length) {
    call.events = [{ at: call.at, kind: 'start', text: `Request started: ${call.method} ${call.url}` }];
    if (call.status != null) {
      call.events.push({ at: call.endAt || call.at, kind: 'headers', text: `Response ${call.status}${call.statusText ? ' ' + call.statusText : ''} received after ${call.ms} ms` });
      call.events.push({ at: call.endAt || call.at, kind: 'done', text: `Response complete: ${call.bytes != null ? call.bytes + ' bytes' : 'size not logged'}${call.bodyPreview ? '' : ' (body content not logged)'}` });
    }
    if (call.error) {
      call.noResponse = call.noResponse || { reason: explainFailure(call.error, call.url), level: 'fail' };
      call.events.push({ at: call.endAt || call.at, kind: 'failed', text: `No response: ${call.error}. ${call.noResponse.reason}` });
    }
  }
  if (call.status == null && !call.noResponse) {
    call.noResponse = call.error
      ? { reason: explainFailure(call.error, call.url), level: 'fail' }
      : { reason: 'No response was logged for this call, and nothing in the saved Android log says why (the log may have been cut off: older runs kept only the last 3,000 lines per test).', level: 'warn' };
  }
  if (call.status != null && !call.bodyPreview && !call.bodyNote && !call.bodyMissing) {
    call.bodyMissing = apiLevel.level !== 'BODY'
      ? `Response body not recorded: ${apiLevel.reason}`
      : call.bytes === 0 ? `The server sent an empty body (0 bytes) with status ${call.status}.`
      : 'Full API logging was on, but the app logged no body for this response: it may read it straight into a file or image without passing it through the logger.';
  }
  if (!call.shape) call.shape = shapeOf(call.bodyPreview, call.contentType, call.bytes, call.bodyNote, call.bodyCut);
  call.issues = issuesOf({ ...call, body: call.bodyPreview }, budgets ? apiLimits(budgets, call.endpoint) : {});
  call.resolution = resolutionOf(call);
  return call;
}

/** Terminal summary at the end of a run: failures and warnings stand out. */
export function printSummary(runData, dashboardFile) {
  const { summary: s, tests, run } = runData;
  const red = (t) => `\x1b[31m${t}\x1b[0m`, yellow = (t) => `\x1b[33m${t}\x1b[0m`, green = (t) => `\x1b[32m${t}\x1b[0m`, bold = (t) => `\x1b[1m${t}\x1b[0m`;
  const line = '─'.repeat(72);
  console.log(`\n${line}`);
  const ap = run?.apk || {};
  console.log(bold(ap.version_name
    ? ` App ${ap.version_name}  ·  build ${ap.build_id || '?'}  ·  ${ap.application_id || ''}`
    : ` App ${ap.application_id || ''}  ·  version not read: ${ap.reason || 'not recorded for this run'}`));
  const status = s.status === 'failed' ? red(bold(' FAILED ')) : s.status === 'warning' ? yellow(bold(' PASSED WITH WARNINGS ')) : green(bold(' PASSED '));
  console.log(`${status}  ${s.passed}/${s.total} passed  ·  ${s.failed} failed  ·  ${s.warnings} test warning(s)${s.budgetWarnings ? `  ·  ${s.budgetWarnings} budget warning(s)` : ''}  ·  ${s.appErrors} unexplained app error log line(s)${s.knownAppErrors ? ` (+${s.knownAppErrors} explained)` : ''}`);
  markKnownApi(tests, loadTriage());
  const api = apiSummary(tests);
  if (api.calls) console.log(`${api.failed ? red(` API: ${api.calls} calls, ${api.failed} failed`) : ` API: ${api.calls} calls, none failed`}${api.warnings ? yellow(`, ${api.warnings} with warnings`) : ''}${api.known ? `, ${api.known} known issue(s)` : ''}`);
  for (const t of tests.filter((x) => x.state === 'failed')) {
    console.log(red(`  ✖ ${t.title}`));
    console.log(`      ${(t.error?.message || '').split('\n')[0]}`);
    if (t.links?.[0]) console.log(`      at ${t.links[0].label}`);
    for (const c of codesIn(t.error?.message)) console.log(`      ⓘ ${c}`);
  }
  for (const t of tests.filter((x) => x.warnings?.length)) {
    for (const w of t.warnings) console.log(yellow(`  ⚠ ${t.id || t.title}: ${w.message}`));
    for (const c of codesIn(t.warnings.map((w) => w.message).join(' '))) console.log(`      ⓘ ${c}`);
  }
  // Budgets, trends and response formats (test/budgets.json, test/api-formats.json): warnings, never failures
  const b = runData.budget;
  if (b) {
    for (const w of b.warnings) console.log(yellow(`  ⚠ ${w.kind === 'budget' ? 'Over budget' : w.kind === 'trend' ? 'Slower than usual' : 'Response format'}: ${w.text}`));
    const checked = b.formats.reduce((n, f) => n + f.ok + f.problems, 0), notChecked = b.formats.reduce((n, f) => n + f.notChecked, 0);
    const within = b.items.filter((x) => x.ok && x.limit != null && x.value != null).length, over = b.items.filter((x) => !x.ok && !x.known).length, knownOver = b.items.filter((x) => !x.ok && x.known).length;
    console.log(` Budgets: ${within} within, ${over} over${knownOver ? ` (+${knownOver} on known APIs, not counted)` : ''}${b.trends.length ? ` · trends: ${b.trends.filter((x) => x.slower).length} of ${b.trends.length} slower than usual` : ' · trends: not enough earlier runs on this device yet'} · response formats: ${checked} checked${notChecked ? `, ${notChecked} could not be checked` : ''}`);
  }
  // Codes of the API calls in this run, once each
  const statuses = [...new Set(tests.flatMap((t) => (t.api || []).map((c) => c.status)).filter((x) => x != null))].sort((a, b) => a - b);
  if (statuses.length) {
    console.log(' API status codes in this run:');
    for (const st of statuses) console.log(`      ${httpMeaning(st)}`);
  }
  console.log(` Dashboard: ${pathToFileURL(dashboardFile).href}`);
  console.log(`${line}\n`);
}

/** Write via a temp file + rename, so an open browser never reads a half-written file. */
function writeAtomic(file, content) {
  mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, content);
  renameSync(tmp, file);
}

const asScript = (assign, data) => `${assign}${JSON.stringify(data).replace(/</g, '\\u003c')};\n`;

/** Show a test as failed / warning (passed, but with warnings or app errors) / passed. */
export const testStatus = (t) => (t.state === 'failed' ? 'failed' : t.state === 'skipped' ? 'skipped' : t.state === 'running' ? 'running' : t.warnings?.length || unexplainedErrors(t) ? 'warning' : 'passed');

function loadTriage() {
  const t = readJson(TRIAGE_FILE) || {};
  return { ticket: t.ticket || {}, modules: t.modules || {}, tests: t.tests || {}, issues: t.issues || {}, knownApi: t.knownApi || [], knownLogLines: t.knownLogLines || [], quarantine: t.quarantine || [], categoryRules: t.categoryRules || [] };
}

const crashed = (t) => (t.logcat?.errors || []).some((e) => e.includes('AndroidRuntime')) || (t.warnings || []).some((w) => /CRASHED/.test(w.message));

/**
 * Error signature: the error with run-specific parts removed, so the same problem in different tests
 * and different runs gets the same key (40 tests failing on one null pointer = one triage row).
 */
export function normalize(msg) {
  return String(msg || '').split('\n')[0]
    .replace(/\b(?!\d+(?:ms|s|px|dp|kb|mb)\b)(?=[a-z0-9]*\d)(?=[a-z0-9]*[a-z])[a-z0-9]{5,}\b/gi, '*') // random ids such as list names "bcs1j7"
    .replace(/\d+/g, '#')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
}
function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}
export function signatureOf(t) {
  if (t.state === 'failed') {
    const text = normalize(t.error?.message || 'failed without a message');
    return { sig: hash('F|' + text), sigText: text };
  }
  if (crashed(t)) {
    const line = (t.logcat?.errors || []).find((e) => /Exception|Error/.test(e)) || 'App crash';
    const text = 'App crash: ' + normalize(line.replace(/^[EF] AndroidRuntime: /, ''));
    return { sig: hash('C|' + text), sigText: text };
  }
  return { sig: null, sigText: '' };
}

/** Module + severity for a test, from test/triage.json, the [P0] tag in its title, or defaults. */
function classify(t, triage) {
  const conf = triage.tests[t.id] || {};
  const tag = (t.title || '').match(/\[(P[0-3])\]/);
  let severity = conf.severity || (tag && tag[1]) || 'P2';
  if (crashed(t)) severity = 'P0'; // a crash is always a blocker
  return { module: conf.module || t.suite || 'Other', severity };
}

// ---------------------------------------------------------------- failure categories (rules, first match wins)
// product = the app misbehaved; test = the test code is wrong; environment = network, emulator or a server
// outside the app; infrastructure = Appium / WebdriverIO / the machine; review = needs a person to decide.
const CATEGORY_RULES = [
  { category: 'infrastructure', test: (t) => t.id === 'SESSION', why: (t) => `The test session never started: ${(t.error?.message || '').replace(/^The test session could not start \([^)]*\)\.\s*/, '').slice(0, 220)}` },
  { category: 'infrastructure', re: /ECONNREFUSED|socket hang up|session not created|Could not start a new session|A new session could not be created|instrumentation process is not running|UiAutomator2 server|cannot be proxied|ENOSPC|out of memory|WebDriverError: .*session/i, why: (t, m) => `Appium / WebdriverIO failed, not the app: "${m}"` },
  { category: 'environment', re: /UnknownHost|no internet|Unable to resolve host|device offline|INSTALL_FAILED|emulator .*(offline|not responding)|adb: /i, why: (t, m) => `The emulator, its network or the install failed: "${m}"` },
  { category: 'test', re: /\b(TypeError|ReferenceError|SyntaxError|RangeError)\b|is not a function|Cannot read propert|is not defined|invalid selector|strict mode violation/i, why: (t, m) => `The test code itself threw an error: "${m}"` },
  { category: 'product', re: /Expected[\s\S]*Received|expect\(|toBe|toEqual|toHaveText|AssertionError/i, why: (t, m) => `The app showed something different from what the test expects: "${m}"` },
  { category: 'review', re: /not displayed|not found|did not open|still not|wait(ed)? .*timed? ?out|timeout|not (?:visible|existing)/i, why: (t, m) => `An expected screen element did not appear ("${m}"). Either the app changed (product bug) or the test looks for the wrong thing (test bug): compare the screenshot with what the test expects.` },
];

/** Category of a failed or crashed test, with the reason. */
export function categorize(t, triage = { categoryRules: [] }) {
  if (t.state !== 'failed' && !crashed(t)) return null;
  const msg = String(t.error?.message || '').split('\n')[0].slice(0, 240);
  for (const r of triage.categoryRules || []) {
    try { if (r.match && new RegExp(r.match, 'i').test(msg)) return { category: r.category, why: r.why || `Rule in test/triage.json matched "${r.match}"`, by: 'triage.json' }; } catch {}
  }
  const setup = (t.warnings || []).find((w) => w.source === 'setup');
  if (setup) return { category: 'infrastructure', why: setup.message, by: 'rule' };
  const stuck = (t.warnings || []).find((w) => w.source === 'device' && /screen was stuck/.test(w.message));
  if (stuck && t.state === 'failed') return { category: 'environment', why: stuck.message, by: 'rule' };
  if (crashed(t)) {
    const line = (t.logcat?.errors || []).find((e) => /Exception|Error/.test(e) && !/FATAL EXCEPTION/.test(e)) || 'FATAL EXCEPTION';
    return { category: 'product', why: `The app crashed during this test: ${line.replace(/^[EF] AndroidRuntime: /, '').slice(0, 220)}`, by: 'rule' };
  }
  const netFail = (t.api || []).find((c) => c.error && !c.known);
  if (netFail) return { category: 'environment', why: `The app could not reach ${hostOf(netFail.url)} during this test: ${explainFailure(netFail.error, netFail.url)}`, by: 'rule' };
  const server = (t.api || []).find((c) => c.status >= 500 && !c.known);
  if (server && /not displayed|not found|did not open/i.test(msg)) return { category: 'environment', why: `${hostOf(server.url)} answered ${server.status} (server error) during this test, so the screen had nothing to show.`, by: 'rule' };
  for (const rule of CATEGORY_RULES) {
    if (rule.test ? rule.test(t) : rule.re.test(msg)) return { category: rule.category, why: rule.why(t, msg), by: 'rule' };
  }
  return { category: 'review', why: `No rule matched this error ("${msg || 'no message'}"); a person needs to decide.`, by: 'rule' };
}
const hostOf = (url) => { try { return new URL(url).hostname; } catch { return 'the server'; } };

// Android's own code logging errors inside the app's process (graphics, WebView/Chromium internals): not the app's code.
const FRAMEWORK_TAGS = /^(DisplayEventDispatcher|chromium|cr_[\w.]+|HWUI|OpenGLRenderer|EGL_emulation|libEGL|Gralloc\w*|BLASTBufferQueue\w*|SurfaceComposerClient|ziparchive|ProfileInstaller)$/;

/** Error lines from the app's process that nothing explains (all of them for records without the split). */
export const unexplainedErrors = (t) => t.logcat?.unexplained ?? t.logcat?.errorCount ?? 0;

/**
 * Sort the app's error log lines into: caused by a known API problem (test/triage.json "knownApi", matched on the
 * URL in the line, e.g. the dev build's 403 from the beta analytics server), Android's own code in the app's process
 * (FRAMEWORK_TAGS), and the rest. Only the rest makes a test "passed with warnings"; the split is shown in the drawer.
 * Lines beyond the last 40 kept in the record cannot be checked and count as unexplained.
 */
export function explainAppErrors(t, knownApi = [], knownLogLines = []) {
  const lc = t.logcat;
  if (!lc?.errors?.length) return;
  const knownOf = (line) => {
    for (const url of line.match(/https?:\/\/[^\s,)"']+/g) || []) {
      const ep = endpointOf('GET', url);
      const k = knownApi.find((x) => x.match && (ep.includes(x.match) || url.includes(x.match)));
      if (k) return k;
    }
    // test/triage.json knownLogLines: { match: 'regular expression on the log line', reason }
    for (const k of knownLogLines) { try { if (k.match && new RegExp(k.match).test(line)) return k; } catch {} }
    return null;
  };
  const kinds = lc.errors.map((line) => {
    const tag = (line.match(/^[EF] (.*?): /) || [])[1] || '';
    const k = knownOf(line);
    if (k) return { kind: 'known', reason: k.reason };
    if (FRAMEWORK_TAGS.test(tag)) return { kind: 'framework', tag };
    return { kind: 'app' };
  });
  // "…handleException():304: " with an empty message is the header of the next line's exception: same verdict
  for (let i = kinds.length - 2; i >= 0; i--) {
    if (kinds[i].kind === 'app' && /handleException\(\):\d+:\s*$/.test(lc.errors[i]) && kinds[i + 1].kind === 'known') kinds[i] = kinds[i + 1];
  }
  const known = kinds.filter((k) => k.kind === 'known');
  const framework = kinds.filter((k) => k.kind === 'framework');
  const unchecked = Math.max(0, (lc.errorCount || lc.errors.length) - lc.errors.length);
  lc.explained = {
    known: known.length,
    knownReasons: [...new Set(known.map((k) => k.reason))],
    framework: framework.length,
    frameworkTags: [...new Set(framework.map((k) => k.tag))],
  };
  lc.unexplained = kinds.filter((k) => k.kind === 'app').length + unchecked;
  const i = (t.warnings || []).findIndex((w) => w.source === 'app' && /logged \d+ error line/.test(w.message));
  if (i < 0) return;
  const parts = [];
  if (known.length) parts.push(`${known.length} from known issues in test/triage.json`);
  if (framework.length) parts.push(`${framework.length} from Android's own code (${lc.explained.frameworkTags.join(', ')})`);
  if (!lc.unexplained) t.warnings.splice(i, 1);
  else if (parts.length) t.warnings[i] = { ...t.warnings[i], message: `The app logged ${lc.unexplained} error line(s) during this test that are not explained (${parts.join('; ')} are not counted).` };
}

/** Mark API calls whose problem is a known one (test/triage.json "knownApi"). */
function markKnownApi(tests, triage) {
  for (const t of tests) {
    for (const c of t.api || []) {
      const k = (triage.knownApi || []).find((x) => x.match && (c.endpoint.includes(x.match) || (c.url || '').includes(x.match)));
      c.known = k && c.issues?.length ? k.reason || 'known issue' : null;
    }
  }
}

/** Per-run API summary: calls, failures (not known), warnings, known, slowest. */
export function apiSummary(tests) {
  const calls = tests.flatMap((t) => t.api || []);
  const fail = (c) => !c.known && c.issues?.some((i) => i.level === 'fail');
  const warnOnly = (c) => !c.known && !fail(c) && c.issues?.some((i) => i.level === 'warn');
  return {
    calls: calls.length,
    failed: calls.filter(fail).length,
    warnings: calls.filter(warnOnly).length,
    known: calls.filter((c) => c.known).length,
    endpoints: new Set(calls.map((c) => c.endpoint)).size,
    bytes: calls.reduce((n, c) => n + (c.bytes || 0), 0),
    slowestMs: calls.reduce((n, c) => Math.max(n, c.ms || 0), 0),
    withBodies: calls.filter((c) => c.bodyFile).length,
    noResponse: calls.filter((c) => c.noResponse).length,
    // The most frequent problems, worded as specifically as the calls themselves
    topIssues: (() => {
      const m = new Map();
      for (const c of calls) {
        for (const i of c.issues || []) {
          const key = (c.known ? 'known' : i.level) + '|' + c.endpoint + '|' + i.reason.replace(/\d+(\.\d+)? ?(ms|s|KB)\b/g, '#');
          if (!m.has(key)) m.set(key, { level: c.known ? 'known' : i.level, endpoint: c.endpoint, reason: c.known ? `${i.reason} (known: ${c.known})` : i.reason, count: 0 });
          m.get(key).count++;
        }
      }
      const order = { fail: 0, warn: 1, info: 2, known: 3 };
      return [...m.values()].sort((a, b) => order[a.level] - order[b.level] || b.count - a.count).slice(0, 12);
    })(),
  };
}

/** Per-run performance summary for the Performance tab. */
function perfSummary(tests) {
  const firstLaunch = tests.flatMap((t) => t.perf?.launches || []).map((l) => l.ms);
  const launches = [...firstLaunch].sort((a, b) => a - b);
  const mem = tests.map((t) => t.perf?.memoryPssKb).filter(Boolean);
  const frames = tests.map((t) => t.perf?.frames).filter((f) => f && f.total);
  const total = frames.reduce((n, f) => n + f.total, 0);
  const janky = frames.reduce((n, f) => n + (f.janky || 0), 0);
  return {
    launchMs: firstLaunch.length ? firstLaunch[0] : null, // the first (cold) launch of the run, as in test/budgets.json
    launchMaxMs: launches.length ? launches[launches.length - 1] : null,
    memoryMaxMb: mem.length ? Math.round(Math.max(...mem) / 1024) : null,
    jankyPct: total ? Math.round((janky / total) * 1000) / 10 : null,
    frames: total || null,
  };
}

/** The small part of a run the Overview needs (no stacks, no logs). */
function runSummary(r) {
  const a = r.run?.apk || {};
  return {
    id: r.id,
    status: r.summary.status,
    startedAt: r.run?.startedAt,
    endedAt: r.run?.endedAt,
    lastActivity: r.summary.lastActivity,
    durationMs: r.summary.durationMs,
    suites: r.run?.suites || [],
    exitCode: r.run?.exitCode,
    setupError: r.run?.setupError || null,
    apk: { version_name: a.version_name, version_code: a.version_code, build_id: a.build_id, build_number: a.build_number, commit: a.commit, variant: a.variant, application_id: a.application_id, app_repo: a.app_repo, apk_sha256: a.apk_sha256, updated_at: a.updated_at, reason: a.reason },
    env: r.run?.env || 'local',
    details: r.run?.details || null,
    recordedWith: r.run?.recordedWith ?? null,
    perf: perfSummary(r.tests),
    budget: r.budget || null,
    metrics: r.metrics ? { launchMs: r.metrics.launchMs, memoryMb: r.metrics.memoryMb, api: Object.fromEntries(Object.entries(r.metrics.api).map(([ep, a]) => [ep, { n: a.n, p50: a.p50, p95: a.p95, max: a.max }])) } : null,
    deviceKey: deviceKey(r.device),
    api: apiSummary(r.tests),
    apiLevel: r.apiLevel || null,
    apiLevelReason: r.apiLevelReason || null,
    apiLog: r.tests.some((t) => t.api?.length) ? `runs/${r.id}/api-log.txt` : null,
    device: r.device,
    summary: { ...r.summary, withWarnings: r.tests.filter((t) => testStatus(t) === 'warning').length, crashes: r.tests.filter(crashed).length },
    problems: r.tests.filter((t) => !['passed', 'skipped', 'running'].includes(testStatus(t))).map((t) => ({
      key: t.key, id: t.id, title: t.title, status: testStatus(t),
      message: t.state === 'failed' ? (t.error?.message || '').split('\n')[0] : (t.warnings?.[0]?.message || `${unexplainedErrors(t)} app error log line(s)`),
    })),
  };
}

/** Every test across all kept runs, newest result first: the consolidated "All tests" view. */
function testHistory(runs, triage) {
  const map = new Map();
  for (const r of runs) {
    for (const t of r.tests) {
      const name = t.id && t.id !== 'SESSION' ? t.id : t.title;
      const c = classify(t, triage);
      if (!map.has(name)) map.set(name, { name, id: t.id, title: t.title, suite: t.suite, file: t.file, module: c.module, severity: c.severity, results: [] });
      map.get(name).results.push({
        runId: r.id, key: t.key, status: testStatus(t), durationMs: t.durationMs, finishedAt: t.finishedAt,
        version: r.run?.apk?.version_name, warnings: t.warnings?.length || 0, appErrors: unexplainedErrors(t),
        message: t.state === 'failed' ? (t.error?.message || '').split('\n')[0] : '',
        ...signatureOf(t), crash: crashed(t), severity: c.severity, title: t.title,
        buildId: r.run?.apk?.build_id || null, buildNumber: r.run?.apk?.build_number || null,
        projectCommit: r.run?.details?.project?.commit || null, projectDirty: r.run?.details?.project?.dirty ?? null,
        category: t.category?.category || null, categoryWhy: t.category?.why || null, startedAt: t.startedAt || null,
      });
    }
  }
  return [...map.values()];
}

/**
 * Rebuild the dashboard. `all` rewrites every run's data file (used by `npm run dashboard`);
 * otherwise only runs that changed since their data file was written.
 */
export function buildDashboard({ all = false } = {}) {
  mkdirSync(cfg.dataDir, { recursive: true });
  const runs = collectRuns();
  const triage = loadTriage();
  for (const r of runs) {
    markKnownApi(r.tests, triage);
    for (const t of r.tests) t.category = categorize(t, triage);
  }
  const kept = new Set(runs.map((r) => r.id));

  // Retention: run folders and data files beyond DASHBOARD_KEEP_RUNS are deleted
  if (existsSync(cfg.runsDir)) {
    for (const d of readdirSync(cfg.runsDir)) if (!kept.has(d) && existsSync(path.join(cfg.runsDir, d, 'meta.json'))) { try { rmSync(path.join(cfg.runsDir, d), { recursive: true, force: true }); } catch {} }
  }
  const runData = path.join(cfg.dataDir, 'runs');
  if (existsSync(runData)) {
    for (const f of readdirSync(runData)) if (!kept.has(f.replace(/\.js$/, ''))) { try { rmSync(path.join(runData, f), { force: true }); } catch {} }
  }

  runs.forEach((r, i) => {
    const file = path.join(runData, `${r.id}.js`);
    const runDir = path.join(cfg.runsDir, r.id);
    const triageTime = existsSync(TRIAGE_FILE) ? statSync(TRIAGE_FILE).mtimeMs : 0;
    const changed = !existsSync(file) || Math.max(newestMtime(runDir), triageTime) > statSync(file).mtimeMs;
    if (all || changed || i < 2) { // the 2 newest always: a running run may turn into 'incomplete'
      try { writeAtomic(path.join(runDir, 'api-log.txt'), apiLogText(r)); } catch {}
      const full = { schemaVersion: SCHEMA_VERSION, ...runSummary(r), apk: r.run?.apk || {}, tests: r.tests.map((t) => ({ ...t, status: testStatus(t), crash: crashed(t), ...classify(t, triage), ...signatureOf(t), category: t.category?.category || null, categoryWhy: t.category?.why || null })) };
      writeAtomic(file, asScript(`(window.DASH_RUNS=window.DASH_RUNS||{})[${JSON.stringify(r.id)}]=`, full));
    }
  });

  const generatedAt = new Date().toISOString();
  writeAtomic(path.join(cfg.dataDir, 'index.js'), asScript('window.DASH_INDEX=', { schemaVersion: SCHEMA_VERSION, project: cfg.projectName, app: APP_PACKAGE, generatedAt, triage, runs: runs.map(runSummary), tests: testHistory(runs, triage) }));
  writeAtomic(path.join(cfg.dataDir, 'codes.js'), codesScript());
  const file = path.join(cfg.reportsDir, 'index.html');
  writeAtomic(file, readFileSync(TEMPLATE_FILE, 'utf8'));
  writeAtomic(path.join(cfg.dataDir, 'latest.js'), asScript('window.DASH_LATEST=', { schemaVersion: SCHEMA_VERSION, generatedAt, runId: runs[0]?.id || null, status: runs[0]?.summary.status || null }));
  return { file, runs };
}

/** data/codes.js: the same code meanings and finder the reports use (codes.js), for the page (works from file://). */
export function codesScript() {
  return `// Written by dashboard.mjs from test/support/report/codes.js: one-line meanings of the codes the dashboard shows.
window.DASH_CODES = (function () {
  const CODE_BOOK = ${JSON.stringify(CODE_BOOK)};
  ${httpMeaning.toString()}
  ${codesIn.toString()}
  return { CODE_BOOK, httpMeaning, codesIn };
})();
`;
}

/** Every API call of a run, in order, from the request to its resolution: reports/runs/<id>/api-log.txt */
export function apiLogText(r) {
  const lines = [];
  const a = r.run?.apk || {};
  lines.push(`API log · run ${r.id} · ${a.application_id || '?'} v${a.version_name || '?'} build ${a.build_number ? '#' + a.build_number : a.build_id || '?'}`);
  lines.push(`Logging level: ${r.apiLevel || 'BASIC'}${r.apiLevelReason ? ' - ' + r.apiLevelReason : ' - full requests and responses'}`);
  lines.push(`Times are the emulator's clock (Android log); +ms is the time since the request started.`);
  let n = 0;
  for (const t of r.tests) {
    if (!t.api?.length) {
      lines.push('', `=== ${t.title}`, `    No API calls were logged during this test (${t.startedAt ? new Date(t.startedAt).toISOString() : '?'} to ${t.finishedAt || '?'}).`);
      continue;
    }
    lines.push('', `=== ${t.title} (${t.api.length} call${t.api.length === 1 ? '' : 's'})`);
    for (const c of t.api) {
      n++;
      lines.push('', `#${n}  ${c.method} ${c.url}${c.afterTestEnded ? '   [after the test ended]' : ''}`);
      lines.push(`    API: ${c.endpoint}${c.pid ? ` · app process ${c.pid}, thread ${c.thread}` : ''}`);
      const t0 = logTimeMs(c.at);
      for (const e of c.events || []) {
        const d = t0 != null && logTimeMs(e.at) != null ? `+${logTimeMs(e.at) - t0} ms` : '';
        lines.push(`    ${String(e.at || '').padEnd(19)} ${d.padStart(9)}  ${e.text}`);
      }
      lines.push(`    => ${c.resolution}`);
      if (c.status != null) lines.push(`    Status: ${httpMeaning(c.status)}`);
      if (c.format) lines.push(`    Format (${c.format.rule}): ${c.format.status === 'ok' ? `OK, ${c.format.checked} values checked` : c.format.status === 'problems' ? c.format.problems.map((p) => p.text).join(' ') : 'not checked: ' + c.format.reason}`);
      if (c.shape) lines.push(`    Response: ${c.shape}`);
      if (c.bodyMissing) lines.push(`    Body: ${c.bodyMissing}`);
      if (c.bodyFile) lines.push(`    Full response: reports/${c.bodyFile}`);
      for (const i of c.issues || []) if (!(c.noResponse && i.reason.includes(c.noResponse.reason))) lines.push(`    ${c.known ? 'KNOWN' : i.level.toUpperCase()}: ${i.reason}${c.known ? ` (known: ${c.known})` : ''}`);
    }
  }
  if (!n) lines.push('', r.run?.setupError || r.tests.some((t) => t.id === 'SESSION')
    ? `No API calls: the test session never started, so the app was not opened (${(r.run?.setupError || r.tests.find((t) => t.id === 'SESSION').error?.message || '').slice(0, 300)}).`
    : 'No API calls were logged in this run.');
  return lines.join('\n') + '\n';
}
const logTimeMs = (at) => { const m = String(at || '').match(/(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})\.(\d{1,3})/); return m ? Date.UTC(2000, m[1] - 1, m[2], m[3], m[4], m[5], Number(m[6].padEnd(3, '0'))) : null; };

function newestMtime(dir) {
  let newest = 0;
  const walk = (d) => {
    for (const f of readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (f.name.endsWith('.json') && f.name !== 'run.json') newest = Math.max(newest, statSync(p).mtimeMs);
    }
  };
  try { walk(dir); } catch {}
  return newest;
}

/** Like buildDashboard, but never throws: a dashboard problem must not break a test run. */
export function safeBuildDashboard(options) {
  try {
    return buildDashboard(options);
  } catch (e) {
    console.warn(`[dashboard] could not rebuild: ${e.message}`);
    return null;
  }
}

// CLI: node test/support/report/dashboard.mjs [--open]
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { file, runs } = buildDashboard({ all: true });
  console.log(`Dashboard: ${pathToFileURL(file).href}  (${runs.length} run(s))`);
  if (process.argv.includes('--open')) {
    const { exec } = await import('node:child_process');
    const cmd = process.platform === 'win32' ? `start "" "${file}"` : process.platform === 'darwin' ? `open "${file}"` : `xdg-open "${file}"`;
    exec(cmd);
  }
}
