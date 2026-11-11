import BasePage, { S } from './BasePage.js';

// The main screen with the bottom navigation bar. The tabs are created in code
// (app/src/main/java/org/wikipedia/navtab/NavTab.kt): each tab's view id is its menu id.
export const TABS = {
  home: { id: 'nav_tab_home', label: 'Home' },
  saved: { id: 'nav_tab_reading_lists', label: 'Saved' },
  search: { id: 'nav_tab_search', label: 'Search' },
  activity: { id: 'nav_tab_edits', label: 'Activity' },
  more: { id: 'nav_tab_more', label: 'More' },
};

const SEL = {
  navBar: S.id('main_nav_tab_layout'),
  tab: (key) => S.id(TABS[key].id),
};

class HomePage extends BasePage {
  get anchors() {
    return [SEL.navBar, SEL.tab('home')];
  }

  get navBar() { return $(SEL.navBar); }

  /** The tab's view, e.g. tab('search'). */
  tab(key) {
    return $(SEL.tab(key));
  }

  async openTab(key) {
    await this.tap(SEL.tab(key));
  }

  /** True when the tab is the selected one. */
  async isTabSelected(key) {
    return (await this.tab(key).getAttribute('selected')) === 'true';
  }
}

export default new HomePage();
