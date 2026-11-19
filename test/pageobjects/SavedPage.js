import BasePage, { S } from './BasePage.js';
import BottomNav from './components/BottomNav.js';
import Dialogs from './components/Dialogs.js';

// Saved tab: reading lists (MainActivity). Captured as locators/MainScreen.json (toolbar, cards)
// and locators/MainScreen5.json (the ⋮ menu). Screenshot: locators/screenshots/MainScreen5.png
//   toolbar: "Saved", ~Filter saved articles, ~Filter my lists (menu_search_lists), ⋮ (menu_overflow_button)
//   sub-tabs: "All articles" / "Reading lists";  default list: "My reading list" / "0 articles"
//   ⋮ menu on "Reading lists": Select · Sort by… · Create new list · Import list · Refresh sync
//   ⋮ menu on "All articles":  Select · Sort by… · Refresh sync   (no Create new list!)
const SEL = {
  filterLists: S.id('menu_search_lists'),
  overflow: S.id('menu_overflow_button'),
  allArticlesTab: S.text('All articles'),
  readingListsTab: S.text('Reading lists'),
  defaultList: S.text('My reading list'),
  // ⋮ menu items
  menuCreateNewList: S.id('reading_lists_overflow_create_new_list'),
  menuSortBy: S.id('reading_lists_overflow_sort_by'),
  menuSelect: S.id('reading_lists_overflow_select'),
  list: (name) => S.text(name),
};

class SavedPage extends BasePage {
  get anchors() {
    return [SEL.filterLists, SEL.allArticlesTab];
  }

  get overflowButton() { return $(SEL.overflow); }
  get allArticlesTab() { return $(SEL.allArticlesTab); }
  get readingListsTab() { return $(SEL.readingListsTab); }
  /** Only exists after something has been saved: a fresh install has no lists (seen 11 Nov 2026). */
  get defaultList() { return $(SEL.defaultList); }

  async open() {
    await BottomNav.open('saved');
    await this.waitForOpen();
    // Promo cards load a moment after the tab: "NEW! Discover articles picked just for you
    // ... Get started / No thanks", "Sync reading lists ... Not now"
    await Dialogs.dismissAll({ timeout: 4000 });
  }

  async openMenu() {
    await this.tap(SEL.overflow);
    await $(SEL.menuCreateNewList).waitForDisplayed({ timeoutMsg: 'Saved ⋮ menu did not open' });
  }

  /** Switch to the "Reading lists" sub-tab (the app remembers the last one used). */
  async showReadingLists() {
    await this.tap(SEL.readingListsTab);
    await driver.pause(500); // tab swipe animation
  }

  /**
   * Reading lists sub-tab -> ⋮ -> "Create new list"; the name dialog opens (CreateReadingListDialog).
   * The ⋮ menu depends on the sub-tab (seen 11 Nov 2026): on "All articles" it only has
   * Select / Sort by… / Refresh sync; "Create new list" is only there on "Reading lists".
   */
  async startNewList() {
    await this.showReadingLists();
    await this.openMenu();
    await this.tap(SEL.menuCreateNewList);
  }

  list(name) {
    return $(SEL.list(name));
  }

  /** True if a reading list with this exact name is shown (switches to "Reading lists" if needed). */
  async hasList(name, timeout = 10000) {
    if (await this.anyDisplayed([SEL.list(name)])) return true;
    if (await this.anyDisplayed([SEL.readingListsTab])) await this.tap(SEL.readingListsTab);
    try {
      await this.list(name).waitForDisplayed({ timeout });
      return true;
    } catch {
      return false;
    }
  }
}

export default new SavedPage();
