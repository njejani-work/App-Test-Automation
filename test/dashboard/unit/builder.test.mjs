// Unit tests for the result format, run details and dashboard builder. Run: npm run test:dashboard:unit
// The builder is tested on the demo runs (test/dashboard/fixtures.mjs) written to a temporary folder.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEMA_VERSION, upgradeRun, upgradeTest } from '../../support/report/schema.js';
import { ciInfo, runDetails } from '../../support/report/run-details.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.resolve(here, '..', 'fixtures.mjs');
const dir = mkdtempSync(path.join(os.tmpdir(), 'wikidash-'));
let D; // dashboard.mjs, imported after DASHBOARD_REPORTS_DIR points at the temporary folder
const load = (file) => { const w = {}; new Function('window', readFileSync(file, 'utf8'))(w); return w; };

before(async () => {
  execFileSync(process.execPath, [fixtures, dir], { stdio: 'ignore' });
  process.env.DASHBOARD_REPORTS_DIR = dir;
  D = await import('../../support/report/dashboard.mjs');
});

// ---------------------------------------------------------------- result format
test('old (version 0) records are upgraded: missing lists filled, version noted', () => {
  const run = upgradeRun({ runId: 'x', startedAt: '2026-01-01T00:00:00Z' });
  assert.equal(run.schemaVersion, SCHEMA_VERSION);
  assert.equal(run.recordedWith, 0);
  assert.deepEqual(run.suites, []);
  assert.match(run.details.trigger, /unknown/);
  const t = upgradeTest({ title: 'A', state: 'weird' });
  assert.deepEqual([t.warnings, t.notes, t.steps], [[], [], []]);
  assert.equal(t.state, 'passed');
  assert.equal(t.logcat.errorCount, 0);
});

test('current records pass through unchanged', () => {
  const run = upgradeRun({ schemaVersion: SCHEMA_VERSION, suites: ['tour'], details: { trigger: 'manual (local)' } });
  assert.equal(run.recordedWith, SCHEMA_VERSION);
  assert.equal(run.details.trigger, 'manual (local)');
  assert.equal(upgradeRun(null), null);
});

// ---------------------------------------------------------------- run details
test('CI details: GitHub Actions link, event and branch', () => {
  const ci = ciInfo({ GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'me/proj', GITHUB_RUN_ID: '77', GITHUB_EVENT_NAME: 'pull_request', GITHUB_HEAD_REF: 'feature', GITHUB_ACTOR: 'bot' });
  assert.equal(ci.url, 'https://github.com/me/proj/actions/runs/77');
  assert.equal(ci.event, 'pull_request');
  assert.equal(ci.branch, 'feature');
  const bb = ciInfo({ BITBUCKET_BUILD_NUMBER: '12', BITBUCKET_REPO_FULL_NAME: 'team/proj', BITBUCKET_BRANCH: 'main' });
  assert.equal(bb.url, 'https://bitbucket.org/team/proj/pipelines/results/12');
  assert.equal(ciInfo({}), null);
});

test('run details never keep a token from the git remote address', () => {
  const repo = mkdtempSync(path.join(os.tmpdir(), 'wikidash-git-'));
  const git = (...a) => execFileSync('git', ['-C', repo, ...a], { stdio: 'ignore' });
  git('init', '-q');
  git('remote', 'add', 'origin', 'https://user:SECRET-TOKEN@github.com/me/proj.git');
  const d = runDetails(repo, {});
  assert.equal(d.project.remote, 'https://github.com/me/proj.git');
  assert.ok(!JSON.stringify(d).includes('SECRET-TOKEN'));
  assert.equal(d.trigger, 'manual (local)');
  assert.equal(typeof d.timeZone, 'string');
});

// ---------------------------------------------------------------- builder
test('builder writes versioned data files the page can load', () => {
  for (const f of ['index.html', 'data/index.js', 'data/latest.js']) assert.ok(existsSync(path.join(dir, f)), f);
  const { DASH_INDEX: I } = load(path.join(dir, 'data', 'index.js'));
  assert.equal(I.schemaVersion, SCHEMA_VERSION);
  assert.equal(I.runs.length, readdirSync(path.join(dir, 'runs')).length);
  for (const r of I.runs) assert.ok(existsSync(path.join(dir, 'data', 'runs', `${r.id}.js`)), r.id);
  const { DASH_LATEST: L } = load(path.join(dir, 'data', 'latest.js'));
  assert.equal(L.generatedAt, I.generatedAt);
});

test('an old-format run still opens, and its API calls are read back from the saved log', () => {
  const runs = D.collectRuns();
  const old = runs.find((r) => r.id === '20261109-090000');
  assert.ok(old);
  assert.equal(old.run.recordedWith, 0);
  assert.equal(old.tests[0].api.length, 1);
  assert.equal(old.tests[0].api[0].status, 200);
  assert.equal(old.tests[0].api[0].fromLog, true);
});

test('run details are recorded and reach the dashboard (CI link on the GitHub run)', () => {
  const { DASH_INDEX: I } = load(path.join(dir, 'data', 'index.js'));
  const ciRun = I.runs.find((r) => r.details && r.details.ci);
  assert.ok(ciRun);
  assert.equal(ciRun.details.ci.url, 'https://github.com/example/wikiApp_compileToTest/actions/runs/1234567');
  assert.match(ciRun.details.trigger, /GitHub Actions · push/);
  const local = I.runs.find((r) => r.details && r.details.trigger === 'manual (local)');
  assert.ok(local.details.tools.node.startsWith('v'));
});

test('the same error in two tests gets one signature; random list names do not split it', () => {
  const runs = D.collectRuns();
  const r = runs.find((x) => x.tests.some((t) => t.id === 'TOUR-02' && t.state === 'failed'));
  const s2 = D.signatureOf(r.tests.find((t) => t.id === 'TOUR-02'));
  const s3 = D.signatureOf(r.tests.find((t) => t.id === 'TOUR-03'));
  assert.equal(s2.sig, s3.sig);
  assert.equal(D.normalize('list "QA list bcs1j7" not shown after 15000ms'), D.normalize('list "QA list q9x7k2" not shown after 15000ms'));
  assert.match(D.normalize('waited 15000ms'), /#ms/);
});

test('known API problems (triage.json knownApi) are grey, not counted as failures', () => {
  const { DASH_INDEX: I } = load(path.join(dir, 'data', 'index.js'));
  const r = I.runs.find((x) => x.api.calls >= 5);
  assert.ok(r.api.known >= 1, 'the dev build 403 is known');
  const failing = I.runs.find((x) => x.api.failed > 0);
  assert.ok(failing, 'the timed-out search call counts as a failure');
});

test('a run that could not start is FAILED with its reason', () => {
  const r = D.collectRuns().find((x) => x.run.setupError);
  assert.equal(r.summary.status, 'failed');
  assert.match(r.run.setupError, /No APK/);
});

test('unfinished runs: the newest is "running", an older one "incomplete"', () => {
  const add = (id) => { mkdirSync(path.join(dir, 'runs', id, 'tests'), { recursive: true }); writeFileSync(path.join(dir, 'runs', id, 'run.json'), JSON.stringify({ schemaVersion: 1, runId: id, suites: ['tour'], startedAt: new Date().toISOString(), apk: {} })); };
  add('20991231-235959');
  add('20000101-000000');
  const runs = D.collectRuns();
  assert.equal(runs.find((r) => r.id === '20991231-235959').summary.status, 'running');
  assert.equal(runs.find((r) => r.id === '20000101-000000').summary.status, 'incomplete');
});

test('retention: runs beyond DASHBOARD_KEEP_RUNS are removed on rebuild', () => {
  const small = mkdtempSync(path.join(os.tmpdir(), 'wikidash-keep-'));
  execFileSync(process.execPath, [fixtures, small], { stdio: 'ignore', env: { ...process.env, DASHBOARD_KEEP_RUNS: '3' } });
  assert.equal(readdirSync(path.join(small, 'runs')).length, 3);
  assert.equal(readdirSync(path.join(small, 'data', 'runs')).length, 3);
});

test('test status: warnings or app errors make a passed test "warning"', () => {
  assert.equal(D.testStatus({ state: 'failed' }), 'failed');
  assert.equal(D.testStatus({ state: 'passed', warnings: [{ message: 'slow' }] }), 'warning');
  assert.equal(D.testStatus({ state: 'passed', warnings: [], logcat: { errorCount: 2 } }), 'warning');
  assert.equal(D.testStatus({ state: 'passed', warnings: [] }), 'passed');
});

// ---------------------------------------------------------------- phase 2: categories, API log, session reasons
test('failure categories come with the reason that decided them', () => {
  const triage = { categoryRules: [] };
  const cat = (t) => D.categorize({ state: 'failed', warnings: [], logcat: { errors: [] }, api: [], ...t }, triage);
  assert.equal(cat({ id: 'SESSION', error: { message: 'The test session could not start (worker 0-0, exit code 1). No emulator or phone was connected.' } }).category, 'infrastructure');
  assert.equal(cat({ error: { message: "TypeError: Cannot read properties of undefined (reading 'click')" } }).category, 'test');
  assert.equal(cat({ error: { message: 'expect(received).toBe(expected)\n\nExpected: true\nReceived: false' } }).category, 'product');
  const crash = D.categorize({ state: 'passed', warnings: [], logcat: { errors: ['E AndroidRuntime: FATAL EXCEPTION: main', 'E AndroidRuntime: java.lang.NullPointerException: boom'] } }, triage);
  assert.equal(crash.category, 'product');
  assert.match(crash.why, /The app crashed during this test: java\.lang\.NullPointerException: boom/);
  const net = cat({ error: { message: 'SearchPage did not open within 20000 ms' }, api: [{ url: 'https://en.wikipedia.org/w/api.php', error: 'java.net.UnknownHostException: x' }] });
  assert.equal(net.category, 'environment');
  assert.match(net.why, /could not reach en\.wikipedia\.org/);
  const review = cat({ error: { message: 'Saved ⋮ menu did not open' } });
  assert.equal(review.category, 'review');
  assert.match(review.why, /compare the screenshot/);
  assert.equal(D.categorize({ state: 'passed', warnings: [], logcat: { errors: [] } }, triage), null);
  const custom = D.categorize({ state: 'failed', error: { message: 'Saved ⋮ menu did not open' } }, { categoryRules: [{ match: 'menu did not open', category: 'product', why: 'Known app bug #12' }] });
  assert.deepEqual([custom.category, custom.why, custom.by], ['product', 'Known app bug #12', 'triage.json']);
  // A test-setup problem (the app could not be opened) is infrastructure, and a stuck emulator screen is environment
  const setup = cat({ error: { message: 'Onboarding: still showing after 6 taps on Forward' }, warnings: [{ source: 'setup', message: 'The test setup could not open the app: x' }] });
  assert.deepEqual([setup.category, setup.why], ['infrastructure', 'The test setup could not open the app: x']);
  const stuck = cat({ error: { message: 'Onboarding: still showing after 6 taps on Forward' }, warnings: [{ source: 'device', message: "The emulator's screen was stuck: 6 tap(s) reached no window at all" }] });
  assert.equal(stuck.category, 'environment');
  assert.match(stuck.why, /screen was stuck/);
  // A setup warning does not turn into an error signature for a passed test
  assert.deepEqual(D.signatureOf({ state: 'passed', warnings: [{ source: 'setup', message: 'x' }], logcat: { errors: [] } }), { sig: null, sigText: '' });
});

test('a session that cannot start is explained from the WebdriverIO log, not with a generic text', async () => {
  const R = await import('../../support/report/recorder.js');
  const logs = mkdtempSync(path.join(os.tmpdir(), 'wikidash-logs-'));
  writeFileSync(path.join(logs, 'wdio-0-0.log'), '2026-11-13T04:34:20Z ERROR webdriver: Request failed with status 500 due to unknown error: Original error: Could not find a connected Android device in 20000ms.\n');
  const why = R.sessionFailureReason('0-0', logs);
  assert.match(why.message, /^No emulator or phone was connected \(adb sees no device\)/);
  assert.match(why.message, /Could not find a connected Android device/);
  writeFileSync(path.join(logs, 'wdio-0-0.log'), 'ERROR webdriver: Error: connect ECONNREFUSED 127.0.0.1:4723\n');
  assert.match(R.sessionFailureReason('0-0', logs).message, /could not reach Appium on port 4723/);
  const empty = mkdtempSync(path.join(os.tmpdir(), 'wikidash-nologs-'));
  assert.match(R.sessionFailureReason('0-0', empty).message, /neither reports\/logs\/wdio-0-0\.log nor the Appium log contains an error line/);
});

test('the session that could not start in the demo data carries the real reason', () => {
  const r = D.collectRuns().find((x) => x.tests.some((t) => t.id === 'SESSION'));
  const t = r.tests.find((x) => x.id === 'SESSION');
  assert.match(t.error.message, /No emulator or phone was connected/);
  assert.match(t.error.stack, /Could not find a connected Android device/);
});

test('api-log.txt: every call from request to outcome, and every no-response with its reason', () => {
  const runs = D.collectRuns();
  const r = runs.find((x) => x.tests.some((t) => (t.logcat?.errors || []).some((e) => e.includes('AndroidRuntime'))));
  const text = readFileSync(path.join(dir, 'runs', r.id, 'api-log.txt'), 'utf8'); // written by the builder (known issues marked)
  assert.match(text, /^API log · run /);
  assert.match(text, /Logging level: BODY/);
  assert.match(text, /Request started: GET https:\/\/en\.wikipedia\.org\/api\/rest_v1\/feed\/featured/);
  assert.match(text, /Response 200 received after \d+ ms/);
  assert.match(text, /No response\. The app crashed at /);
  assert.match(text, /No response\. The test closed the app on purpose \(step "Close the app"\)/);
  assert.match(text, /KNOWN: HTTP 403 from meta\.wikimedia\.beta\.wmcloud\.org/);
  assert.match(text, /Status: 403 Forbidden: The server understood the request but refuses it/);
  assert.match(text, /Status: 200 OK: The request worked/);
  assert.ok(existsSync(path.join(dir, 'runs', r.id, 'api-log.txt')));
  const session = runs.find((x) => x.tests.some((t) => t.id === 'SESSION'));
  assert.match(D.apiLogText(session), /No API calls: the test session never started/);
});

test('calls recorded by older versions are upgraded: timeline, outcome, exact reason for a missing body', () => {
  const old = D.collectRuns().find((r) => r.id === '20261109-090000');
  const c = old.tests[0].api[0];
  assert.deepEqual(c.events.map((e) => e.kind), ['start', 'headers', 'done']);
  assert.match(c.resolution, /^200 · /);
  assert.match(c.bodyMissing, /recorded before full API logging existed/);
});

test('every API call in the demo data has an outcome, and every call without a response has a reason', () => {
  for (const r of D.collectRuns()) for (const t of r.tests) for (const c of t.api || []) {
    assert.ok(c.resolution && c.resolution.length > 10, `${r.id} ${c.url}: no outcome`);
    if (c.status == null) assert.ok(c.noResponse && c.noResponse.reason.length > 20, `${r.id} ${c.url}: no reason for the missing response`);
    if (c.status != null && !c.bodyPreview) assert.ok(c.bodyMissing || c.bodyNote, `${r.id} ${c.url}: no reason for the missing body`);
  }
});

test('calls still open when the session ends are added to the last test, marked as after the test', () => {
  const r = D.collectRuns().find((x) => x.tests.some((t) => (t.api || []).some((c) => c.afterTestEnded)));
  const c = r.tests.flatMap((t) => t.api || []).find((x) => x.afterTestEnded);
  assert.match(c.noResponse.reason, /^No response was logged before the test session ended at /);
  assert.match(c.noResponse.reason, /Last test: SMK-04/);
});
