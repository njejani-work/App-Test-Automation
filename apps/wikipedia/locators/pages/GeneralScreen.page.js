// AUTO-GENERATED from locators/GeneralScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends GeneralScreenClass { async login(phone) { ... } }
// Screen: General | activity: org.wikipedia.settings.SettingsActivity | updated: 2026-11-11T16:53:00.247Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  toolbarView: ["id=org.wikipedia.dev:id/toolbar", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/toolbar\"]"],
  navigateUpBtn: ["~Navigate up", "//android.widget.ImageButton[@content-desc=\"Navigate up\"]"],
  settingsText: ["android=new UiSelector().text(\"Settings\")", "//android.widget.TextView[@text=\"Settings\"]"],
  developerSettingsBtn: ["~Developer settings", "id=org.wikipedia.dev:id/developer_settings", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/developer_settings\" and @content-desc=\"Developer settings\"]"],
  fragmentContainerView: ["id=org.wikipedia.dev:id/fragment_container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/fragment_container\"]"],
  listContainerView: ["id=android:id/list_container", "//android.widget.FrameLayout[@resource-id=\"android:id/list_container\"]"],
  recyclerList: ["id=org.wikipedia.dev:id/recycler_view", "//androidx.recyclerview.widget.RecyclerView[@resource-id=\"org.wikipedia.dev:id/recycler_view\"]"],
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"General\")", "android=new UiSelector().text(\"General\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"General\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Wikipedia languages\")", "android=new UiSelector().text(\"Wikipedia languages\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Wikipedia languages\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  summaryText: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"English\")", "android=new UiSelector().text(\"English\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"English\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(0)"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[3]"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Home feed\")", "android=new UiSelector().text(\"Home feed\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Home feed\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  summaryText2: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Customize your Home feed\")", "android=new UiSelector().text(\"Customize your Home feed\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Customize your Home feed\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(1)"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Year In Review\")", "android=new UiSelector().text(\"Year In Review\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Year In Review\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  summaryText3: ["(//android.widget.TextView[@resource-id=\"android:id/summary\"])[3]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(2)", "id=android:id/summary"],
  widgetFrameView: ["(//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"])[1]", "android=new UiSelector().resourceId(\"android:id/widget_frame\").instance(0)", "id=android:id/widget_frame"],
  switchWidgetSwitch: ["(//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/switchWidget\").instance(0)", "id=org.wikipedia.dev:id/switchWidget"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[5]"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Show link previews\")", "android=new UiSelector().text(\"Show link previews\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Show link previews\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  summaryText4: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Show a quick preview of articles when tapping on links.\")", "android=new UiSelector().text(\"Show a quick preview of articles when tapping on links.\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Show a quick preview of articles when tapping on links.\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(3)"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Collapse tables\")", "android=new UiSelector().text(\"Collapse tables\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Collapse tables\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  summaryText5: ["(//android.widget.TextView[@resource-id=\"android:id/summary\"])[5]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(4)", "id=android:id/summary"],
};

class GeneralScreen extends BasePage {
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

  /** TextView "Settings" */
  get settingsText() {
    return $(L.settingsText[0]);
  }

  /** Button */
  get developerSettingsBtn() {
    return $(L.developerSettingsBtn[0]);
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

  /** TextView "General" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** LinearLayout */
  get btn() {
    return $(L.btn[0]);
  }

  /** TextView "Wikipedia languages" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** TextView "English" */
  get summaryText() {
    return $(L.summaryText[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Home feed" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** TextView "Customize your Home feed" */
  get summaryText2() {
    return $(L.summaryText2[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "Year In Review" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** TextView "Turning off Year in Review will clear al" */
  get summaryText3() {
    return $(L.summaryText3[0]);
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
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "Show link previews" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** TextView "Show a quick preview of articles when ta" */
  get summaryText4() {
    return $(L.summaryText4[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "Collapse tables" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** TextView "Automatically collapse tables in article" */
  get summaryText5() {
    return $(L.summaryText5[0]);
  }
}

export { GeneralScreen as GeneralScreenClass, L as GeneralScreenLocators };
export default new GeneralScreen();
