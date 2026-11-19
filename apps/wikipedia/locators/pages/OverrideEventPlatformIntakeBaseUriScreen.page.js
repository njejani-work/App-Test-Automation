// AUTO-GENERATED from locators/OverrideEventPlatformIntakeBaseUriScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends OverrideEventPlatformIntakeBaseUriScreenClass { async login(phone) { ... } }
// Screen: Override Event Platform intake base URI | activity: org.wikipedia.settings.dev.DeveloperSettingsActivity | updated: 2026-11-11T16:52:18.168Z
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
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Override Event Platform intake base URI\")", "android=new UiSelector().text(\"Override Event Platform intake base URI\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Override Event Platform intake base URI\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  summaryText: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[1]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(0)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[3]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Event platform batch size\")", "android=new UiSelector().text(\"Event platform batch size\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Event platform batch size\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  summaryText2: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[2]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(1)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Miscellaneous\")", "android=new UiSelector().text(\"Miscellaneous\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Miscellaneous\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[5]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"hasVisitedArticlePage\")", "android=new UiSelector().text(\"hasVisitedArticlePage\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"hasVisitedArticlePage\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  widgetFrameView: ["id=android:id/widget_frame", "//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"]"],
  switchWidgetSwitch: ["id=org.wikipedia.dev:id/switchWidget", "//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"]"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"pageLastShown\")", "android=new UiSelector().text(\"pageLastShown\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"pageLastShown\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  summaryText3: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"0\")", "android=new UiSelector().text(\"0\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"0\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(2)"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"readingAppInstallID\")", "android=new UiSelector().text(\"readingAppInstallID\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"readingAppInstallID\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  summaryText4: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"ce5706f8-833f-4d04-bf03-081f260d334e\")", "android=new UiSelector().text(\"ce5706f8-833f-4d04-bf03-081f260d334e\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"ce5706f8-833f-4d04-bf03-081f260d334e\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(3)"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[8]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"content_language\")", "android=new UiSelector().text(\"content_language\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"content_language\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  btn8: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[9]"],
  titleText8: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"languageApp\")", "android=new UiSelector().text(\"languageApp\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"languageApp\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(7)"],
  summaryText5: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"en\")", "android=new UiSelector().text(\"en\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"en\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(5)"],
};

class OverrideEventPlatformIntakeBaseUriScreen extends BasePage {
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

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Override Event Platform intake base URI" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** TextView "Unset" */
  get summaryText() {
    return $(L.summaryText[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "Event platform batch size" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** TextView "Unset" */
  get summaryText2() {
    return $(L.summaryText2[0]);
  }

  /** TextView "Miscellaneous" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "hasVisitedArticlePage" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** LinearLayout */
  get widgetFrameView() {
    return $(L.widgetFrameView[0]);
  }

  /** Switch */
  get switchWidgetSwitch() {
    return $(L.switchWidgetSwitch[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "pageLastShown" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** TextView "0" */
  get summaryText3() {
    return $(L.summaryText3[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** TextView "readingAppInstallID" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** TextView "ce5706f8-833f-4d04-bf03-081f260d334e" */
  get summaryText4() {
    return $(L.summaryText4[0]);
  }

  /** LinearLayout */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** TextView "content_language" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** LinearLayout */
  get btn8() {
    return $(L.btn8[0]);
  }

  /** TextView "languageApp" */
  get titleText8() {
    return $(L.titleText8[0]);
  }

  /** TextView "en" */
  get summaryText5() {
    return $(L.summaryText5[0]);
  }
}

export { OverrideEventPlatformIntakeBaseUriScreen as OverrideEventPlatformIntakeBaseUriScreenClass, L as OverrideEventPlatformIntakeBaseUriScreenLocators };
export default new OverrideEventPlatformIntakeBaseUriScreen();
