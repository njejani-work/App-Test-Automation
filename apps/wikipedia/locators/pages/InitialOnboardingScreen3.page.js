// AUTO-GENERATED from locators/InitialOnboardingScreen3.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends InitialOnboardingScreen3Class { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.onboarding.InitialOnboardingActivity | updated: 2026-11-11T16:44:59.172Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  readInMoreThanImage: ["~Read in more than 300 languages", "//android.widget.ImageView[@content-desc=\"Read in more than 300 languages\"]"],
  readInMoreThanText: ["android=new UiSelector().text(\"Read in more than 300 languages\")", "//android.widget.TextView[@text=\"Read in more than 300 languages\"]"],
  weVeNoticedTheText: ["android=new UiSelector().text(\"We've noticed the following languages on your device:\")", "//android.widget.TextView[@text=\"We've noticed the following languages on your device:\"]"],
  englishText: ["android=new UiSelector().text(\"English\")", "//android.widget.TextView[@text=\"English\"]"],
  primaryText: ["android=new UiSelector().text(\"Primary\")", "//android.widget.TextView[@text=\"Primary\"]"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.view.View[2]"],
  addOrEditYourText: ["android=new UiSelector().text(\"Add or edit your languages\")", "//android.widget.TextView[@text=\"Add or edit your languages\"]"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]"],
  forwardView: ["~Forward", "//android.view.View[@content-desc=\"Forward\"]"],
};

class InitialOnboardingScreen3 extends BasePage {
  constructor() {
    super(L, ["readInMoreThanImage"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** ImageView */
  get readInMoreThanImage() {
    return $(L.readInMoreThanImage[0]);
  }

  /** TextView "Read in more than 300 languages" */
  get readInMoreThanText() {
    return $(L.readInMoreThanText[0]);
  }

  /** TextView "We've noticed the following languages on" */
  get weVeNoticedTheText() {
    return $(L.weVeNoticedTheText[0]);
  }

  /** TextView "English" */
  get englishText() {
    return $(L.englishText[0]);
  }

  /** TextView "Primary" */
  get primaryText() {
    return $(L.primaryText[0]);
  }

  /** View */
  get btn() {
    return $(L.btn[0]);
  }

  /** TextView "Add or edit your languages" */
  get addOrEditYourText() {
    return $(L.addOrEditYourText[0]);
  }

  /** View */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** View */
  get forwardView() {
    return $(L.forwardView[0]);
  }
}

export { InitialOnboardingScreen3 as InitialOnboardingScreen3Class, L as InitialOnboardingScreen3Locators };
export default new InitialOnboardingScreen3();
