// AUTO-GENERATED from locators/LastAnonEditTimeScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends LastAnonEditTimeScreenClass { async login(phone) { ... } }
// Screen: lastAnonEditTime | activity: org.wikipedia.settings.dev.DeveloperSettingsActivity | updated: 2026-11-11T16:52:26.073Z
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
  titleText: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"lastAnonEditTime\")", "android=new UiSelector().text(\"lastAnonEditTime\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"lastAnonEditTime\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(0)"],
  summaryText: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[1]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(0)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  titleText2: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"lastAnonNotificationTime\")", "android=new UiSelector().text(\"lastAnonNotificationTime\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"lastAnonNotificationTime\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(1)"],
  summaryText2: ["(//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Unset\"])[2]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(1)", "id=android:id/summary", "android=new UiSelector().resourceId(\"android:id/summary\").text(\"Unset\")"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[3]"],
  titleText3: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"lastAnonNotificationLang\")", "android=new UiSelector().text(\"lastAnonNotificationLang\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"lastAnonNotificationLang\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(2)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[4]"],
  titleText4: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"lastAnonUserWithMessages\")", "android=new UiSelector().text(\"lastAnonUserWithMessages\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"lastAnonUserWithMessages\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(3)"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[5]"],
  titleText5: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"clearAllTalkTopics\")", "android=new UiSelector().text(\"clearAllTalkTopics\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"clearAllTalkTopics\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(4)"],
  summaryText3: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Reset all talk page topics to unread.\")", "android=new UiSelector().text(\"Reset all talk page topics to unread.\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Reset all talk page topics to unread.\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(4)"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[6]"],
  titleText6: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"placesDefaultLocationLatLng\")", "android=new UiSelector().text(\"placesDefaultLocationLatLng\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"placesDefaultLocationLatLng\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(5)"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[7]"],
  titleText7: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"clearLastLocationAndZoomLevel\")", "android=new UiSelector().text(\"clearLastLocationAndZoomLevel\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"clearLastLocationAndZoomLevel\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(6)"],
  summaryText4: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"Reset the stored Places location.\")", "android=new UiSelector().text(\"Reset the stored Places location.\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"Reset the stored Places location.\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(6)"],
  btn8: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[8]"],
  titleText8: ["android=new UiSelector().resourceId(\"android:id/title\").text(\"dailyEventTask-lastrun\")", "android=new UiSelector().text(\"dailyEventTask-lastrun\")", "//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"dailyEventTask-lastrun\"]", "android=new UiSelector().resourceId(\"android:id/title\").instance(7)"],
  summaryText5: ["android=new UiSelector().resourceId(\"android:id/summary\").text(\"1794415358458\")", "android=new UiSelector().text(\"1794415358458\")", "//android.widget.TextView[@resource-id=\"android:id/summary\" and @text=\"1794415358458\"]", "android=new UiSelector().resourceId(\"android:id/summary\").instance(7)"],
};

class LastAnonEditTimeScreen extends BasePage {
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

  /** TextView "lastAnonEditTime" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** TextView "Unset" */
  get summaryText() {
    return $(L.summaryText[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "lastAnonNotificationTime" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** TextView "Unset" */
  get summaryText2() {
    return $(L.summaryText2[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "lastAnonNotificationLang" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "lastAnonUserWithMessages" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "clearAllTalkTopics" */
  get titleText5() {
    return $(L.titleText5[0]);
  }

  /** TextView "Reset all talk page topics to unread." */
  get summaryText3() {
    return $(L.summaryText3[0]);
  }

  /** LinearLayout */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** TextView "placesDefaultLocationLatLng" */
  get titleText6() {
    return $(L.titleText6[0]);
  }

  /** LinearLayout */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** TextView "clearLastLocationAndZoomLevel" */
  get titleText7() {
    return $(L.titleText7[0]);
  }

  /** TextView "Reset the stored Places location." */
  get summaryText4() {
    return $(L.summaryText4[0]);
  }

  /** LinearLayout */
  get btn8() {
    return $(L.btn8[0]);
  }

  /** TextView "dailyEventTask-lastrun" */
  get titleText8() {
    return $(L.titleText8[0]);
  }

  /** TextView "1794415358458" */
  get summaryText5() {
    return $(L.summaryText5[0]);
  }
}

export { LastAnonEditTimeScreen as LastAnonEditTimeScreenClass, L as LastAnonEditTimeScreenLocators };
export default new LastAnonEditTimeScreen();
