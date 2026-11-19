// TOUR: open the app, visit every bottom-bar screen once, create a reading list with a random
// name, then exit the app.
//   fresh start -> intro + personalisation -> Home -> Saved -> Search -> Activity -> More
//   -> Saved: ⋮ > Create new list > "QA list <random>" > OK -> the list is shown -> close the app
// Safe: no login, nothing published. The new list lives only on this emulator, and the next run
// starts from a clean app anyway (wdio.conf.js: noReset false), so nothing needs cleaning up.
// The tests run in order and each starts where the previous one ended: run the whole file.
// Run: npm run test:tour
import {
  BottomNav, TABS, HomePage, SavedPage, CreateReadingListDialog, SearchTabPage, ActivityPage, MoreMenu, MORE_ITEMS, Dialogs,
} from '../../pageobjects/index.js';
import { APP_ID, appInForeground, getToMainScreen, exitApp, randomListName } from '../../support/app.js';

describe('Tour: every bottom-bar screen, then a new reading list', () => {
  const listName = randomListName();

  it('TOUR-01 the app opens and reaches the main screen (intro + personalisation done)', async () => {
    await driver.waitUntil(appInForeground, { timeout: 30000, timeoutMsg: `${APP_ID()} did not open` });
    await getToMainScreen();
    for (const key of Object.keys(TABS)) {
      await expect(BottomNav.tab(key)).toBeDisplayed({ message: `Bottom tab "${TABS[key].label}" missing` });
    }
  });

  it('TOUR-02 Home: Community and For you feeds', async () => {
    await HomePage.open();
    await BottomNav.waitUntilSelected('home');
    await expect(HomePage.communityTab).toBeDisplayed();
    await expect(HomePage.forYouTab).toBeDisplayed();
  });

  it('TOUR-03 Saved: "All articles" and "Reading lists" tabs and the ⋮ menu', async () => {
    // A fresh install has NO reading list yet ("My reading list" only appears once something
    // is saved), so this checks the screen itself, not a list.
    await SavedPage.open();
    await BottomNav.waitUntilSelected('saved');
    await expect(SavedPage.allArticlesTab).toBeDisplayed();
    await expect(SavedPage.readingListsTab).toBeDisplayed();
    await expect(SavedPage.overflowButton).toBeDisplayed();
  });

  it('TOUR-04 Search: search bar and reading history', async () => {
    await SearchTabPage.open();
    await BottomNav.waitUntilSelected('search');
    await expect(SearchTabPage.searchBar).toBeDisplayed();
    await expect(SearchTabPage.historyTitle).toBeDisplayed();
  });

  it('TOUR-05 Activity: opens (intro closed if shown), logged-out message', async () => {
    await ActivityPage.open();
    await expect(ActivityPage.loggedOutMessage).toBeDisplayed();
  });

  it('TOUR-06 More: menu with Log in, Games, Places, Settings, Donate', async () => {
    await MoreMenu.open();
    for (const key of MORE_ITEMS) {
      await expect(MoreMenu.item(key)).toBeDisplayed({ message: `More menu: "${key}" missing` });
    }
    await MoreMenu.close();
  });

  it(`TOUR-07 Saved: create a new reading list with a random name ("${listName}")`, async () => {
    await SavedPage.open();
    await SavedPage.startNewList();
    await CreateReadingListDialog.create(listName, 'Created by the automated tour suite');
    await Dialogs.dismissAll(); // "Share this reading list ... Got it" balloon, if shown
    // The app may open the new list; come back to the Saved tab to check it is listed
    if (!(await SavedPage.isOpen(3000))) {
      await driver.back();
      await SavedPage.waitForOpen();
    }
    expect(await SavedPage.hasList(listName)).toBe(true);
  });

  it('TOUR-08 exit the app', async () => {
    await exitApp();
    expect(await appInForeground()).toBe(false);
  });
});
