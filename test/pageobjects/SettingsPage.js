import BasePage, { S } from './BasePage.js';
import MoreMenu from './MoreMenu.js';

// "More" tab opens a bottom sheet (MenuNavTabDialog, layout view_main_drawer.xml).
// Its Settings row has the id main_drawer_settings_container.
// The Settings screen itself is identified by preference titles, not by the word
// "Settings" (that word is also on the More sheet, so it would match too early).
const SEL = {
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
    await MoreMenu.open();
    await MoreMenu.openSettings();
    await this.waitForOpen();
  }
}

export default new SettingsPage();
