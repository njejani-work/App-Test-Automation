// One import for every page model:
//   import { HomePage, SavedPage, BottomNav } from '../../pageobjects/index.js';
// Locators in these files come from the capture in locators/ (see locators/SCREEN-MAP.md).
//
// Page objects exported here are instrumented for the shared dashboard (@apptest/toolkit): each async method a spec
// calls is recorded as a step with a screenshot and passed/failed status; the taps and typing inside it are its actions.
// Import from the individual files instead if you ever need the raw, un-recorded objects.
import { instrument } from '@apptest/toolkit/dashboard/recorder.js';

import RawDialogs from './components/Dialogs.js';
import RawBottomNav from './components/BottomNav.js';
import RawOnboardingPage from './OnboardingPage.js';
import RawPersonalizationPage from './PersonalizationPage.js';
import RawHomePage from './HomePage.js';
import RawSavedPage from './SavedPage.js';
import RawCreateReadingListDialog from './CreateReadingListDialog.js';
import RawSearchTabPage from './SearchTabPage.js';
import RawSearchPage from './SearchPage.js';
import RawArticlePage from './ArticlePage.js';
import RawActivityPage from './ActivityPage.js';
import RawMoreMenu from './MoreMenu.js';
import RawSettingsPage from './SettingsPage.js';

export { default as BasePage, S } from './BasePage.js';
export { TABS } from './components/BottomNav.js';
export { MORE_ITEMS } from './MoreMenu.js';

export const Dialogs = instrument(RawDialogs, 'Dialogs');
export const BottomNav = instrument(RawBottomNav, 'BottomNav');
export const OnboardingPage = instrument(RawOnboardingPage, 'OnboardingPage');
export const PersonalizationPage = instrument(RawPersonalizationPage, 'PersonalizationPage');
export const HomePage = instrument(RawHomePage, 'HomePage');
export const SavedPage = instrument(RawSavedPage, 'SavedPage');
export const CreateReadingListDialog = instrument(RawCreateReadingListDialog, 'CreateReadingListDialog');
export const SearchTabPage = instrument(RawSearchTabPage, 'SearchTabPage');
export const SearchPage = instrument(RawSearchPage, 'SearchPage');
export const ArticlePage = instrument(RawArticlePage, 'ArticlePage');
export const ActivityPage = instrument(RawActivityPage, 'ActivityPage');
export const MoreMenu = instrument(RawMoreMenu, 'MoreMenu');
export const SettingsPage = instrument(RawSettingsPage, 'SettingsPage');
