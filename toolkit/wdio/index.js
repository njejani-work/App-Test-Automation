// The shared WebdriverIO config. An app's wdio.conf.js is three lines:
//   import { createConfig } from '@apptest/toolkit/wdio/index.js';
//   import app from './app.config.js';
//   export const config = await createConfig(app);
// app.config.js says what is specific to the app (package, activity, specs, suites, capabilities, dashboard title);
// everything else (Appium service, reporters, timeouts, the dashboard recording) is the same for every app.
//
// Overrides: anything in app.wdio wins over the defaults below; app.capabilities merge key by key over the default
// capabilities. createConfig(app, { hooks }) adds hooks that run AFTER the toolkit's own (WebdriverIO accepts a list
// per hook). createConfig(app, { replace: ['afterTest'] }) drops the toolkit's own hook of that name first.
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import dotenv from 'dotenv';

/** The app settings every app.config.js must give. */
const REQUIRED = ['id', 'name', 'package', 'activity', 'specs'];

/**
 * Appium finds its drivers (UiAutomator2) in APPIUM_HOME. In the workspace npm installs every package once, at the repo
 * root, but Appium would look in the app's folder and find no driver (18 Nov 2026). Point it at the folder where the
 * driver really is. Kept if APPIUM_HOME is already set.
 */
function appiumHome(env) {
  try {
    const driverPkg = createRequire(pathToFileURL(path.join(process.cwd(), 'package.json'))).resolve('appium-uiautomator2-driver/package.json');
    env.APPIUM_HOME ||= path.resolve(path.dirname(driverPkg), '..', '..'); // <root>/node_modules/<driver> -> <root>
  } catch { /* driver not installed: Appium reports it */ }
}

/** The defaults every app gets (as eGenome's wdio.conf.js had them on 18 Nov 2026). */
function defaults(env) {
  return {
    runner: 'local',
    port: 4723,
    maxInstances: 1, // one emulator = one session at a time
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': env.DEVICE_NAME || 'emulator-5554',
      'appium:udid': env.DEVICE_UDID || 'emulator-5554',
      'appium:noReset': true, // keep app data between runs; a spec clears it when it needs a fresh install state
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
      'appium:waitForIdleTimeout': Number(env.APPIUM_WAIT_FOR_IDLE_MS ?? 100),
      'appium:uiautomator2ServerInstallTimeout': 120000,
      'appium:uiautomator2ServerLaunchTimeout': 120000,
      'appium:adbExecTimeout': 60000,
      'appium:androidInstallTimeout': 180000,
      'appium:ignoreHiddenApiPolicyError': true,
    },
    wdio: {
      logLevel: 'info',
      bail: 0,
      waitforTimeout: 10000,
      connectionRetryTimeout: 120000,
      connectionRetryCount: 3,
      services: ['appium'],
      framework: 'mocha',
      reporters: ['spec', ['allure', { outputDir: 'allure-results' }]],
      mochaOpts: { ui: 'bdd', timeout: 180000 },
    },
    hooks: {
      // a screenshot of the failed test for the spec / Allure reporters
      afterTest: async function (test, context, { passed }) {
        if (!passed) await browser.takeScreenshot();
      },
    },
  };
}

/**
 * @param {object} app  the app's app.config.js
 * @param {{ hooks?: object, replace?: string[], env?: object }} [opts]
 */
export async function createConfig(app, { hooks = {}, replace = [], env = process.env } = {}) {
  const missing = REQUIRED.filter((k) => app?.[k] == null);
  if (missing.length) throw new Error(`app.config.js is missing: ${missing.join(', ')}`);
  dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });
  appiumHome(env);
  // the shared dashboard records this app (read when its modules load, so set before they are imported)
  env.DASHBOARD_APP_PACKAGE ||= app.package;
  if (app.dashboard?.title) env.DASHBOARD_TITLE ||= app.dashboard.title;

  const d = defaults(env);
  const config = {
    runner: d.runner,
    port: d.port,
    specs: app.specs,
    suites: app.suites || {},
    exclude: app.exclude || [],
    maxInstances: d.maxInstances,
    capabilities: [{ ...d.capabilities, 'appium:appPackage': app.package, 'appium:appActivity': app.activity, ...(app.capabilities || {}) }],
    ...d.wdio,
    ...(app.wdio || {}),
  };
  for (const [name, fn] of Object.entries(d.hooks)) if (!replace.includes(name)) config[name] = fn;
  for (const [name, fn] of Object.entries(hooks)) config[name] = config[name] ? [...[].concat(config[name]), ...[].concat(fn)] : fn;

  const { withDashboard } = await import('../dashboard/hooks.js');
  return withDashboard(config);
}
