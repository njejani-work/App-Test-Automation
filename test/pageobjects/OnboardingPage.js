import BasePage, { S } from './BasePage.js';

// First-launch intro. This app version uses a NEW intro written in Jetpack Compose
// (app/src/main/java/org/wikipedia/onboarding/InitialOnboardingScreen.kt), seen on the
// emulator on 11 Nov 2026:
//   page 1 "All the world's knowledge"          (INTRO)
//   page 2 "Data & Privacy"                       (DATA_PRIVACY)
//   page 3 "Read in more than 300 languages"      (LANGUAGES)
// There is NO Skip button: a single arrow (content-desc "Forward") moves to the next page,
// and on the last page it finishes the intro. Compose has no resource-ids here, so the
// selectors use the content-desc and visible titles.
// The old view-based intro (ids fragment_onboarding_*) is kept as a fallback for older builds.
const SEL = {
  forward: S.desc('Forward'),
  introTitle: S.text("All the world's knowledge"),
  privacyTitle: S.text('Data & Privacy'),
  languagesTitle: S.text('Read in more than 300 languages'),
  // old intro (fallback)
  oldSkip: S.id('fragment_onboarding_skip_button'),
  oldPager: S.id('fragment_onboarding_pager_container'),
};

class OnboardingPage extends BasePage {
  get anchors() {
    return [SEL.forward, SEL.introTitle, SEL.oldSkip, SEL.oldPager];
  }

  get forwardButton() { return $(SEL.forward); }
  get introTitle() { return $(SEL.introTitle); }

  /** Which intro page is showing: 'intro' | 'privacy' | 'languages' | 'old' | null. */
  async currentPage() {
    if (await this.anyDisplayed([SEL.introTitle])) return 'intro';
    if (await this.anyDisplayed([SEL.privacyTitle])) return 'privacy';
    if (await this.anyDisplayed([SEL.languagesTitle])) return 'languages';
    if (await this.anyDisplayed([SEL.oldSkip, SEL.oldPager])) return 'old';
    return null;
  }

  /** Go through the whole intro: tap Forward until the intro is gone (or tap Skip on the old intro). */
  async complete({ maxPages = 6 } = {}) {
    for (let i = 0; i < maxPages; i++) {
      if (await this.anyDisplayed([SEL.oldSkip])) {
        await this.tap(SEL.oldSkip);
        return;
      }
      if (!(await this.anyDisplayed([SEL.forward]))) return; // intro finished
      await this.tap(SEL.forward);
      await driver.pause(600); // page change animation
    }
    if (await this.anyDisplayed([SEL.forward])) {
      throw new Error(`Onboarding: still showing after ${maxPages} taps on Forward`);
    }
  }
}

export default new OnboardingPage();
