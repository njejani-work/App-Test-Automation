// AUTO-GENERATED from locators/PreferOfflineContentScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends PreferOfflineContentScreenClass { async login(phone) { ... } }
// Screen: Prefer offline content | activity: org.wikipedia.settings.SettingsActivity | updated: 2026-11-11T16:52:05.010Z
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
  widgetFrameView: ["(//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"])[1]", "android=new UiSelector().resourceId(\"android:id/widget_frame\").instance(0)", "id=android:id/widget_frame"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Prefer offline content\")", "android=new UiSelector().text(\"Prefer offline content\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Prefer offline content\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  summaryText: ["id=android:id/summary", "//android.widget.TextView[@resource-id=\"android:id/summary\"]"],
  switchWidgetSwitch: ["id=org.wikipedia.dev:id/switchWidget", "//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"About\")", "android=new UiSelector().text(\"About\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"About\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"About the Wikipedia app\")", "android=new UiSelector().text(\"About the Wikipedia app\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"About the Wikipedia app\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[5]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Send app feedback\")", "android=new UiSelector().text(\"Send app feedback\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Send app feedback\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  rightIconImage: ["(//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/right_icon\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/right_icon\").instance(0)", "id=org.wikipedia.dev:id/right_icon"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Wikipedia App FAQ\")", "android=new UiSelector().text(\"Wikipedia App FAQ\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Wikipedia App FAQ\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Privacy policy\")", "android=new UiSelector().text(\"Privacy policy\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Privacy policy\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[8]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Terms of use\")", "android=new UiSelector().text(\"Terms of use\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Terms of use\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  btn8: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[9]"],
  titleText8: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Legal and safety contacts\")", "android=new UiSelector().text(\"Legal and safety contacts\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Legal and safety contacts\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(7)"],
};

class PreferOfflineContentScreen extends BasePage {
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

  /** LinearLayout */
  get widgetFrameView() {
    return $(L.widgetFrameView[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Prefer offline content" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** TextView "Save data usage by loading articles that" */
  get summaryText() {
    return $(L.summaryText[0]);
  }

  /** Switch */
  get switchWidgetSwitch() {
    return $(L.switchWidgetSwitch[0]);
  }

  /** TextView "About" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "About the Wikipedia app" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "Send app feedback" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** ImageView */
  get rightIconImage() {
    return $(L.rightIconImage[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "Wikipedia App FAQ" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** TextView "Privacy policy" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** LinearLayout */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** TextView "Terms of use" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** LinearLayout */
  get btn8() {
    return $(L.btn8[0]);
  }

  /** TextView "Legal and safety contacts" */
  get titleText8() {
    return $(L.titleText8[0]);
  }
}

export { PreferOfflineContentScreen as PreferOfflineContentScreenClass, L as PreferOfflineContentScreenLocators };
export default new PreferOfflineContentScreen();
