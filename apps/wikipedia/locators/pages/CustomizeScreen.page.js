// AUTO-GENERATED from locators/CustomizeScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends CustomizeScreenClass { async login(phone) { ... } }
// Screen: Customize | activity: org.wikipedia.main.MainActivity | updated: 2026-11-11T16:51:13.750Z
import BasePage from './BasePage.js';

const L = {
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.ListView[1]/android.widget.LinearLayout[1]"],
  contentView: ["(//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/content\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/content\").instance(0)", "id=org.wikipedia.dev:id/content"],
  iconImage: ["(//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/icon\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/icon\").instance(0)", "id=org.wikipedia.dev:id/icon"],
  titleText: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/title\").text(\"Customize\")", "android=new UiSelector().text(\"Customize\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/title\" and @text=\"Customize\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/title\").instance(0)"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.ListView[1]/android.widget.LinearLayout[2]"],
  titleText2: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/title\").text(\"Learn more\")", "android=new UiSelector().text(\"Learn more\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/title\" and @text=\"Learn more\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/title\").instance(1)"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.ListView[1]/android.widget.LinearLayout[3]"],
  titleText3: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/title\").text(\"Clear reading history\")", "android=new UiSelector().text(\"Clear reading history\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/title\" and @text=\"Clear reading history\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/title\").instance(2)"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.ListView[1]/android.widget.LinearLayout[4]"],
  titleText4: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/title\").text(\"Clear donation history\")", "android=new UiSelector().text(\"Clear donation history\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/title\" and @text=\"Clear donation history\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/title\").instance(3)"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.ListView[1]/android.widget.LinearLayout[5]"],
  titleText5: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/title\").text(\"Problem with feature\")", "android=new UiSelector().text(\"Problem with feature\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/title\" and @text=\"Problem with feature\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/title\").instance(4)"],
};

class CustomizeScreen extends BasePage {
  constructor() {
    super(L, []);
  }

  /** LinearLayout */
  get btn() {
    return $(L.btn[0]);
  }

  /** LinearLayout */
  get contentView() {
    return $(L.contentView[0]);
  }

  /** ImageView */
  get iconImage() {
    return $(L.iconImage[0]);
  }

  /** TextView "Customize" */
  get titleText() {
    return $(L.titleText[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Learn more" */
  get titleText2() {
    return $(L.titleText2[0]);
  }

  /** LinearLayout */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "Clear reading history" */
  get titleText3() {
    return $(L.titleText3[0]);
  }

  /** LinearLayout */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "Clear donation history" */
  get titleText4() {
    return $(L.titleText4[0]);
  }

  /** LinearLayout */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "Problem with feature" */
  get titleText5() {
    return $(L.titleText5[0]);
  }
}

export { CustomizeScreen as CustomizeScreenClass, L as CustomizeScreenLocators };
export default new CustomizeScreen();
