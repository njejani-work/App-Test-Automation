// App-level helpers shared by the suites.
import { OnboardingPage, PersonalizationPage, HomePage, Dialogs } from '../pageobjects/index.js';

/** Package of the APK under test (set by wdio.conf.js from the build receipt). */
export const APP_ID = () => process.env.APP_ID || 'org.wikipedia.dev';

/** True while the app is in the foreground (it hasn't crashed or left the app). */
export async function appInForeground() {
  try {
    return (await driver.getCurrentPackage()) === APP_ID();
  } catch {
    return false;
  }
}

/**
 * Fresh install -> main screen. The first-launch flow seen in the capture (11 Nov 2026):
 *   intro (3 pages, ~Forward) -> "Follow your curiosity" personalisation (Skip)
 *   -> "Let's build your feed…" -> Home
 */
export async function getToMainScreen() {
  if (await OnboardingPage.isOpen(15000)) await OnboardingPage.complete();
  if (await PersonalizationPage.isOpen(10000)) await PersonalizationPage.skip();
  await Dialogs.dismissAll();
  await HomePage.waitForOpen(30000);
}

/** Press back until the main screen shows (max `tries` times). */
export async function backToMain(tries = 4) {
  for (let i = 0; i < tries; i++) {
    if (await HomePage.isOpen(1000)) return;
    await driver.back();
  }
  await HomePage.waitForOpen();
}

/** Close the app completely and check it is no longer running in the foreground. */
export async function exitApp() {
  await driver.terminateApp(APP_ID());
  // queryAppState: 1 = not running, 2/3 = background, 4 = foreground
  await driver.waitUntil(async () => (await driver.queryAppState(APP_ID())) < 4, {
    timeout: 10000,
    timeoutMsg: 'App is still in the foreground after closing it',
  });
}

/** A unique reading-list name, e.g. "QA list 7f3k2a". */
export function randomListName(prefix = 'QA list') {
  return `${prefix} ${Math.random().toString(36).slice(2, 8)}`;
}
