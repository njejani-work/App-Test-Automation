import BasePage, { S } from './BasePage.js';
import HomePage from './HomePage.js';

// "More" tab opens a bottom sheet (MenuNavTabDialog, layout view_main_drawer.xml).
// Its Settings row has the id main_drawer_settings_container.
// The Settings screen itself is identified by preference titles, not by the word
// "Settings" (that word is also on the More sheet, so it would match too early).
const SEL = {
  moreSheetSettings: S.id('main_drawer_settings_container'),
  languagePref: S.text('Wikipedia languages'),
  themePref: S.text('App theme'),
  generalHeading: S.text('General'),
};

class SettingsPage extends BasePage {
  get anchors() {
    return [SEL.languagePref, SEL.generalHeading];
  }

  get languagePreference() { return $(SEL.languagePref); }

  /** Main screen -> More -> Settings. */
  async openFromMore() {
    await HomePage.openTab('more');
    await this.tap(SEL.moreSheetSettings);
    await this.waitForOpen();
  }
}

export default new SettingsPage();
