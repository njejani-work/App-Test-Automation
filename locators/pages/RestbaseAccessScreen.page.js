// AUTO-GENERATED from locators/RestbaseAccessScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends RestbaseAccessScreenClass { async login(phone) { ... } }
// Screen: RESTBase access | activity: org.wikipedia.settings.dev.DeveloperSettingsActivity | updated: 2026-11-11T16:52:14.608Z
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
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"RESTBase access\")", "android=new UiSelector().text(\"RESTBase access\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"RESTBase access\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[3]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"RESTBaseUriFormat\")", "android=new UiSelector().text(\"RESTBaseUriFormat\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"RESTBaseUriFormat\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  summaryText: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[1]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(0)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"mediaWikiBaseUri\")", "android=new UiSelector().text(\"mediaWikiBaseUri\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"mediaWikiBaseUri\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  summaryText2: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[2]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(1)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[5]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"mediaWikiBaseUriSupportsLangCode\")", "android=new UiSelector().text(\"mediaWikiBaseUriSupportsLangCode\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"mediaWikiBaseUriSupportsLangCode\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  widgetFrameView: ["id=android:id/widget_frame", "//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"]"],
  switchWidgetSwitch: ["id=org.wikipedia.dev:id/switchWidget", "//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"]"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Logging\")", "android=new UiSelector().text(\"Logging\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Logging\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Retrofit Log Level (restart required)\")", "android=new UiSelector().text(\"Retrofit Log Level (restart required)\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Retrofit Log Level (restart required)\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[8]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Session timeout (minutes)\")", "android=new UiSelector().text(\"Session timeout (minutes)\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Session timeout (minutes)\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[9]"],
  titleText8: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"channel\")", "android=new UiSelector().text(\"channel\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"channel\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(7)"],
  summaryText3: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Developer Channel\")", "android=new UiSelector().text(\"Developer Channel\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Developer Channel\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(3)"],
};

class RestbaseAccessScreen extends BasePage {
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

  /** TextView "RESTBase access" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "RESTBaseUriFormat" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** TextView "Unset" */
  get summaryText() {
    return $(L.summaryText[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "mediaWikiBaseUri" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** TextView "Unset" */
  get summaryText2() {
    return $(L.summaryText2[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "mediaWikiBaseUriSupportsLangCode" */
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

  /** TextView "Logging" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "Retrofit Log Level (restart required)" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** TextView "Session timeout (minutes)" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** LinearLayout */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** TextView "channel" */
  get titleText8() {
    return $(L.titleText8[0]);
  }

  /** TextView "Developer Channel" */
  get summaryText3() {
    return $(L.summaryText3[0]);
  }
}

export { RestbaseAccessScreen as RestbaseAccessScreenClass, L as RestbaseAccessScreenLocators };
export default new RestbaseAccessScreen();
