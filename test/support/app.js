// App-level helpers shared by the suites.
import { OnboardingPage, HomePage, Dialogs } from '../pageobjects/index.js';

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

/** From a fresh install: skip the intro if it shows, close pop-ups, end on the main screen. */
export async function getToMainScreen() {
  if (await OnboardingPage.isOpen(10000)) await OnboardingPage.skip();
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
