// WebdriverIO hooks that feed the dashboard. Wired in wdio.conf.js:
//   import { withDashboard } from '@apptest/toolkit/dashboard/hooks.js';
//   export const config = withDashboard(baseConfig);
// Every hook is defensive: a reporting problem must never fail a test.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { options } from './options.js';
import * as rec from './recorder.js';
import { buildRun, buildIndex, printSummary } from './builder.js';
import * as dev from './device-recorder.js';
import { runDetails } from './lib/run-details.js';
import { appInfo, clockOffsetMs, deviceDetails, listDevices } from './lib/device.js';
import { PROJECT_ROOT } from './options.js';
import { APP_PACKAGE } from './egenome-run.js';

const RECORDER_VERSION = 1; // 1 = app log, API calls, performance, video, app version (13 Nov 2026)

const CURRENT = () => path.join(options.reportsDir, '.current-run');
const safe = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (e) {
    if (options.verbose) console.warn('[dashboard]', e);
  }
};

const pad = (n) => String(n).padStart(2, '0');
function newRunId() {
  const d = new Date();
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function runIdForWorker() {
  if (process.env.DASHBOARD_RUN_ID) return process.env.DASHBOARD_RUN_ID;
  try { return fs.readFileSync(CURRENT(), 'utf8').trim(); } catch { return null; }
}

function deviceFrom(caps = {}) {
  const g = (k) => caps[k] ?? caps[`appium:${k}`];
  return {
    name: g('deviceName'),
    udid: g('udid'),
    model: g('deviceModel'),
    manufacturer: g('deviceManufacturer'),
    platform: caps.platformName,
    platformVersion: g('platformVersion'),
    apiLevel: g('deviceApiLevel'),
    screen: g('deviceScreenSize'),
    app: g('appPackage'),
    appVersion: process.env.APP_VERSION || undefined,
  };
}

/** describe/it titles from a spec file, used to list tests mocha skipped. */
function specTests(file) {
  try {
    const src = fs.readFileSync(file, 'utf8');
    const out = [];
    let suite = '';
    const re = /\b(describe|it)(?:\.only|\.skip)?\(\s*(['"`])((?:\\.|(?!\2).)*)\2/g;
    for (let m; (m = re.exec(src)); ) {
      if (m[1] === 'describe') suite = m[3];
      else out.push({ suite, title: m[3], file: path.relative(process.cwd(), file).split(path.sep).join('/') });
    }
    return out;
  } catch {
    return [];
  }
}

const hookTitle = (hookName) => {
  const m = String(hookName || '').match(/"((?:before|after) (?:all|each))"/);
  return m ? `${m[1][0].toUpperCase()}${m[1].slice(1)} hook` : String(hookName || 'Hook');
};

export function createHooks() {
  return {
    // ---------------- launcher process
    onPrepare: safe(async (config) => {
      const id = newRunId();
      process.env.DASHBOARD_RUN_ID = id;
      const runDir = path.join(options.reportsDir, 'runs', id);
      fs.mkdirSync(runDir, { recursive: true });
      fs.writeFileSync(CURRENT(), id);
      const startedAt = Date.now();
      // The app on the device: version and a fingerprint of the installed APK (tells app changes from test changes)
      const app = await appInfo(options.udid, APP_PACKAGE);
      let details = null;
      try { details = runDetails(PROJECT_ROOT); } catch {}
      fs.writeFileSync(
        path.join(runDir, 'meta.json'),
        JSON.stringify({
          id,
          startedAt,
          environment: options.environment,
          trigger: process.env.CI ? 'ci' : 'local',
          host: { os: `${os.type()} ${os.release()}`, node: process.version, user: os.userInfo().username, machine: os.hostname() },
          specPattern: config.specs,
          args: process.argv.slice(2).join(' '),
          recorder: RECORDER_VERSION,
          app,
          details,
          api: { logcat: options.logcat },
        }, null, 1)
      );
      console.log(app.version_name ? `  App ${APP_PACKAGE} ${app.version_name} (${app.version_code || '?'}) · build ${app.build_id}` : `  App version not read: ${app.reason || 'unknown reason'}`);
      buildIndex(options.reportsDir, { keepRuns: options.keepRuns, projectName: options.projectName });
      console.log(`\n  Dashboard run ${id} -> ${path.relative(process.cwd(), path.join(options.reportsDir, 'index.html'))}\n`);
    }),

    // A worker that ended without running any test: say why (no device is the usual reason)
    onWorkerEnd: safe(async (cid, exitCode) => {
      const id = process.env.DASHBOARD_RUN_ID || runIdForWorker();
      if (!id || !exitCode) return;
      const runDir = path.join(options.reportsDir, 'runs', id);
      const w = (() => { try { return JSON.parse(fs.readFileSync(path.join(runDir, 'workers', `${cid}.json`), 'utf8')); } catch { return null; } })();
      if (w && (w.entries || []).length) return;
      const list = await listDevices();
      const attached = list ? list.split(/\r?\n/).slice(1).filter((l) => /\tdevice$/.test(l)).map((l) => l.split('\t')[0]) : null;
      const reason = attached === null
        ? 'adb could not be run on this computer (is the Android SDK platform-tools folder on PATH?), so the device could not be checked.'
        : !attached.length ? 'No emulator or phone was connected (adb sees no device). Start the emulator, wait for its home screen, and run again.'
        : options.udid && !attached.includes(options.udid) ? `The device in DEVICE_UDID (${options.udid}) is not connected; adb sees: ${attached.join(', ')}. Fix DEVICE_UDID in .env.`
        : `A device is connected (${attached.join(', ')}), so the session failed for another reason: see WebdriverIO's error in the terminal output above (often Appium not starting, or the app not installed).`;
      const metaFile = path.join(runDir, 'meta.json');
      const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
      meta.workerFailures = [...(meta.workerFailures || []), { cid, exitCode, at: Date.now(), reason }];
      fs.writeFileSync(metaFile, JSON.stringify(meta, null, 1));
    }),

    onComplete: safe(async (exitCode, config, caps, results) => {
      const id = process.env.DASHBOARD_RUN_ID || runIdForWorker();
      if (!id) return;
      const metaFile = path.join(options.reportsDir, 'runs', id, 'meta.json');
      const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
      Object.assign(meta, { finishedAt: Date.now(), exitCode, results });
      fs.writeFileSync(metaFile, JSON.stringify(meta, null, 1));
      buildRun(options.reportsDir, id);
      const { file, runs } = buildIndex(options.reportsDir, { keepRuns: options.keepRuns, projectName: options.projectName });
      const r = runs.find((x) => x.id === id);
      if (r) printSummary(r, file);
      else console.log(`\n  Dashboard: ${file}  (or: npm run dashboard)\n`);
    }),

    // ---------------- worker process
    before: safe(async (capabilities, specs) => {
      const caps = { ...capabilities, ...(driver?.capabilities || {}) };
      const device = deviceFrom(caps);
      const udid = options.udid || device.udid || '';
      device.details = await deviceDetails(udid); // emulator or phone, Android build, WebView (adb, read-only)
      device.clockOffsetMs = await clockOffsetMs(udid); // device clock vs this computer: puts API calls in their step
      const runId = runIdForWorker();
      rec.init({ runId, cid: process.env.WDIO_WORKER_ID, specs, device });
      dev.initDevice({ runDir: runId ? path.join(options.reportsDir, 'runs', runId) : null, cid: process.env.WDIO_WORKER_ID, udid, pkg: APP_PACKAGE });
    }),

    beforeHook: safe(async (test, context, hookName) => {
      rec.startHook({ title: hookTitle(hookName), suite: test?.parent || test?.title || '', file: test?.file });
    }),

    afterHook: safe(async (test, context, result = {}, hookName) => {
      await rec.end({ passed: !result.error, error: result.error });
      void hookName;
    }),

    beforeTest: safe(async (test) => {
      await dev.beforeTest();
      rec.startTest({ title: test.title, suite: test.parent, file: test.file });
    }),

    afterTest: safe(async (test, context, { error, passed, retries, duration } = {}) => {
      // this.skip() inside a test: WebdriverIO reports it as not passed, without an error
      const skipped = !passed && !error;
      let out = { extra: null, tail: [] };
      try { out = await dev.afterTest(test, { passed: passed || skipped, duration }); } catch (e) { out.extra = { warnings: [], notes: [`The dashboard could not read the device after this test: ${e.message}`] }; }
      await rec.end({ passed, skipped, error, retries, logcat: out.tail, extra: out.extra });
      const last = rec.lastEntryRef();
      if (last) dev.rememberLast(last.file, last.index);
      // Keep the dashboard current while the run is in progress (an open page refreshes within a few seconds)
      const id = runIdForWorker();
      if (id) { buildRun(options.reportsDir, id); buildIndex(options.reportsDir, { keepRuns: options.keepRuns, projectName: options.projectName }); }
    }),

    // The test is about to close or clear the app: API calls still waiting are cut off on purpose, not lost
    beforeCommand: safe(async (commandName, args) => {
      if (commandName === 'terminateApp') await dev.appClosing('closed the app');
      else if (commandName === 'execute' && args && args[0] === 'mobile: clearApp') await dev.appClosing('cleared the app\'s data');
    }),

    afterAssertion: safe(async (params) => {
      await rec.recordAssertion(params);
    }),

    after: safe(async (result, capabilities, specs) => {
      await dev.finishSession();
      rec.recordSkipped(specs.flatMap((s) => specTests(s.startsWith('file:') ? fileURLToPath(s) : s)));
      const id = runIdForWorker();
      if (id) buildRun(options.reportsDir, id);
    }),
  };
}

/** Add the dashboard hooks to a WDIO config, keeping any hooks it already has. */
export function withDashboard(baseConfig) {
  const merged = { ...baseConfig };
  for (const [name, fn] of Object.entries(createHooks())) {
    const existing = baseConfig[name];
    merged[name] = existing ? [...[].concat(existing), fn] : fn;
  }
  return merged;
}
