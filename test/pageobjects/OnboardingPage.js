import BasePage, { S } from './BasePage.js';

// First-launch intro pages ("The Free Encyclopedia ...in over 300 languages", "New ways to explore", ...).
// Ids from app/src/main/res/layout/fragment_onboarding_pager.xml in the app's repository.
const SEL = {
  skip: S.id('fragment_onboarding_skip_button'),        // "Skip"
  forward: S.id('fragment_onboarding_forward_button'),  // "Continue"
  done: S.id('fragment_onboarding_done_button'),        // "Get started" (last page)
  pager: S.id('fragment_onboarding_pager_container'),
};

class OnboardingPage extends BasePage {
  get anchors() {
    return [SEL.skip, SEL.forward, SEL.pager];
  }

  get skipButton() { return $(SEL.skip); }
  get continueButton() { return $(SEL.forward); }

  async skip() {
    await this.tap(SEL.skip);
  }

  /** Walk through every intro page with Continue, then Get started. */
  async goThrough({ maxPages = 6 } = {}) {
    for (let i = 0; i < maxPages; i++) {
      if (await this.anyDisplayed([SEL.done])) {
        await this.tap(SEL.done);
        return;
      }
      await this.tap(SEL.forward);
    }
    throw new Error('Onboarding: "Get started" never appeared');
  }
}

export default new OnboardingPage();
