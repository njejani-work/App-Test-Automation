import BasePage, { S } from './BasePage.js';
import BottomNav from './components/BottomNav.js';

// Activity tab (MainActivity). Captured in locators/MainScreen.json. Logged out it shows
// "Log in or create an account to view your activity..." with "Create account" / "Log in"
// (the tests never tap those).
// First visit opens "Introducing Activity" (ActivityTabOnboardingActivity,
// locators/ActivityTabOnboardingScreen.json): Reading patterns, Impact highlights,
// More ways to engage, Stay in control ... "Learn more" / "Continue".
const SEL = {
  introTitle: S.text('Introducing Activity'),
  introContinue: S.text('Continue'),
  loggedOutMessage: S.textContains('Log in or create an account'),
  createAccount: S.text('Create account'),
  logIn: S.text('Log in'),
};

class ActivityPage extends BasePage {
  get anchors() {
    return [SEL.loggedOutMessage, SEL.createAccount];
  }

  get loggedOutMessage() { return $(SEL.loggedOutMessage); }

  async open() {
    await BottomNav.open('activity');
    if (await this.isIntroShown(5000)) await this.closeIntro();
    await BottomNav.waitUntilSelected('activity');
  }

  async isIntroShown(timeout = 0) {
    try {
      await $(SEL.introTitle).waitForDisplayed({ timeout: Math.max(timeout, 1) });
      return true;
    } catch {
      return false;
    }
  }

  async closeIntro() {
    await this.tap(SEL.introContinue);
    await $(SEL.introTitle).waitForDisplayed({ reverse: true, timeout: 10000 });
  }
}

export default new ActivityPage();
