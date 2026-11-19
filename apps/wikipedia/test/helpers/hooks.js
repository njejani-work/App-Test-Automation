// Wikipedia's own WebdriverIO hooks. They run after the shared dashboard hooks (toolkit/dashboard/hooks.js), which
// record the run, the device, every test, the app log and API calls. Only what is particular to this app is here:
//   onPrepare      stop the run when there is no usable APK (the reason comes from test/support/apk.js)
//   before         full API logging on, then open the app (appium:autoLaunch is false), once per session
//   beforeTest     the app version next to every test in the terminal
//   afterTest      a failed test saves the screen's element tree (reports/logs/source-<test>.xml) to see why
//   afterCommand   Back / Close / Open the app become steps on the dashboard ("steps to reproduce")
import { mkdirSync, writeFileSync } from 'node:fs';
import { step } from '@apptest/toolkit/dashboard/recorder.js';
import { apk, apkError, versionLabel } from '../../app.config.js';
import { openApp, enableHttpBodyLogging } from './launch.js';

const API_BODIES = (process.env.DASHBOARD_API_BODIES || 'on') !== 'off'; // log full API responses
const appId = () => process.env.APP_ID || '';

export const hooks = {
  onPrepare() {
    if (apkError) throw new Error(apkError);
    console.log(`\n[wikiApp] App ${versionLabel(apk.info)}`);
    console.log(`[wikiApp] APK ${apk.path}\n`);
  },

  async before() {
    let api = { level: 'BASIC', reason: 'Switched off with DASHBOARD_API_BODIES=off: API calls are recorded with address, status code, time and size, without response headers and bodies.' };
    if (API_BODIES) api = await enableHttpBodyLogging(appId());
    console.log(`[wikiApp] API responses: ${api.level}${api.reason ? ' - ' + api.reason : ''}`);
    const open = await openApp(appId());
    if (open.ok) {
      console.log(`[wikiApp] App opened (${open.how}).`);
    } else {
      // the terminal says why; the first test then fails on its first screen check, with a screenshot
      console.error(`[wikiApp] The test setup could not open the app: ${open.error}. Tests that expect the app on screen fail until it is opened.`);
    }
  },

  beforeTest(test) {
    console.log(`[app ${versionLabel(apk.info)}] ▶ ${test.title}`);
  },

  async afterTest(test, context, { passed }) {
    if (passed) return;
    try {
      mkdirSync('reports/logs', { recursive: true });
      const name = String(test.title).replace(/[^a-z0-9]+/gi, '-').slice(0, 60);
      writeFileSync(`reports/logs/source-${name}.xml`, await driver.getPageSource());
    } catch (e) {
      console.warn(`[wikiApp] could not save the screen's element tree: ${e.message}`);
    }
  },

  async afterCommand(commandName, args, result, error) {
    const names = { back: 'Press Android Back', terminateApp: 'Close the app', activateApp: 'Open the app' };
    if (names[commandName]) await step(names[commandName] + (error ? ' (failed)' : ''), async () => {});
  },
};
