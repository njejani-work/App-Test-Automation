// AUTO-GENERATED from locators/QuickstepAddItemScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends QuickstepAddItemScreenClass { async login(phone) { ... } }
// Screen: (no title) | activity: com.android.launcher3.QuickstepAddItemActivity | updated: 2026-11-11T16:49:15.647Z
import BasePage from './BasePage.js';

const L = {
  addItemDragLayerView: ["id=com.google.android.apps.nexuslauncher:id/add_item_drag_layer", "//android.widget.FrameLayout[@resource-id=\"com.google.android.apps.nexuslauncher:id/add_item_drag_layer\"]"],
  pinWidgetsCatalogView: ["id=com.android.launcher3.widgetpicker:id/pin_widgets_catalog", "//android.view.View[@resource-id=\"com.android.launcher3.widgetpicker:id/pin_widgets_catalog\"]"],
  wikipediaDevText: ["android=new UiSelector().text(\"Wikipedia Dev\")", "//android.widget.TextView[@text=\"Wikipedia Dev\"]"],
  touchAndHoldToText: ["android=new UiSelector().text(\"Touch and hold to move a widget.\")", "//android.widget.TextView[@text=\"Touch and hold to move a widget.\"]"],
  widgetPreviewView: ["id=com.android.launcher3.widgetpicker:id/widget_preview", "//android.view.View[@resource-id=\"com.android.launcher3.widgetpicker:id/widget_preview\"]"],
  widgetDetailsBtn: ["id=com.android.launcher3.widgetpicker:id/widget_details", "//android.view.View[@resource-id=\"com.android.launcher3.widgetpicker:id/widget_details\"]"],
  wikipediaSearchView: ["~Wikipedia search", "//android.view.View[@content-desc=\"Wikipedia search\"]"],
  wikipediaSearchText: ["android=new UiSelector().text(\"Wikipedia search\")", "//android.widget.TextView[@text=\"Wikipedia search\"]"],
  el4WideBy1Text: ["~4 wide by 1 high", "android=new UiSelector().text(\"4 × 1\")", "//android.widget.TextView[@content-desc=\"4 wide by 1 high\" and @text=\"4 × 1\"]"],
  theFastestWayToText: ["android=new UiSelector().text(\"The fastest way to search Wikipedia\")", "//android.widget.TextView[@text=\"The fastest way to search Wikipedia\"]"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.a1[1]/android.view.View[1]/android.view.View[2]/android.view.View[1]/android.view.View[1]/android.view.View[2]"],
  cancelText: ["android=new UiSelector().text(\"Cancel\")", "//android.widget.TextView[@text=\"Cancel\"]"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.a1[1]/android.view.View[1]/android.view.View[2]/android.view.View[1]/android.view.View[1]/android.view.View[3]"],
  addToHomeScreenText: ["android=new UiSelector().text(\"Add to home screen\")", "//android.widget.TextView[@text=\"Add to home screen\"]"],
};

class QuickstepAddItemScreen extends BasePage {
  constructor() {
    super(L, ["widgetDetailsBtn","pinWidgetsCatalogView","widgetPreviewView"]);
  }

  /** FrameLayout */
  get addItemDragLayerView() {
    return $(L.addItemDragLayerView[0]);
  }

  /** View */
  get pinWidgetsCatalogView() {
    return $(L.pinWidgetsCatalogView[0]);
  }

  /** TextView "Wikipedia Dev" */
  get wikipediaDevText() {
    return $(L.wikipediaDevText[0]);
  }

  /** TextView "Touch and hold to move a widget." */
  get touchAndHoldToText() {
    return $(L.touchAndHoldToText[0]);
  }

  /** View */
  get widgetPreviewView() {
    return $(L.widgetPreviewView[0]);
  }

  /** View */
  get widgetDetailsBtn() {
    return $(L.widgetDetailsBtn[0]);
  }

  /** View */
  get wikipediaSearchView() {
    return $(L.wikipediaSearchView[0]);
  }

  /** TextView "Wikipedia search" */
  get wikipediaSearchText() {
    return $(L.wikipediaSearchText[0]);
  }

  /** TextView "4 × 1" */
  get el4WideBy1Text() {
    return $(L.el4WideBy1Text[0]);
  }

  /** TextView "The fastest way to search Wikipedia" */
  get theFastestWayToText() {
    return $(L.theFastestWayToText[0]);
  }

  /** View */
  get btn() {
    return $(L.btn[0]);
  }

  /** TextView "Cancel" */
  get cancelText() {
    return $(L.cancelText[0]);
  }

  /** View */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Add to home screen" */
  get addToHomeScreenText() {
    return $(L.addToHomeScreenText[0]);
  }
}

export { QuickstepAddItemScreen as QuickstepAddItemScreenClass, L as QuickstepAddItemScreenLocators };
export default new QuickstepAddItemScreen();
