// AUTO-GENERATED from locators/HistoryScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends HistoryScreenClass { async login(phone) { ... } }
// Screen: History | activity: org.wikipedia.main.MainActivity | updated: 2026-11-11T16:49:19.312Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  mainToolbarView: ["id=org.wikipedia.dev:id/main_toolbar", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/main_toolbar\"]"],
  searchText: ["(//android.widget.TextView[@text=\"Search\"])[1]", "android=new UiSelector().text(\"Search\")"],
  fragmentContainerView: ["id=org.wikipedia.dev:id/fragment_container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/fragment_container\"]"],
  fragmentMainCoordinatorView: ["id=org.wikipedia.dev:id/fragment_main_coordinator", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/fragment_main_coordinator\"]"],
  mainPagerList: ["id=org.wikipedia.dev:id/main_view_pager", "//androidx.viewpager.widget.ViewPager[@resource-id=\"org.wikipedia.dev:id/main_view_pager\"]"],
  list: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]"],
  historyList: ["id=org.wikipedia.dev:id/history_list", "//androidx.recyclerview.widget.RecyclerView[@resource-id=\"org.wikipedia.dev:id/history_list\"]"],
  searchCardBtn: ["id=org.wikipedia.dev:id/search_card", "//androidx.cardview.widget.CardView[@resource-id=\"org.wikipedia.dev:id/search_card\"]"],
  searchIconImage: ["~Search Wikipedia", "id=org.wikipedia.dev:id/search_icon", "//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/search_icon\" and @content-desc=\"Search Wikipedia\"]"],
  searchText2: ["id=org.wikipedia.dev:id/search_text_view", "android=new UiSelector().text(\"Search Wikipedia\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/search_text_view\" and @text=\"Search Wikipedia\"]"],
  voiceSearchBtn: ["~Voice input search", "id=org.wikipedia.dev:id/voice_search_button", "//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/voice_search_button\" and @content-desc=\"Voice input search\"]"],
  historyTitleText: ["id=org.wikipedia.dev:id/history_title", "android=new UiSelector().text(\"History\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/history_title\" and @text=\"History\"]"],
  historyEmptyContainerView: ["id=org.wikipedia.dev:id/history_empty_container", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/history_empty_container\"]"],
  historyEmptyImage: ["id=org.wikipedia.dev:id/history_empty_image", "//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/history_empty_image\"]"],
  historyEmptyTitleText: ["id=org.wikipedia.dev:id/history_empty_title", "android=new UiSelector().text(\"No recently viewed articles\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/history_empty_title\" and @text=\"No recently viewed articles\"]"],
  historyEmptyMessageText: ["id=org.wikipedia.dev:id/history_empty_message", "android=new UiSelector().text(\"Track what you've been reading here.\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/history_empty_message\" and @text=\"Track what you've been reading here.\"]"],
  mainNavTabBorderView: ["id=org.wikipedia.dev:id/main_nav_tab_border", "//android.view.View[@resource-id=\"org.wikipedia.dev:id/main_nav_tab_border\"]"],
  mainNavTabContainerView: ["id=org.wikipedia.dev:id/main_nav_tab_container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/main_nav_tab_container\"]"],
  mainNavTabLayoutView: ["id=org.wikipedia.dev:id/main_nav_tab_layout", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/main_nav_tab_layout\"]"],
  navTabHomeBtn: ["~Home", "id=org.wikipedia.dev:id/nav_tab_home", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/nav_tab_home\" and @content-desc=\"Home\"]"],
  navigationBarItemContentContainerView: ["(//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_content_container\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_content_container\").instance(0)", "id=org.wikipedia.dev:id/navigation_bar_item_content_container"],
  navigationBarItemIconContainerView: ["(//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_icon_container\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_icon_container\").instance(0)", "id=org.wikipedia.dev:id/navigation_bar_item_icon_container"],
  navigationBarItemInnerContentContainerView: ["(//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_inner_content_container\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_inner_content_container\").instance(0)", "id=org.wikipedia.dev:id/navigation_bar_item_inner_content_container"],
  navigationBarItemIconImage: ["(//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_icon_view\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_icon_view\").instance(0)", "id=org.wikipedia.dev:id/navigation_bar_item_icon_view"],
  navigationBarItemLabelsGroupView: ["(//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_labels_group\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_labels_group\").instance(0)", "id=org.wikipedia.dev:id/navigation_bar_item_labels_group"],
  navigationBarItemSmallLabelText: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").text(\"Home\")", "android=new UiSelector().text(\"Home\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\" and @text=\"Home\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").instance(0)"],
  navTabReadingListsBtn: ["~Saved", "id=org.wikipedia.dev:id/nav_tab_reading_lists", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/nav_tab_reading_lists\" and @content-desc=\"Saved\"]"],
  navTabOverlayDotImage: ["(//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/nav_tab_overlay_dot\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/nav_tab_overlay_dot\").instance(0)", "id=org.wikipedia.dev:id/nav_tab_overlay_dot"],
  navigationBarItemSmallLabelText2: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").text(\"Saved\")", "android=new UiSelector().text(\"Saved\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\" and @text=\"Saved\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").instance(1)"],
  navTabSearchView: ["~Search", "id=org.wikipedia.dev:id/nav_tab_search", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/nav_tab_search\" and @content-desc=\"Search\"]"],
  navigationBarItemActiveIndicatorView: ["id=org.wikipedia.dev:id/navigation_bar_item_active_indicator_view", "//android.view.View[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_active_indicator_view\"]"],
  navigationBarItemLargeLabelText: ["id=org.wikipedia.dev:id/navigation_bar_item_large_label_view", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_large_label_view\" and @text=\"Search\"]", "android=new UiSelector().text(\"Search\")"],
  navTabEditsBtn: ["~Activity", "id=org.wikipedia.dev:id/nav_tab_edits", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/nav_tab_edits\" and @content-desc=\"Activity\"]"],
  navigationBarItemSmallLabelText3: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").text(\"Activity\")", "android=new UiSelector().text(\"Activity\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\" and @text=\"Activity\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").instance(2)"],
  navTabMoreBtn: ["~More", "id=org.wikipedia.dev:id/nav_tab_more", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/nav_tab_more\" and @content-desc=\"More\"]"],
  navigationBarItemSmallLabelText4: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").text(\"More\")", "android=new UiSelector().text(\"More\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\" and @text=\"More\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").instance(3)"],
};

class HistoryScreen extends BasePage {
  constructor() {
    super(L, ["searchCardBtn","voiceSearchBtn","searchIconImage"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** ViewGroup */
  get mainToolbarView() {
    return $(L.mainToolbarView[0]);
  }

  /** TextView "Search" */
  get searchText() {
    return $(L.searchText[0]);
  }

  /** FrameLayout */
  get fragmentContainerView() {
    return $(L.fragmentContainerView[0]);
  }

  /** ViewGroup */
  get fragmentMainCoordinatorView() {
    return $(L.fragmentMainCoordinatorView[0]);
  }

  /** ViewPager */
  get mainPagerList() {
    return $(L.mainPagerList[0]);
  }

  /** RecyclerView */
  get list() {
    return $(L.list[0]);
  }

  /** RecyclerView */
  get historyList() {
    return $(L.historyList[0]);
  }

  /** CardView */
  get searchCardBtn() {
    return $(L.searchCardBtn[0]);
  }

  /** ImageView */
  get searchIconImage() {
    return $(L.searchIconImage[0]);
  }

  /** TextView "Search Wikipedia" */
  get searchText2() {
    return $(L.searchText2[0]);
  }

  /** ImageView */
  get voiceSearchBtn() {
    return $(L.voiceSearchBtn[0]);
  }

  /** TextView "History" */
  get historyTitleText() {
    return $(L.historyTitleText[0]);
  }

  /** ViewGroup */
  get historyEmptyContainerView() {
    return $(L.historyEmptyContainerView[0]);
  }

  /** ImageView */
  get historyEmptyImage() {
    return $(L.historyEmptyImage[0]);
  }

  /** TextView "No recently viewed articles" */
  get historyEmptyTitleText() {
    return $(L.historyEmptyTitleText[0]);
  }

  /** TextView "Track what you've been reading here." */
  get historyEmptyMessageText() {
    return $(L.historyEmptyMessageText[0]);
  }

  /** View */
  get mainNavTabBorderView() {
    return $(L.mainNavTabBorderView[0]);
  }

  /** FrameLayout */
  get mainNavTabContainerView() {
    return $(L.mainNavTabContainerView[0]);
  }

  /** FrameLayout */
  get mainNavTabLayoutView() {
    return $(L.mainNavTabLayoutView[0]);
  }

  /** FrameLayout */
  get navTabHomeBtn() {
    return $(L.navTabHomeBtn[0]);
  }

  /** LinearLayout */
  get navigationBarItemContentContainerView() {
    return $(L.navigationBarItemContentContainerView[0]);
  }

  /** FrameLayout */
  get navigationBarItemIconContainerView() {
    return $(L.navigationBarItemIconContainerView[0]);
  }

  /** LinearLayout */
  get navigationBarItemInnerContentContainerView() {
    return $(L.navigationBarItemInnerContentContainerView[0]);
  }

  /** ImageView */
  get navigationBarItemIconImage() {
    return $(L.navigationBarItemIconImage[0]);
  }

  /** ViewGroup */
  get navigationBarItemLabelsGroupView() {
    return $(L.navigationBarItemLabelsGroupView[0]);
  }

  /** TextView "Home" */
  get navigationBarItemSmallLabelText() {
    return $(L.navigationBarItemSmallLabelText[0]);
  }

  /** FrameLayout */
  get navTabReadingListsBtn() {
    return $(L.navTabReadingListsBtn[0]);
  }

  /** ImageView */
  get navTabOverlayDotImage() {
    return $(L.navTabOverlayDotImage[0]);
  }

  /** TextView "Saved" */
  get navigationBarItemSmallLabelText2() {
    return $(L.navigationBarItemSmallLabelText2[0]);
  }

  /** FrameLayout */
  get navTabSearchView() {
    return $(L.navTabSearchView[0]);
  }

  /** View */
  get navigationBarItemActiveIndicatorView() {
    return $(L.navigationBarItemActiveIndicatorView[0]);
  }

  /** TextView "Search" */
  get navigationBarItemLargeLabelText() {
    return $(L.navigationBarItemLargeLabelText[0]);
  }

  /** FrameLayout */
  get navTabEditsBtn() {
    return $(L.navTabEditsBtn[0]);
  }

  /** TextView "Activity" */
  get navigationBarItemSmallLabelText3() {
    return $(L.navigationBarItemSmallLabelText3[0]);
  }

  /** FrameLayout */
  get navTabMoreBtn() {
    return $(L.navTabMoreBtn[0]);
  }

  /** TextView "More" */
  get navigationBarItemSmallLabelText4() {
    return $(L.navigationBarItemSmallLabelText4[0]);
  }
}

export { HistoryScreen as HistoryScreenClass, L as HistoryScreenLocators };
export default new HistoryScreen();
