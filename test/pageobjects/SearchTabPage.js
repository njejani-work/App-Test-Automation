import BasePage, { S } from './BasePage.js';
import BottomNav from './components/BottomNav.js';
import Dialogs from './components/Dialogs.js';

// Search tab = search bar + reading History (MainActivity). Captured as locators/HistoryScreen.json.
//   search bar: id search_card, text "Search Wikipedia" (search_text_view), ~Voice input search
//   "History" (history_title); empty state "No recently viewed articles" (history_empty_title)
// First visit may show a bottom sheet "A Faster way to Search" (Add / ~Close): locators/MainScreen3.json
const SEL = {
  searchBar: S.id('search_card'),
  searchBarText: S.id('search_text_view'),
  voiceSearch: S.desc('Voice input search'),
  historyTitle: S.id('history_title'),
  historyEmpty: S.id('history_empty_title'),
};

class SearchTabPage extends BasePage {
  get anchors() {
    return [SEL.searchBar, SEL.historyTitle];
  }

  get searchBar() { return $(SEL.searchBar); }
  get historyTitle() { return $(SEL.historyTitle); }
  get historyEmpty() { return $(SEL.historyEmpty); }

  async open() {
    await BottomNav.open('search');
    await Dialogs.dismissAll({ timeout: 3000 }); // first visit: "A Faster way to Search" sheet -> ~Close
    await this.waitForOpen();
  }

  /** Tap the search bar: opens the search screen (SearchPage). */
  async openSearch() {
    await this.tap(SEL.searchBar);
  }
}

export default new SearchTabPage();
