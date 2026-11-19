# Wikipedia (apps/wikipedia): compile the app from its repository, then smoke-test it

End-to-end pipeline for the Wikipedia Android app, built the same way as the eGenome.ai test project:
**step 1** compiles the app's source code from Git into an APK, **step 2** installs that exact APK on an emulator and runs an Appium smoke suite against it.

**Stack:** Bash (build script) · Gradle · Node.js · WebdriverIO 10 · Appium 3 · UiAutomator2 · Mocha · page objects. All free and open source (the Android SDK is free, Google licence).

**App under test:** https://github.com/njejani-work/apps-android-wikipedia.git (public fork of Wikipedia's app), variant `devDebug` → package `org.wikipedia.dev`.

---

## How it works

```
npm run smoke
 ├─ STEP 1  npm run build:apk  ──► scripts/build-apk.sh
 │            1 check the variant name        devDebug -> assembleDevDebug
 │            2 check tools                   git, Java, ANDROID_HOME
 │            3 fetch ONE commit of the app   into app-src/ (git fetch --depth 1)
 │            4 build with Gradle             ./gradlew assembleDevDebug
 │            5 find the APK by its label     output-metadata.json (no guessed paths)
 │            6 name it + write a receipt     out/<app>-<variant>-<commit>.apk + .build-info.txt (SHA-256)
 │
 └─ STEP 2  npm run test:smoke ──► wdio.conf.js
              picks the newest APK in out/ and checks its SHA-256 against the receipt
              └─ Appium installs it on the emulator, clears app data (fresh start)
                   └─ test/specs/smoke/smoke.e2e.js  (8 tests, page objects in test/pageobjects/)
                        └─ results: terminal + reports/junit/*.xml + reports/screenshots/ (failures)
```

The two steps only share one thing: the `out/` folder. That's deliberate. You can build once and test many times, test an APK someone else built (`APK_PATH`), or run each step on a different machine in CI.

## Prerequisites

| Tool | Check | Notes |
|---|---|---|
| Git for Windows (includes Git Bash) | `git --version` | The build script is Bash |
| JDK 17+ | Android Studio's own Java is fine | Gradle uses `JAVA_HOME` |
| Android SDK + an emulator (AVD) | `echo $ANDROID_HOME` | Android Studio → Device Manager; API 30+ x86_64, **English** language |
| Node.js 20+ | `node -v` | |
| ~10 GB RAM free, ~10 GB disk | | Gradle builds of this app are heavy; first build ~11 min |

## Setup (once)

```bash
cd "C:/Users/egeno/Downloads/Nishant/Projects/App test Automation/wikiApp_compileToTest"
npm install                 # WebdriverIO, Appium, reporters
npm run appium:setup        # Appium's Android driver (UiAutomator2)
cp .env.example .env        # defaults work as they are
```

## Run

1. Start an emulator (Android Studio → Device Manager → ▶). Make sure it has internet.
2. Then:

```bash
npm run doctor              # checks everything below and tells you what to fix
npm run build:apk           # STEP 1 only  (first time ~11 min, then ~10 s if nothing changed)
npm run test:smoke          # STEP 2 only  (~2-3 min)
npm run smoke               # both, one after the other
npm run test:tour           # tour of every bottom-bar screen + new reading list (~3 min)
```

Other variants or app versions:

```bash
npm run build:apk -- alphaDebug                      # another variant
APP_REF=<full-commit-hash> npm run build:apk         # a specific commit (Git Bash)
```

## The smoke suite

| ID | Priority | Checks |
|---|---|---|
| SMK-01 | P0 | The built APK is installed and the app starts (right package in the foreground) |
| SMK-02 | P0 | The intro (3 pages, Forward arrow) can be completed and the main screen opens |
| SMK-03 | P0 | The bottom navigation shows all five tabs |
| SMK-04 | P0 | Searching for `SEARCH_TERM` (default "Albert Einstein") shows matching results |
| SMK-05 | P0 | Opening a result shows the article |
| SMK-06 | P1 | Back returns to the results, then to the main screen |
| SMK-07 | P1 | Settings opens from the More menu |
| SMK-08 | P0 | The app is still running at the end (no crash) |

Read-only: no login, nothing saved. Needs internet. Tests run in order, each starting where the last one ended, so run the whole file.

## The tour suite

`test/specs/tour/bottom-nav-tour.e2e.js`. Run: `npm run test:tour`

| ID | Checks |
|---|---|
| TOUR-01 | App opens; intro (3 pages) and "Follow your curiosity" are passed; all 5 bottom tabs shown |
| TOUR-02 | Home: Community and For you feeds |
| TOUR-03 | Saved: "All articles" / "Reading lists" tabs and the ⋮ menu (a fresh install has no lists yet) |
| TOUR-04 | Search: search bar and History |
| TOUR-05 | Activity: "Introducing Activity" closed if shown; logged-out message |
| TOUR-06 | More: Log in, Games, Places, Settings, Donate |
| TOUR-07 | Saved: ⋮ → Create new list → random name "QA list xxxxxx" → OK → the list is shown |
| TOUR-08 | The app is closed and no longer in the foreground |

Locators come from the capture in `locators/`; `locators/SCREEN-MAP.md` maps each captured screen to its page object.

## Build versions and the test dashboard

**Every build is versioned.** `npm run build:apk` gives each build a number (#1, #2, …; on CI the CI's run number) and names the APK
`<app>-<variant>-v<versionName>-b<number>-<YYYYMMDD-HHMMSS>-<commit>.apk`, e.g.
`apps-android-wikipedia-devDebug-v50616-dev-2026-11-11-b12-20261111-164210-57644dbeea.apk`. Its `.build-info.txt` receipt
has the same `build_number`, `build_id`, version name/code, commit and build times. The newest `KEEP_BUILDS` (default 5)
builds are kept in `out/`; tests use the newest.

**Every test shows the app version:** in the terminal before each test (`[app v… · build …] ▶ TOUR-03 …`) and everywhere on the dashboard.

### The dashboard (shared)

Since 19 Nov 2026 this project is `apps/wikipedia` in the `app-tests` workspace and uses the **shared** recorder, dashboard and
locator tool in `toolkit/` (see `toolkit/README.md`); its own copies were removed. `npm run dashboard` opens
`reports/index.html`; the App filter at the top switches to eGenome.ai and Instagram. The version shown is the one in the receipt
of the APK under test (`dashboard.appInfo` in `app.config.js`), because Appium installs that APK only when the session starts.

What stays Wikipedia's own: `test/helpers/launch.js` (full API logging with run-as, then opening the app on its exact activity),
`test/helpers/hooks.js`, and the settings files `test/triage.json`, `test/budgets.json` and `test/api-formats.json`, which the
shared dashboard reads from this folder. `npm run test:unit` checks budgets, formats and the app opening without a device.


## Project structure

| Path | What |
|---|---|
| `scripts/build-apk.sh` | **Step 1**: source → named APK + receipt |
| `scripts/run-bash.mjs` | Lets `npm run build:apk` use Git Bash on Windows (not WSL) and passes `.env` settings |
| `scripts/doctor.mjs` | Pre-flight checks for both steps |
| `app.config.js`, `wdio.conf.js` | **Step 2**: device, APK, timeouts, reporters (over the shared `toolkit/wdio` settings) |
| `test/support/apk.js` | Finds the newest APK in `out/` and verifies its SHA-256 |
| `test/support/app.js` | App-level helpers (in foreground? back to main screen) |
| `test/helpers/` | Wikipedia's own hooks, and opening the app with full API logging (`launch.js`) |
| `test/triage.json` | Severity and module per test, module owners, known issues and tickets (used by the dashboard) |
| `test/budgets.json` | Performance and API budgets, and trend settings (phase 3) |
| `test/api-formats.json` | Response format rules: the fields the app relies on, per API (phase 3) |
| `test/unit/` | Unit tests without a device (`npm run test:unit`) |
| `test/pageobjects/` | One file per screen; only these know the selectors |
| `test/specs/smoke/smoke.e2e.js` | The smoke suite |
| `test/data/searchTerms.js` | Test data (overridable in `.env`) |
| `.github/workflows/smoke.yml` | GitHub Actions: compile + smoke on every push / PR (free, has KVM) |
| `.github/workflows/capture-locators.yml` | GitHub Actions: compile + crawl the real app screens, upload `locators/` |
| `locators.config.mjs` | Settings for the shared locator tool (`toolkit/locators`) |
| `locators/` | Captured screens: JSON locators, screenshots, generated page classes |
| `app-src/`, `out/`, `reports/` | Generated, git-ignored |

## GitHub repository and CI

The project lives in its own GitHub repository; both workflows run on GitHub's free Linux machines, which support the emulator (KVM).

```bash
git init -b main && git add . && git commit -m "Compile-and-test project for the Wikipedia app"
git remote add origin https://github.com/<your-account>/wikiApp_compileToTest.git
git push -u origin main
```

| Workflow | When | Result (Actions tab → run → Artifacts) |
|---|---|---|
| Compile and smoke test | Every push / pull request to `main`, or by hand | `reports/`, the APK and its receipt |
| Capture locators | By hand only | `locators/`: one JSON, screenshot and page class per screen |

## Capturing locators from the app's screens

Page objects should be built from what is really on screen. The capture tool records every element of every screen it visits: its best locator, fallbacks, and a screenshot.

**On GitHub (no local emulator needed):** Actions → **Capture locators** → Run workflow. Download the `locators` artifact and copy it into `locators/`.

**On your PC:** install the APK on the emulator (`adb install -r out/<newest>.apk`), start Appium in one terminal (`npm run appium`), then in another:

```bash
npm run locators:crawl     # the tool taps through the app by itself (denylist blocks edit/login/donate/share...)
npm run locators:watch     # you navigate; it captures each new screen (keys: c n r m l q)
```

Then: rename screens to clear names (`node ../../toolkit/locators/capture.mjs rename MainScreen3 SearchScreen`) and regenerate the classes (`npm run locators:pages`). Hand-written page objects in `test/pageobjects/` extend the generated classes, and suites in `test/specs/` are organised per screen.

## Locators

The app is mostly native Android views with stable resource-ids, plus some Jetpack Compose screens (search results, Home feed) that have none. Page objects use, in this order:

1. **Resource-id, matched by its end** (`.*:id/search_src_text`), because the package part changes with the flavour (`org.wikipedia.dev:id/…` vs `org.wikipedia:id/…`).
2. **Visible text** for Compose screens. That's why the emulator must be in English.

The ids were taken from the app's source (`app/src/main/res/layout/*.xml`, `navtab/NavTab.kt`). If the app changes and a test can't find something, open **Appium Inspector** on that screen, find the new id or text, and update one page object.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `No APK found in out/` | Step 1 not run | `npm run build:apk` |
| `does not match the SHA-256 in its receipt` | APK changed or half-copied | Rebuild |
| Build: `Gradle build daemon disappeared` | Out of memory | Set `GRADLE_ARGS=-Dorg.gradle.jvmargs=-Xmx3g --max-workers=2` in `.env` |
| `Git Bash not found` | Git for Windows missing or elsewhere | Install it, or set `GIT_BASH` to `bash.exe` |
| Session won't start / `no devices` | Emulator not running | Start it; `adb devices` must list it |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | A copy signed with another key is installed | `adb uninstall org.wikipedia.dev` |
| SMK-04 can't find results | No internet, or emulator not in English | Check both |
| A locator fails after an app update | Screen changed | Appium Inspector → update the page object |
