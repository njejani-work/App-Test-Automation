// AUTO-GENERATED from locators/EditNoticesTooltipShownScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends EditNoticesTooltipShownScreenClass { async login(phone) { ... } }
// Screen: editNoticesTooltipShown | activity: org.wikipedia.settings.dev.DeveloperSettingsActivity | updated: 2026-11-11T16:52:45.300Z
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
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"editNoticesTooltipShown\")", "android=new UiSelector().text(\"editNoticesTooltipShown\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"editNoticesTooltipShown\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  widgetFrameView: ["(//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"])[1]", "android=new UiSelector().resourceId(\"android:id/widget_frame\").instance(0)", "id=android:id/widget_frame"],
  switchWidgetSwitch: ["(//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/switchWidget\").instance(0)", "id=org.wikipedia.dev:id/switchWidget"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"showEditTalkPageSourcePrompt\")", "android=new UiSelector().text(\"showEditTalkPageSourcePrompt\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"showEditTalkPageSourcePrompt\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[3]"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"showSearchTabTooltip\")", "android=new UiSelector().text(\"showSearchTabTooltip\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"showSearchTabTooltip\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"showCustomizeToolbarTooltip\")", "android=new UiSelector().text(\"showCustomizeToolbarTooltip\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"showCustomizeToolbarTooltip\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[5]"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"showSequentialRecentEditsDiffTooltip\")", "android=new UiSelector().text(\"showSequentialRecentEditsDiffTooltip\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"showSequentialRecentEditsDiffTooltip\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"tempAccountWelcomeShown\")", "android=new UiSelector().text(\"tempAccountWelcomeShown\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"tempAccountWelcomeShown\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"tempAccountDialogShown\")", "android=new UiSelector().text(\"tempAccountDialogShown\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"tempAccountDialogShown\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  btn8: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[8]"],
  titleText8: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"tempAccountCreateDay\")", "android=new UiSelector().text(\"tempAccountCreateDay\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"tempAccountCreateDay\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(7)"],
  summaryText: ["id=android:id/summary", "android=new UiSelector().text(\"Unset\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"]"],
  btn9: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[9]"],
  titleText9: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Show editor preference dialog\")", "android=new UiSelector().text(\"Show editor preference dialog\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Show editor preference dialog\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(8)"],
};

class EditNoticesTooltipShownScreen extends BasePage {
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

  /** TextView "editNoticesTooltipShown" */
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

  /** TextView "showEditTalkPageSourcePrompt" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "showSearchTabTooltip" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "showCustomizeToolbarTooltip" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "showSequentialRecentEditsDiffTooltip" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** TextView "tempAccountWelcomeShown" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** LinearLayout */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** TextView "tempAccountDialogShown" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** LinearLayout */
  get btn8() {
    return $(L.btn8[0]);
  }

  /** TextView "tempAccountCreateDay" */
  get titleText8() {
    return $(L.titleText8[0]);
  }

  /** TextView "Unset" */
  get summaryText() {
    return $(L.summaryText[0]);
  }

  /** LinearLayout */
  get btn9() {
    return $(L.btn9[0]);
  }

  /** TextView "Show editor preference dialog" */
  get titleText9() {
    return $(L.titleText9[0]);
  }
}

export { EditNoticesTooltipShownScreen as EditNoticesTooltipShownScreenClass, L as EditNoticesTooltipShownScreenLocators };
export default new EditNoticesTooltipShownScreen();
