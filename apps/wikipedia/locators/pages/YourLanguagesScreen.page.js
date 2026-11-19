// AUTO-GENERATED from locators/YourLanguagesScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends YourLanguagesScreenClass { async login(phone) { ... } }
// Screen: Your languages | activity: org.wikipedia.settings.languages.WikipediaLanguagesActivity | updated: 2026-11-11T16:45:40.804Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  fragmentContainerView: ["id=org.wikipedia.dev:id/fragment_container", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/fragment_container\"]"],
  toolbarView: ["id=org.wikipedia.dev:id/toolbar", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/toolbar\"]"],
  navigateUpBtn: ["~Navigate up", "//android.widget.ImageButton[@content-desc=\"Navigate up\"]"],
  wikipediaLanguagesText: ["android=new UiSelector().text(\"Wikipedia languages\")", "//android.widget.TextView[@text=\"Wikipedia languages\"]"],
  wikipediaLanguagesRecyclerList: ["id=org.wikipedia.dev:id/wikipedia_languages_recycler", "//androidx.recyclerview.widget.RecyclerView[@resource-id=\"org.wikipedia.dev:id/wikipedia_languages_recycler\"]"],
  sectionHeaderText: ["id=org.wikipedia.dev:id/section_header_text", "android=new UiSelector().text(\"Your languages\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/section_header_text\" and @text=\"Your languages\"]"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[2]"],
  wikiLanguageOrderText: ["id=org.wikipedia.dev:id/wiki_language_order", "android=new UiSelector().text(\"1\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/wiki_language_order\" and @text=\"1\"]"],
  wikiLanguageCodeView: ["id=org.wikipedia.dev:id/wiki_language_code", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/wiki_language_code\"]"],
  langCodeText: ["id=org.wikipedia.dev:id/langCodeText", "android=new UiSelector().text(\"EN\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/langCodeText\" and @text=\"EN\"]"],
  wikiLanguageTitleText: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/wiki_language_title\").text(\"English\")", "android=new UiSelector().text(\"English\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/wiki_language_title\" and @text=\"English\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/wiki_language_title\").instance(0)"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/androidx.recyclerview.widget.RecyclerView[1]/android.widget.LinearLayout[3]"],
  wikiLanguageTitleText2: ["android=new UiSelector().resourceId(\"org.wikipedia.dev:id/wiki_language_title\").text(\"Add language\")", "android=new UiSelector().text(\"Add language\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/wiki_language_title\" and @text=\"Add language\"]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/wiki_language_title\").instance(1)"],
};

class YourLanguagesScreen extends BasePage {
  constructor() {
    super(L, ["sectionHeaderText","wikiLanguageOrderText"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** FrameLayout */
  get fragmentContainerView() {
    return $(L.fragmentContainerView[0]);
  }

  /** ViewGroup */
  get toolbarView() {
    return $(L.toolbarView[0]);
  }

  /** ImageButton */
  get navigateUpBtn() {
    return $(L.navigateUpBtn[0]);
  }

  /** TextView "Wikipedia languages" */
  get wikipediaLanguagesText() {
    return $(L.wikipediaLanguagesText[0]);
  }

  /** RecyclerView */
  get wikipediaLanguagesRecyclerList() {
    return $(L.wikipediaLanguagesRecyclerList[0]);
  }

  /** TextView "Your languages" */
  get sectionHeaderText() {
    return $(L.sectionHeaderText[0]);
  }

  /** LinearLayout */
  get btn() {
    return $(L.btn[0]);
  }

  /** TextView "1" */
  get wikiLanguageOrderText() {
    return $(L.wikiLanguageOrderText[0]);
  }

  /** FrameLayout */
  get wikiLanguageCodeView() {
    return $(L.wikiLanguageCodeView[0]);
  }

  /** TextView "EN" */
  get langCodeText() {
    return $(L.langCodeText[0]);
  }

  /** TextView "English" */
  get wikiLanguageTitleText() {
    return $(L.wikiLanguageTitleText[0]);
  }

  /** LinearLayout */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Add language" */
  get wikiLanguageTitleText2() {
    return $(L.wikiLanguageTitleText2[0]);
  }
}

export { YourLanguagesScreen as YourLanguagesScreenClass, L as YourLanguagesScreenLocators };
export default new YourLanguagesScreen();
