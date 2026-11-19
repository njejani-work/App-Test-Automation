// AUTO-GENERATED from locators/ClearLastLocationAndZoomLevelScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends ClearLastLocationAndZoomLevelScreenClass { async login(phone) { ... } }
// Screen: clearLastLocationAndZoomLevel | activity: org.wikipedia.settings.dev.DeveloperSettingsActivity | updated: 2026-11-11T16:52:31.655Z
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
  summaryText: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[1]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(0)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"clearLastLocationAndZoomLevel\")", "android=new UiSelector().text(\"clearLastLocationAndZoomLevel\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"clearLastLocationAndZoomLevel\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  summaryText2: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Reset the stored Places location.\")", "android=new UiSelector().text(\"Reset the stored Places location.\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Reset the stored Places location.\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(1)"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[3]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"dailyEventTask-lastrun\")", "android=new UiSelector().text(\"dailyEventTask-lastrun\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"dailyEventTask-lastrun\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  summaryText3: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"1794415358458\")", "android=new UiSelector().text(\"1794415358458\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"1794415358458\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(2)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Force email authentication when logging in.\")", "android=new UiSelector().text(\"Force email authentication when logging in.\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Force email authentication when logging in.\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  widgetFrameView: ["(//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"])[1]", "android=new UiSelector().resourceId(\"android:id/widget_frame\").instance(0)", "id=android:id/widget_frame"],
  switchWidgetSwitch: ["(//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/switchWidget\").instance(0)", "id=org.wikipedia.dev:id/switchWidget"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[5]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"lastBackgroundLoginDateTime\")", "android=new UiSelector().text(\"lastBackgroundLoginDateTime\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"lastBackgroundLoginDateTime\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  summaryText4: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[2]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(3)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"showDeveloperSettings\")", "android=new UiSelector().text(\"showDeveloperSettings\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"showDeveloperSettings\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"memoryLeakTest\")", "android=new UiSelector().text(\"memoryLeakTest\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"memoryLeakTest\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  btn8: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[8]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"crashedBeforeActivityCreated\")", "android=new UiSelector().text(\"crashedBeforeActivityCreated\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"crashedBeforeActivityCreated\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  btn9: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[9]"],
  titleText8: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Crash\")", "android=new UiSelector().text(\"Crash\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Crash\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(7)"],
};

class ClearLastLocationAndZoomLevelScreen extends BasePage {
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

  /** TextView "Unset" */
  get summaryText() {
    return $(L.summaryText[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "clearLastLocationAndZoomLevel" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** TextView "Reset the stored Places location." */
  get summaryText2() {
    return $(L.summaryText2[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "dailyEventTask-lastrun" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** TextView "1794415358458" */
  get summaryText3() {
    return $(L.summaryText3[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "Force email authentication when logging " */
  get titleText3() {
    return $(L.titleText3[0]);
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

  /** TextView "lastBackgroundLoginDateTime" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** TextView "Unset" */
  get summaryText4() {
    return $(L.summaryText4[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** TextView "showDeveloperSettings" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** LinearLayout */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** TextView "memoryLeakTest" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** LinearLayout */
  get btn8() {
    return $(L.btn8[0]);
  }

  /** TextView "crashedBeforeActivityCreated" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** LinearLayout */
  get btn9() {
    return $(L.btn9[0]);
  }

  /** TextView "Crash" */
  get titleText8() {
    return $(L.titleText8[0]);
  }
}

export { ClearLastLocationAndZoomLevelScreen as ClearLastLocationAndZoomLevelScreenClass, L as ClearLastLocationAndZoomLevelScreenLocators };
export default new ClearLastLocationAndZoomLevelScreen();
