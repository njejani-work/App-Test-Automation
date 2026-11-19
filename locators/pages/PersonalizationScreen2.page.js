// AUTO-GENERATED from locators/PersonalizationScreen2.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends PersonalizationScreen2Class { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.feed.personalization.PersonalizationActivity | updated: 2026-11-11T16:46:00.349Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  view: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]"],
  whatAreYouInterestedText: ["android=new UiSelector().text(\"What are you interested in?\")", "//android.widget.TextView[@text=\"What are you interested in?\"]"],
  view2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]"],
  btn: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]"],
  searchWikipediaView: ["~Search Wikipedia", "//android.view.View[@content-desc=\"Search Wikipedia\"]"],
  searchForAnArticleText: ["android=new UiSelector().text(\"Search for an article\")", "//android.widget.TextView[@text=\"Search for an article\"]"],
  view3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]"],
  btn2: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]/android.view.View[1]"],
  architectureText: ["android=new UiSelector().text(\"Architecture\")", "//android.widget.TextView[@text=\"Architecture\"]"],
  btn3: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]/android.view.View[2]"],
  artText: ["android=new UiSelector().text(\"Art\")", "//android.widget.TextView[@text=\"Art\"]"],
  btn4: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]/android.view.View[3]"],
  comicsAndAnimeText: ["android=new UiSelector().text(\"Comics and anime\")", "//android.widget.TextView[@text=\"Comics and anime\"]"],
  btn5: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[3]/android.view.View[1]"],
  wilLedezmaText: ["android=new UiSelector().text(\"Wil Ledezma\")", "//android.widget.TextView[@text=\"Wil Ledezma\"]"],
  venezuelanBaseballPlayerBornText: ["android=new UiSelector().text(\"Venezuelan baseball player (born 1981)\")", "//android.widget.TextView[@text=\"Venezuelan baseball player (born 1981)\"]"],
  btn6: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[4]/android.view.View[1]"],
  gaylordOprylandResortConventionText: ["android=new UiSelector().text(\"Gaylord Opryland Resort & Convention Center\")", "//android.widget.TextView[@text=\"Gaylord Opryland Resort & Convention Center\"]"],
  hotelAndConventionCenterText: ["android=new UiSelector().text(\"Hotel and convention center in Tennessee\")", "//android.widget.TextView[@text=\"Hotel and convention center in Tennessee\"]"],
  btn7: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[5]/android.view.View[1]"],
  btn8: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]"],
  selectAtLeastOneText: ["android=new UiSelector().text(\"Select at least one interest\")", "//android.widget.TextView[@text=\"Select at least one interest\"]"],
  btn9: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]"],
  skipText: ["android=new UiSelector().text(\"Skip\")", "//android.widget.TextView[@text=\"Skip\"]"],
  btn10: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[3]"],
  nextView: ["~Next", "//android.view.View[@content-desc=\"Next\"]"],
  el1SelectedText: ["android=new UiSelector().text(\"1 selected\")", "//android.widget.TextView[@text=\"1 selected\"]"],
  btn11: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[2]/android.view.View[1]/android.view.View[1]"],
  deselectAllText: ["android=new UiSelector().text(\"Deselect all\")", "//android.widget.TextView[@text=\"Deselect all\"]"],
  yasuhiroNightowText: ["android=new UiSelector().text(\"Yasuhiro Nightow\")", "//android.widget.TextView[@text=\"Yasuhiro Nightow\"]"],
  japaneseMangaArtistText: ["android=new UiSelector().text(\"Japanese manga artist\")", "//android.widget.TextView[@text=\"Japanese manga artist\"]"],
  monthlyCarolText: ["android=new UiSelector().text(\"Monthly Carol\")", "//android.widget.TextView[@text=\"Monthly Carol\"]"],
  japaneseMangaMagazineText: ["android=new UiSelector().text(\"Japanese manga magazine\")", "//android.widget.TextView[@text=\"Japanese manga magazine\"]"],
  btn12: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/androidx.compose.ui.platform.ComposeView[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.view.View[6]/android.view.View[1]"],
  umatillaBridgeText: ["android=new UiSelector().text(\"Umatilla Bridge\")", "//android.widget.TextView[@text=\"Umatilla Bridge\"]"],
  bridgeBetweenWashingtonAndText: ["android=new UiSelector().text(\"Bridge between Washington and Oregon, U.S.\")", "//android.widget.TextView[@text=\"Bridge between Washington and Oregon, U.S.\"]"],
  highDesertMuseumText: ["android=new UiSelector().text(\"High Desert Museum\")", "//android.widget.TextView[@text=\"High Desert Museum\"]"],
  regionalMuseumInOregonText: ["android=new UiSelector().text(\"Regional museum in Oregon, USA\")", "//android.widget.TextView[@text=\"Regional museum in Oregon, USA\"]"],
  el2SelectedText: ["android=new UiSelector().text(\"2 selected\")", "//android.widget.TextView[@text=\"2 selected\"]"],
  el3SelectedText: ["android=new UiSelector().text(\"3 selected\")", "//android.widget.TextView[@text=\"3 selected\"]"],
  formerDinglinzihbianPoliceStationText: ["android=new UiSelector().text(\"Former Dinglinzihbian Police Station\")", "//android.widget.TextView[@text=\"Former Dinglinzihbian Police Station\"]"],
  policeStationInLinyuanText: ["android=new UiSelector().text(\"Police station in Linyuan, Kaohsiung, Taiwan\")", "//android.widget.TextView[@text=\"Police station in Linyuan, Kaohsiung, Taiwan\"]"],
  chapelOfTheImmaculateText: ["android=new UiSelector().text(\"Chapel of the Immaculate Conception, St. Julian's\")", "//android.widget.TextView[@text=\"Chapel of the Immaculate Conception, St. Julian's\"]"],
  churchInStJulianText: ["android=new UiSelector().text(\"Church in St. Julian's, Malta\")", "//android.widget.TextView[@text=\"Church in St. Julian's, Malta\"]"],
  semyonBudyonnyText: ["android=new UiSelector().text(\"Semyon Budyonny\")", "//android.widget.TextView[@text=\"Semyon Budyonny\"]"],
  sovietMilitaryCommander1883Text: ["android=new UiSelector().text(\"Soviet military commander (1883–1973)\")", "//android.widget.TextView[@text=\"Soviet military commander (1883–1973)\"]"],
  ditchDaveyText: ["android=new UiSelector().text(\"Ditch Davey\")", "//android.widget.TextView[@text=\"Ditch Davey\"]"],
  australianActorText: ["android=new UiSelector().text(\"Australian actor\")", "//android.widget.TextView[@text=\"Australian actor\"]"],
  littleAthensText: ["android=new UiSelector().text(\"Little Athens\")", "//android.widget.TextView[@text=\"Little Athens\"]"],
  martianSuccessorNadesicoText: ["android=new UiSelector().text(\"Martian Successor Nadesico\")", "//android.widget.TextView[@text=\"Martian Successor Nadesico\"]"],
  el1996ScienceFictionAnimeText: ["android=new UiSelector().text(\"1996 science fiction anime television series\")", "//android.widget.TextView[@text=\"1996 science fiction anime television series\"]"],
  davidWrightArtistText: ["android=new UiSelector().text(\"David Wright (artist)\")", "//android.widget.TextView[@text=\"David Wright (artist)\"]"],
  britishIllustratorText: ["android=new UiSelector().text(\"British illustrator\")", "//android.widget.TextView[@text=\"British illustrator\"]"],
};

class PersonalizationScreen2 extends BasePage {
  constructor() {
    super(L, ["searchWikipediaView"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** View */
  get view() {
    return $(L.view[0]);
  }

  /** TextView "What are you interested in?" */
  get whatAreYouInterestedText() {
    return $(L.whatAreYouInterestedText[0]);
  }

  /** View */
  get view2() {
    return $(L.view2[0]);
  }

  /** View */
  get btn() {
    return $(L.btn[0]);
  }

  /** View */
  get searchWikipediaView() {
    return $(L.searchWikipediaView[0]);
  }

  /** TextView "Search for an article" */
  get searchForAnArticleText() {
    return $(L.searchForAnArticleText[0]);
  }

  /** View */
  get view3() {
    return $(L.view3[0]);
  }

  /** View */
  get btn2() {
    return $(L.btn2[0]);
  }

  /** TextView "Architecture" */
  get architectureText() {
    return $(L.architectureText[0]);
  }

  /** View */
  get btn3() {
    return $(L.btn3[0]);
  }

  /** TextView "Art" */
  get artText() {
    return $(L.artText[0]);
  }

  /** View */
  get btn4() {
    return $(L.btn4[0]);
  }

  /** TextView "Comics and anime" */
  get comicsAndAnimeText() {
    return $(L.comicsAndAnimeText[0]);
  }

  /** View */
  get btn5() {
    return $(L.btn5[0]);
  }

  /** TextView "Wil Ledezma" */
  get wilLedezmaText() {
    return $(L.wilLedezmaText[0]);
  }

  /** TextView "Venezuelan baseball player (born 1981)" */
  get venezuelanBaseballPlayerBornText() {
    return $(L.venezuelanBaseballPlayerBornText[0]);
  }

  /** View */
  get btn6() {
    return $(L.btn6[0]);
  }

  /** TextView "Gaylord Opryland Resort & Convention Cen" */
  get gaylordOprylandResortConventionText() {
    return $(L.gaylordOprylandResortConventionText[0]);
  }

  /** TextView "Hotel and convention center in Tennessee" */
  get hotelAndConventionCenterText() {
    return $(L.hotelAndConventionCenterText[0]);
  }

  /** View */
  get btn7() {
    return $(L.btn7[0]);
  }

  /** View */
  get btn8() {
    return $(L.btn8[0]);
  }

  /** TextView "Select at least one interest" */
  get selectAtLeastOneText() {
    return $(L.selectAtLeastOneText[0]);
  }

  /** View */
  get btn9() {
    return $(L.btn9[0]);
  }

  /** TextView "Skip" */
  get skipText() {
    return $(L.skipText[0]);
  }

  /** View */
  get btn10() {
    return $(L.btn10[0]);
  }

  /** View */
  get nextView() {
    return $(L.nextView[0]);
  }

  /** TextView "1 selected" */
  get el1SelectedText() {
    return $(L.el1SelectedText[0]);
  }

  /** View */
  get btn11() {
    return $(L.btn11[0]);
  }

  /** TextView "Deselect all" */
  get deselectAllText() {
    return $(L.deselectAllText[0]);
  }

  /** TextView "Yasuhiro Nightow" */
  get yasuhiroNightowText() {
    return $(L.yasuhiroNightowText[0]);
  }

  /** TextView "Japanese manga artist" */
  get japaneseMangaArtistText() {
    return $(L.japaneseMangaArtistText[0]);
  }

  /** TextView "Monthly Carol" */
  get monthlyCarolText() {
    return $(L.monthlyCarolText[0]);
  }

  /** TextView "Japanese manga magazine" */
  get japaneseMangaMagazineText() {
    return $(L.japaneseMangaMagazineText[0]);
  }

  /** View */
  get btn12() {
    return $(L.btn12[0]);
  }

  /** TextView "Umatilla Bridge" */
  get umatillaBridgeText() {
    return $(L.umatillaBridgeText[0]);
  }

  /** TextView "Bridge between Washington and Oregon, U." */
  get bridgeBetweenWashingtonAndText() {
    return $(L.bridgeBetweenWashingtonAndText[0]);
  }

  /** TextView "High Desert Museum" */
  get highDesertMuseumText() {
    return $(L.highDesertMuseumText[0]);
  }

  /** TextView "Regional museum in Oregon, USA" */
  get regionalMuseumInOregonText() {
    return $(L.regionalMuseumInOregonText[0]);
  }

  /** TextView "2 selected" */
  get el2SelectedText() {
    return $(L.el2SelectedText[0]);
  }

  /** TextView "3 selected" */
  get el3SelectedText() {
    return $(L.el3SelectedText[0]);
  }

  /** TextView "Former Dinglinzihbian Police Station" */
  get formerDinglinzihbianPoliceStationText() {
    return $(L.formerDinglinzihbianPoliceStationText[0]);
  }

  /** TextView "Police station in Linyuan, Kaohsiung, Ta" */
  get policeStationInLinyuanText() {
    return $(L.policeStationInLinyuanText[0]);
  }

  /** TextView "Chapel of the Immaculate Conception, St." */
  get chapelOfTheImmaculateText() {
    return $(L.chapelOfTheImmaculateText[0]);
  }

  /** TextView "Church in St. Julian's, Malta" */
  get churchInStJulianText() {
    return $(L.churchInStJulianText[0]);
  }

  /** TextView "Semyon Budyonny" */
  get semyonBudyonnyText() {
    return $(L.semyonBudyonnyText[0]);
  }

  /** TextView "Soviet military commander (1883–1973)" */
  get sovietMilitaryCommander1883Text() {
    return $(L.sovietMilitaryCommander1883Text[0]);
  }

  /** TextView "Ditch Davey" */
  get ditchDaveyText() {
    return $(L.ditchDaveyText[0]);
  }

  /** TextView "Australian actor" */
  get australianActorText() {
    return $(L.australianActorText[0]);
  }

  /** TextView "Little Athens" */
  get littleAthensText() {
    return $(L.littleAthensText[0]);
  }

  /** TextView "Martian Successor Nadesico" */
  get martianSuccessorNadesicoText() {
    return $(L.martianSuccessorNadesicoText[0]);
  }

  /** TextView "1996 science fiction anime television se" */
  get el1996ScienceFictionAnimeText() {
    return $(L.el1996ScienceFictionAnimeText[0]);
  }

  /** TextView "David Wright (artist)" */
  get davidWrightArtistText() {
    return $(L.davidWrightArtistText[0]);
  }

  /** TextView "British illustrator" */
  get britishIllustratorText() {
    return $(L.britishIllustratorText[0]);
  }
}

export { PersonalizationScreen2 as PersonalizationScreen2Class, L as PersonalizationScreen2Locators };
export default new PersonalizationScreen2();
