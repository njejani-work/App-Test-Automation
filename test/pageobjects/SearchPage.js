import BasePage, { S } from './BasePage.js';
import HomePage from './HomePage.js';

// Search screen (SearchActivity). The text box is a standard Android SearchView
// (id search_cab_view), whose inner EditText has the id search_src_text.
// Results are drawn with Jetpack Compose (SearchResultsScreen.kt) and have no ids,
// so a result is found by its visible title.
const SEL = {
  searchBarOnTab: S.text('Search Wikipedia'),  // the bar at the top of the Search tab
  searchView: S.id('search_cab_view'),
  input: S.id('search_src_text'),
  anyInput: S.cls('android.widget.EditText'),   // fallback if the id ever changes
  result: (title) => S.textViewContains(title),
};

class SearchPage extends BasePage {
  get anchors() {
    return [SEL.input, SEL.searchView];
  }

  get input() { return $(SEL.input); }

  /** From the main screen: Search tab -> tap the search bar -> search screen. */
  async openFromNav() {
    await HomePage.openTab('search');
    if (!(await this.isOpen(1500))) {
      await this.tap(SEL.searchBarOnTab);
    }
    await this.waitForOpen();
  }

  async search(term) {
    const sel = (await this.anyDisplayed([SEL.input])) ? SEL.input : SEL.anyInput;
    await this.type(sel, term);
  }

  result(title) {
    return $(SEL.result(title));
  }

  async waitForResult(title, timeout = 20000) {
    await this.result(title).waitForDisplayed({
      timeout,
      timeoutMsg: `No search result containing "${title}" within ${timeout} ms (network? device language?)`,
    });
  }

  async resultCount(title) {
    return (await $$(SEL.result(title))).length;
  }

  /** Tap the first result whose title contains `title`. */
  async openResult(title) {
    await this.hideKeyboard();
    await this.tap(SEL.result(title));
  }
}

export default new SearchPage();
