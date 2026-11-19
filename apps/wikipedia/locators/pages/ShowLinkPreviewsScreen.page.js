// AUTO-GENERATED from locators/ShowLinkPreviewsScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends ShowLinkPreviewsScreenClass { async login(phone) { ... } }
// Screen: Show link previews | activity: org.wikipedia.settings.SettingsActivity | updated: 2026-11-11T16:51:49.673Z
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
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[1]"],
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Show link previews\")", "android=new UiSelector().text(\"Show link previews\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Show link previews\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  summaryText: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Show a quick preview of articles when tapping on links.\")", "android=new UiSelector().text(\"Show a quick preview of articles when tapping on links.\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Show a quick preview of articles when tapping on links.\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(0)"],
  widgetFrameView: ["(//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"])[1]", "android=new UiSelector().resourceId(\"android:id/widget_frame\").instance(0)", "id=android:id/widget_frame"],
  switchWidgetSwitch: ["(//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/switchWidget\").instance(0)", "id=org.wikipedia.dev:id/switchWidget"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Collapse tables\")", "android=new UiSelector().text(\"Collapse tables\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Collapse tables\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  summaryText2: ["(//android.widget.TextView[@resource-id=\"android:id/summary\"])[2]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(1)", "id=android:id/summary"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[3]"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"App theme\")", "android=new UiSelector().text(\"App theme\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"App theme\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  summaryText3: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Light\")", "android=new UiSelector().text(\"Light\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Light\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(2)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Editing preference\")", "android=new UiSelector().text(\"Editing preference\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Editing preference\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  summaryText4: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Visual editing\")", "android=new UiSelector().text(\"Visual editing\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Visual editing\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(3)"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Recommendations\")", "android=new UiSelector().text(\"Recommendations\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Recommendations\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Discover reading list\")", "android=new UiSelector().text(\"Discover reading list\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Discover reading list\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  summaryText5: ["(//android.widget.TextView[@resource-id=\"android:id/summary\"])[5]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(4)", "id=android:id/summary"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Donations\")", "android=new UiSelector().text(\"Donations\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Donations\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
};

class ShowLinkPreviewsScreen extends BasePage {
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

  /** LinearLayout */
  get btn() {
    return $(L.btn[0]);
  }

  /** TextView "Show link previews" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** TextView "Show a quick preview of articles when ta" */
  get summaryText() {
    return $(L.summaryText[0]);
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
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Collapse tables" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** TextView "Automatically collapse tables in article" */
  get summaryText2() {
    return $(L.summaryText2[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "App theme" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** TextView "Light" */
  get summaryText3() {
    return $(L.summaryText3[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "Editing preference" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** TextView "Visual editing" */
  get summaryText4() {
    return $(L.summaryText4[0]);
  }

  /** TextView "Recommendations" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "Discover reading list" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** TextView "Discover is off. Wikipedia won't recomme" */
  get summaryText5() {
    return $(L.summaryText5[0]);
  }

  /** TextView "Donations" */
  get titleText7() {
    return $(L.titleText7[0]);
  }
}

export { ShowLinkPreviewsScreen as ShowLinkPreviewsScreenClass, L as ShowLinkPreviewsScreenLocators };
export default new ShowLinkPreviewsScreen();
