// AUTO-GENERATED from locators/AppThemeScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends AppThemeScreenClass { async login(phone) { ... } }
// Screen: App theme | activity: org.wikipedia.settings.SettingsActivity | updated: 2026-11-11T16:51:53.455Z
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
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"App theme\")", "android=new UiSelector().text(\"App theme\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"App theme\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  summaryText: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Light\")", "android=new UiSelector().text(\"Light\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Light\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(0)"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Editing preference\")", "android=new UiSelector().text(\"Editing preference\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Editing preference\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  summaryText2: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Visual editing\")", "android=new UiSelector().text(\"Visual editing\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Visual editing\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(1)"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Recommendations\")", "android=new UiSelector().text(\"Recommendations\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Recommendations\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Discover reading list\")", "android=new UiSelector().text(\"Discover reading list\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Discover reading list\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  summaryText3: ["(//android.widget.TextView[@resource-id=\"android:id/summary\"])[3]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(2)", "id=android:id/summary"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Donations\")", "android=new UiSelector().text(\"Donations\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Donations\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Donation reminders\")", "android=new UiSelector().text(\"Donation reminders\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Donation reminders\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  summaryText4: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Donation reminders are off.\")", "android=new UiSelector().text(\"Donation reminders are off.\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Donation reminders are off.\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(3)"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Clear donation history\")", "android=new UiSelector().text(\"Clear donation history\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Clear donation history\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  titleText8: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Syncing\")", "android=new UiSelector().text(\"Syncing\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Syncing\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(7)"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[9]"],
  widgetFrameView: ["id=android:id/widget_frame", "//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"]"],
};

class AppThemeScreen extends BasePage {
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

  /** TextView "App theme" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** TextView "Light" */
  get summaryText() {
    return $(L.summaryText[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Editing preference" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** TextView "Visual editing" */
  get summaryText2() {
    return $(L.summaryText2[0]);
  }

  /** TextView "Recommendations" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "Discover reading list" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** TextView "Discover is off. Wikipedia won't recomme" */
  get summaryText3() {
    return $(L.summaryText3[0]);
  }

  /** TextView "Donations" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "Donation reminders" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** TextView "Donation reminders are off." */
  get summaryText4() {
    return $(L.summaryText4[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "Clear donation history" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** TextView "Syncing" */
  get titleText8() {
    return $(L.titleText8[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** LinearLayout */
  get widgetFrameView() {
    return $(L.widgetFrameView[0]);
  }
}

export { AppThemeScreen as AppThemeScreenClass, L as AppThemeScreenLocators };
export default new AppThemeScreen();
