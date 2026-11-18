// The eGenome parts of the dashboard: reading eGenome runs (old and new), adb readers, the per-test device
// recording, the builder (run.json for the deliverables, data files for the page) and "session could not start".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'egdash-'));
process.env.DASHBOARD_DIR = tmp(); // nothing here may touch the real reports folder
process.env.DASHBOARD_SLOW_MS = '';
const { loadEgRun, suitesOf, testIdOf, placeCalls } = await import('@apptest/toolkit/dashboard/egenome-run.js');
const { apiLevelOf } = await import('@apptest/toolkit/dashboard/analysis.mjs');
const adb = await import('@apptest/toolkit/dashboard/lib/device.js');
const dev = await import('@apptest/toolkit/dashboard/device-recorder.js');
const { buildIndex, exportSnapshot } = await import('@apptest/toolkit/dashboard/builder.js');
const { createHooks } = await import('@apptest/toolkit/dashboard/hooks.js');

/** A run folder in eGenome's format (meta.json + workers/0-0.json). */
function writeRun(root, id, meta, entries, device = { name: 'emulator-5554', model: 'sdk_gphone64_x86_64', platformVersion: '15', apiLevel: 35 }) {
  const dir = path.join(root, 'runs', id);
  fs.mkdirSync(path.join(dir, 'workers'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ id, startedAt: Date.UTC(2026, 9, 30, 5, 0), environment: 'staging', trigger: 'local', host: { os: 'Windows_NT 10', node: 'v24.22.1', user: 'tester', machine: 'pc' }, args: 'run ./wdio.conf.js --suite smoke', ...meta }));
  fs.writeFileSync(path.join(dir, 'workers', '0-0.json'), JSON.stringify({ cid: '0-0', specs: ['test/specs/smoke/smoke.e2e.js'], device, updatedAt: Date.UTC(2026, 9, 30, 5, 5), entries }));
  return dir;
}
const step = (n, title, status = 'passed', extra = {}) => ({ n, title, call: `Page.${title}()`, kind: 'action', status, start: n * 1000, durationMs: 800, actions: [], screenshot: `runs/R/screenshots/0-0/t002-s00${n}.png`, ...extra });

// ------------------------------------------------------------------ reading runs
test('suites come from the command line; the default run is smoke + regression', () => {
  assert.deepEqual(suitesOf({ args: 'run ./wdio.conf.js --suite smoke' }), ['smoke']);
  assert.deepEqual(suitesOf({ args: 'run ./wdio.conf.js --suite smoke --suite layout' }), ['smoke', 'layout']);
  assert.deepEqual(suitesOf({ args: 'run ./wdio.conf.js --spec ./test/specs/regression/01-login.e2e.js' }), ['spec 01-login.e2e.js']);
  assert.deepEqual(suitesOf({ args: 'run ./wdio.conf.js' }), ['smoke', 'regression']);
  assert.equal(testIdOf('SMK-01 [P0] intro and login screen'), 'SMK-01');
  assert.equal(testIdOf('logs in with the correct OTP'), '');
});

test('an old run (before 13 Nov 2026): steps, layout checks, the failure tail of the Android log, hooks, skipped tests', () => {
  const root = tmp();
  writeRun(root, 'R', { finishedAt: Date.UTC(2026, 9, 30, 5, 6), exitCode: 1 }, [
    { id: '0-0-001', index: 1, type: 'hook', title: '"before all" hook', suite: 'Smoke', file: 'x', status: 'passed', start: 1, durationMs: 5, steps: [step(1, 'Login')] },
    { id: '0-0-002', index: 2, type: 'test', title: 'SMK-01 [P0] intro and login screen', suite: 'Smoke', file: 'test/specs/smoke/smoke.e2e.js', status: 'failed', start: Date.UTC(2026, 9, 30, 5, 1), durationMs: 9000,
      error: { name: 'Error', message: 'Layout "Onboarding": 1 of 60 checks failed', stack: '' },
      steps: [step(1, 'Wait for open'), step(2, 'Verify layout', 'failed', { warnings: ['skipBtn tap target is 46dp'], layout: { spec: 'Onboarding', summary: { total: 60, passed: 58, failed: 1, warnings: 1, skipped: 0 } } })],
      logcat: ['10:01:19.037 ALL 10-28 15:31:18.241 30714 30802 E ReactNativeJS: TypeError: x is undefined', '10:01:19.040 ALL 10-28 15:31:18.250 30714 30802 W ReactNativeJS: deprecated'] },
    { id: '0-0-003', index: 3, type: 'hook', title: '"before each" hook', suite: 'Smoke', file: 'x', status: 'failed', start: 2, durationMs: 5, error: { message: 'Home did not open' }, steps: [] },
    { id: '0-0-004', index: 4, type: 'test', title: 'SMK-02 [P0] login', suite: 'Smoke', file: 'x', status: 'skipped', start: 3, durationMs: 0, steps: [] },
  ]);
  const { run, tests, devices } = loadEgRun(path.join(root, 'runs'), 'R');
  assert.equal(run.recordedWith, 0);
  assert.equal(run.details.trigger, 'manual (local)');
  assert.deepEqual(run.suites, ['smoke']);
  assert.equal(devices[0].deviceModel, 'sdk_gphone64_x86_64');
  assert.deepEqual(tests.map((t) => [t.id, t.state, t.kind]), [['SMK-01', 'failed', 'test'], ['', 'failed', 'hook'], ['SMK-02', 'skipped', 'test']], 'passed hooks are left out, a failed one is a result');
  const t = tests[0];
  assert.equal(t.stepsDetail.length, 2);
  assert.deepEqual(t.steps.map((s) => s.text), ['Page.Wait for open()', 'Page.Verify layout()']);
  assert.equal(t.screenshot, 'screenshots/0-0/t002-s002.png', 'relative to the run folder');
  assert.deepEqual(t.layout, { total: 60, passed: 58, failed: 1, warnings: 1, skipped: 0, screens: ['Onboarding'] });
  assert.equal(t.warnings[0].source, 'layout');
  assert.match(t.warnings[0].message, /^Step 2 \(Verify layout\): skipBtn tap target is 46dp$/);
  assert.equal(t.logcat.errorCount, 1);
  assert.match(t.logcat.errors[0], /^E ReactNativeJS: TypeError: x is undefined/);
  assert.equal(tests[1].title, 'Setup: "before each" hook (Smoke)');
});

test('an old run that ended before any test says the reason was not captured; a new one gives the reason', () => {
  const root = tmp();
  writeRun(root, 'OLD', { finishedAt: 2, exitCode: 1 }, []);
  const [s1] = loadEgRun(path.join(root, 'runs'), 'OLD').tests;
  assert.equal(s1.id, 'SESSION');
  assert.match(s1.error.message, /exit code 1\): no test ran\. The reason was not captured/);
  writeRun(root, 'NEW', { finishedAt: 2, exitCode: 1, recorder: 1, workerFailures: [{ cid: '0-0', exitCode: 1, reason: 'No emulator or phone was connected (adb sees no device).' }] }, []);
  const [s2] = loadEgRun(path.join(root, 'runs'), 'NEW').tests;
  assert.match(s2.error.message, /could not start \(worker 0-0, exit code 1\)\. No emulator or phone was connected/);
});

test('API status is never generic: old run, log off, no calls (React Native), status lines only, full bodies', () => {
  const old = apiLevelOf(null, { recordedWith: 0 }, []);
  assert.equal(old.level, 'NONE');
  assert.match(old.reason, /recorded before the dashboard read the app's Android log/);
  assert.match(apiLevelOf({ logcat: false }, { recordedWith: 1 }, []).reason, /DASHBOARD_LOGCAT=false/);
  const none = apiLevelOf({ logcat: true }, { recordedWith: 1, apk: { application_id: 'com.egenome.app' } }, [{ api: [] }]);
  assert.match(none.reason, /no "OkHttp" lines from com\.egenome\.app/);
  assert.match(none.reason, /HttpLoggingInterceptor/);
  assert.equal(apiLevelOf({}, { recordedWith: 1 }, [{ api: [{ status: 200, resHeaders: {} }] }]).level, 'BASIC');
  assert.equal(apiLevelOf({}, { recordedWith: 1 }, [{ api: [{ status: 200, bodyPreview: '{}' }] }]).level, 'BODY');
});

// ------------------------------------------------------------------ adb (read-only)
test('app version and a fingerprint of the installed APK, read with adb', async () => {
  adb.setAdbRunner((a) => ({
    'dumpsys package com.egenome.app': '  versionCode=240 minSdk=24\n  versionName=2.4.0\n  firstInstallTime=2026-10-01 10:00:00\n  lastUpdateTime=2026-11-11 18:20:00\n',
    'pm path com.egenome.app': 'package:/data/app/x/base.apk\npackage:/data/app/x/split_config.en.apk\n',
    'sha256sum /data/app/x/base.apk': 'b7e9d0f1a2' + '1'.repeat(54) + '  /data/app/x/base.apk\n',
  })[a.join(' ')] ?? '');
  const info = await adb.appInfo('emulator-5554', 'com.egenome.app');
  assert.equal(info.version_name, '2.4.0');
  assert.equal(info.version_code, '240');
  assert.equal(info.build_id, '2.4.0-b7e9d0f1a2');
  assert.equal(info.updated_at, '2026-11-11 18:20:00');
  adb.setAdbRunner(() => null);
  assert.match((await adb.appInfo(null, 'com.egenome.app')).reason, /adb could not read the app details/);
  adb.setAdbRunner((a) => (a[1] === 'meminfo' ? '  TOTAL PSS:   256100   TOTAL RSS: 1' : a[1] === 'gfxinfo' ? 'Total frames rendered: 400\nJanky frames: 40 (10.00%)\n90th percentile: 16ms' : ''));
  assert.equal(await adb.memoryPssKb(null, 'com.egenome.app'), 256100);
  assert.deepEqual(await adb.frameStats(null, 'com.egenome.app'), { total: 400, janky: 40, jankyPct: 10, p90Ms: 16 });
  adb.setAdbRunner(null);
});

// ------------------------------------------------------------------ around a test
test('after a test: its Android log, API calls with bodies, launch time, memory, warnings, video only on failure', async () => {
  const runDir = tmp();
  adb.setAdbRunner((a) => (a[1] === 'meminfo' ? 'TOTAL PSS: 300000' : a[0] === 'pidof' ? '4321' : ''));
  let queue = [];
  globalThis.driver = {
    getLogs: async () => { const q = queue; queue = []; return q.map((message) => ({ message })); },
    startRecordingScreen: async () => {}, stopRecordingScreen: async () => Buffer.from('video').toString('base64'),
  };
  dev.initDevice({ runDir, cid: '0-0', udid: 'emulator-5554' });
  await dev.beforeTest();
  const H = (m) => `11-13 10:00:01.000  4321  4330 I OkHttp  : ${m}`;
  queue = [
    '11-13 10:00:00.500   555   570 I ActivityTaskManager: Displayed com.egenome.app/.MainActivity for user 0: +2s100ms',
    H('--> GET https://staging.api.example/v1/reports'), H('Authorization: Bearer x'), H('--> END GET'), H('<-- 200 https://staging.api.example/v1/reports (310ms)'), H('content-type: application/json'), H(''), H('{"data":[{"id":"r1"}]}'), H('<-- END HTTP (312ms, 22-byte body)'),
    '11-13 10:00:02.000  4321  4321 E ReactNativeJS: Error: something failed',
  ];
  const ok = await dev.afterTest({ title: 'SMK-05 [P0] reports' }, { passed: true, duration: 50000 });
  assert.equal(ok.extra.video, undefined, 'no video for a passed test');
  assert.deepEqual(ok.extra.perf.launches, [{ activity: 'MainActivity', ms: 2100 }]);
  assert.equal(ok.extra.perf.memoryPssKb, 300000);
  assert.equal(ok.extra.api.length, 1);
  assert.equal(ok.extra.api[0].reqHeaders.authorization, '(hidden)');
  assert.ok(fs.existsSync(path.join(runDir, ok.extra.api[0].bodyFile)));
  assert.ok(fs.existsSync(path.join(runDir, ok.extra.logcatFile)));
  assert.equal(ok.extra.logcat.errorCount, 1);
  assert.ok(ok.extra.warnings.some((w) => /logged 1 error line/.test(w.message)));
  assert.ok(ok.extra.warnings.some((w) => /^Slow test: 50\.0 s \(limit 45 s, test\/budgets\.json\)\.$/.test(w.message)));
  assert.deepEqual(ok.tail, []);
  await dev.beforeTest();
  queue = ['11-13 10:00:03.000  4321  4321 E ReactNativeJS: TypeError: crash soon'];
  const bad = await dev.afterTest({ title: 'SMK-06 [P0] settings' }, { passed: false, duration: 1000 });
  assert.match(bad.extra.video, /^videos\/0-0-002-SMK-06/);
  assert.equal(bad.tail.length, 1, 'eGenome\'s "Device log" lines are kept for failed tests');
  adb.setAdbRunner(null);
});

// ------------------------------------------------------------------ builder and deliverables
test('build: run.json keeps eGenome\'s format (deliverables), the page data is written, a snapshot copies everything', () => {
  const root = tmp();
  const dir = writeRun(root, '20261030-110013', { finishedAt: Date.UTC(2026, 9, 30, 5, 6), exitCode: 0, recorder: 1, app: { application_id: 'com.egenome.app', version_name: '2.4.0', build_id: '2.4.0-b7e9d0f1a2' } }, [
    { id: '0-0-001', index: 1, type: 'test', title: 'SMK-01 [P0] intro', suite: 'Smoke', file: 'x', status: 'passed', start: Date.UTC(2026, 9, 30, 5, 1), durationMs: 9000, steps: [step(1, 'Wait')], extra: { warnings: [], logcatFile: 'logcat/a.txt', logcat: { errors: [], warnings: [], errorCount: 0, warningCount: 0 }, perf: { launches: [{ activity: 'MainActivity', ms: 1500 }], memoryPssKb: 200000 }, api: [] } },
  ]);
  for (const d of ['logcat', 'network', 'videos', 'screenshots']) { fs.mkdirSync(path.join(dir, d), { recursive: true }); fs.writeFileSync(path.join(dir, d, 'a.txt'), 'x'); }
  const { runs } = buildIndex(root, { rebuildRuns: true, projectName: 'eGenome.ai App Tests' });
  assert.equal(runs.length, 1);
  const legacy = JSON.parse(fs.readFileSync(path.join(dir, 'run.json'), 'utf8'));
  assert.equal(legacy.status, 'passed');
  assert.equal(legacy.totals.passed, 1);
  assert.equal(legacy.tests[0].steps[0].title, 'Wait', 'the deliverables read eGenome\'s steps from run.json');
  const w = {};
  new Function('window', fs.readFileSync(path.join(root, 'data', 'index.js'), 'utf8'))(w);
  assert.equal(w.DASH_INDEX.project, 'eGenome.ai App Tests');
  assert.equal(w.DASH_INDEX.runs[0].apk.build_id, '2.4.0-b7e9d0f1a2');
  assert.ok(fs.existsSync(path.join(root, 'data', 'codes.js')));
  assert.ok(fs.existsSync(path.join(root, 'index.html')));
  const out = tmp();
  assert.deepEqual(exportSnapshot(root, out, { count: 5 }), ['20261030-110013']);
  for (const d of ['logcat', 'network', 'videos', 'screenshots', 'workers']) assert.ok(fs.existsSync(path.join(out, 'runs', '20261030-110013', d)), d);
  assert.ok(fs.existsSync(path.join(out, 'data', 'runs', '20261030-110013.js')));
});

test('a worker that ends before any test: the reason comes from adb', async () => {
  const root = process.env.DASHBOARD_DIR;
  const cases = [
    [null, /adb could not be run on this computer/],
    ['List of devices attached\n\n', /No emulator or phone was connected \(adb sees no device\)/],
    ['List of devices attached\nemulator-5556\tdevice\n', /The device in DEVICE_UDID \(emulator-5554\) is not connected; adb sees: emulator-5556/],
    ['List of devices attached\nemulator-5554\tdevice\n', /A device is connected \(emulator-5554\), so the session failed for another reason/],
  ];
  process.env.DEVICE_UDID = 'emulator-5554';
  for (const [i, [out, re]] of cases.entries()) {
    const id = `W${i}`;
    writeRun(root, id, {}, []);
    fs.rmSync(path.join(root, 'runs', id, 'workers'), { recursive: true });
    process.env.DASHBOARD_RUN_ID = id;
    adb.setAdbRunner((a) => (a[0] === 'devices' ? out : null));
    await createHooks().onWorkerEnd('0-0', 1);
    const meta = JSON.parse(fs.readFileSync(path.join(root, 'runs', id, 'meta.json'), 'utf8'));
    assert.match(meta.workerFailures[0].reason, re);
  }
  delete process.env.DASHBOARD_RUN_ID;
  delete process.env.DEVICE_UDID;
  adb.setAdbRunner(null);
});

test('a test that skips itself (this.skip()) is skipped, also in runs recorded before the fix', () => {
  const root = tmp();
  writeRun(root, 'S', { finishedAt: 2, exitCode: 1 }, [
    { id: '0-0-001', index: 1, type: 'test', title: 'SMK-04 [P0] Premium plan', suite: 'Smoke', file: 'x', status: 'failed', start: 1, durationMs: 300, steps: [] },
    { id: '0-0-002', index: 2, type: 'test', title: 'SMK-05 [P0] Reports', suite: 'Smoke', file: 'x', status: 'failed', start: 2, durationMs: 300, error: { message: 'Reports did not open' }, steps: [] },
  ]);
  assert.deepEqual(loadEgRun(path.join(root, 'runs'), 'S').tests.map((t) => t.state), ['skipped', 'failed']);
});

test('known log lines in test/triage.json are listed but not counted as app errors', async () => {
  const { explainAppErrors, testStatus } = await import('@apptest/toolkit/dashboard/analysis.mjs');
  const triage = JSON.parse(fs.readFileSync(new URL('../../triage.json', import.meta.url), 'utf8'));
  const t = {
    state: 'passed',
    warnings: [{ source: 'app', message: 'The app logged 4 error line(s) during this test.' }],
    logcat: { errorCount: 4, errors: [
      'E adservices: Failed binding to measurement service: com.android.adservices.shared.common.exception.ServiceUnavailableException: Service is not available.',
      'E unknown:SurfaceMountingManager: Stopping surface [11]',
      'E unknown:ReactNative: Tried to remove non-existent frame callback',
      'E com.egenome.app: No package ID 6b found for resource ID 0x6b0b0013.',
    ] },
  };
  explainAppErrors(t, triage.knownApi, triage.knownLogLines);
  assert.equal(t.logcat.unexplained, 0);
  assert.equal(t.logcat.explained.known, 4);
  assert.equal(testStatus(t), 'passed');
  t.logcat.errors.push('E ReactNativeJS: TypeError: undefined is not an object');
  t.logcat.errorCount = 5;
  t.warnings = [{ source: 'app', message: 'The app logged 5 error line(s) during this test.' }];
  explainAppErrors(t, triage.knownApi, triage.knownLogLines);
  assert.equal(t.logcat.unexplained, 1);
  assert.match(t.warnings[0].message, /1 error line\(s\) during this test that are not explained \(4 from known issues in test\/triage\.json are not counted\)/);
});

test('API calls are placed in the step (and screen) that was running when the app made them', async () => {
  const { clockOffsetMs, setAdbRunner } = await import('@apptest/toolkit/dashboard/lib/device.js');
  // The device clock is India time, 1.5 s ahead of this computer's clock
  const host = Date.UTC(2026, 10, 13, 10, 0, 0);
  const realNow = Date.now;
  Date.now = () => host;
  setAdbRunner((args) => (args[0] === 'date' ? '11-13 15:30:01.500000000\n' : ''));
  const offset = await clockOffsetMs('emulator-5554');
  setAdbRunner(null);
  Date.now = realNow;
  const t = {
    startMs: host, clockOffsetMs: offset,
    stepsDetail: [
      { n: 1, title: 'Login · Request OTP', start: 0, durationMs: 4000 },
      { n: 2, title: 'Otp · Verify layout', start: 4500, durationMs: 1000, layout: { spec: 'Otp' } },
    ],
    // device times: 1.5 s ahead, so 15:30:03.500 is 2.0 s into the test
    api: [
      { at: '11-13 15:30:03.500', endpoint: 'POST /v1/otp/send' },
      { at: '11-13 15:30:05.800', endpoint: 'GET /v1/config' }, // 4.3 s: between step 1 and 2
      { at: '11-13 15:30:06.400', endpoint: 'GET /v1/me' }, // 4.9 s: in step 2
      { at: '11-13 15:30:00.900', endpoint: 'GET /v1/flags' }, // before the test started
    ],
  };
  placeCalls(t);
  assert.deepEqual(t.api.map((c) => [c.step.n, c.step.screen, c.step.when]), [[1, 'Login', 'during'], [1, 'Login', 'after'], [2, 'Otp', 'during'], [1, 'Login', 'before']]);
  // runs recorded without the device clock: the calls say why they have no step
  const old = { startMs: host, clockOffsetMs: null, stepsDetail: t.stepsDetail, api: [{ at: '11-13 15:30:03.500' }] };
  placeCalls(old);
  assert.equal(old.api[0].step, undefined);
  assert.match(old.api[0].stepNote, /did not record the device clock/);
});
