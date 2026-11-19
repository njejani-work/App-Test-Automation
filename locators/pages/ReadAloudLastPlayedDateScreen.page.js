// AUTO-GENERATED from locators/ReadAloudLastPlayedDateScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends ReadAloudLastPlayedDateScreenClass { async login(phone) { ... } }
// Screen: readAloudLastPlayedDate | activity: org.wikipedia.settings.dev.DeveloperSettingsActivity | updated: 2026-11-11T16:52:57.058Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  toolbarView: ["id=org.wikipedia.dev:id/toolbar", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/toolbar\"]"],
  navigateUpBtn: ["~Navigate up", "//android.widget.ImageButton[@content-desc=\"Navigate up\"]"],
  developerSettingsText: ["android=new UiSelector().text(\"Developer settings\")", "//android.widget.TextView[@text=\"Developer settings\"]"],
  menuSearchBtn: ["~Search", "id=org.wikipedia.dev:id/menu_search", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/menu_search\" and @content-desc=\"Search\"]"],
  moreOptionsBtn: ["~More options", "//android.widget.ImageView[@content-desc=\"More options\"]"],
  fragmentContainerView: ["id=org.wikipedia.dev:id/fragment_container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/fragment_container\"]"],
  listContainerView: ["id=android:id/list_container", "//android.widget.FrameLayout[@resource-id=\"android:id/list_container\"]"],
  recyclerList: ["id=org.wikipedia.dev:id/recycler_view", "//androidx.recyclerview.widget.RecyclerView[@resource-id=\"org.wikipedia.dev:id/recycler_view\"]"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[1]"],
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"readAloudLastPlayedDate\")", "android=new UiSelector().text(\"readAloudLastPlayedDate\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"readAloudLastPlayedDate\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  summaryText: ["id=android:id/summary", "android=new UiSelector().text(\"Unset\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"]"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"readAloudLeadSectionOverrideConfig\")", "android=new UiSelector().text(\"readAloudLeadSectionOverrideConfig\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"readAloudLeadSectionOverrideConfig\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  widgetFrameView: ["(//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"])[1]", "android=new UiSelector().resourceId(\"android:id/widget_frame\").instance(0)", "id=android:id/widget_frame"],
  switchWidgetSwitch: ["(//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/switchWidget\").instance(0)", "id=org.wikipedia.dev:id/switchWidget"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Semantic Search\")", "android=new UiSelector().text(\"Semantic Search\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Semantic Search\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"semanticSearchEnabled\")", "android=new UiSelector().text(\"semanticSearchEnabled\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"semanticSearchEnabled\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[5]"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"semanticSearchFirstUse\")", "android=new UiSelector().text(\"semanticSearchFirstUse\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"semanticSearchFirstUse\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"semanticSearchOverrideSupportedLanguage\")", "android=new UiSelector().text(\"semanticSearchOverrideSupportedLanguage\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"semanticSearchOverrideSupportedLanguage\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"semanticSearchIsTestActive\")", "android=new UiSelector().text(\"semanticSearchIsTestActive\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"semanticSearchIsTestActive\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  titleText8: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Notifications Experiment\")", "android=new UiSelector().text(\"Notifications Experiment\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Notifications Experiment\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(7)"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[9]"],
  titleText9: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"notificationsIsTestActive\")", "android=new UiSelector().text(\"notificationsIsTestActive\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"notificationsIsTestActive\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(8)"],
};

class ReadAloudLastPlayedDateScreen extends BasePage {
  constructor() {
    super(L, []);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** ViewGroup */
  get toolbarView() {
    return $(L.toolbarView[0]);
  }

  /** ImageButton */
  get navigateUpBtn() {
    return $(L.navigateUpBtn[0]);
  }

  /** TextView "Developer settings" */
  get developerSettingsText() {
    return $(L.developerSettingsText[0]);
  }

  /** Button */
  get menuSearchBtn() {
    return $(L.menuSearchBtn[0]);
  }

  /** ImageView */
  get moreOptionsBtn() {
    return $(L.moreOptionsBtn[0]);
  }

  /** FrameLayout */
  get fragmentContainerView() {
    return $(L.fragmentContainerView[0]);
  }

  /** FrameLayout */
  get listContainerView() {
    return $(L.listContainerView[0]);
  }

  /** RecyclerView */
  get recyclerList() {
    return $(L.recyclerList[0]);
  }

  /** LinearLayout */
  get btn() {
    return $(L.btn[0]);
  }

  /** TextView "readAloudLastPlayedDate" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** TextView "Unset" */
  get summaryText() {
    return $(L.summaryText[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "readAloudLeadSectionOverrideConfig" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** LinearLayout */
  get widgetFrameView() {
    return $(L.widgetFrameView[0]);
  }

  /** Switch */
  get switchWidgetSwitch() {
    return $(L.switchWidgetSwitch[0]);
  }

  /** TextView "Semantic Search" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "semanticSearchEnabled" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "semanticSearchFirstUse" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "semanticSearchOverrideSupportedLanguage" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** TextView "semanticSearchIsTestActive" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** TextView "Notifications Experiment" */
  get titleText8() {
    return $(L.titleText8[0]);
  }

  /** LinearLayout */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** TextView "notificationsIsTestActive" */
  get titleText9() {
    return $(L.titleText9[0]);
  }
}

export { ReadAloudLastPlayedDateScreen as ReadAloudLastPlayedDateScreenClass, L as ReadAloudLastPlayedDateScreenLocators };
export default new ReadAloudLastPlayedDateScreen();
