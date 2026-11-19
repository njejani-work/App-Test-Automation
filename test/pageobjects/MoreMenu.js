import BasePage, { S } from './BasePage.js';
import BottomNav from './components/BottomNav.js';

// "More" tab: a bottom sheet over the main screen. Captured as locators/MainScreen4.json.
//   "Log in / join Wikipedia" (main_drawer_login_button), Games, Places, Settings, Donate
// The tests open Settings only. Login, Donate etc. are listed so a test can check they exist.
const SEL = {
  sheet: S.id('design_bottom_sheet'),
  login: S.id('main_drawer_login_button'),
  games: S.id('main_drawer_games_hub_container'),
  places: S.id('main_drawer_places_container'),
  settings: S.id('main_drawer_settings_container'),
  donate: S.id('main_drawer_donate_container'),
};

export const MORE_ITEMS = ['login', 'games', 'places', 'settings', 'donate'];

class MoreMenu extends BasePage {
  get anchors() {
    return [SEL.settings, SEL.login];
  }

  item(key) {
    return $(SEL[key]);
  }

  async open() {
    await BottomNav.open('more');
    await this.waitForOpen();
  }

  async openSettings() {
    await this.tap(SEL.settings);
  }

  /** Close the sheet with the Android back button. */
  async close() {
    await driver.back();
    await $(SEL.settings).waitForDisplayed({ reverse: true, timeout: 10000 });
  }
}

export default new MoreMenu();
