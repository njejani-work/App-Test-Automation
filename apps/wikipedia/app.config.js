// What is specific to the Wikipedia app. The shared WebdriverIO settings are in @apptest/toolkit/wdio/index.js;
// every value below is what this project's own wdio.conf.js had before the move (19 Nov 2026).
//
// The app under test is the APK this project builds from the Wikipedia source (npm run build:apk -> out/), not an app
// already on the device: Appium installs it when the session starts, and the dashboard shows the version from its
// build receipt (dashboard.appInfo below).
import { resolveApk } from './test/support/apk.js';

// Which APK? The newest one in out/ (checked against its receipt), or APK_PATH from .env.
// If none is usable, the hooks stop the run with the reason (test/helpers/hooks.js onPrepare).
let apk;
export let apkError = null;
try {
  apk = resolveApk();
} catch (e) {
  apkError = e.message;
  apk = { path: '', info: {} };
}
export { apk };
// Share the package name with the tests (worker processes inherit the environment)
process.env.APP_ID = process.env.APP_ID || apk.info.application_id || 'org.wikipedia.dev';

/** "v<version> · build <id>", as the terminal showed it before the move */
export const versionLabel = (info = apk.info) => `v${info.version_name || '?'} · build ${info.build_id || (info.commit || '?').slice(0, 10)}`;

// Appium's adb_shell lets the hooks read frame stats and switch the app's API log to full responses (run-as on this
// debug build). DASHBOARD_PERF=off and DASHBOARD_API_BODIES=off turn it off.
const adbShell = (env) => (env.DASHBOARD_PERF || 'on') !== 'off' || (env.DASHBOARD_API_BODIES || 'on') !== 'off';

export default {
  id: 'wikipedia',
  name: 'Wikipedia',
  package: process.env.APP_ID,
  activity: process.env.APP_ACTIVITY || 'org.wikipedia.main.MainActivity',
  specs: ['./test/specs/**/*.e2e.js'],
  suites: {
    smoke: ['./test/specs/smoke/**/*.e2e.js'],
    tour: ['./test/specs/tour/**/*.e2e.js'],
  },
  dashboard: {
    title: 'Wikipedia App Tests',
    // the build under test, from its receipt in out/ (the installed app may still be the previous build at this point)
    appInfo: () => ({
      application_id: apk.info.application_id || process.env.APP_ID,
      version_name: apk.info.version_name || null,
      version_code: apk.info.version_code || null,
      apk_sha256: apk.info.apk_sha256 || null,
      build_id: apk.info.build_id || null,
      ...(apkError ? { reason: apkError } : {}),
    }),
  },

  capabilities: (env) => ({
    'appium:deviceName': env.DEVICE_NAME || 'Android Emulator',
    'appium:udid': env.DEVICE_UDID || undefined, // empty = the only connected device
    'appium:app': apk.path, // Appium installs this APK
    'appium:appWaitActivity': '*', // the app may open onboarding first; any screen is fine
    'appium:autoLaunch': false, // install (and clear) only: the before hook switches on API logging, then opens the app
    'appium:noReset': false, // clear app data per session: every run starts like a fresh install
    'appium:language': 'en', // tests look for English text
    'appium:locale': 'US',
    // toolkit defaults this project never had
    'appium:waitForIdleTimeout': undefined,
    'appium:ignoreHiddenApiPolicyError': undefined,
  }),

  wdio: (env) => ({
    logLevel: 'warn',
    // WebdriverIO's own log per worker (wdio-0-0.log): explains a session that could not start
    outputDir: './reports/logs',
    waitforTimeout: 15000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 2,
    services: [['appium', { logPath: './reports/logs', args: adbShell(env) ? { allowInsecure: 'uiautomator2:adb_shell' } : {} }]],
    reporters: [
      'spec',
      ['junit', { outputDir: 'reports/junit', outputFileFormat: (o) => `results-${o.cid}.xml` }],
      ['allure', { outputDir: 'allure-results' }],
    ],
  }),
};
