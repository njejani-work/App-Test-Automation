// AUTO-GENERATED from locators/ClearDonationHistoryScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends ClearDonationHistoryScreenClass { async login(phone) { ... } }
// Screen: Clear donation history | activity: org.wikipedia.settings.SettingsActivity | updated: 2026-11-11T16:51:57.773Z
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
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Clear donation history\")", "android=new UiSelector().text(\"Clear donation history\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Clear donation history\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Syncing\")", "android=new UiSelector().text(\"Syncing\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Syncing\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[3]"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Reading list syncing\")", "android=new UiSelector().text(\"Reading list syncing\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Reading list syncing\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  summaryText: ["(//android.widget.TextView[@resource-id=\"android:id/summary\"])[1]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(0)", "id=android:id/summary"],
  widgetFrameView: ["(//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"])[1]", "android=new UiSelector().resourceId(\"android:id/widget_frame\").instance(0)", "id=android:id/widget_frame"],
  switchWidgetSwitch: ["(//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/switchWidget\").instance(0)", "id=org.wikipedia.dev:id/switchWidget"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Download reading list articles\")", "android=new UiSelector().text(\"Download reading list articles\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Download reading list articles\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Data usage\")", "android=new UiSelector().text(\"Data usage\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Data usage\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Download only over Wi-Fi\")", "android=new UiSelector().text(\"Download only over Wi-Fi\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Download only over Wi-Fi\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Show images\")", "android=new UiSelector().text(\"Show images\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Show images\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  summaryText2: ["(//android.widget.TextView[@resource-id=\"android:id/summary\"])[2]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(1)", "id=android:id/summary"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[8]"],
};

class ClearDonationHistoryScreen extends BasePage {
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

  /** TextView "Clear donation history" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** TextView "Syncing" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Reading list syncing" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** TextView "Sync reading lists across different devi" */
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
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "Download reading list articles" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** TextView "Data usage" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "Download only over Wi-Fi" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "Show images" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** TextView "Enable or disable loading of images in p" */
  get summaryText2() {
    return $(L.summaryText2[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }
}

export { ClearDonationHistoryScreen as ClearDonationHistoryScreenClass, L as ClearDonationHistoryScreenLocators };
export default new ClearDonationHistoryScreen();
