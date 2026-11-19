// AUTO-GENERATED from locators/MainScreen4.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends MainScreen4Class { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.main.MainActivity | updated: 2026-11-11T16:51:31.921Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  containerView: ["id=org.wikipedia.dev:id/container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/container\"]"],
  coordinatorView: ["id=org.wikipedia.dev:id/coordinator", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/coordinator\"]"],
  touchOutsideBtn: ["id=org.wikipedia.dev:id/touch_outside", "//android.view.View[@resource-id=\"org.wikipedia.dev:id/touch_outside\"]"],
  designBottomSheetView: ["id=org.wikipedia.dev:id/design_bottom_sheet", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/design_bottom_sheet\"]"],
  mainDrawerAccountContainerBtn: ["id=org.wikipedia.dev:id/main_drawer_account_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/main_drawer_account_container\"]"],
  mainDrawerAccountAvatarImage: ["id=org.wikipedia.dev:id/main_drawer_account_avatar", "//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/main_drawer_account_avatar\"]"],
  mainDrawerLoginText: ["id=org.wikipedia.dev:id/main_drawer_login_button", "android=new UiSelector().text(\"Log in / join Wikipedia\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/main_drawer_login_button\" and @text=\"Log in / join Wikipedia\"]"],
  mainDrawerGamesHubContainerBtn: ["id=org.wikipedia.dev:id/main_drawer_games_hub_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/main_drawer_games_hub_container\"]"],
  gamesText: ["android=new UiSelector().text(\"Games\")", "//android.widget.TextView[@text=\"Games\"]"],
  mainDrawerPlacesContainerBtn: ["id=org.wikipedia.dev:id/main_drawer_places_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/main_drawer_places_container\"]"],
  placesText: ["android=new UiSelector().text(\"Places\")", "//android.widget.TextView[@text=\"Places\"]"],
  mainDrawerSettingsContainerBtn: ["id=org.wikipedia.dev:id/main_drawer_settings_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/main_drawer_settings_container\"]"],
  settingsText: ["android=new UiSelector().text(\"Settings\")", "//android.widget.TextView[@text=\"Settings\"]"],
  mainDrawerDonateContainerBtn: ["id=org.wikipedia.dev:id/main_drawer_donate_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/main_drawer_donate_container\"]"],
  donateText: ["android=new UiSelector().text(\"Donate\")", "//android.widget.TextView[@text=\"Donate\"]"],
};

class MainScreen4 extends BasePage {
  constructor() {
    super(L, ["mainDrawerAccountAvatarImage","mainDrawerLoginText"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** FrameLayout */
  get containerView() {
    return $(L.containerView[0]);
  }

  /** ViewGroup */
  get coordinatorView() {
    return $(L.coordinatorView[0]);
  }

  /** View */
  get touchOutsideBtn() {
    return $(L.touchOutsideBtn[0]);
  }

  /** FrameLayout */
  get designBottomSheetView() {
    return $(L.designBottomSheetView[0]);
  }

  /** LinearLayout */
  get mainDrawerAccountContainerBtn() {
    return $(L.mainDrawerAccountContainerBtn[0]);
  }

  /** ImageView */
  get mainDrawerAccountAvatarImage() {
    return $(L.mainDrawerAccountAvatarImage[0]);
  }

  /** TextView "Log in / join Wikipedia" */
  get mainDrawerLoginText() {
    return $(L.mainDrawerLoginText[0]);
  }

  /** LinearLayout */
  get mainDrawerGamesHubContainerBtn() {
    return $(L.mainDrawerGamesHubContainerBtn[0]);
  }

  /** TextView "Games" */
  get gamesText() {
    return $(L.gamesText[0]);
  }

  /** LinearLayout */
  get mainDrawerPlacesContainerBtn() {
    return $(L.mainDrawerPlacesContainerBtn[0]);
  }

  /** TextView "Places" */
  get placesText() {
    return $(L.placesText[0]);
  }

  /** LinearLayout */
  get mainDrawerSettingsContainerBtn() {
    return $(L.mainDrawerSettingsContainerBtn[0]);
  }

  /** TextView "Settings" */
  get settingsText() {
    return $(L.settingsText[0]);
  }

  /** LinearLayout */
  get mainDrawerDonateContainerBtn() {
    return $(L.mainDrawerDonateContainerBtn[0]);
  }

  /** TextView "Donate" */
  get donateText() {
    return $(L.donateText[0]);
  }
}

export { MainScreen4 as MainScreen4Class, L as MainScreen4Locators };
export default new MainScreen4();
