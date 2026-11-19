// AUTO-GENERATED from locators/AnnouncementsScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends AnnouncementsScreenClass { async login(phone) { ... } }
// Screen: Announcements | activity: org.wikipedia.settings.dev.DeveloperSettingsActivity | updated: 2026-11-11T16:52:10.333Z
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
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Announcements\")", "android=new UiSelector().text(\"Announcements\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Announcements\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"GeoIP Country Override\")", "android=new UiSelector().text(\"GeoIP Country Override\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"GeoIP Country Override\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  summaryText: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[1]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(0)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[3]"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Use the test.wikipedia debug URL.\")", "android=new UiSelector().text(\"Use the test.wikipedia debug URL.\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Use the test.wikipedia debug URL.\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  widgetFrameView: ["(//android.widget.LinearLayout[@resource-id=\"android:id/widget_frame\"])[1]", "android=new UiSelector().resourceId(\"android:id/widget_frame\").instance(0)", "id=android:id/widget_frame"],
  switchWidgetSwitch: ["(//android.widget.Switch[@resource-id=\"org.wikipedia.dev:id/switchWidget\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/switchWidget\").instance(0)", "id=org.wikipedia.dev:id/switchWidget"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"announcementCustomTabTestUrl\")", "android=new UiSelector().text(\"announcementCustomTabTestUrl\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"announcementCustomTabTestUrl\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  summaryText2: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[2]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(1)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[5]"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"announcementPauseTime\")", "android=new UiSelector().text(\"announcementPauseTime\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"announcementPauseTime\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Ignore date\")", "android=new UiSelector().text(\"Ignore date\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Ignore date\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"Reset shown dialogs\")", "android=new UiSelector().text(\"Reset shown dialogs\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"Reset shown dialogs\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  summaryText3: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"0 shown dialog(s).\")", "android=new UiSelector().text(\"0 shown dialog(s).\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"0 shown dialog(s).\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(3)"],
  titleText8: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"RESTBase access\")", "android=new UiSelector().text(\"RESTBase access\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"RESTBase access\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(7)"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[9]"],
  titleText9: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"RESTBaseUriFormat\")", "android=new UiSelector().text(\"RESTBaseUriFormat\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"RESTBaseUriFormat\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(8)"],
};

class AnnouncementsScreen extends BasePage {
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

  /** TextView "Announcements" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** LinearLayout */
  get btn() {
    return $(L.btn[0]);
  }

  /** TextView "GeoIP Country Override" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** TextView "Unset" */
  get summaryText() {
    return $(L.summaryText[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Use the test.wikipedia debug URL." */
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
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "announcementCustomTabTestUrl" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** TextView "Unset" */
  get summaryText2() {
    return $(L.summaryText2[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "announcementPauseTime" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "Ignore date" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** TextView "Reset shown dialogs" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** TextView "0 shown dialog(s)." */
  get summaryText3() {
    return $(L.summaryText3[0]);
  }

  /** TextView "RESTBase access" */
  get titleText8() {
    return $(L.titleText8[0]);
  }

  /** LinearLayout */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** TextView "RESTBaseUriFormat" */
  get titleText9() {
    return $(L.titleText9[0]);
  }
}

export { AnnouncementsScreen as AnnouncementsScreenClass, L as AnnouncementsScreenLocators };
export default new AnnouncementsScreen();
