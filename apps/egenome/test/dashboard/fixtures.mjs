#!/usr/bin/env node
// Demo runs for the dashboard's own tests and for `npm run dashboard:demo` (no device, no emulator).
// Uses the REAL eGenome recorder (recorder.js), device recorder (device-recorder.js) and builder with a pretend
// device: a fake WebdriverIO `driver` (screenshots, Android log, screen recording) and canned adb answers.
//
//   node test/dashboard/fixtures.mjs [outDir]      default: reports-demo/
//
// Scenarios (oldest first): three passing smoke runs on app 2.3.0 (layout warnings, trends), a regression run with a
// failed setup hook and skipped tests, then app 2.4.0 (a debug build that logs its API calls): a regression, a flaky
// test, a layout failure, an app crash, WebView crashing elsewhere on the device, API calls with a server error, a
// response-format problem and a known API problem, a slow app start and memory over budget, and finally a run whose
// session could not start because no device was connected.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..', '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'reports-demo'));
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// Settings for the code under test: this folder, and copies of the project's triage / budgets / format files
process.env.DASHBOARD_DIR = OUT;
process.env.DASHBOARD_KEEP_RUNS = '30';
process.env.DASHBOARD_SCREENSHOTS = 'all';
process.env.DASHBOARD_VIDEO = 'failed';
process.env.DASHBOARD_PERF = 'on';
process.env.DASHBOARD_LOGCAT = 'true';
process.env.DASHBOARD_SLOW_MS = '';
const triage = JSON.parse(fs.readFileSync(path.join(ROOT, 'test', 'triage.json'), 'utf8'));
triage.knownApi = [{ match: 'analytics.staging.example', reason: 'The staging analytics endpoint refuses test devices (403). Not caused by the tests.' }];
triage.quarantine = [{ test: 'SMK-06', reason: 'Settings screen loads slowly on the CI emulator', owner: 'QA', until: '2026-11-01', ticket: '', added: '2026-10-20' }];
const files = {
  DASHBOARD_TRIAGE_FILE: ['.fixture-triage.json', JSON.stringify(triage, null, 2)],
  DASHBOARD_BUDGETS_FILE: ['.fixture-budgets.json', fs.readFileSync(path.join(ROOT, 'test', 'budgets.json'), 'utf8')],
  DASHBOARD_FORMATS_FILE: ['.fixture-api-formats.json', JSON.stringify({ rules: [{ name: 'Reports list', match: '/v1/reports', status: 200, fields: { data: 'array', 'data[].id': 'string', 'data[].title': 'string', 'data[].paid': 'boolean?' }, nonEmpty: ['data'] }] }, null, 2)],
};
for (const [env, [name, text]] of Object.entries(files)) { fs.writeFileSync(path.join(OUT, name), text); process.env[env] = path.join(OUT, name); }

const rec = await import('../support/dashboard/recorder.js');
const dev = await import('../support/dashboard/device-recorder.js');
const adb = await import('../support/dashboard/lib/device.js');
const { buildRun, buildIndex } = await import('../support/dashboard/builder.js');

// ------------------------------------------------------------------ a controllable clock (realistic durations)
const BASE = Date.UTC(2026, 10, 10, 3, 30, 0); // 10 Nov 2026 09:00 India time
let clock = BASE;
Date.now = () => clock;
const tick = (ms) => { clock += ms; };
const pad = (n, w = 2) => String(n).padStart(w, '0');
// Android log time stamps (the emulator's clock, local time) for the current clock
const ts = () => { const d = new Date(clock + 5.5 * 3600 * 1000); return `${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}.${pad(d.getUTCMilliseconds(), 3)}`; };

// ------------------------------------------------------------------ the pretend device
const PKG = 'com.egenome.app';
const PID = '4321';
let logs = [];
let failShot = false;
let mem = 240000;
let frames = { total: 400, janky: 40 };
const L = (tag, msg, level = 'I', pid = PID, tid = '4330') => logs.push(`${ts()}  ${pid}  ${tid} ${level} ${tag}: ${msg}`);
const shot = (f) => fs.copyFileSync(path.join(here, failShot ? 'fixture-screen-error.png' : 'fixture-screen.png'), f);
globalThis.driver = {
  capabilities: {},
  getLogs: async () => { const l = logs; logs = []; return l.map((message) => ({ timestamp: clock, level: 'ALL', message })); },
  saveScreenshot: async (f) => shot(f),
  startRecordingScreen: async () => {},
  stopRecordingScreen: async () => Buffer.from('not-a-real-video').toString('base64'),
};
globalThis.browser = globalThis.driver;
let app = { version: '2.3.0', code: '230', sha: 'a3f1c2d4e5'.padEnd(64, '0') };
let deviceConnected = true;
adb.setAdbRunner((args) => {
  const a = args.join(' ');
  if (a === 'devices') return deviceConnected ? 'List of devices attached\nemulator-5554\tdevice\n' : 'List of devices attached\n\n';
  if (!deviceConnected) return null;
  if (a === `dumpsys package ${PKG}`) return `Packages:\n  Package [${PKG}]\n    versionCode=${app.code} minSdk=24\n    versionName=${app.version}\n    firstInstallTime=2026-10-01 10:00:00\n    lastUpdateTime=2026-11-${app.version === '2.3.0' ? '05' : '11'} 18:20:00\n`;
  if (a === `pm path ${PKG}`) return `package:/data/app/~~x/${PKG}-1/base.apk\n`;
  if (a.startsWith('sha256sum')) return `${app.sha}  /data/app/~~x/${PKG}-1/base.apk\n`;
  if (a === `pidof ${PKG}`) return `${PID}\n`;
  if (a === `dumpsys gfxinfo ${PKG} reset`) return '';
  if (a === `dumpsys gfxinfo ${PKG}`) return `Total frames rendered: ${frames.total}\nJanky frames: ${frames.janky} (${(frames.janky / frames.total * 100).toFixed(2)}%)\n90th percentile: 14ms\n`;
  if (a === `dumpsys meminfo ${PKG}`) return `** MEMINFO in pid ${PID} [${PKG}] **\n           TOTAL PSS:   ${mem}            TOTAL RSS:   ${mem + 40000}\n`;
  if (a.startsWith('date ')) return `${ts()}000000\n`; // the device's clock (India time), as `date +%m-%d %H:%M:%S.%N` prints it
  if (a === 'getprop ro.kernel.qemu') return '1\n';
  if (a === 'getprop ro.product.model') return 'sdk_gphone64_x86_64\n';
  if (a === 'getprop ro.build.fingerprint') return 'google/sdk_gphone64_x86_64/emu64xa:15/AE3A.240806.036/12592187:userdebug/dev-keys\n';
  if (a === 'getprop ro.build.version.security_patch') return '2026-10-05\n';
  if (a === 'getprop ro.product.cpu.abi') return 'x86_64\n';
  if (a === 'dumpsys package com.google.android.webview') return 'versionName=131.0.6778.135\n';
  return '';
});

// ------------------------------------------------------------------ the app's own HTTP log (OkHttp, level BODY)
const HOST = 'https://staging.api.example';
function call(tid, method, url, status, ms, body = '', ctype = 'application/json; charset=utf-8') {
  L('OkHttp', `--> ${method} ${url}`, 'I', PID, tid);
  L('OkHttp', 'Authorization: Bearer secret-token', 'I', PID, tid);
  L('OkHttp', `--> END ${method}`, 'I', PID, tid);
  if (status === 'OPEN') return;
  tick(ms);
  L('OkHttp', `<-- ${status} ${url} (${ms}ms)`, 'I', PID, tid);
  L('OkHttp', `content-type: ${ctype}`, 'I', PID, tid);
  L('OkHttp', '', 'I', PID, tid);
  for (let k = 0; k < body.length; k += 4000) L('OkHttp', body.slice(k, k + 4000), 'I', PID, tid);
  L('OkHttp', `<-- END HTTP (${ms + 3}ms, ${body.length}-byte body)`, 'I', PID, tid);
}

// ------------------------------------------------------------------ one run, the way the hooks record it
const LAY_ELEMENTS = [
  { name: 'profileSwitcher', status: 'passed', actual: { x: 0.04, y: 0.06, w: 0.3, h: 0.05 } },
  { name: 'weightCard', status: 'failed', actual: { x: 0.05, y: 0.22, w: 0.42, h: 0.12 }, expected: { x: 0.05, y: 0.16, w: 0.42, h: 0.12 } },
  { name: 'skipBtn', status: 'warning', actual: { x: 0.8, y: 0.05, w: 0.15, h: 0.04 } },
];
function layout(spec, failed) {
  const results = [
    { type: 'presence', target: 'profileSwitcher', status: 'passed' },
    { type: 'box', target: 'weightCard', status: failed ? 'failed' : 'passed', expected: 'y 16.3% ±2.0%', actual: failed ? 'y 21.7%' : 'y 16.5%', message: failed ? 'weightCard moved/resized: y 21.7% (expected 16.3% ±2.0%)' : '' },
    { type: 'minTap', target: 'skipBtn', status: 'warning', expected: '≥ 48dp', actual: '46dp', message: 'skipBtn tap target is 46dp (Android guideline: 48dp)' },
  ];
  return { spec, reviewed: true, mode: 'on', aspectMatches: true, screen: { w: 1080, h: 2400 }, baseline: { w: 1080, h: 2400 }, summary: { total: 60, passed: 60 - (failed ? 2 : 0) - 1, failed: failed ? 2 : 0, warnings: 1, skipped: 0 }, results, elements: LAY_ELEMENTS.map((e) => (failed || e.status !== 'failed' ? e : { ...e, status: 'passed' })) };
}

async function step(title, call, ms, { fail, layoutOf, failLayout, during } = {}) {
  return rec.step(title, async () => {
    // API calls the app makes while this step runs (half-way through it)
    if (during) { tick(Math.round(ms / 2)); during(); tick(ms - Math.round(ms / 2)); } else tick(ms);
    if (layoutOf) {
      const L2 = layout(layoutOf, failLayout);
      rec.annotate({ layout: L2, warnings: L2.results.filter((r) => r.status === 'warning').map((r) => r.message) });
      if (failLayout) throw new Error(`Layout "${layoutOf}": 2 of 60 checks failed\n  - weightCard moved/resized: y 21.7% (expected 16.3% ±2.0%)`);
    }
    if (fail) { failShot = true; throw Object.assign(new Error(fail), { stack: `Error: ${fail}\n    at ReportsPage.waitForOpen (file:///${ROOT.replace(/\\/g, '/').replace(/^\//, '')}/test/pageobjects/BasePage.js:106:5)` }); }
  }, { kind: 'action', call }).catch((e) => { throw e; });
}

const SMOKE = [
  ['SMK-01 [P0] intro and login screen', [['Onboarding · Wait for open', 'OnboardingPage.waitForOpen(30000)', 2100], ['Onboarding · Verify layout', 'OnboardingPage.verifyLayout()', 1400, { layoutOf: 'Onboarding' }], ['Onboarding · Skip', 'OnboardingPage.skip()', 900]]],
  ['SMK-02 [P0] login with mobile number and OTP', [['Login · Enter phone', 'LoginPage.enterPhone("1234567890")', 1800], ['Login · Send OTP', 'LoginPage.sendOtp()', 2500], ['Otp · Enter OTP', 'OtpPage.enterOtp("••••••")', 1600], ['Home · Wait for open', 'HomePage.waitForOpen()', 4200]]],
  ['SMK-03 [P0] Home loads, with the profile switcher and Monthly Progress', [['Home · Wait for open', 'HomePage.waitForOpen()', 1200], ['Home · Verify layout', 'HomePage.verifyLayout()', 2100, { layoutOf: 'Home' }], ['Home · Open monthly progress', 'HomePage.openMonthlyProgress()', 1500]]],
  ['SMK-04 [P0] Premium plan screen opens from the payment banner', [['Home · Tap payment banner', 'HomePage.tapPaymentBanner()', 1300], ['Premium · Wait for open', 'PremiumPage.waitForOpen()', 3600]]],
  ['SMK-05 [P0] Report tab lists reports and one report opens', [['Bottom nav · Open reports', 'BottomNav.open("Report")', 1100], ['Reports · Wait for open', 'ReportsPage.waitForOpen()', 2400], ['Reports · Open first report', 'ReportsPage.openFirst()', 2000]]],
  ['SMK-06 [P0] Settings, Profile and Edit Profile open', [['Bottom nav · Open settings', 'BottomNav.open("Settings")', 1000], ['Settings · Open profile', 'SettingsPage.openProfile()', 1700], ['Profile · Edit', 'ProfilePage.edit()', 1400]]],
];
const REGRESSION = [
  ['LGN-01 [P0] intro is shown on first launch and can be skipped', [['App · Clear app data and relaunch', 'freshInstallState()', 4000], ['Onboarding · Skip', 'OnboardingPage.skip()', 900]]],
  ['LGN-02 [P0] login screen shows the expected text and layout', [['Login · Verify layout', 'LoginPage.verifyLayout()', 1500, { layoutOf: 'Login' }]]],
  ['LGN-03 [P1] an empty phone number does not send an OTP', [['Login · Send OTP', 'LoginPage.sendOtp()', 1200]]],
];

const COMMIT_1 = 'c0ffee1234567890abcdef1234567890abcdef12';
const plan = [
  { suite: 'smoke', tests: SMOKE },
  { suite: 'smoke', tests: SMOKE },
  { suite: 'smoke', tests: SMOKE },
  { suite: 'regression', tests: REGRESSION, failedHook: true },
  { suite: 'smoke', tests: SMOKE, build: 2, fail: { 4: 'ReportsPage did not open within 20000ms' }, failLayout: 2, api: true },
  { suite: 'smoke', tests: SMOKE, build: 2, fail: { 4: 'ReportsPage did not open within 20000ms', 5: 'ProfilePage did not open within 10000ms' }, api: true },
  { suite: 'smoke', tests: SMOKE, build: 2, fail: { 4: 'ReportsPage did not open within 20000ms' }, crash: 3, api: true, apiProblems: true, slow: true },
  { suite: 'smoke', tests: [], noDevice: true },
];

const meta = {};
for (const [n, p] of plan.entries()) {
  clock = BASE + n * 3600_000;
  app = p.build === 2 ? { version: '2.4.0', code: '240', sha: 'b7e9d0f1a2'.padEnd(64, '1') } : { version: '2.3.0', code: '230', sha: 'a3f1c2d4e5'.padEnd(64, '0') };
  deviceConnected = !p.noDevice;
  const d = new Date(clock + 5.5 * 3600 * 1000);
  const id = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
  const runDir = path.join(OUT, 'runs', id);
  fs.mkdirSync(runDir, { recursive: true });
  const m = {
    id, startedAt: clock, environment: 'staging', trigger: 'local',
    host: { os: 'Windows_NT 10.0.26200', node: 'v24.22.1', user: 'tester', machine: 'test-pc' },
    specPattern: [`./test/specs/${p.suite}/**/*.js`], args: `run ./wdio.conf.js --suite ${p.suite}`,
    recorder: 1, app: await adb.appInfo('emulator-5554', PKG),
    details: { trigger: 'manual (local)', startedBy: 'tester', ci: null, project: { branch: 'main', commit: COMMIT_1, commitMessage: 'Smoke and regression suites', dirty: false, remote: 'https://github.com/example/egenome-app-tests.git' }, host: { name: 'test-pc', os: 'Windows 11', arch: 'x64' }, timeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, tools: { node: 'v24.22.1', webdriverio: '10.1.0', appium: '3.9.0', uiautomator2Driver: '8.7.2' } },
    api: { logcat: true },
  };
  fs.writeFileSync(path.join(runDir, 'meta.json'), JSON.stringify(m, null, 1));
  meta[id] = m;

  if (p.noDevice) {
    // The worker ends at once: no device. onWorkerEnd checks adb and writes the reason (same code path as hooks.js)
    const { createHooks } = await import('../support/dashboard/hooks.js');
    process.env.DASHBOARD_RUN_ID = id;
    tick(15000);
    await createHooks().onWorkerEnd('0-0', 1);
    const mm = JSON.parse(fs.readFileSync(path.join(runDir, 'meta.json'), 'utf8'));
    Object.assign(mm, { finishedAt: clock, exitCode: 1 });
    fs.writeFileSync(path.join(runDir, 'meta.json'), JSON.stringify(mm, null, 1));
    delete process.env.DASHBOARD_RUN_ID;
    continue;
  }

  const device = { name: 'emulator-5554', udid: 'emulator-5554', model: 'sdk_gphone64_x86_64', manufacturer: 'Google', platform: 'Android', platformVersion: '15', apiLevel: 35, screen: '1080x2400', app: PKG, details: await adb.deviceDetails('emulator-5554'), clockOffsetMs: await adb.clockOffsetMs('emulator-5554') };
  rec.init({ runId: id, cid: '0-0', specs: [path.join(ROOT, 'test', 'specs', p.suite, `${p.suite}.e2e.js`)], device });
  dev.initDevice({ runDir, cid: '0-0', udid: 'emulator-5554', pkg: PKG });
  mem = 240000 + n * 9000 + (p.slow ? 160000 : 0);
  // The app starts before the first test (its launch time goes to the first test)
  L('ActivityManager', `Start proc ${PID}:${PKG}/u0a190 for next-top-activity`, 'I', '555', '570');
  tick(p.slow ? 4600 : 2000 + n * 40);
  L('ActivityTaskManager', `Displayed ${PKG}/.MainActivity for user 0: +${p.slow ? '4s600' : `2s${pad(n * 40, 3)}`}ms`, 'I', '555', '570');

  if (p.failedHook) {
    rec.startHook({ title: '"before all" hook', suite: 'Login', file: path.join(ROOT, 'test', 'specs', 'regression', '01-login.e2e.js') });
    try { await step('App · Clear app data and relaunch', 'freshInstallState()', 3000, { fail: 'OnboardingPage did not open within 30000ms' }); } catch (e) { await rec.end({ passed: false, error: e }); }
    failShot = false;
    rec.recordSkipped(p.tests.map(([title]) => ({ suite: 'Login', title, file: 'test/specs/regression/01-login.e2e.js' })));
  } else {
    for (const [i, [title, steps]] of p.tests.entries()) {
      await dev.beforeTest();
      rec.startTest({ title, suite: 'Smoke', file: path.join(ROOT, 'test', 'specs', p.suite, `${p.suite}.e2e.js`) });
      const t0 = clock;
      let error = null;
      frames = { total: 420, janky: p.slow ? 160 : 30 + n };
      try {
        // The app's API calls, made while a step runs: config + analytics on the first screen, the reports list
        // (and, in the bad run, a report summary) while the Reports screen opens
        const during = {};
        if (p.api) {
          during['0:0'] = () => {
            call('4331', 'GET', `${HOST}/v1/config`, 200, 180 + n * 10, JSON.stringify({ features: { premium: true }, minAppVersion: '2.0.0' }));
            call('4332', 'POST', `https://analytics.staging.example/v1/events`, 403, 90, '<html><head><title>Forbidden</title></head><body><p>Test devices are not accepted</p></body></html>', 'text/html');
          };
          during['4:1'] = () => {
            const bad = p.apiProblems;
            call('4333', 'GET', `${HOST}/v1/reports?profile=me`, 200, bad ? 2600 : 420, JSON.stringify({ data: bad ? [{ id: 'r1', title: 12345, paid: true }] : [{ id: 'r1', title: 'CVD Assessment Health Report', paid: true }, { id: 'r2', title: 'Diabetes Risk Assessment', paid: false }] }));
            if (bad) call('4334', 'GET', `${HOST}/v1/reports/r1/summary`, 500, 900, JSON.stringify({ error: { code: 'internal', message: 'Report service unavailable' } }));
          };
        }
        for (const [k, [st, c, ms, opt = {}]] of steps.entries()) {
          const failHere = p.fail && p.fail[i] && k === steps.length - 1;
          await step(st, c, ms, { ...opt, during: during[`${i}:${k}`], fail: failHere ? p.fail[i] : null, failLayout: opt.layoutOf && p.failLayout === i });
        }
        if (p.crash === i) {
          L('AndroidRuntime', 'FATAL EXCEPTION: main', 'E');
          L('AndroidRuntime', `Process: ${PKG}, PID: ${PID}`, 'E');
          L('AndroidRuntime', 'com.facebook.react.common.JavascriptException: TypeError: undefined is not an object (evaluating \'plan.price\')', 'E');
          L('ActivityManager', `Process ${PKG} (pid ${PID}) has died: fg TOP`, 'I', '555', '570');
          throw new Error('PremiumPage did not open within 10000ms');
        }
        if (i === 2) L('ReactNativeJS', 'Warning: Each child in a list should have a unique "key" prop.', 'W');
        if (p.slow && i === 1) {
          L('AndroidRuntime', 'FATAL EXCEPTION: main', 'E', '9001', '9001');
          L('AndroidRuntime', 'Process: com.google.android.webview:sandboxed_process0:org.chromium.content.app.SandboxedProcessService0:0, PID: 9001', 'E', '9001', '9001');
          L('AndroidRuntime', "java.lang.NullPointerException: Attempt to invoke virtual method 'android.os.Bundle android.os.Bundle.getBundle(java.lang.String)' on a null object reference", 'E', '9001', '9001');
        }
        if (i === 3 && p.api) L('ReactNativeJS', 'Error: Network request failed while loading plans', 'E');
      } catch (e) { error = e; }
      if (p.slow && i === 2) tick(50000); // a slow test (over its 45 s budget)
      const passed = !error;
      const { extra, tail } = await dev.afterTest({ title }, { passed, duration: clock - t0 });
      await rec.end({ passed, error, logcat: tail, extra });
      const last = rec.lastEntryRef(); if (last) dev.rememberLast(last.file, last.index);
      failShot = false;
      tick(800);
    }
    if (p.api) call('4335', 'GET', `${HOST}/v1/notifications`, 'OPEN', 0); // still waiting when the session ends
    await dev.finishSession();
  }
  const mm = JSON.parse(fs.readFileSync(path.join(runDir, 'meta.json'), 'utf8'));
  const anyFail = p.failedHook || (p.fail && Object.keys(p.fail).length) || p.crash != null;
  Object.assign(mm, { finishedAt: clock, exitCode: anyFail ? 1 : 0 });
  fs.writeFileSync(path.join(runDir, 'meta.json'), JSON.stringify(mm, null, 1));
  buildRun(OUT, id);
}

// ------------------------------------------------------------------ unit test runs ("Unit tests" tab)
// The sample tests in unit-sample/ run through the real reporter (test/support/dashboard/unit-report.mjs): once
// passing, once with two failures (an assertion with expected / actual, a thrown error) and coverage under its limit.
{
  const { spawnSync } = await import('node:child_process');
  const sample = path.join(here, 'unit-sample');
  fs.rmSync(path.join(OUT, 'unit'), { recursive: true, force: true });
  for (const [id, extra, fail] of [['20261110-100500', [], false], ['20261110-150500', ['--experimental-test-coverage', '--test-coverage-lines=90', '--test-coverage-include=**/demo-lib.mjs'], true]]) {
    const r = spawnSync(process.execPath, ['--test', ...extra, '--test-reporter=../../support/dashboard/unit-report.mjs', '--test-reporter-destination=stdout', 'demo.sample.mjs'], {
      cwd: sample, encoding: 'utf8', timeout: 60000,
      env: { ...process.env, DASHBOARD_DIR: OUT, DASHBOARD_UNIT_ID: id, DASHBOARD_UNIT_NO_BUILD: '1', DEMO_FAIL: fail ? '1' : '', npm_lifecycle_event: 'test:unit' },
    });
    // (relative reporter path: a full Windows path "C:\\..." would be read as a URL and not load)
    if (!fs.existsSync(path.join(OUT, 'unit', `${id}.json`))) throw new Error(`demo unit run ${id} was not saved: ${r.stderr || r.stdout}`);
  }
}

const { runs, file } = buildIndex(OUT, { keepRuns: 30, rebuildRuns: true });
console.log(`Demo dashboard: ${runs.length} runs in ${OUT}`);
console.log(`  ${file}`);
