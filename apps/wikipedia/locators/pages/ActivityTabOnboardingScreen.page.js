// AUTO-GENERATED from locators/ActivityTabOnboardingScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends ActivityTabOnboardingScreenClass { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.activitytab.ActivityTabOnboardingActivity | updated: 2026-11-11T16:49:43.210Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  list: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]"],
  introducingActivityText: ["android=new UiSelector().text(\"Introducing Activity\")", "//android.widget.TextView[@text=\"Introducing Activity\"]"],
  readingPatternsText: ["android=new UiSelector().text(\"Reading patterns\")", "//android.widget.TextView[@text=\"Reading patterns\"]"],
  seeHowMuchTimeText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.widget.TextView[3]"],
  impactHighlightsText: ["android=new UiSelector().text(\"Impact highlights\")", "//android.widget.TextView[@text=\"Impact highlights\"]"],
  discoverInsightsAboutYourText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.widget.TextView[5]"],
  moreWaysToEngageText: ["android=new UiSelector().text(\"More ways to engage\")", "//android.widget.TextView[@text=\"More ways to engage\"]"],
  exploreStatsForGamesText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.widget.TextView[7]"],
  stayInControlText: ["android=new UiSelector().text(\"Stay in control\")", "//android.widget.TextView[@text=\"Stay in control\"]"],
  chooseWhichModulesToText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.widget.TextView[9]"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]"],
  learnMoreText: ["android=new UiSelector().text(\"Learn more\")", "//android.widget.TextView[@text=\"Learn more\"]"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]"],
  continueText: ["android=new UiSelector().text(\"Continue\")", "//android.widget.TextView[@text=\"Continue\"]"],
};

class ActivityTabOnboardingScreen extends BasePage {
  constructor() {
    super(L, []);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** ScrollView */
  get list() {
    return $(L.list[0]);
  }

  /** TextView "Introducing Activity" */
  get introducingActivityText() {
    return $(L.introducingActivityText[0]);
  }

  /** TextView "Reading patterns" */
  get readingPatternsText() {
    return $(L.readingPatternsText[0]);
  }

  /** TextView "See how much time you've spent reading a" */
  get seeHowMuchTimeText() {
    return $(L.seeHowMuchTimeText[0]);
  }

  /** TextView "Impact highlights" */
  get impactHighlightsText() {
    return $(L.impactHighlightsText[0]);
  }

  /** TextView "Discover insights about your contributio" */
  get discoverInsightsAboutYourText() {
    return $(L.discoverInsightsAboutYourText[0]);
  }

  /** TextView "More ways to engage" */
  get moreWaysToEngageText() {
    return $(L.moreWaysToEngageText[0]);
  }

  /** TextView "Explore stats for games, saved articles," */
  get exploreStatsForGamesText() {
    return $(L.exploreStatsForGamesText[0]);
  }

  /** TextView "Stay in control" */
  get stayInControlText() {
    return $(L.stayInControlText[0]);
  }

  /** TextView "Choose which modules to display. All per" */
  get chooseWhichModulesToText() {
    return $(L.chooseWhichModulesToText[0]);
  }

  /** View */
  get btn() {
    return $(L.btn[0]);
  }

  /** TextView "Learn more" */
  get learnMoreText() {
    return $(L.learnMoreText[0]);
  }

  /** View */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Continue" */
  get continueText() {
    return $(L.continueText[0]);
  }
}

export { ActivityTabOnboardingScreen as ActivityTabOnboardingScreenClass, L as ActivityTabOnboardingScreenLocators };
export default new ActivityTabOnboardingScreen();
