import { logAction } from '@apptest/toolkit/dashboard/recorder.js';
// The bottom navigation bar on the main screen (MainActivity).
// Captured in: locators/HistoryScreen.json and MainScreen.json (11 Nov 2026).
// Each tab has a resource-id AND a content-desc equal to its label, e.g.
//   ~Saved  /  id=org.wikipedia.dev:id/nav_tab_reading_lists
import { S } from '../BasePage.js';

export const TABS = {
  home: { id: 'nav_tab_home', label: 'Home' },
  saved: { id: 'nav_tab_reading_lists', label: 'Saved' },
  search: { id: 'nav_tab_search', label: 'Search' },
  activity: { id: 'nav_tab_edits', label: 'Activity' },
  more: { id: 'nav_tab_more', label: 'More' },
};

const SEL = {
  bar: S.id('main_nav_tab_layout'),
  tab: (key) => S.id(TABS[key].id),
};

class BottomNav {
  get bar() { return $(SEL.bar); }
  get selector() { return SEL.bar; }

  tab(key) {
    return $(SEL.tab(key));
  }

  async open(key) {
    const el = await this.tab(key);
    await el.waitForDisplayed({ timeoutMsg: `Bottom tab "${TABS[key].label}" not displayed` });
    logAction('tap', `Bottom bar "${TABS[key].label}"`);
    await el.click();
  }

  async isSelected(key) {
    return (await this.tab(key).getAttribute('selected')) === 'true';
  }

  async waitUntilSelected(key, timeout = 10000) {
    await driver.waitUntil(() => this.isSelected(key), {
      timeout,
      timeoutMsg: `Bottom tab "${TABS[key].label}" did not become selected`,
    });
  }
}

export default new BottomNav();
