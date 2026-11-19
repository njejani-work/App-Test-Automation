// AUTO-GENERATED from locators/InitialOnboardingScreen2.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends InitialOnboardingScreen2Class { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.onboarding.InitialOnboardingActivity | updated: 2026-11-11T16:44:52.730Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  dataPrivacyImage: ["~Data & Privacy", "//android.widget.ImageView[@content-desc=\"Data & Privacy\"]"],
  dataPrivacyText: ["android=new UiSelector().text(\"Data & Privacy\")", "//android.widget.TextView[@text=\"Data & Privacy\"]"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]"],
  forwardView: ["~Forward", "//android.view.View[@content-desc=\"Forward\"]"],
};

class InitialOnboardingScreen2 extends BasePage {
  constructor() {
    super(L, ["dataPrivacyImage"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** ImageView */
  get dataPrivacyImage() {
    return $(L.dataPrivacyImage[0]);
  }

  /** TextView "Data & Privacy" */
  get dataPrivacyText() {
    return $(L.dataPrivacyText[0]);
  }

  /** View */
  get btn() {
    return $(L.btn[0]);
  }

  /** View */
  get forwardView() {
    return $(L.forwardView[0]);
  }
}

export { InitialOnboardingScreen2 as InitialOnboardingScreen2Class, L as InitialOnboardingScreen2Locators };
export default new InitialOnboardingScreen2();
