// AUTO-GENERATED from locators/ReadingListScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends ReadingListScreenClass { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.readinglist.ReadingListActivity | updated: 2026-11-11T16:53:19.386Z
import BasePage from './BasePage.js';

const L = {
  balloonView: ["id=org.wikipedia.dev:id/balloon", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/balloon\"]"],
  balloonWrapperView: ["id=org.wikipedia.dev:id/balloon_wrapper", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/balloon_wrapper\"]"],
  balloonContentView: ["id=org.wikipedia.dev:id/balloon_content", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/balloon_content\"]"],
  balloonCardView: ["id=org.wikipedia.dev:id/balloon_card", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/balloon_card\"]"],
  shareThisReadingListText: ["id=org.wikipedia.dev:id/textView", "android=new UiSelector().text(\"Share this reading list with others\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/textView\" and @text=\"Share this reading list with others\"]"],
  gotItBtn: ["id=org.wikipedia.dev:id/buttonView", "android=new UiSelector().text(\"Got it\")", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/buttonView\" and @text=\"Got it\"]"],
  balloonArrowImage: ["id=org.wikipedia.dev:id/balloon_arrow", "//android.widget.ImageView[@resource-id=\"org.wikipedia.dev:id/balloon_arrow\"]"],
};

class ReadingListScreen extends BasePage {
  constructor() {
    super(L, ["gotItBtn","shareThisReadingListText","balloonArrowImage"]);
  }

  /** FrameLayout */
  get balloonView() {
    return $(L.balloonView[0]);
  }

  /** FrameLayout */
  get balloonWrapperView() {
    return $(L.balloonWrapperView[0]);
  }

  /** FrameLayout */
  get balloonContentView() {
    return $(L.balloonContentView[0]);
  }

  /** FrameLayout */
  get balloonCardView() {
    return $(L.balloonCardView[0]);
  }

  /** TextView "Share this reading list with others" */
  get shareThisReadingListText() {
    return $(L.shareThisReadingListText[0]);
  }

  /** Button "Got it" */
  get gotItBtn() {
    return $(L.gotItBtn[0]);
  }

  /** ImageView */
  get balloonArrowImage() {
    return $(L.balloonArrowImage[0]);
  }
}

export { ReadingListScreen as ReadingListScreenClass, L as ReadingListScreenLocators };
export default new ReadingListScreen();
