import BasePage, { S } from './BasePage.js';

// "Follow your curiosity": 3-step feed personalisation that follows the intro on a fresh install
// (PersonalizationActivity). Captured as locators/PersonalizationScreen(.json, 2.json).
//   step 1 "Follow your curiosity" / "Select topics that interest you..."
//   step 2 "What are you interested in?"  (topic cards)
//   step 3 "What would you like to see first?" (Community-related / Personalized content)
// Bottom bar on every step: "Skip" (text) ... dots ... arrow (~Next).
// After it, a short "Let's build your feed…" screen (ExploreFeedBuildingActivity) opens Home.
const SEL = {
  skip: S.text('Skip'),
  next: S.desc('Next'),
  step1Title: S.text('Follow your curiosity'),
  step2Title: S.text('What are you interested in?'),
  step3Title: S.text('What would you like to see first?'),
  buildingFeed: S.textContains("Let's build your feed"),
};

class PersonalizationPage extends BasePage {
  get anchors() {
    return [SEL.step1Title, SEL.step2Title, SEL.step3Title];
  }

  get skipButton() { return $(SEL.skip); }
  get nextButton() { return $(SEL.next); }

  /** Skip personalisation and wait until the "building your feed" screen has gone. */
  async skip() {
    await this.tap(SEL.skip);
    await driver.waitUntil(async () => !(await this.anyDisplayed([SEL.buildingFeed, ...this.anchors])), {
      timeout: 30000,
      interval: 500,
      timeoutMsg: 'Still on personalisation / "Let\'s build your feed" after 30 s',
    });
  }
}

export default new PersonalizationPage();
