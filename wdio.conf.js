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
import { mkdirSync } from 'node:fs';
import { resolveApk } from './test/support/apk.js';

dotenv.config({ quiet: true });

// Which APK? The newest one in out/ (checked against its receipt), or APK_PATH from .env.
const apk = resolveApk();
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
        'appium:appWaitActivity': '*',                // the app may open onboarding first; any screen is fine
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
    bail: 0,
    waitforTimeout: 15000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 2,

    services: ['appium'],          // starts the Appium server from node_modules for the run
    framework: 'mocha',
    mochaOpts: { ui: 'bdd', timeout: 180000 },

    reporters: [
        'spec',
        ['junit', { outputDir: 'reports/junit', outputFileFormat: (o) => `smoke-${o.cid}.xml` }],
        ['allure', { outputDir: 'allure-results' }],
    ],

    // ---- Hooks ----
    onPrepare() {
        const i = apk.info;
        console.log('\n[wikiApp] Testing APK:', apk.path);
        if (i.commit) console.log(`[wikiApp] commit ${i.commit.slice(0, 10)}  variant ${i.variant}  package ${i.application_id}  built ${i.built_at_utc}\n`);
    },

    afterTest: async function (test, context, { passed }) {
        if (!passed) {
            mkdirSync('reports/screenshots', { recursive: true });
            const name = `${test.parent} ${test.title}`.replace(/[^a-z0-9]+/gi, '_').slice(0, 120);
            await browser.saveScreenshot(`reports/screenshots/${name}.png`);
        }
    },
};
