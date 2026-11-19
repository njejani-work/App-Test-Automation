// AUTO-GENERATED from locators/TempAccountDialogShownScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends TempAccountDialogShownScreenClass { async login(phone) { ... } }
// Screen: tempAccountDialogShown | activity: org.wikipedia.settings.dev.DeveloperSettingsActivity | updated: 2026-11-11T16:52:51.770Z
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
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"tempAccountDialogShown\")", "android=new UiSelector().text(\"tempAccountDialogShown\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"tempAccountDialogShown\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  widgetFrameView: ["(//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"])[1]", "android=new UiSelector().resourceId(\"android:id/widget_frame\").instance(0)", "id=android:id/widget_frame"],
  switchWidgetSwitch: ["(//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/switchWidget\").instance(0)", "id=org.wikipedia.dev:id/switchWidget"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"tempAccountCreateDay\")", "android=new UiSelector().text(\"tempAccountCreateDay\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"tempAccountCreateDay\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  summaryText: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[1]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(0)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[3]"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Show editor preference dialog\")", "android=new UiSelector().text(\"Show editor preference dialog\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Show editor preference dialog\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Create Account encouragement impressions (-1 to force)\")", "android=new UiSelector().text(\"Create Account encouragement impressions (-1 to force)\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Create Account encouragement impressions (-1 to force)\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  summaryText2: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[2]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(1)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[5]"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Create Account encouragement last impression date\")", "android=new UiSelector().text(\"Create Account encouragement last impression date\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Create Account encouragement last impression date\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Reading Lists\")", "android=new UiSelector().text(\"Reading Lists\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Reading Lists\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Add articles\")", "android=new UiSelector().text(\"Add articles\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Add articles\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[8]"],
  titleText8: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Add reading lists\")", "android=new UiSelector().text(\"Add reading lists\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Add reading lists\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(7)"],
};

class TempAccountDialogShownScreen extends BasePage {
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

  /** TextView "tempAccountDialogShown" */
  get titleText() {
    return $(L.titleText[0]);
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

  /** TextView "tempAccountCreateDay" */
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

  /** TextView "Show editor preference dialog" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "Create Account encouragement impressions" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** TextView "Unset" */
  get summaryText2() {
    return $(L.summaryText2[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "Create Account encouragement last impres" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** TextView "Reading Lists" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** TextView "Add articles" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** LinearLayout */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** TextView "Add reading lists" */
  get titleText8() {
    return $(L.titleText8[0]);
  }
}

export { TempAccountDialogShownScreen as TempAccountDialogShownScreenClass, L as TempAccountDialogShownScreenLocators };
export default new TempAccountDialogShownScreen();
