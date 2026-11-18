import BasePage, { S } from '../BasePage.js';
import { logAction } from '../../support/dashboard/recorder.js';
import { APP_ID } from '../../support/app.js';

// Bottom tab bar shown on Home, Report and Settings (captured: ~Home / ~Report / ~Settings).
// The login and OTP screens: when one of these shows, the app is logged out and there is no tab bar to go back to
const LOGGED_OUT = [S.text('Log in or Sign up'), S.desc('Send OTP'), S.text('OTP, please'), S.descStarts('OTP digit ')];

export const LOCATORS = {
  homeTab: S.desc('Home'),
  reportTab: S.desc('Report'),
  settingsTab: S.desc('Settings'),
};
class BottomNav extends BasePage {
  get anchors() {
    return [S.desc('Home'), S.desc('Settings')];
  }

  get homeTab() { return $(S.desc('Home')); }
  get reportTab() { return $(S.desc('Report')); }
  get settingsTab() { return $(S.desc('Settings')); }

  /**
   * Makes sure the tab bar is on screen. If a previous step left a pushed screen open
   * (Premium, a report, a Settings sub-screen...), presses Back until the tabs show again,
   * so one failed test doesn't make every following test fail too.
   */
  async ensureVisible(maxBacks = 4) {
    if (await this.isOpen(2000)) return;
    // Logged out (an earlier login did not finish): Back here would close the app, and reopening it restarts the
    // login flow while the test has moved on. Stop at once and say why instead.
    if (await this.#loggedOutScreen()) throw this.#notLoggedIn();
    for (let i = 0; i < maxBacks; i++) {
      await driver.back();
      if ((await driver.queryAppState(APP_ID)) !== 4) await driver.activateApp(APP_ID); // Back left the app
      if (await this.isOpen(2000)) { logAction('recovered tab bar', `after ${i + 1} Back press(es)`); return; }
      if (await this.#loggedOutScreen()) throw this.#notLoggedIn(); // Back reached the login screen
    }
  }

  async #loggedOutScreen() {
    for (const sel of LOGGED_OUT) if (await $(sel).isDisplayed().catch(() => false)) return true;
    return false;
  }

  #notLoggedIn() {
    return new Error('BottomNav: the app is not logged in (the login or OTP screen is showing), so there is no tab bar. '
      + 'An earlier login did not finish: fix the first failed test (usually SMK-02) first.');
  }

  async openHome() {
    await this.ensureVisible();
    await this.tap(S.desc('Home'));
  }

  async openReports() {
    await this.ensureVisible();
    await this.tap(S.desc('Report'));
  }

  async openSettings() {
    await this.ensureVisible();
    await this.tap(S.desc('Settings'));
  }
}

export default new BottomNav();
