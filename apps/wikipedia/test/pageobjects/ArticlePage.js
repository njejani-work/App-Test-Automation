import BasePage, { S } from './BasePage.js';

// An article (PageActivity). The text is shown in a WebView; the
// bar under it (page_actions_tab_layout) holds Save / Language / Find / Theme / Contents.
const SEL = {
  // The WebView has no resource-id in UiAutomator's tree (19 Nov 2026: page_web_view never matched), so: its class
  webView: S.cls('android.webkit.WebView'),
  actionsBar: S.id('page_actions_tab_layout'),
  toolbar: S.id('page_toolbar'),
  // Web content is exposed to UiAutomator as text or content-description, depending on the WebView version
  titleText: (t) => S.textContains(t),
  titleDesc: (t) => S.descContains(t),
};

class ArticlePage extends BasePage {
  get anchors() {
    return [SEL.webView, SEL.actionsBar];
  }

  get webView() { return $(SEL.webView); }
  get actionsBar() { return $(SEL.actionsBar); }
  get toolbar() { return $(SEL.toolbar); }

  /** Wait until the article's text shows `title` somewhere on screen (page content loaded). */
  async waitForTitle(title, timeout = 30000) {
    await driver.waitUntil(() => this.anyDisplayed([SEL.titleText(title), SEL.titleDesc(title)]), {
      timeout,
      interval: 500,
      timeoutMsg: `Article content with "${title}" did not appear within ${timeout} ms`,
    });
  }
}

export default new ArticlePage();
