// AUTO-GENERATED from locators/MainScreen3.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends MainScreen3Class { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.main.MainActivity | updated: 2026-11-11T16:48:59.679Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  containerView: ["id=org.wikipedia.dev:id/container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/container\"]"],
  coordinatorView: ["id=org.wikipedia.dev:id/coordinator", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/coordinator\"]"],
  touchOutsideBtn: ["id=org.wikipedia.dev:id/touch_outside", "//android.view.View[@resource-id=\"org.wikipedia.dev:id/touch_outside\"]"],
  designBottomSheetView: ["id=org.wikipedia.dev:id/design_bottom_sheet", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/design_bottom_sheet\"]"],
  aFasterWayToText: ["android=new UiSelector().text(\"A Faster way to Search\")", "//android.widget.TextView[@text=\"A Faster way to Search\"]"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]"],
  closeView: ["~Close", "//android.view.View[@content-desc=\"Close\"]"],
  installTheWikipediaSearchText: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.widget.ScrollView[1]/android.widget.TextView[1]"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.widget.ScrollView[1]/android.view.View[2]"],
  addText: ["android=new UiSelector().text(\"Add\")", "//android.widget.TextView[@text=\"Add\"]"],
};

class MainScreen3 extends BasePage {
  constructor() {
    super(L, ["closeView"]);
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

  /** TextView "A Faster way to Search" */
  get aFasterWayToText() {
    return $(L.aFasterWayToText[0]);
  }

  /** View */
  get btn() {
    return $(L.btn[0]);
  }

  /** View */
  get closeView() {
    return $(L.closeView[0]);
  }

  /** TextView "Install the Wikipedia Search widget for " */
  get installTheWikipediaSearchText() {
    return $(L.installTheWikipediaSearchText[0]);
  }

  /** View */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Add" */
  get addText() {
    return $(L.addText[0]);
  }
}

export { MainScreen3 as MainScreen3Class, L as MainScreen3Locators };
export default new MainScreen3();
