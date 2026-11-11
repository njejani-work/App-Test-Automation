// SMOKE (~2-3 min): does the freshly compiled APK install, start, and do its core job?
//   install + launch -> skip intro -> main screen + tabs -> search -> open an article
//   -> back -> Settings -> app still running.
// Read-only: no login, nothing saved or edited. Needs internet (articles come from wikipedia.org).
// Starts from a clean app state (wdio.conf.js: noReset false). The tests run in order and
// each one starts where the previous one ended, so run the whole file, not single tests.
// Run: npm run test:smoke        (after npm run build:apk)
import { OnboardingPage, HomePage, TABS, SearchPage, ArticlePage, SettingsPage, Dialogs } from '../../pageobjects/index.js';
import { APP_ID, appInForeground, backToMain } from '../../support/app.js';
import { SEARCH_TERM } from '../../data/searchTerms.js';

describe('Smoke: Wikipedia app built from source', () => {
  it('SMK-01 [P0] the built APK is installed and the app starts', async () => {
    await driver.waitUntil(appInForeground, {
      timeout: 30000,
      timeoutMsg: `App ${APP_ID()} is not in the foreground after launch`,
    });
    expect(await driver.isAppInstalled(APP_ID())).toBe(true);
  });

  it('SMK-02 [P0] the intro can be skipped and the main screen opens', async () => {
    if (await OnboardingPage.isOpen(15000)) {
      await expect(OnboardingPage.skipButton).toBeDisplayed();
      await OnboardingPage.skip();
    }
    await Dialogs.dismissAll();
    await HomePage.waitForOpen(30000);
    await expect(HomePage.navBar).toBeDisplayed();
  });

  it('SMK-03 [P0] the bottom navigation shows all five tabs', async () => {
    for (const key of Object.keys(TABS)) {
      await expect(HomePage.tab(key)).toBeDisplayed({ message: `Tab "${TABS[key].label}" is missing` });
    }
  });

  it(`SMK-04 [P0] searching for "${SEARCH_TERM}" shows matching results`, async () => {
    await SearchPage.openFromNav();
    await SearchPage.search(SEARCH_TERM);
    await SearchPage.waitForResult(SEARCH_TERM);
    expect(await SearchPage.resultCount(SEARCH_TERM)).toBeGreaterThan(0);
  });

  it('SMK-05 [P0] opening a result shows the article', async () => {
    await SearchPage.openResult(SEARCH_TERM);
    await Dialogs.dismissAll({ timeout: 1500 });
    await ArticlePage.waitForOpen(30000);
    await expect(ArticlePage.webView).toBeDisplayed();
    await ArticlePage.waitForTitle(SEARCH_TERM);
  });

  it('SMK-06 [P1] back returns to the search results, then to the main screen', async () => {
    await ArticlePage.goBack();
    await SearchPage.waitForOpen();
    await expect(SearchPage.result(SEARCH_TERM)).toBeDisplayed();
    await backToMain();
  });

  it('SMK-07 [P1] Settings opens from the More menu', async () => {
    await SettingsPage.openFromMore();
    await expect(SettingsPage.languagePreference).toBeDisplayed();
    await backToMain();
  });

  it('SMK-08 [P0] the app is still running (no crash during the smoke run)', async () => {
    expect(await appInForeground()).toBe(true);
    await expect(HomePage.navBar).toBeDisplayed();
  });
});
