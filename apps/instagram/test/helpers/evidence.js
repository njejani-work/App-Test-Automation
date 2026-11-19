// test/helpers/evidence.js
// Steps for the shared test dashboard (@apptest/toolkit). A spec names each step:
//
//   await step('Tap Log in', () => LoginPage.logInBtn.click(), {
//     waitFor: () => LoginPage.notNowBtn.waitForDisplayed(),   // "result has loaded"
//   });
//
// Each step: deny a permission popup if one is up, run the action, wait for its result, wait until the UI stops
// changing, deny a popup it may have opened. The dashboard's recorder (installed by hooks.js) records it with a
// screenshot, its time and its error. Taps and typing inside it are listed under it, passwords masked.
// (The project's own report, reports/runs/<id>/<suite>/suite.json, was retired on 19 Nov 2026: step 7.)

import fs from 'node:fs';
import path from 'node:path';
import { denyPermissionPopupIfShown } from './permissions.js';

// ---------------------------------------------------------------- secrets: never in a step name, log or report
const secrets = new Set();
export function registerSecrets(values = []) {
  for (const v of values) if (v && String(v).length >= 3) secrets.add(String(v));
}
export function mask(text) {
  let s = text == null ? '' : String(text);
  for (const v of secrets) s = s.split(v).join('••••••');
  return s;
}

// ---------------------------------------------------------------- taps and typing, listed under the running step
let loggingInstalled = false;
/** Call once per worker (hooks.js -> before). */
export function installLogging() {
  if (loggingInstalled) return;
  loggingInstalled = true;
  for (const cmd of ['click', 'doubleClick', 'setValue', 'addValue', 'clearValue']) {
    browser.overwriteCommand(cmd, async function (orig, ...args) {
      const typed = cmd === 'setValue' || cmd === 'addValue' ? mask(args[0]) : undefined;
      try { globalThis.DASHBOARD_ACTION?.(cmd === 'click' ? 'tap' : cmd, String(this.selector), typed); } catch {}
      return orig(...args);
    }, { attachToElement: true }); // WebdriverIO 10.2: an options object (a bare true was removed)
  }
}

// ---------------------------------------------------------------- waiting for "loading complete"
/**
 * Wait until two consecutive page sources are identical (no spinners/animations still changing the hierarchy).
 * Gives up after `timeout` and carries on: videos in the feed never fully settle.
 */
export async function waitForUiIdle({ timeout = 4000, interval = 400 } = {}) {
  const clean = (xml) => xml.replace(/\s(focused|selected|a11y-focused)="[^"]*"/g, '');
  let prev = clean(await driver.getPageSource());
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    await driver.pause(interval);
    const cur = clean(await driver.getPageSource());
    if (cur === prev) return true;
    prev = cur;
  }
  return false;
}

/** Write page source + current package/activity to a file. Returns the file name (or undefined). */
export async function saveDebugSource(filePath) {
  try {
    let header = '';
    try {
      header = `<!-- package=${await driver.getCurrentPackage()} activity=${await driver.getCurrentActivity()} -->\n`;
    } catch { /* not Android */ }
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, header + await driver.getPageSource());
    return path.basename(filePath);
  } catch (e) {
    console.warn(`Could not save page source: ${e.message}`);
    return undefined;
  }
}

// ---------------------------------------------------------------- steps
const record = (name, fn) => (globalThis.DASHBOARD_STEP ? globalThis.DASHBOARD_STEP(mask(name), fn) : fn());

/**
 * One test action, recorded as a dashboard step with a screenshot once its result has loaded.
 * Outside a test (e.g. in before hooks) the action just runs, unrecorded.
 * @param {string}   name      Shown on the dashboard. Passwords are masked automatically.
 * @param {Function} action    The action, e.g. () => btn.click(). null = screenshot only.
 * @param {object}   opts
 * @param {Function} opts.waitFor   Waits for the result of the action (element shown, screen changed…)
 * @param {boolean}  opts.settle    Also wait for the UI to stop changing (default true)
 * @param {number}   opts.settleTimeout
 */
export function step(name, action, { waitFor, settle = true, settleTimeout = 4000 } = {}) {
  return record(name, async () => {
    await denyPermissionPopupIfShown();                 // a popup would block the action
    const result = action ? await action() : undefined;
    if (waitFor) await waitFor(result);
    if (settle) await waitForUiIdle({ timeout: settleTimeout });
    await denyPermissionPopupIfShown();                 // a popup the action opened
    return result;
  });
}

/** A screenshot of the current screen without an action. */
export const checkpoint = (name, opts) => step(name, null, opts);

/** An extra screenshot as its own step (used for system popups). */
export const snapshot = (name) => record(name, async () => {});

/** Kept for older specs: tests are recorded automatically. */
export function useEvidence() {}
