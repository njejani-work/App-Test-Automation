// AUTO-GENERATED from locators/MainScreen2.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends MainScreen2Class { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.main.MainActivity | updated: 2026-11-11T16:53:38.822Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  parentPanelView: ["id=org.wikipedia.dev:id/parentPanel", "//androidx.appcompat.widget.LinearLayoutCompat[@resource-id=\"org.wikipedia.dev:id/parentPanel\"]"],
  customPanelView: ["id=org.wikipedia.dev:id/customPanel", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/customPanel\"]"],
  customView: ["id=org.wikipedia.dev:id/custom", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/custom\"]"],
  containerView: ["id=org.wikipedia.dev:id/text_input_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/text_input_container\"]"],
  myReadingListInput: ["id=org.wikipedia.dev:id/text_input", "android=new UiSelector().text(\"a\")", "//android.widget.EditText[@resource-id=\"org.wikipedia.dev:id/text_input\" and @text=\"a\"]"],
  secondaryContainerView: ["id=org.wikipedia.dev:id/secondary_text_input_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/secondary_text_input_container\"]"],
  secondaryInput: ["id=org.wikipedia.dev:id/secondary_text_input", "android=new UiSelector().text(\"Description (optional)\")", "//android.widget.EditText[@resource-id=\"org.wikipedia.dev:id/secondary_text_input\" and @text=\"Description (optional)\"]"],
  panelList: ["id=org.wikipedia.dev:id/buttonPanel", "//android.widget.ScrollView[@resource-id=\"org.wikipedia.dev:id/buttonPanel\"]"],
  button2Btn: ["id=android:id/button2", "android=new UiSelector().text(\"Cancel\")", "//android.widget.Button[@resource-id=\"android:id/button2\" and @text=\"Cancel\"]"],
  button1Btn: ["id=android:id/button1", "android=new UiSelector().text(\"OK\")", "//android.widget.Button[@resource-id=\"android:id/button1\" and @text=\"OK\"]"],
  errorIconBtn: ["~Error", "id=org.wikipedia.dev:id/text_input_error_icon", "//android.widget.ImageButton[@resource-id=\"org.wikipedia.dev:id/text_input_error_icon\" and @content-desc=\"Error\"]"],
  textinputErrorText: ["id=org.wikipedia.dev:id/textinput_error", "android=new UiSelector().text(\"Reading list \\\"My reading list\\\" already exists.\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/textinput_error\" and @text='Reading list \"My reading list\" already exists.']"],
};

class MainScreen2 extends BasePage {
  constructor() {
    super(L, ["myReadingListInput","secondaryInput","button2Btn"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** LinearLayoutCompat */
  get parentPanelView() {
    return $(L.parentPanelView[0]);
  }

  /** FrameLayout */
  get customPanelView() {
    return $(L.customPanelView[0]);
  }

  /** FrameLayout */
  get customView() {
    return $(L.customView[0]);
  }

  /** LinearLayout */
  get containerView() {
    return $(L.containerView[0]);
  }

  /** EditText "a" */
  get myReadingListInput() {
    return $(L.myReadingListInput[0]);
  }

  /** LinearLayout */
  get secondaryContainerView() {
    return $(L.secondaryContainerView[0]);
  }

  /** EditText "Description (optional)" */
  get secondaryInput() {
    return $(L.secondaryInput[0]);
  }

  /** ScrollView */
  get panelList() {
    return $(L.panelList[0]);
  }

  /** Button "Cancel" */
  get button2Btn() {
    return $(L.button2Btn[0]);
  }

  /** Button "OK" */
  get button1Btn() {
    return $(L.button1Btn[0]);
  }

  /** ImageButton */
  get errorIconBtn() {
    return $(L.errorIconBtn[0]);
  }

  /** TextView "Reading list "My reading list" already e" */
  get textinputErrorText() {
    return $(L.textinputErrorText[0]);
  }
}

export { MainScreen2 as MainScreen2Class, L as MainScreen2Locators };
export default new MainScreen2();
