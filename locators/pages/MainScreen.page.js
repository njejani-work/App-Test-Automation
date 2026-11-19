// AUTO-GENERATED from locators/MainScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends MainScreenClass { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.main.MainActivity | updated: 2026-11-11T16:53:44.711Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  fragmentContainerView: ["id=org.wikipedia.dev:id/fragment_container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/fragment_container\"]"],
  fragmentMainCoordinatorView: ["id=org.wikipedia.dev:id/fragment_main_coordinator", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/fragment_main_coordinator\"]"],
  mainPagerList: ["id=org.wikipedia.dev:id/main_view_pager", "//androidx.viewpager.widget.ViewPager[@resource-id=\"org.wikipedia.dev:id/main_view_pager\"]"],
  list: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]"],
  communityText: ["android=new UiSelector().text(\"Community\")", "//android.widget.TextView[@text=\"Community\"]"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[3]"],
  forYouText: ["android=new UiSelector().text(\"For you\")", "//android.widget.TextView[@text=\"For you\"]"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[4]"],
  enText: ["android=new UiSelector().text(\"EN\")", "//android.widget.TextView[@text=\"EN\"]"],
  view: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]"],
  contentAndResourcesSelectedText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.widget.TextView[1]"],
  todayNov112026Text: ["android=new UiSelector().text(\"Today - Nov 11, 2026\")", "//android.widget.TextView[@text=\"Today - Nov 11, 2026\"]"],
  featuredArticleText: ["android=new UiSelector().text(\"Featured article\")", "//android.widget.TextView[@text=\"Featured article\"]"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[2]/android.view.View[1]"],
  moreOptionsView: ["(//android.view.View[@content-desc=\"More options\"])[1]", "~More options"],
  featuredArticlesAreSomeText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[2]/android.widget.TextView[2]"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[2]/android.view.View[2]"],
  spanLangEnDirView: ["~<span lang=\"en\" dir=\"ltr\"><span class=\"mw-page-title-main\">U.S. Route 101</span></span>", "//android.view.View[@content-desc='<span lang=\"en\" dir=\"ltr\"><span class=\"mw-page-title-main\">U.S. Route 101</span></span>']"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[2]/android.view.View[2]/android.view.View[3]"],
  saveView: ["~Save", "//android.view.View[@content-desc=\"Save\"]"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[2]/android.view.View[2]/android.view.View[4]"],
  shareView: ["~Share", "//android.view.View[@content-desc=\"Share\"]"],
  mainNavTabBorderView: ["id=org.wikipedia.dev:id/main_nav_tab_border", "//android.view.View[@resource-id=\"org.wikipedia.dev:id/main_nav_tab_border\"]"],
  mainNavTabContainerView: ["id=org.wikipedia.dev:id/main_nav_tab_container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/main_nav_tab_container\"]"],
  mainNavTabLayoutView: ["id=org.wikipedia.dev:id/main_nav_tab_layout", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/main_nav_tab_layout\"]"],
  navTabHomeView: ["~Home", "id=org.wikipedia.dev:id/nav_tab_home", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/nav_tab_home\" and @content-desc=\"Home\"]"],
  navigationBarItemContentContainerView: ["(//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_content_container\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_content_container\").instance(0)", "id=org.wikipedia.dev:id/navigation_bar_item_content_container"],
  navigationBarItemIconContainerView: ["(//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_icon_container\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_icon_container\").instance(0)", "id=org.wikipedia.dev:id/navigation_bar_item_icon_container"],
  navigationBarItemActiveIndicatorView: ["id=org.wikipedia.dev:id/navigation_bar_item_active_indicator_view", "//android.view.View[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_active_indicator_view\"]"],
  navigationBarItemInnerContentContainerView: ["(//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_inner_content_container\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_inner_content_container\").instance(0)", "id=org.wikipedia.dev:id/navigation_bar_item_inner_content_container"],
  navigationBarItemIconImage: ["(//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_icon_view\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_icon_view\").instance(0)", "id=org.wikipedia.dev:id/navigation_bar_item_icon_view"],
  navigationBarItemLabelsGroupView: ["(//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_labels_group\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_labels_group\").instance(0)", "id=org.wikipedia.dev:id/navigation_bar_item_labels_group"],
  navigationBarItemLargeLabelText: ["id=org.wikipedia.dev:id/navigation_bar_item_large_label_view", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_large_label_view\" and @text=\"Saved\"]", "android=new UiSelector().text(\"Saved\")"],
  navTabReadingListsBtn: ["~Saved", "id=org.wikipedia.dev:id/nav_tab_reading_lists", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/nav_tab_reading_lists\" and @content-desc=\"Saved\"]"],
  navTabOverlayDotImage: ["id=org.wikipedia.dev:id/nav_tab_overlay_dot", "//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/nav_tab_overlay_dot\"]"],
  navigationBarItemSmallLabelText: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").text(\"Home\")", "android=new UiSelector().text(\"Home\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\" and @text=\"Home\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").instance(0)"],
  navTabSearchBtn: ["~Search", "id=org.wikipedia.dev:id/nav_tab_search", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/nav_tab_search\" and @content-desc=\"Search\"]"],
  navigationBarItemSmallLabelText2: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").text(\"Search\")", "android=new UiSelector().text(\"Search\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\" and @text=\"Search\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").instance(1)"],
  navTabEditsBtn: ["~Activity", "id=org.wikipedia.dev:id/nav_tab_edits", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/nav_tab_edits\" and @content-desc=\"Activity\"]"],
  navigationBarItemSmallLabelText3: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").text(\"Activity\")", "android=new UiSelector().text(\"Activity\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\" and @text=\"Activity\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").instance(2)"],
  navTabMoreBtn: ["~More", "id=org.wikipedia.dev:id/nav_tab_more", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/nav_tab_more\" and @content-desc=\"More\"]"],
  navigationBarItemSmallLabelText4: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").text(\"More\")", "android=new UiSelector().text(\"More\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\" and @text=\"More\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").instance(3)"],
  thatTheXiJinpingText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.widget.TextView[1]"],
  text: ["android=new UiSelector().text(\"?\")", "//android.widget.TextView[@text=\"?\"]"],
  btn8: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.view.View[3]"],
  moreDidYouKnowText: ["android=new UiSelector().text(\"More did you know\")", "//android.widget.TextView[@text=\"More did you know\"]"],
  moreDidYouKnowView: ["~More did you know", "//android.view.View[@content-desc=\"More did you know\"]"],
  inTheNewsText: ["android=new UiSelector().text(\"In the news\")", "//android.widget.TextView[@text=\"In the news\"]"],
  articlesThatHaveBeenText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[2]/android.widget.TextView[2]"],
  btn9: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[2]/android.view.View[2]/android.view.View[1]"],
  nov8InStockView: ["~<!--Nov 8-->In stock car racing, <a rel=\"mw:WikiLink\" href=\"./Kyle_Larson\" title=\"Kyle Larson\" id=\"mwBg\">Kyle Larson</a> <i id=\"mwBw\"></i> wins <b id=\"mwCA\"><a rel=\"mw:WikiLink\" href=\"./2026_NASCAR_Cup_Series\" title=\"2026 NASCAR Cup Series\" id=\"mwCQ\">the NASCAR Cup Series</a></b>.", "//android.view.View[@content-desc='<!--Nov 8-->In stock car racing, <a rel=\"mw:WikiLink\" href=\"./Kyle_Larson\" title=\"Kyle Larson\" id=\"mwBg\">Kyle Larson</a> <i id=\"mwBw\"></i> wins <b id=\"mwCA\"><a rel=\"mw:WikiLink\" href=\"./2026_NASCAR_Cup_Series\" title=\"2026 NASCAR Cup Series\" id=\"mwCQ\">the NASCAR Cup Series</a></b>.']"],
  view2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.view.View[1]"],
  btn10: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.view.View[1]/android.view.View[1]"],
  inStockCarRacingText: ["android=new UiSelector().text(\"In stock car racing, Kyle Larson wins the NASCAR Cup Series.\")", "//android.widget.TextView[@text=\"In stock car racing, Kyle Larson wins the NASCAR Cup Series.\"]"],
  onThisDayText: ["android=new UiSelector().text(\"On this day\")", "//android.widget.TextView[@text=\"On this day\"]"],
  discoverHistoricalEventsFromText: ["android=new UiSelector().text(\"Discover historical events from this day\")", "//android.widget.TextView[@text=\"Discover historical events from this day\"]"],
  el2008Text: ["android=new UiSelector().text(\"2008\")", "//android.widget.TextView[@text=\"2008\"]"],
  el18YearsAgoText: ["android=new UiSelector().text(\"18 years ago\")", "//android.widget.TextView[@text=\"18 years ago\"]"],
  after30YearsInText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[2]/android.widget.TextView[5]"],
  theHouseOfLordsText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.widget.TextView[1]"],
  list2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.widget.HorizontalScrollView[1]"],
  btn11: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.widget.HorizontalScrollView[1]/android.view.View[1]"],
  houseOfLordsActText: ["android=new UiSelector().text(\"House of Lords Act 1999\")", "//android.widget.TextView[@text=\"House of Lords Act 1999\"]"],
  actOfTheParliamentText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.widget.HorizontalScrollView[1]/android.view.View[1]/android.widget.TextView[2]"],
  btn12: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.widget.HorizontalScrollView[1]/android.view.View[1]/android.view.View[2]"],
  btn13: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.widget.HorizontalScrollView[1]/android.view.View[2]"],
  royalAssentText: ["android=new UiSelector().text(\"Royal assent\")", "//android.widget.TextView[@text=\"Royal assent\"]"],
  formalApprovalOfAText: ["android=new UiSelector().text(\"Formal approval of a proposed law in monarchies\")", "//android.widget.TextView[@text=\"Formal approval of a proposed law in monarchies\"]"],
  btn14: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.view.View[2]"],
  moreOnThisDayText: ["android=new UiSelector().text(\"More on this day\")", "//android.widget.TextView[@text=\"More on this day\"]"],
  moreOnThisDayView: ["~More on this day", "//android.view.View[@content-desc=\"More on this day\"]"],
  pictureOfTheDayText: ["android=new UiSelector().text(\"Picture of the day\")", "//android.widget.TextView[@text=\"Picture of the day\"]"],
  dailyImagesOnWikimediaText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[2]/android.widget.TextView[2]"],
  fileKoCielecView: ["~File:Kościelec view 2.jpg", "//android.view.View[@content-desc=\"File:Kościelec view 2.jpg\"]"],
  btn15: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[2]/android.view.View[2]/android.view.View[2]"],
  downloadView: ["~Download", "//android.view.View[@content-desc=\"Download\"]"],
  panoramicViewTowardsWinicaText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]/android.view.View[1]/android.view.View[2]/android.widget.TextView[1]"],
  kallernaOwnWorkText: ["android=new UiSelector().text(\"kallerna - Own work\")", "//android.widget.TextView[@text=\"kallerna - Own work\"]"],
  ccBySa4Text: ["android=new UiSelector().text(\"CC BY-SA 4.0\")", "//android.widget.TextView[@text=\"CC BY-SA 4.0\"]"],
  btn16: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[2]"],
  mainToolbarView: ["id=org.wikipedia.dev:id/main_toolbar", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/main_toolbar\"]"],
  savedText: ["(//android.widget.TextView[@text=\"Saved\"])[1]", "android=new UiSelector().text(\"Saved\")"],
  menuFilterReadingListsArticlesBtn: ["~Filter saved articles", "id=org.wikipedia.dev:id/menu_filter_reading_lists_articles", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/menu_filter_reading_lists_articles\" and @content-desc=\"Filter saved articles\"]"],
  menuSearchListsBtn: ["~Filter my lists", "id=org.wikipedia.dev:id/menu_search_lists", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/menu_search_lists\" and @content-desc=\"Filter my lists\"]"],
  menuOverflowBtn: ["~More options", "id=org.wikipedia.dev:id/menu_overflow_button", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/menu_overflow_button\" and @content-desc=\"More options\"]"],
  btn17: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]"],
  allArticlesText: ["android=new UiSelector().text(\"All articles\")", "//android.widget.TextView[@text=\"All articles\"]"],
  btn18: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[2]"],
  readingListsText: ["android=new UiSelector().text(\"Reading lists\")", "//android.widget.TextView[@text=\"Reading lists\"]"],
  btn19: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[3]/android.view.View[1]/android.view.View[1]"],
  syncReadingListsText: ["android=new UiSelector().text(\"Sync reading lists\")", "//android.widget.TextView[@text=\"Sync reading lists\"]"],
  readingListsCanNowText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[3]/android.view.View[1]/android.view.View[1]/android.widget.TextView[2]"],
  btn20: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[3]/android.view.View[1]/android.view.View[1]/android.view.View[2]"],
  logInJoinWikipediaText: ["android=new UiSelector().text(\"Log in / join Wikipedia\")", "//android.widget.TextView[@text=\"Log in / join Wikipedia\"]"],
  btn21: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[3]/android.view.View[1]/android.view.View[1]/android.view.View[3]"],
  notNowText: ["android=new UiSelector().text(\"Not now\")", "//android.widget.TextView[@text=\"Not now\"]"],
  newText: ["android=new UiSelector().text(\"NEW!\")", "//android.widget.TextView[@text=\"NEW!\"]"],
  discoverArticlesPickedJustText: ["android=new UiSelector().text(\"Discover articles picked just for you\")", "//android.widget.TextView[@text=\"Discover articles picked just for you\"]"],
  yourWeeklyReadingListText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[3]/android.view.View[1]/android.view.View[1]/android.widget.TextView[2]"],
  getStartedText: ["android=new UiSelector().text(\"Get started\")", "//android.widget.TextView[@text=\"Get started\"]"],
  noThanksText: ["android=new UiSelector().text(\"No thanks\")", "//android.widget.TextView[@text=\"No thanks\"]"],
  organizeSavedArticlesWithText: ["android=new UiSelector().text(\"Organize saved articles with reading lists\")", "//android.widget.TextView[@text=\"Organize saved articles with reading lists\"]"],
  createReadingListsForText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.widget.ScrollView[1]/android.widget.TextView[2]"],
  btn22: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.widget.ScrollView[1]/android.view.View[1]"],
  createANewReadingText: ["android=new UiSelector().text(\"Create a new reading list\")", "//android.widget.TextView[@text=\"Create a new reading list\"]"],
  snackbarText: ["id=org.wikipedia.dev:id/snackbar_text", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/snackbar_text\"]"],
  btn23: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[3]/android.view.View[1]"],
  myReadingListText: ["android=new UiSelector().text(\"My reading list\")", "//android.widget.TextView[@text=\"My reading list\"]"],
  el0ArticlesText: ["android=new UiSelector().text(\"0 articles\")", "//android.widget.TextView[@text=\"0 articles\"]"],
  activityText: ["(//android.widget.TextView[@text=\"Activity\"])[1]", "android=new UiSelector().text(\"Activity\")"],
  emptyBtn: ["id=org.wikipedia.dev:id/empty", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/empty\" and @content-desc=\"More\"]", "~More"],
  list3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]"],
  logInOrCreateText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.widget.TextView[1]"],
  btn24: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.view.View[2]"],
  createAccountText: ["android=new UiSelector().text(\"Create account\")", "//android.widget.TextView[@text=\"Create account\"]"],
  btn25: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.view.View[3]"],
  logInText: ["android=new UiSelector().text(\"Log in\")", "//android.widget.TextView[@text=\"Log in\"]"],
  ourYearInReviewText: ["android=new UiSelector().text(\"Our Year in Review is here\")", "//android.widget.TextView[@text=\"Our Year in Review is here\"]"],
  rediscoverTheYearOnText: ["android=new UiSelector().text(\"Rediscover the year on Wikipedia.\")", "//android.widget.TextView[@text=\"Rediscover the year on Wikipedia.\"]"],
  btn26: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.view.View[4]/android.view.View[1]"],
  navigationBarItemSmallLabelText5: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").text(\"Saved\")", "android=new UiSelector().text(\"Saved\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\" and @text=\"Saved\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/navigation_bar_item_small_label_view\").instance(1)"],
  btn27: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[3]/android.view.View[2]"],
  btn28: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/androidx.viewpager.widget.ViewPager[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[3]/android.view.View[3]"],
};

class MainScreen extends BasePage {
  constructor() {
    super(L, ["menuFilterReadingListsArticlesBtn","spanLangEnDirView","saveView"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
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

  /** View */
  get btn() {
    return $(L.btn[0]);
  }

  /** TextView "Community" */
  get communityText() {
    return $(L.communityText[0]);
  }

  /** View */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "For you" */
  get forYouText() {
    return $(L.forYouText[0]);
  }

  /** View */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "EN" */
  get enText() {
    return $(L.enText[0]);
  }

  /** View */
  get view() {
    return $(L.view[0]);
  }

  /** TextView "Content and resources selected by and ab" */
  get contentAndResourcesSelectedText() {
    return $(L.contentAndResourcesSelectedText[0]);
  }

  /** TextView "Today - Nov 11, 2026" */
  get todayNov112026Text() {
    return $(L.todayNov112026Text[0]);
  }

  /** TextView "Featured article" */
  get featuredArticleText() {
    return $(L.featuredArticleText[0]);
  }

  /** View */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** View */
  get moreOptionsView() {
    return $(L.moreOptionsView[0]);
  }

  /** TextView "Featured articles are some of the highes" */
  get featuredArticlesAreSomeText() {
    return $(L.featuredArticlesAreSomeText[0]);
  }

  /** View */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** View */
  get spanLangEnDirView() {
    return $(L.spanLangEnDirView[0]);
  }

  /** View */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** View */
  get saveView() {
    return $(L.saveView[0]);
  }

  /** View */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** View */
  get shareView() {
    return $(L.shareView[0]);
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
  get navTabHomeView() {
    return $(L.navTabHomeView[0]);
  }

  /** LinearLayout */
  get navigationBarItemContentContainerView() {
    return $(L.navigationBarItemContentContainerView[0]);
  }

  /** FrameLayout */
  get navigationBarItemIconContainerView() {
    return $(L.navigationBarItemIconContainerView[0]);
  }

  /** View */
  get navigationBarItemActiveIndicatorView() {
    return $(L.navigationBarItemActiveIndicatorView[0]);
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

  /** TextView "Saved" */
  get navigationBarItemLargeLabelText() {
    return $(L.navigationBarItemLargeLabelText[0]);
  }

  /** FrameLayout */
  get navTabReadingListsBtn() {
    return $(L.navTabReadingListsBtn[0]);
  }

  /** ImageView */
  get navTabOverlayDotImage() {
    return $(L.navTabOverlayDotImage[0]);
  }

  /** TextView "Home" */
  get navigationBarItemSmallLabelText() {
    return $(L.navigationBarItemSmallLabelText[0]);
  }

  /** FrameLayout */
  get navTabSearchBtn() {
    return $(L.navTabSearchBtn[0]);
  }

  /** TextView "Search" */
  get navigationBarItemSmallLabelText2() {
    return $(L.navigationBarItemSmallLabelText2[0]);
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

  /** TextView "... that the Xi Jinping–promoted Great C" */
  get thatTheXiJinpingText() {
    return $(L.thatTheXiJinpingText[0]);
  }

  /** TextView "?" */
  get text() {
    return $(L.text[0]);
  }

  /** View */
  get btn8() {
    return $(L.btn8[0]);
  }

  /** TextView "More did you know" */
  get moreDidYouKnowText() {
    return $(L.moreDidYouKnowText[0]);
  }

  /** View */
  get moreDidYouKnowView() {
    return $(L.moreDidYouKnowView[0]);
  }

  /** TextView "In the news" */
  get inTheNewsText() {
    return $(L.inTheNewsText[0]);
  }

  /** TextView "Articles that have been substantially up" */
  get articlesThatHaveBeenText() {
    return $(L.articlesThatHaveBeenText[0]);
  }

  /** View */
  get btn9() {
    return $(L.btn9[0]);
  }

  /** View */
  get nov8InStockView() {
    return $(L.nov8InStockView[0]);
  }

  /** View */
  get view2() {
    return $(L.view2[0]);
  }

  /** View */
  get btn10() {
    return $(L.btn10[0]);
  }

  /** TextView "In stock car racing, Kyle Larson wins th" */
  get inStockCarRacingText() {
    return $(L.inStockCarRacingText[0]);
  }

  /** TextView "On this day" */
  get onThisDayText() {
    return $(L.onThisDayText[0]);
  }

  /** TextView "Discover historical events from this day" */
  get discoverHistoricalEventsFromText() {
    return $(L.discoverHistoricalEventsFromText[0]);
  }

  /** TextView "2008" */
  get el2008Text() {
    return $(L.el2008Text[0]);
  }

  /** TextView "18 years ago" */
  get el18YearsAgoText() {
    return $(L.el18YearsAgoText[0]);
  }

  /** TextView "After 30 years in power, Maumoon Abdul G" */
  get after30YearsInText() {
    return $(L.after30YearsInText[0]);
  }

  /** TextView "The House of Lords Act was given royal a" */
  get theHouseOfLordsText() {
    return $(L.theHouseOfLordsText[0]);
  }

  /** HorizontalScrollView */
  get list2() {
    return $(L.list2[0]);
  }

  /** View */
  get btn11() {
    return $(L.btn11[0]);
  }

  /** TextView "House of Lords Act 1999" */
  get houseOfLordsActText() {
    return $(L.houseOfLordsActText[0]);
  }

  /** TextView "Act of the Parliament of the United King" */
  get actOfTheParliamentText() {
    return $(L.actOfTheParliamentText[0]);
  }

  /** View */
  get btn12() {
    return $(L.btn12[0]);
  }

  /** View */
  get btn13() {
    return $(L.btn13[0]);
  }

  /** TextView "Royal assent" */
  get royalAssentText() {
    return $(L.royalAssentText[0]);
  }

  /** TextView "Formal approval of a proposed law in mon" */
  get formalApprovalOfAText() {
    return $(L.formalApprovalOfAText[0]);
  }

  /** View */
  get btn14() {
    return $(L.btn14[0]);
  }

  /** TextView "More on this day" */
  get moreOnThisDayText() {
    return $(L.moreOnThisDayText[0]);
  }

  /** View */
  get moreOnThisDayView() {
    return $(L.moreOnThisDayView[0]);
  }

  /** TextView "Picture of the day" */
  get pictureOfTheDayText() {
    return $(L.pictureOfTheDayText[0]);
  }

  /** TextView "Daily images on Wikimedia Commons, selec" */
  get dailyImagesOnWikimediaText() {
    return $(L.dailyImagesOnWikimediaText[0]);
  }

  /** View */
  get fileKoCielecView() {
    return $(L.fileKoCielecView[0]);
  }

  /** View */
  get btn15() {
    return $(L.btn15[0]);
  }

  /** View */
  get downloadView() {
    return $(L.downloadView[0]);
  }

  /** TextView "Panoramic view towards Świnica from Kośc" */
  get panoramicViewTowardsWinicaText() {
    return $(L.panoramicViewTowardsWinicaText[0]);
  }

  /** TextView "kallerna - Own work" */
  get kallernaOwnWorkText() {
    return $(L.kallernaOwnWorkText[0]);
  }

  /** TextView "CC BY-SA 4.0" */
  get ccBySa4Text() {
    return $(L.ccBySa4Text[0]);
  }

  /** View */
  get btn16() {
    return $(L.btn16[0]);
  }

  /** ViewGroup */
  get mainToolbarView() {
    return $(L.mainToolbarView[0]);
  }

  /** TextView "Saved" */
  get savedText() {
    return $(L.savedText[0]);
  }

  /** Button */
  get menuFilterReadingListsArticlesBtn() {
    return $(L.menuFilterReadingListsArticlesBtn[0]);
  }

  /** Button */
  get menuSearchListsBtn() {
    return $(L.menuSearchListsBtn[0]);
  }

  /** Button */
  get menuOverflowBtn() {
    return $(L.menuOverflowBtn[0]);
  }

  /** View */
  get btn17() {
    return $(L.btn17[0]);
  }

  /** TextView "All articles" */
  get allArticlesText() {
    return $(L.allArticlesText[0]);
  }

  /** View */
  get btn18() {
    return $(L.btn18[0]);
  }

  /** TextView "Reading lists" */
  get readingListsText() {
    return $(L.readingListsText[0]);
  }

  /** View */
  get btn19() {
    return $(L.btn19[0]);
  }

  /** TextView "Sync reading lists" */
  get syncReadingListsText() {
    return $(L.syncReadingListsText[0]);
  }

  /** TextView "Reading lists can now be synced across d" */
  get readingListsCanNowText() {
    return $(L.readingListsCanNowText[0]);
  }

  /** View */
  get btn20() {
    return $(L.btn20[0]);
  }

  /** TextView "Log in / join Wikipedia" */
  get logInJoinWikipediaText() {
    return $(L.logInJoinWikipediaText[0]);
  }

  /** View */
  get btn21() {
    return $(L.btn21[0]);
  }

  /** TextView "Not now" */
  get notNowText() {
    return $(L.notNowText[0]);
  }

  /** TextView "NEW!" */
  get newText() {
    return $(L.newText[0]);
  }

  /** TextView "Discover articles picked just for you" */
  get discoverArticlesPickedJustText() {
    return $(L.discoverArticlesPickedJustText[0]);
  }

  /** TextView "Your weekly reading list of Wikipedia ar" */
  get yourWeeklyReadingListText() {
    return $(L.yourWeeklyReadingListText[0]);
  }

  /** TextView "Get started" */
  get getStartedText() {
    return $(L.getStartedText[0]);
  }

  /** TextView "No thanks" */
  get noThanksText() {
    return $(L.noThanksText[0]);
  }

  /** TextView "Organize saved articles with reading lis" */
  get organizeSavedArticlesWithText() {
    return $(L.organizeSavedArticlesWithText[0]);
  }

  /** TextView "Create reading lists for places to trave" */
  get createReadingListsForText() {
    return $(L.createReadingListsForText[0]);
  }

  /** View */
  get btn22() {
    return $(L.btn22[0]);
  }

  /** TextView "Create a new reading list" */
  get createANewReadingText() {
    return $(L.createANewReadingText[0]);
  }

  /** TextView "To set up your recommended reading list " */
  get snackbarText() {
    return $(L.snackbarText[0]);
  }

  /** View */
  get btn23() {
    return $(L.btn23[0]);
  }

  /** TextView "My reading list" */
  get myReadingListText() {
    return $(L.myReadingListText[0]);
  }

  /** TextView "0 articles" */
  get el0ArticlesText() {
    return $(L.el0ArticlesText[0]);
  }

  /** TextView "Activity" */
  get activityText() {
    return $(L.activityText[0]);
  }

  /** Button */
  get emptyBtn() {
    return $(L.emptyBtn[0]);
  }

  /** ScrollView */
  get list3() {
    return $(L.list3[0]);
  }

  /** TextView "Log in or create an account to view your" */
  get logInOrCreateText() {
    return $(L.logInOrCreateText[0]);
  }

  /** View */
  get btn24() {
    return $(L.btn24[0]);
  }

  /** TextView "Create account" */
  get createAccountText() {
    return $(L.createAccountText[0]);
  }

  /** View */
  get btn25() {
    return $(L.btn25[0]);
  }

  /** TextView "Log in" */
  get logInText() {
    return $(L.logInText[0]);
  }

  /** TextView "Our Year in Review is here" */
  get ourYearInReviewText() {
    return $(L.ourYearInReviewText[0]);
  }

  /** TextView "Rediscover the year on Wikipedia." */
  get rediscoverTheYearOnText() {
    return $(L.rediscoverTheYearOnText[0]);
  }

  /** View */
  get btn26() {
    return $(L.btn26[0]);
  }

  /** TextView "Saved" */
  get navigationBarItemSmallLabelText5() {
    return $(L.navigationBarItemSmallLabelText5[0]);
  }

  /** View */
  get btn27() {
    return $(L.btn27[0]);
  }

  /** View */
  get btn28() {
    return $(L.btn28[0]);
  }
}

export { MainScreen as MainScreenClass, L as MainScreenLocators };
export default new MainScreen();
