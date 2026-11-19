# Captured screens → page objects

Captured on 11 Nov 2026 (watch mode, `org.wikipedia.dev`, build 57644dbeea). The capture tool named screens automatically; this table says what each one really is and which page object uses it.

| Captured file | What it is | Page object |
|---|---|---|
| `InitialOnboardingScreen` | Intro 1: "All the world's knowledge" (~Forward) | `OnboardingPage` |
| `InitialOnboardingScreen2` | Intro 2: "Data & Privacy" | `OnboardingPage` |
| `InitialOnboardingScreen3` | Intro 3: "Read in more than 300 languages" | `OnboardingPage` |
| `PersonalizationScreen`, `…2` | "Follow your curiosity" (3 steps, Skip / ~Next) | `PersonalizationPage` |
| `ExploreFeedBuildingScreen` | "Let's build your feed…" (transient) | `PersonalizationPage` (waits it out) |
| `MainScreen` | Main screen: Home feed, Saved, Activity, bottom bar (merged by the tool) | `HomePage`, `SavedPage`, `ActivityPage`, `components/BottomNav` |
| `HistoryScreen` | Search tab: search bar + History | `SearchTabPage` |
| `MainScreen3` | Search tab first visit: "A Faster way to Search" sheet (~Close) | `components/Dialogs` |
| `ActivityTabOnboardingScreen` | Activity first visit: "Introducing Activity" (Continue) | `ActivityPage` |
| `MainScreen4` | More menu (bottom sheet) | `MoreMenu` |
| `MainScreen5` | Saved ⋮ menu (Create new list…) | `SavedPage` |
| `MainScreen2` | "Create new list" dialog | `CreateReadingListDialog` |
| `ReadingListScreen` | Reading list "Share this reading list… Got it" balloon | `components/Dialogs` |
| `MyReadingListScreen` | Inside a reading list | (not used yet) |
| `SearchScreen`, `YourLanguagesScreen` | Search screen; language list | `SearchPage` (existing) |
| `GeneralScreen`, `AppThemeScreen`, … | Settings and its dialogs | `SettingsPage` (partly) |
| `CustomizeScreen`, `GamesHubScreen`, `CreateAccountScreen` | Feed card menu, Games, Create account | (not used yet) |
| Developer-settings screens (`AnnouncementsScreen`, `RestbaseAccessScreen`, …) | Hidden debug settings of the dev build | not tested |
| `QuickstepAddItemScreen` | Android launcher (left the app via "Add widget") | ignore |

Renaming the files themselves is optional: `node scripts/locator-capture/capture.mjs rename MainScreen4 MoreMenuScreen` and then `npm run locators:pages`.
