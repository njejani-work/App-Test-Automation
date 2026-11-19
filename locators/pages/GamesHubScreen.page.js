// AUTO-GENERATED from locators/GamesHubScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends GamesHubScreenClass { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.games.GamesHubActivity | updated: 2026-11-11T16:51:22.546Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  toolbarView: ["id=org.wikipedia.dev:id/toolbar", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/toolbar\"]"],
  navigateUpBtn: ["~Navigate up", "//android.widget.ImageButton[@content-desc=\"Navigate up\"]"],
  gamesText: ["android=new UiSelector().text(\"Games\")", "//android.widget.TextView[@text=\"Games\"]"],
  emptyBtn: ["~More", "id=org.wikipedia.dev:id/empty", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/empty\" and @content-desc=\"More\"]"],
  fragmentContainerView: ["id=org.wikipedia.dev:id/fragment_container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/fragment_container\"]"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]"],
  englishText: ["android=new UiSelector().text(\"English\")", "//android.widget.TextView[@text=\"English\"]"],
  whichCameFirstText: ["android=new UiSelector().text(\"Which came first?\")", "//android.widget.TextView[@text=\"Which came first?\"]"],
  view: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]/android.view.View[1]"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]/android.view.View[1]/android.view.View[1]/android.view.View[1]"],
  november11Text: ["android=new UiSelector().text(\"November 11\")", "//android.widget.TextView[@text=\"November 11\"]"],
  romanEmperorTrajanCelebratesText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.widget.TextView[2]"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[3]"],
  playTodaySGameText: ["android=new UiSelector().text(\"Play today's game\")", "//android.widget.TextView[@text=\"Play today's game\"]"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]/android.view.View[1]/android.view.View[2]/android.view.View[1]"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]/android.view.View[1]/android.view.View[2]/android.view.View[1]/android.view.View[1]"],
};

class GamesHubScreen extends BasePage {
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

  /** TextView "Games" */
  get gamesText() {
    return $(L.gamesText[0]);
  }

  /** Button */
  get emptyBtn() {
    return $(L.emptyBtn[0]);
  }

  /** FrameLayout */
  get fragmentContainerView() {
    return $(L.fragmentContainerView[0]);
  }

  /** View */
  get btn() {
    return $(L.btn[0]);
  }

  /** TextView "English" */
  get englishText() {
    return $(L.englishText[0]);
  }

  /** TextView "Which came first?" */
  get whichCameFirstText() {
    return $(L.whichCameFirstText[0]);
  }

  /** View */
  get view() {
    return $(L.view[0]);
  }

  /** View */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "November 11" */
  get november11Text() {
    return $(L.november11Text[0]);
  }

  /** TextView "Roman emperor Trajan celebrates his newl" */
  get romanEmperorTrajanCelebratesText() {
    return $(L.romanEmperorTrajanCelebratesText[0]);
  }

  /** View */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "Play today's game" */
  get playTodaySGameText() {
    return $(L.playTodaySGameText[0]);
  }

  /** View */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** View */
  get btn5() {
    return $(L.btn5[0]);
  }
}

export { GamesHubScreen as GamesHubScreenClass, L as GamesHubScreenLocators };
export default new GamesHubScreen();
