// AUTO-GENERATED from locators/InitialOnboardingScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends InitialOnboardingScreenClass { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.onboarding.InitialOnboardingActivity | updated: 2026-11-11T16:42:41.347Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  list: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]"],
  wikipediaImage: ["~Wikipedia", "//android.widget.ImageView[@content-desc=\"Wikipedia\"]"],
  allTheWorldSText: ["android=new UiSelector().text(\"All the world's knowledge\")", "//android.widget.TextView[@text=\"All the world's knowledge\"]"],
  wikipediaIsAFreeText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.widget.TextView[2]"],
  learnMoreAboutWikipediaLink: ["android=new UiSelector().text(\"Learn more about Wikipedia\")", "//android.widget.TextView[@text=\"Learn more about Wikipedia\"]"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]"],
  forwardView: ["~Forward", "//android.view.View[@content-desc=\"Forward\"]"],
};

class InitialOnboardingScreen extends BasePage {
  constructor() {
    super(L, ["wikipediaImage"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** ScrollView */
  get list() {
    return $(L.list[0]);
  }

  /** ImageView */
  get wikipediaImage() {
    return $(L.wikipediaImage[0]);
  }

  /** TextView "All the world's knowledge" */
  get allTheWorldSText() {
    return $(L.allTheWorldSText[0]);
  }

  /** TextView "Wikipedia is a free online encyclopedia " */
  get wikipediaIsAFreeText() {
    return $(L.wikipediaIsAFreeText[0]);
  }

  /** TextView "Learn more about Wikipedia" */
  get learnMoreAboutWikipediaLink() {
    return $(L.learnMoreAboutWikipediaLink[0]);
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

export { InitialOnboardingScreen as InitialOnboardingScreenClass, L as InitialOnboardingScreenLocators };
export default new InitialOnboardingScreen();
