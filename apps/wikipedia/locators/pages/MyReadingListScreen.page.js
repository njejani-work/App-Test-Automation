// AUTO-GENERATED from locators/MyReadingListScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends MyReadingListScreenClass { async login(phone) { ... } }
// Screen: My reading list | activity: org.wikipedia.readinglist.ReadingListActivity | updated: 2026-11-11T16:53:21.386Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  fragmentContainerView: ["id=org.wikipedia.dev:id/fragment_container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/fragment_container\"]"],
  fragmentReadingListCoordinatorList: ["id=org.wikipedia.dev:id/fragment_reading_list_coordinator", "//android.widget.ScrollView[@resource-id=\"org.wikipedia.dev:id/fragment_reading_list_coordinator\"]"],
  readingListAppBarView: ["id=org.wikipedia.dev:id/reading_list_app_bar", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/reading_list_app_bar\"]"],
  readingListToolbarContainerView: ["id=org.wikipedia.dev:id/reading_list_toolbar_container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/reading_list_toolbar_container\"]"],
  readingListHeaderView: ["id=org.wikipedia.dev:id/reading_list_header", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/reading_list_header\"]"],
  readingListHeaderGradientView: ["id=org.wikipedia.dev:id/reading_list_header_image_gradient", "//android.view.View[@resource-id=\"org.wikipedia.dev:id/reading_list_header_image_gradient\"]"],
  readingListHeaderEmptyImage: ["id=org.wikipedia.dev:id/reading_list_header_empty_image", "//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/reading_list_header_empty_image\"]"],
  readingListToolbarView: ["id=org.wikipedia.dev:id/reading_list_toolbar", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/reading_list_toolbar\"]"],
  navigateUpBtn: ["~Navigate up", "//android.widget.ImageButton[@content-desc=\"Navigate up\"]"],
  menuSearchListsBtn: ["~Filter my lists", "id=org.wikipedia.dev:id/menu_search_lists", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/menu_search_lists\" and @content-desc=\"Filter my lists\"]"],
  menuSortOptionsBtn: ["~Sort", "id=org.wikipedia.dev:id/menu_sort_options", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/menu_sort_options\" and @content-desc=\"Sort\"]"],
  readingListSwipeRefreshView: ["id=org.wikipedia.dev:id/reading_list_swipe_refresh", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/reading_list_swipe_refresh\"]"],
  readingListRecyclerList: ["id=org.wikipedia.dev:id/reading_list_recycler_view", "//androidx.recyclerview.widget.RecyclerView[@resource-id=\"org.wikipedia.dev:id/reading_list_recycler_view\"]"],
  view: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.ScrollView[1]/android.view.ViewGroup[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.view.ViewGroup[1]"],
  itemTitleContainerView: ["id=org.wikipedia.dev:id/item_title_container", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/item_title_container\"]"],
  itemTitleText: ["id=org.wikipedia.dev:id/item_title", "android=new UiSelector().text(\"My reading list\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/item_title\" and @text=\"My reading list\"]"],
  itemReadingListStatisticalDescriptionText: ["id=org.wikipedia.dev:id/item_reading_list_statistical_description", "android=new UiSelector().text(\"0 of 0 articles available offline\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/item_reading_list_statistical_description\" and @text=\"0 of 0 articles available offline\"]"],
  itemShareBtn: ["~Share…", "id=org.wikipedia.dev:id/item_share_button", "//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/item_share_button\" and @content-desc=\"Share…\"]"],
  itemOverflowMenuBtn: ["~More options", "id=org.wikipedia.dev:id/item_overflow_menu", "//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/item_overflow_menu\" and @content-desc=\"More options\"]"],
  readingListEmptyText: ["id=org.wikipedia.dev:id/reading_list_empty_text", "android=new UiSelector().text(\"You have no articles added to this list.\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/reading_list_empty_text\" and @text=\"You have no articles added to this list.\"]"],
};

class MyReadingListScreen extends BasePage {
  constructor() {
    super(L, ["menuSortOptionsBtn","itemShareBtn","readingListHeaderGradientView"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** FrameLayout */
  get fragmentContainerView() {
    return $(L.fragmentContainerView[0]);
  }

  /** ScrollView */
  get fragmentReadingListCoordinatorList() {
    return $(L.fragmentReadingListCoordinatorList[0]);
  }

  /** LinearLayout */
  get readingListAppBarView() {
    return $(L.readingListAppBarView[0]);
  }

  /** FrameLayout */
  get readingListToolbarContainerView() {
    return $(L.readingListToolbarContainerView[0]);
  }

  /** FrameLayout */
  get readingListHeaderView() {
    return $(L.readingListHeaderView[0]);
  }

  /** View */
  get readingListHeaderGradientView() {
    return $(L.readingListHeaderGradientView[0]);
  }

  /** ImageView */
  get readingListHeaderEmptyImage() {
    return $(L.readingListHeaderEmptyImage[0]);
  }

  /** ViewGroup */
  get readingListToolbarView() {
    return $(L.readingListToolbarView[0]);
  }

  /** ImageButton */
  get navigateUpBtn() {
    return $(L.navigateUpBtn[0]);
  }

  /** Button */
  get menuSearchListsBtn() {
    return $(L.menuSearchListsBtn[0]);
  }

  /** Button */
  get menuSortOptionsBtn() {
    return $(L.menuSortOptionsBtn[0]);
  }

  /** ViewGroup */
  get readingListSwipeRefreshView() {
    return $(L.readingListSwipeRefreshView[0]);
  }

  /** RecyclerView */
  get readingListRecyclerList() {
    return $(L.readingListRecyclerList[0]);
  }

  /** ViewGroup */
  get view() {
    return $(L.view[0]);
  }

  /** ViewGroup */
  get itemTitleContainerView() {
    return $(L.itemTitleContainerView[0]);
  }

  /** TextView "My reading list" */
  get itemTitleText() {
    return $(L.itemTitleText[0]);
  }

  /** TextView "0 of 0 articles available offline" */
  get itemReadingListStatisticalDescriptionText() {
    return $(L.itemReadingListStatisticalDescriptionText[0]);
  }

  /** ImageView */
  get itemShareBtn() {
    return $(L.itemShareBtn[0]);
  }

  /** ImageView */
  get itemOverflowMenuBtn() {
    return $(L.itemOverflowMenuBtn[0]);
  }

  /** TextView "You have no articles added to this list." */
  get readingListEmptyText() {
    return $(L.readingListEmptyText[0]);
  }
}

export { MyReadingListScreen as MyReadingListScreenClass, L as MyReadingListScreenLocators };
export default new MyReadingListScreen();
