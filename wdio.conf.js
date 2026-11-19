// wdio.conf.js – Instagram (Android native app) on a local emulator via Appium
import 'dotenv/config';                                   // optional .env file (credentials, device)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { RUN_ID, RUN_DIR, RUNS_DIR } from './test/helpers/run.js';   // must be first: fixes the run id
import { installPermissionGuard, denyPermissionPopupIfShown } from './test/helpers/permissions.js';
import {
  installLogging, logCommand, registerSecrets, startTest, endTest, recordHookFailure, flushSuites,
} from './test/helpers/evidence.js';
import { buildDashboard } from './tools/build-dashboard.mjs';
import { users } from './test/data/users.js';
import { fileURLToPath, pathToFileURL } from 'node:url';

const env = process.env;
const KEEP_RUNS = Number(env.KEEP_RUNS || 30);       // run history shown in the dashboard

// ---------------------------------------------------------------------------
// Shared test dashboard (the same one as the eGenome.ai tests; switch apps in its App filter).
// Its recorder lives in the eGenome.ai project; DASHBOARD_LIB points to it (default: ../eGenome.ai next to this
// project). It records every step(...) of the specs with a screenshot, the app's Android log, the device, memory and
// frames, and writes reports/index.html. Without it (folder missing, or DASHBOARD=off) the old recording below is used:
// reports/dashboard/index.html.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DASHBOARD_LIB = path.resolve(HERE, env.DASHBOARD_LIB || '../eGenome.ai/test/support/dashboard');
let shared = null;
if (env.DASHBOARD !== 'off' && fs.existsSync(path.join(DASHBOARD_LIB, 'hooks.js'))) {
  env.DASHBOARD_PROJECT_ROOT = HERE;                        // reports/, test/triage.json, test/budgets.json of THIS project
  env.DASHBOARD_APP_PACKAGE ||= 'com.instagram.android';
  env.DASHBOARD_TITLE ||= 'Instagram App Tests';
  env.DEVICE_UDID ||= env.UDID || '';                       // the device adb reads from (empty = the only one)
  env.DASHBOARD_VIDEO ||= 'failed';
  try {
    const lib = (f) => import(pathToFileURL(path.join(DASHBOARD_LIB, f)).href);
    shared = { ...(await lib('hooks.js')), recorder: await lib('recorder.js') };
  } catch (e) {
    console.warn(`[dashboard] shared dashboard not loaded (${e.message}); using the Instagram project's own report.`);
  }
}
// Per-run WebdriverIO, Appium and JUnit logs. With the shared dashboard they go to reports/wdio/<run>/, so that
// reports/runs/ only holds the dashboard's runs.
const LOG_BASE = shared ? path.join(HERE, 'reports', 'wdio', RUN_ID) : RUN_DIR;
const LOG_DIR = path.join(LOG_BASE, 'logs');

const baseConfig = {
  // ====================
  // Runner / Appium
  // ====================
  runner: 'local',
  hostname: '127.0.0.1',
  port: 4723,

  services: [
    ['appium', {
      args: {
        address: '127.0.0.1',
        port: 4723,
        log: path.join(LOG_DIR, 'appium.log'),
      },
    }],
  ],

  // ==================
  // Specs & suites
  // ==================
  specs: ['./test/specs/**/*.e2e.js'],
  exclude: [],

  // Run a group with:  npx wdio run wdio.conf.js --suite login
  suites: {
    login:   ['./test/specs/login.e2e.js'],
    flow:    ['./test/specs/loginToLogout.e2e.js'],
    home:    ['./test/specs/home.e2e.js'],
    profile: ['./test/specs/profile.e2e.js'],
    menu:    ['./test/specs/menu.e2e.js'],
    smoke:   ['./test/specs/login.e2e.js', './test/specs/loginToLogout.e2e.js'],
  },

  // ============
  // Capabilities
  // ============
  // One emulator + a shared logged-in state → specs must run one at a time.
  maxInstances: 1,

  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': env.DEVICE_NAME || 'emulator-5554',
    ...(env.UDID && { 'appium:udid': env.UDID }),
    ...(env.PLATFORM_VERSION && { 'appium:platformVersion': env.PLATFORM_VERSION }),

    'appium:appPackage': 'com.instagram.android',
    'appium:appActivity': '.activity.MainTabActivity',
    'appium:appWaitActivity': '*',

    'appium:noReset': true,              // keep app data (don't wipe the install)
    'appium:forceAppLaunch': true,       // but restart the app at the start of every spec
    'appium:shouldTerminateApp': true,
    'appium:autoGrantPermissions': false,  // we deny the notification popup instead (test/helpers/permissions.js)
    'appium:newCommandTimeout': 300,
    'appium:uiautomator2ServerLaunchTimeout': 90000,
    'appium:adbExecTimeout': 60000,
  }],

  // ===================
  // Test configuration
  // ===================
  logLevel: env.LOG_LEVEL || 'warn',
  outputDir: LOG_DIR,                  // wdio worker logs, kept per run
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 2,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 5 * 60 * 1000,   // login + network + per-step screenshots take a while
  },

  specFileRetries: Number(env.RETRIES || 0),

  reporters: [
    'spec',
    ['junit', {
      outputDir: path.join(LOG_BASE, 'junit'),
      outputFileFormat: ({ cid }) => `results-${cid}.xml`,
    }],
    ['allure', {
      outputDir: './allure-results',
      disableWebdriverStepsReporting: true,        // don't log every single command
      disableWebdriverScreenshotsReporting: false, // attach every screenshot taken
    }],
  ],

  // =====
  // Hooks
  // =====

  /** Launcher, once: create this run's folder, record what was run, prune old runs. */
  onPrepare(cfg) {
    fs.rmSync('./allure-results', { recursive: true, force: true });
    fs.mkdirSync(LOG_DIR, { recursive: true });

    const args = process.argv.slice(2).join(' ');
    fs.writeFileSync(path.join(RUN_DIR, 'run.json'), JSON.stringify({
      runId: RUN_ID,
      status: 'running',
      startedAt: new Date().toISOString(),
      command: `wdio ${args}`.trim(),
      suite: (args.match(/--suite[ =](\S+)/g) || []).map((s) => s.split(/[ =]/)[1]).join(', ') || undefined,
      spec: (args.match(/--spec[ =](\S+)/g) || []).map((s) => s.split(/[ =]/)[1]).join(', ') || undefined,
      grep: args.match(/--mochaOpts\.grep[ =]"?([^"]+)"?/)?.[1],
      host: os.hostname(),
      user: os.userInfo().username,
      node: process.version,
      ci: Boolean(env.CI),
      label: env.RUN_LABEL,             // optional free text, e.g. "build 1.4.2"
    }, null, 2));

    // Keep the newest KEEP_RUNS runs (this one included)
    const old = fs.existsSync(RUNS_DIR) ? fs.readdirSync(RUNS_DIR).filter((d) => d !== RUN_ID).sort().reverse() : [];
    for (const d of old.slice(Math.max(0, KEEP_RUNS - 1))) {
      fs.rmSync(path.join(RUNS_DIR, d), { recursive: true, force: true });
    }
  },

  /** Worker, once per spec file. */
  async before() {
    await driver.setTimeout({ implicit: 0 });
    try {
      await driver.activateApp('com.instagram.android');
    } catch { /* already in foreground */ }

    registerSecrets([users.valid.password, users.invalid.password]);   // masked in every log/report
    installLogging();

    // Deny the notification-permission popup whenever it appears during any wait.
    // Set DENY_ALL_PERMISSIONS=true to deny every runtime-permission popup, not just notifications.
    installPermissionGuard({ only: env.DENY_ALL_PERMISSIONS === 'true' ? null : /notif/i });
  },

  async beforeTest(test) {
    startTest(test);
    await denyPermissionPopupIfShown();     // popup can still be up from the previous test
  },

  async afterTest(test, context, result) {
    await endTest(test, result);
  },

  /** A failing before/after hook is recorded on the dashboard too (with screenshot + error). */
  async afterHook(test, context, { error }, hookName) {
    if (error) await recordHookFailure(test, hookName, error);
  },

  afterCommand(commandName, args, result, error) {
    logCommand(commandName, args, result, error);
  },

  after() {
    flushSuites();
  },

  /** Launcher, once at the end: close the run record and rebuild the dashboard. */
  onComplete(exitCode, cfg, caps, results) {
    const file = path.join(RUN_DIR, 'run.json');
    const run = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { runId: RUN_ID };
    run.finishedAt = new Date().toISOString();
    run.durationMs = Date.parse(run.finishedAt) - Date.parse(run.startedAt || run.finishedAt);
    run.exitCode = exitCode;
    run.status = exitCode === 0 ? 'passed' : 'failed';
    run.specFiles = results;           // { finished, passed, failed, retries }
    fs.writeFileSync(file, JSON.stringify(run, null, 2));

    try {
      const out = buildDashboard();
      console.log(`\nDashboard:  ${out}`);
    } catch (e) {
      console.error(`Dashboard build failed: ${e.message}`);
    }
    console.log(`Run folder: ${RUN_DIR}`);
    console.log('Open it:    npm run dashboard\n');
  },
};

// Shared dashboard on: its hooks record the tests, so the old recording hooks are left out (the permission guard,
// the app launch and the password masking stay).
const OLD_RECORDING = ['afterTest', 'afterHook', 'afterCommand', 'after', 'onComplete'];
function withSharedDashboard(cfg) {
  const own = { ...cfg };
  for (const k of OLD_RECORDING) delete own[k];
  own.onPrepare = function () {                             // only the parts that are not about the old report
    fs.rmSync('./allure-results', { recursive: true, force: true });
    fs.mkdirSync(LOG_DIR, { recursive: true });
  };
  own.beforeTest = async function () { await denyPermissionPopupIfShown(); };
  const before = cfg.before;
  own.before = async function (...args) {
    // the specs' step('...') and the typed / tapped elements go to the shared recorder (test/helpers/evidence.js)
    globalThis.DASHBOARD_STEP = shared.recorder.step;
    globalThis.DASHBOARD_ACTION = shared.recorder.logAction;
    return before.apply(this, args);
  };
  return shared.withDashboard(own);
}

export const config = shared ? withSharedDashboard(baseConfig) : baseConfig;
