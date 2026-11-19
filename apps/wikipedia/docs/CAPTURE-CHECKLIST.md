# Screen capture checklist (watch mode)

Goal: one clean capture per screen, saved under the names below, so the page objects and suites can be built from the real app.

## Before you start (Git Bash, project folder)

```bash
adb shell pm clear org.wikipedia.dev          # fresh app state, so the intro shows again
export SAVE_RAW_XML=true                      # also keep each screen's raw page source
```

- **Terminal A:** `npm run appium` (leave it running)
- **Terminal B:** `npm run locators:watch`

## How to capture each screen

1. Open the screen in the emulator and wait until it has fully loaded.
2. In Terminal B, press **`n`**, type the name from the table, and press Enter.
3. If the screen scrolls, scroll down slowly to the bottom and press **`c`** at each stop. New elements are added to the same screen.
4. Then go to the next screen.

Skip a screen that doesn't exist in this build, and note it at the bottom. If you find a screen that isn't listed, give it a clear name of your own.

**Never tap:** Edit, Publish, Log in, Donate, Share, Thank, Watch, or links that open the browser. Wikipedia is a live public site.

| # | Name to type | How to get there |
|---|---|---|
| 1 | `OnboardingIntroScreen` | Fresh start: "All the world's knowledge" |
| 2 | `OnboardingPrivacyScreen` | → arrow: "Data & Privacy" |
| 3 | `OnboardingLanguagesScreen` | → arrow: "Read in more than 300 languages" |
| 4 | `HomeCommunityScreen` | → arrow (finish). Home, "Community" tab. Scroll through it |
| 5 | `HomeForYouScreen` | Home, "For you" tab |
| 6 | `FeedLanguageMenu` | Home, the "EN ⌄" button |
| 7 | `SavedScreen` | Bottom tab: Saved |
| 8 | `SearchTabScreen` | Bottom tab: Search (history and recent searches) |
| 9 | `SearchScreen` | Tap "Search Wikipedia" (empty search box, keyboard open) |
| 10 | `SearchResultsScreen` | Type `Albert Einstein`, wait for results |
| 11 | `ArticleScreen` | Tap the "Albert Einstein" result. Scroll a little |
| 12 | `ArticleContentsScreen` | In the article, the contents / table of contents button |
| 13 | `ArticleOverflowMenu` | In the article, the ⋮ (more options) button |
| 14 | `ArticleLanguagesScreen` | In the article, the language button |
| 15 | `TabsScreen` | In the article, the tabs button (square with a number) |
| 16 | `ActivityScreen` | Bottom tab: Activity |
| 17 | `MoreMenu` | Bottom tab: More (the sheet that slides up) |
| 18 | `SettingsScreen` | More → Settings. Scroll to the bottom |
| 19 | `WikipediaLanguagesScreen` | Settings → Wikipedia languages |
| 20 | `AppThemeScreen` | Settings → App theme |
| 21 | `AboutScreen` | Settings → About the Wikipedia app |

Press **`l`** at any time to list what's been captured, and **`q`** to quit. Then:

```bash
npm run locators:list      # check all names are there
```

Stop Appium in Terminal A (Ctrl+C) before running any `npm run test:...` again.

## Notes (screens missing, odd behaviour)

- 
