// AUTO-GENERATED from locators/ExploreFeedBuildingScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends ExploreFeedBuildingScreenClass { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.feed.onboarding.ExploreFeedBuildingActivity | updated: 2026-11-11T16:46:12.954Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  letSBuildYourText: ["android=new UiSelector().text(\"Let's build your feed…\")", "//android.widget.TextView[@text=\"Let's build your feed…\"]"],
};

class ExploreFeedBuildingScreen extends BasePage {
  constructor() {
    super(L, []);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** TextView "Let's build your feed…" */
  get letSBuildYourText() {
    return $(L.letSBuildYourText[0]);
  }
}

export { ExploreFeedBuildingScreen as ExploreFeedBuildingScreenClass, L as ExploreFeedBuildingScreenLocators };
export default new ExploreFeedBuildingScreen();
