// AUTO-GENERATED from locators/MainScreen5.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends MainScreen5Class { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.main.MainActivity | updated: 2026-11-11T16:53:28.838Z
import BasePage from './BasePage.js';

const L = {
  readingListsOverflowCardContainerView: ["id=org.wikipedia.dev:id/reading_lists_overflow_card_container", "//androidx.cardview.widget.CardView[@resource-id=\"org.wikipedia.dev:id/reading_lists_overflow_card_container\"]"],
  readingListsOverflowSelectLink: ["id=org.wikipedia.dev:id/reading_lists_overflow_select", "android=new UiSelector().text(\"Select\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/reading_lists_overflow_select\" and @text=\"Select\"]"],
  readingListsOverflowSortByLink: ["id=org.wikipedia.dev:id/reading_lists_overflow_sort_by", "android=new UiSelector().text(\"Sort by…\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/reading_lists_overflow_sort_by\" and @text=\"Sort by…\"]"],
  readingListsOverflowCreateNewListLink: ["id=org.wikipedia.dev:id/reading_lists_overflow_create_new_list", "android=new UiSelector().text(\"Create new list\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/reading_lists_overflow_create_new_list\" and @text=\"Create new list\"]"],
  readingListsOverflowImportListLink: ["id=org.wikipedia.dev:id/reading_lists_overflow_import_list", "android=new UiSelector().text(\"Import list\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/reading_lists_overflow_import_list\" and @text=\"Import list\"]"],
  readingListsOverflowRefreshBtn: ["id=org.wikipedia.dev:id/reading_lists_overflow_refresh", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/reading_lists_overflow_refresh\"]"],
  refreshSyncText: ["android=new UiSelector().text(\"Refresh sync\")", "//android.widget.TextView[@text=\"Refresh sync\"]"],
};

class MainScreen5 extends BasePage {
  constructor() {
    super(L, ["readingListsOverflowSelectLink","readingListsOverflowSortByLink","readingListsOverflowCreateNewListLink"]);
  }

  /** CardView */
  get readingListsOverflowCardContainerView() {
    return $(L.readingListsOverflowCardContainerView[0]);
  }

  /** TextView "Select" */
  get readingListsOverflowSelectLink() {
    return $(L.readingListsOverflowSelectLink[0]);
  }

  /** TextView "Sort by…" */
  get readingListsOverflowSortByLink() {
    return $(L.readingListsOverflowSortByLink[0]);
  }

  /** TextView "Create new list" */
  get readingListsOverflowCreateNewListLink() {
    return $(L.readingListsOverflowCreateNewListLink[0]);
  }

  /** TextView "Import list" */
  get readingListsOverflowImportListLink() {
    return $(L.readingListsOverflowImportListLink[0]);
  }

  /** LinearLayout */
  get readingListsOverflowRefreshBtn() {
    return $(L.readingListsOverflowRefreshBtn[0]);
  }

  /** TextView "Refresh sync" */
  get refreshSyncText() {
    return $(L.refreshSyncText[0]);
  }
}

export { MainScreen5 as MainScreen5Class, L as MainScreen5Locators };
export default new MainScreen5();
