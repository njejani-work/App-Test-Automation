// AUTO-GENERATED from locators/NotificationFrequencySimulatorScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends NotificationFrequencySimulatorScreenClass { async login(phone) { ... } }
// Screen: Notification frequency Simulator | activity: org.wikipedia.settings.dev.DeveloperSettingsActivity | updated: 2026-11-11T16:52:54.612Z
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
  widgetFrameView: ["(//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"])[1]", "android=new UiSelector().resourceId(\"android:id/widget_frame\").instance(0)", "id=android:id/widget_frame"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Notification frequency Simulator\")", "android=new UiSelector().text(\"Notification frequency Simulator\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Notification frequency Simulator\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Playground\")", "android=new UiSelector().text(\"Playground\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Playground\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Reading Challenge Widget Configurations\")", "android=new UiSelector().text(\"Reading Challenge Widget Configurations\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Reading Challenge Widget Configurations\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Year in Review\")", "android=new UiSelector().text(\"Year in Review\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Year in Review\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Year in Review Playground\")", "android=new UiSelector().text(\"Year in Review Playground\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Year in Review Playground\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"yearInReviewVisited2026\")", "android=new UiSelector().text(\"yearInReviewVisited2026\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"yearInReviewVisited2026\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  switchWidgetSwitch: ["id=org.wikipedia.dev:id/switchWidget", "//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"]"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[8]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"yearInReviewActivityTabDotSeenYear\")", "android=new UiSelector().text(\"yearInReviewActivityTabDotSeenYear\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"yearInReviewActivityTabDotSeenYear\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  summaryText: ["id=android:id/summary", "android=new UiSelector().text(\"2026\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"2026\"]"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[9]"],
  titleText8: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Yir Survey State\")", "android=new UiSelector().text(\"Yir Survey State\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Yir Survey State\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(7)"],
  titleText9: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Donation Reminder\")", "android=new UiSelector().text(\"Donation Reminder\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Donation Reminder\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(8)"],
  btn8: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[11]"],
  titleText10: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Reset donation reminder.\")", "android=new UiSelector().text(\"Reset donation reminder.\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Reset donation reminder.\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(9)"],
};

class NotificationFrequencySimulatorScreen extends BasePage {
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
  get widgetFrameView() {
    return $(L.widgetFrameView[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Notification frequency Simulator" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** TextView "Playground" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "Reading Challenge Widget Configurations" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** TextView "Year in Review" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "Year in Review Playground" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "yearInReviewVisited2026" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** Switch */
  get switchWidgetSwitch() {
    return $(L.switchWidgetSwitch[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** TextView "yearInReviewActivityTabDotSeenYear" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** TextView "2026" */
  get summaryText() {
    return $(L.summaryText[0]);
  }

  /** LinearLayout */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** TextView "Yir Survey State" */
  get titleText8() {
    return $(L.titleText8[0]);
  }

  /** TextView "Donation Reminder" */
  get titleText9() {
    return $(L.titleText9[0]);
  }

  /** LinearLayout */
  get btn8() {
    return $(L.btn8[0]);
  }

  /** TextView "Reset donation reminder." */
  get titleText10() {
    return $(L.titleText10[0]);
  }
}

export { NotificationFrequencySimulatorScreen as NotificationFrequencySimulatorScreenClass, L as NotificationFrequencySimulatorScreenLocators };
export default new NotificationFrequencySimulatorScreen();
