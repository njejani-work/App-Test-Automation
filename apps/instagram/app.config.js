// What the shared toolkit needs to know about the Instagram app (read by wdio.conf.js -> createConfig()).
// Everything not here is the toolkit's default: see toolkit/wdio/index.js. The values below are the ones this project's
// own wdio.conf.js had (18 Nov 2026), so the tests run exactly as before.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RUN_ID } from './test/helpers/run.js'; // one id per run: the launcher makes it, the workers inherit it

const HERE = path.dirname(fileURLToPath(import.meta.url));
/** WebdriverIO, Appium and JUnit logs of each run (reports/runs/ holds the dashboard's runs). */
export const LOG_BASE = path.join(HERE, 'reports', 'wdio', RUN_ID);
export const LOG_DIR = path.join(LOG_BASE, 'logs');

export default {
  id: 'instagram',
  name: 'Instagram',
  package: 'com.instagram.android',
  activity: '.activity.MainTabActivity',
  dashboard: { title: 'Instagram App Tests' },

  specs: ['./test/specs/**/*.e2e.js'],
  suites: {
    login: ['./test/specs/login.e2e.js'],
    flow: ['./test/specs/loginToLogout.e2e.js'],
    home: ['./test/specs/home.e2e.js'],
    profile: ['./test/specs/profile.e2e.js'],
    menu: ['./test/specs/menu.e2e.js'],
    smoke: ['./test/specs/login.e2e.js', './test/specs/loginToLogout.e2e.js'],
  },

  // Over the toolkit's default capabilities (env = process.env after .env is loaded)
  capabilities: (env) => ({
    'appium:udid': env.UDID || undefined,                    // only when set: otherwise the only connected device
    'appium:platformVersion': env.PLATFORM_VERSION || undefined,
    'appium:appWaitActivity': '*',
    // The notification prompt can still be up from an earlier run when the session starts: then the permission
    // controller, not Instagram, is in front, and Appium would say the app "never started" (19 Nov 2026). Accept it too;
    // the popup guard denies it as soon as the session is up.
    'appium:appWaitPackage': 'com.instagram.android,com.google.android.permissioncontroller,com.android.permissioncontroller',
    'appium:forceAppLaunch': true,                           // restart the app at the start of every spec
    'appium:shouldTerminateApp': true,
    'appium:autoGrantPermissions': false,                    // the notification popup is denied instead (permissions.js)
    'appium:newCommandTimeout': 300,
    'appium:uiautomator2ServerLaunchTimeout': 90000,
    // toolkit defaults this project never used: left out
    'appium:waitForIdleTimeout': undefined,
    'appium:uiautomator2ServerInstallTimeout': undefined,
    'appium:androidInstallTimeout': undefined,
    'appium:ignoreHiddenApiPolicyError': undefined,
  }),

  // Other WebdriverIO settings that differ from the toolkit's
  wdio: (env) => ({
    hostname: '127.0.0.1',
    services: [['appium', { args: { address: '127.0.0.1', port: 4723, log: path.join(LOG_DIR, 'appium.log') } }]],
    logLevel: env.LOG_LEVEL || 'warn',
    outputDir: LOG_DIR,                                      // wdio worker logs, kept per run
    waitforTimeout: 15000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 2,
    mochaOpts: { ui: 'bdd', timeout: 5 * 60 * 1000 },       // login + network + per-step screenshots take a while
    specFileRetries: Number(env.RETRIES || 0),
    reporters: [
      'spec',
      ['junit', { outputDir: path.join(LOG_BASE, 'junit'), outputFileFormat: ({ cid }) => `results-${cid}.xml` }],
      ['allure', { outputDir: './allure-results', disableWebdriverStepsReporting: true, disableWebdriverScreenshotsReporting: false }],
    ],
  }),
};
