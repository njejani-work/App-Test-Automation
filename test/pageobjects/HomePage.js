import BasePage, { S } from './BasePage.js';
import BottomNav, { TABS } from './components/BottomNav.js';

export { TABS };

// Home tab (MainActivity, Compose feed). Captured as locators/MainScreen.json.
// Top: "Wikipedia" wordmark, sub-tabs "Community" / "For you", language button "EN".
// Feed cards (Community): "Featured article", "In the news", "On this day", "Picture of the day"...
const SEL = {
  community: S.text('Community'),
  forYou: S.text('For you'),
  language: S.text('EN'),
  featuredArticle: S.text('Featured article'),
};

class HomePage extends BasePage {
  get anchors() {
    return [SEL.community, SEL.forYou];
  }

  get nav() { return BottomNav; }
  get navBar() { return BottomNav.bar; }
  get communityTab() { return $(SEL.community); }
  get forYouTab() { return $(SEL.forYou); }
  get languageButton() { return $(SEL.language); }

  /** Bottom tab view, e.g. tab('search'). */
  tab(key) { return BottomNav.tab(key); }
  async openTab(key) { await BottomNav.open(key); }
  async isTabSelected(key) { return BottomNav.isSelected(key); }

  async open() {
    await BottomNav.open('home');
    await this.waitForOpen();
  }

  async showCommunity() { await this.tap(SEL.community); }
  async showForYou() { await this.tap(SEL.forYou); }
}

export default new HomePage();
