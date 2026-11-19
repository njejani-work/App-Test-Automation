// AUTO-GENERATED from locators/SearchScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends SearchScreenClass { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.search.SearchActivity | updated: 2026-11-11T16:45:43.250Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  fragmentContainerView: ["id=org.wikipedia.dev:id/fragment_container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/fragment_container\"]"],
  searchContainerBtn: ["id=org.wikipedia.dev:id/search_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/search_container\"]"],
  searchToolbarView: ["id=org.wikipedia.dev:id/search_toolbar", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/search_toolbar\"]"],
  navigateUpBtn: ["~Navigate up", "//android.widget.ImageButton[@content-desc=\"Navigate up\"]"],
  searchLangContainerView: ["id=org.wikipedia.dev:id/search_lang_button_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/search_lang_button_container\"]"],
  searchCabView: ["id=org.wikipedia.dev:id/search_cab_view", "//androidx.appcompat.widget.LinearLayoutCompat[@resource-id=\"org.wikipedia.dev:id/search_cab_view\"]"],
  searchBarView: ["id=org.wikipedia.dev:id/search_bar", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/search_bar\"]"],
  searchFrameView: ["id=org.wikipedia.dev:id/search_edit_frame", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/search_edit_frame\"]"],
  searchPlateView: ["id=org.wikipedia.dev:id/search_plate", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/search_plate\"]"],
  searchSrcInput: ["id=org.wikipedia.dev:id/search_src_text", "android=new UiSelector().text(\"Search Wikipedia\")", "//android.widget.AutoCompleteTextView[@resource-id=\"org.wikipedia.dev:id/search_src_text\" and @text=\"Search Wikipedia\"]"],
  searchLangBtn: ["~Wikipedia languages", "id=org.wikipedia.dev:id/search_lang_button", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/search_lang_button\" and @content-desc=\"Wikipedia languages\"]"],
  langCodeText: ["id=org.wikipedia.dev:id/langCodeText", "android=new UiSelector().text(\"EN\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/langCodeText\" and @text=\"EN\"]"],
  fragmentSearchResultsView: ["id=org.wikipedia.dev:id/fragment_search_results", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/fragment_search_results\"]"],
  searchPanelRecentView: ["id=org.wikipedia.dev:id/search_panel_recent", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/search_panel_recent\"]"],
  recentSearchesContainerView: ["id=org.wikipedia.dev:id/recent_searches_container", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/recent_searches_container\"]"],
  searchEmptyContainerView: ["id=org.wikipedia.dev:id/search_empty_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/search_empty_container\"]"],
  searchEmptyImage: ["id=org.wikipedia.dev:id/search_empty_image", "//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/search_empty_image\"]"],
  searchEmptyMessageText: ["id=org.wikipedia.dev:id/search_empty_message", "android=new UiSelector().text(\"Search Wikipedia in more languages\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/search_empty_message\" and @text=\"Search Wikipedia in more languages\"]"],
  addLanguagesBtn: ["id=org.wikipedia.dev:id/add_languages_button", "android=new UiSelector().text(\"Add Wikipedia languages\")", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/add_languages_button\" and @text=\"Add Wikipedia languages\"]"],
  namespacesContainerView: ["id=org.wikipedia.dev:id/namespacesContainer", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/namespacesContainer\"]"],
  namespacesRecyclerList: ["id=org.wikipedia.dev:id/namespaces_recycler", "//androidx.recyclerview.widget.RecyclerView[@resource-id=\"org.wikipedia.dev:id/namespaces_recycler\"]"],
  namespaceLink: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").text(\"Namespaces\")", "android=new UiSelector().text(\"Namespaces\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/namespaceText\" and @text=\"Namespaces\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").instance(0)"],
  namespaceLink2: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").text(\"User:\")", "android=new UiSelector().text(\"User:\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/namespaceText\" and @text=\"User:\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").instance(1)"],
  namespaceLink3: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").text(\"Portal:\")", "android=new UiSelector().text(\"Portal:\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/namespaceText\" and @text=\"Portal:\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").instance(2)"],
  namespaceLink4: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").text(\"Help:\")", "android=new UiSelector().text(\"Help:\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/namespaceText\" and @text=\"Help:\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").instance(3)"],
  namespaceLink5: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").text(\"Wikipedia:\")", "android=new UiSelector().text(\"Wikipedia:\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/namespaceText\" and @text=\"Wikipedia:\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").instance(4)"],
  namespaceLink6: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").text(\"Template:\")", "android=new UiSelector().text(\"Template:\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/namespaceText\" and @text=\"Template:\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/namespaceText\").instance(5)"],
};

class SearchScreen extends BasePage {
  constructor() {
    super(L, ["searchSrcInput","addLanguagesBtn","searchToolbarView"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** FrameLayout */
  get fragmentContainerView() {
    return $(L.fragmentContainerView[0]);
  }

  /** LinearLayout */
  get searchContainerBtn() {
    return $(L.searchContainerBtn[0]);
  }

  /** ViewGroup */
  get searchToolbarView() {
    return $(L.searchToolbarView[0]);
  }

  /** ImageButton */
  get navigateUpBtn() {
    return $(L.navigateUpBtn[0]);
  }

  /** LinearLayout */
  get searchLangContainerView() {
    return $(L.searchLangContainerView[0]);
  }

  /** LinearLayoutCompat */
  get searchCabView() {
    return $(L.searchCabView[0]);
  }

  /** LinearLayout */
  get searchBarView() {
    return $(L.searchBarView[0]);
  }

  /** LinearLayout */
  get searchFrameView() {
    return $(L.searchFrameView[0]);
  }

  /** LinearLayout */
  get searchPlateView() {
    return $(L.searchPlateView[0]);
  }

  /** AutoCompleteTextView "Search Wikipedia" */
  get searchSrcInput() {
    return $(L.searchSrcInput[0]);
  }

  /** FrameLayout */
  get searchLangBtn() {
    return $(L.searchLangBtn[0]);
  }

  /** TextView "EN" */
  get langCodeText() {
    return $(L.langCodeText[0]);
  }

  /** FrameLayout */
  get fragmentSearchResultsView() {
    return $(L.fragmentSearchResultsView[0]);
  }

  /** FrameLayout */
  get searchPanelRecentView() {
    return $(L.searchPanelRecentView[0]);
  }

  /** ViewGroup */
  get recentSearchesContainerView() {
    return $(L.recentSearchesContainerView[0]);
  }

  /** LinearLayout */
  get searchEmptyContainerView() {
    return $(L.searchEmptyContainerView[0]);
  }

  /** ImageView */
  get searchEmptyImage() {
    return $(L.searchEmptyImage[0]);
  }

  /** TextView "Search Wikipedia in more languages" */
  get searchEmptyMessageText() {
    return $(L.searchEmptyMessageText[0]);
  }

  /** Button "Add Wikipedia languages" */
  get addLanguagesBtn() {
    return $(L.addLanguagesBtn[0]);
  }

  /** LinearLayout */
  get namespacesContainerView() {
    return $(L.namespacesContainerView[0]);
  }

  /** RecyclerView */
  get namespacesRecyclerList() {
    return $(L.namespacesRecyclerList[0]);
  }

  /** TextView "Namespaces" */
  get namespaceLink() {
    return $(L.namespaceLink[0]);
  }

  /** TextView "User:" */
  get namespaceLink2() {
    return $(L.namespaceLink2[0]);
  }

  /** TextView "Portal:" */
  get namespaceLink3() {
    return $(L.namespaceLink3[0]);
  }

  /** TextView "Help:" */
  get namespaceLink4() {
    return $(L.namespaceLink4[0]);
  }

  /** TextView "Wikipedia:" */
  get namespaceLink5() {
    return $(L.namespaceLink5[0]);
  }

  /** TextView "Template:" */
  get namespaceLink6() {
    return $(L.namespaceLink6[0]);
  }
}

export { SearchScreen as SearchScreenClass, L as SearchScreenLocators };
export default new SearchScreen();
