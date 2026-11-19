// WebdriverIO configuration: how the tests reach the app.
//
//   npm run test:smoke
//     └─ WebdriverIO + Mocha (this file)       picks the suite, device, timeouts, reporters
//          └─ spec (test/specs/smoke)          test steps written as page-object calls
//               └─ page objects                know how to find and use each screen
//                    └─ Appium (port 4723)     turns WebDriver calls into device commands
//                         └─ UiAutomator2      on the emulator: taps, types, reads the screen
//                              └─ the APK built by scripts/build-apk.sh (out/)
import dotenv from 'dotenv';
import { resolveApk } from './test/support/apk.js';
import { startRun, finishRun, recordWorkerFailure, recordDevice, beforeEachTest, afterEachTest, versionLabel, step, prepareApp, appClosingByTest, finishSession } from './test/support/report/recorder.js';
import { safeBuildDashboard, collectRuns, printSummary } from './test/support/report/dashboard.mjs';

dotenv.config({ quiet: true });

// Which APK? The newest one in out/ (checked against its receipt), or APK_PATH from .env.
// If none is usable, the run still shows up on the dashboard as FAILED with the reason.
let apk;
let apkError = null;
try {
    apk = resolveApk();
} catch (e) {
    apkError = e.message;
    apk = { path: '', info: {} };
}
// Share the package name with the tests (worker processes inherit the environment)
process.env.APP_ID = process.env.APP_ID || apk.info.application_id || 'org.wikipedia.dev';

const udid = process.env.DEVICE_UDID;

export const config = {
    runner: 'local',
    port: 4723,

    // ---- Which tests ----
    specs: ['./test/specs/**/*.e2e.js'],
    suites: {
        smoke: ['./test/specs/smoke/**/*.e2e.js'],
        tour: ['./test/specs/tour/**/*.e2e.js'],
    },
    exclude: [],

    // ---- Which device and app ----
    maxInstances: 1, // one emulator = one session at a time
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
        ...(udid ? { 'appium:udid': udid } : {}),     // leave empty to use the only connected device
        'appium:app': apk.path,                       // Appium installs this APK
        // Exact screen to start: this debug build has two launcher entries (Wikipedia + LeakCanary).
        'appium:appPackage': process.env.APP_ID,
        'appium:appActivity': process.env.APP_ACTIVITY || 'org.wikipedia.main.MainActivity',
        'appium:appWaitActivity': '*',                // the app may open onboarding first; any screen is fine
        'appium:autoLaunch': false,                   // install (and clear) only: the before hook switches on API logging, then opens the app
        'appium:noReset': false,                      // clear app data per session: every run starts like a fresh install
        'appium:autoGrantPermissions': true,          // e.g. notifications on Android 13+
        'appium:newCommandTimeout': 240,
        'appium:uiautomator2ServerInstallTimeout': 120000,
        'appium:uiautomator2ServerLaunchTimeout': 120000,
        'appium:adbExecTimeout': 60000,
        'appium:androidInstallTimeout': 180000,      // the debug APK is ~140 MB
        'appium:language': 'en',                      // tests look for English text
        'appium:locale': 'US',
    }],

    // ---- Timeouts and logging ----
    logLevel: 'warn',
    // WebdriverIO's own log per worker (wdio-0-0.log): the dashboard reads it to explain a session that could not start
    outputDir: './reports/logs',
    bail: 0,
    waitforTimeout: 15000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 2,

    // Starts the Appium server from node_modules for the run. adb_shell lets the dashboard read frame stats
    // (dumpsys gfxinfo) and switch the app's API log to full responses (run-as on this debug build).
    // Only the local emulator is affected; DASHBOARD_PERF=off and DASHBOARD_API_BODIES=off turn it off.
    services: [['appium', { logPath: './reports/logs', args: (process.env.DASHBOARD_PERF || 'on') !== 'off' || (process.env.DASHBOARD_API_BODIES || 'on') !== 'off' ? { allowInsecure: 'uiautomator2:adb_shell' } : {} }]],
    framework: 'mocha',
    mochaOpts: { ui: 'bdd', timeout: 180000 },

    reporters: [
        'spec',
        ['junit', { outputDir: 'reports/junit', outputFileFormat: (o) => `results-${o.cid}.xml` }],
        ['allure', { outputDir: 'allure-results' }],
    ],

    // ---- Hooks: results recorder + dashboard (test/support/report) ----
    // Launcher, before any worker starts: create reports/runs/<runId>/ and share the app version.
    onPrepare() {
        const suiteArg = process.argv.indexOf('--suite');
        const suites = suiteArg > -1 ? [process.argv[suiteArg + 1]] : [];
        const { runId } = startRun({ suites, apk, setupError: apkError });
        safeBuildDashboard(); // an open dashboard switches to the new run (RUNNING…)
        if (apkError) throw new Error(apkError);
        console.log(`\n[wikiApp] Run ${runId}  ·  app ${versionLabel(apk.info)}`);
        console.log(`[wikiApp] APK ${apk.path}\n`);
    },

    // Worker: device details once per session
    before: async function (capabilities, specs) {
        await recordDevice(process.env.WDIO_WORKER_ID || '0-0');
        await prepareApp(process.env.WDIO_WORKER_ID || '0-0'); // full API logging on, then open the app (once, no restart)
    },

    // Worker: before/after every test: version banner, screenshot, app log, warnings
    beforeTest: async function (test) {
        await beforeEachTest(test);
    },
    afterTest: async function (test, context, result) {
        await afterEachTest(test, result, process.env.WDIO_WORKER_ID || '0-0');
    },

    // Worker: device-level actions become "steps to reproduce" (taps and typing are recorded by the page objects)
    async beforeCommand(commandName) {
        if (commandName === 'terminateApp') await appClosingByTest(); // calls cut off by closing the app get this reason
    },
    afterCommand(commandName, args, result, error) {
        const names = { back: 'Press Android Back', terminateApp: 'Close the app', activateApp: 'Open the app' };
        if (names[commandName]) step(names[commandName] + (error ? ' (failed)' : ''));
    },

    // Worker, end of session: API calls that finished after the last test, or never got a response
    after: async function () {
        await finishSession();
    },

    // Launcher: a worker that died before running tests (e.g. app would not start)
    onWorkerEnd(cid, exitCode) {
        recordWorkerFailure(cid, exitCode);
    },

    // Launcher, at the very end: close the run, rebuild the dashboard, print a clear summary
    // Runs whether tests passed or failed, so the dashboard always ends up refreshed.
    onComplete(exitCode) {
        try { finishRun(exitCode); } catch (e) { console.warn(`[wikiApp] could not close the run: ${e.message}`); }
        const built = safeBuildDashboard();
        try {
            const latest = collectRuns().find((r) => r.id === process.env.RUN_ID);
            if (latest && built) printSummary(latest, built.file);
        } catch (e) { console.warn(`[wikiApp] could not print the summary: ${e.message}`); }
    },
};
