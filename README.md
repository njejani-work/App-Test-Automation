# wikiApp_compileToTest: compile the app from its repository, then smoke-test it

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

### The dashboard

`reports/index.html`; open it with `npm run dashboard` and leave it open: it **refreshes by itself** after every test and at the end of
every run, pass or fail (⟳ or `r` refreshes by hand). Built for triage, most urgent first:

```
┌ Triage · Coverage · Performance · Device matrix · History · API calls   Updated … ● Auto ⟳ ◐ ┐
│ App ▾  Build ▾  Suite ▾  Run ▾  Env ▾  Platform ▾  [Only mine]  search (/)                │ global filters, kept in the URL
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ ■ BLOCKED   Pass 87.5% ▼12.5   Failed 1   New 1   Flaky 0   Crashes 0   Warnings 2  API 1 │ verdict + change vs previous run
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ ALL RUNS · CONSOLIDATED  Runs 8 · Tests 64 · Passed 52 · Failed 12 · Warnings 3 · API 43   │ totals over every kept run
├──────────────────────────────┬────────────────────────────────────────────────────────────┤
│ FAILURES BY MODULE (sorted)  │ TREND · last 14 runs: pass-rate line + failure bars        │
├──────────────────────────────┴────────────────────────────────────────────────────────────┤
│ TRIAGE  Sev │ Test / Issue │ Module │ Status │ Since │ Owner │ Ticket                      │ severity → new → module
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ ALL RUNS  run · build · device · tests · passed · failed · warnings · API calls · status   │ click one to open it
└───────────────────────────────────────────────────────────────────────────────────────────┘
  click a row (or j/k + Enter) → DETAIL DRAWER from the right; Esc closes
```

| Zone | What it does |
|---|---|
| **Filters** | App, Build (#number), Run (newest by default), Env, Platform (device · Android version), **Only mine** (asks your name once), search. The whole state is in the address (`#/triage?build=n12&f=new…`), so a link opens the same view for someone else |
| **Verdict** | **BLOCKED** = a P0 test failed (not flaky, not known), a crash, or the run could not start · **UNSTABLE** = other failures or flaky tests · **PASS**. Six numbers with their change since the previous run; click one to filter the table |
| **All runs · consolidated** | Totals over every kept run that matches the filters, like the eGenome.ai overview: runs (passed/failed), tests run, passed, failed (crashes), warnings, API calls (failed / warnings / known), with percentages and a pass/warning/fail bar. The **All runs** table at the bottom lists each run with its build, device, test counts and API calls |
| **Failures by module** | Horizontal bars, sorted; new / recurring / flaky. Click a module to filter |
| **Trend** | Pass rate and failures over the last 14 runs of the current filters, labelled by build. Click a run to open it |
| **Triage table** | One row per **error signature**: the same error in several tests is one row ("2 tests: TOUR-02, TOUR-03"). **Status**: NEW (passed last run), RECURRING, FLAKY 3/10 (flips in the last 10 runs), KNOWN, CRASH. **Since**: the build where this failure streak started, so you know which commits to look at. Owner and Ticket |
| **Drawer** | Error with links to the exact source line (VS Code) and stack · **steps to reproduce** (every tap/type/back the test did, with timings) · **video** of the failing test + screenshot · device, OS and build · app log · **diff since the last pass** (build, commit with a GitHub compare link, device, duration, steps that differ, memory) · history. Actions: **Assign**, **Create ticket** (opens a pre-filled GitHub issue and copies the report), ticket link, **Mark as known** |
| **Coverage** | Each module from `test/triage.json`: covered, gap (no tests) or excluded on purpose (log in, editing the live site) |
| **Performance** | App start (Android's own launch time), peak memory, janky frames: per run (trend) and per test |
| **Device matrix** | Pass rate per Android version × device. Click a cell to filter everything to that platform |
| **History** | Every test across runs, with pass rate and a **flakiness** score (how often it flips pass ↔ fail) |
| **API calls** | Every call the app made to Wikipedia's servers during the selected run: method, address, status code, time, size, which test, and the **response** (headers and body, pretty-printed; the full body opens from a link). **Issues and failures** first, each with its reason (error status + the server's message, no response such as no internet or timeout, an API error inside a 200 response, slow > 2 s, large > 500 KB). Then a table **by API** (calls, status codes, average/max time, problems). The test drawer shows the same for one test |

**How API calls are recorded.** The app logs its own HTTP traffic (OkHttp) in the Android log. At the start of each session Appium
installs the app without opening it (`appium:autoLaunch: false`); the test setup then switches that log to full responses (the app's
developer setting "Retrofit Log Level" = BODY, written with `run-as`, which works on this debug build) and opens the app once, with the
launcher intent on `APP_ACTIVITY`. The app is never restarted mid-session: on Android 17 that left a blank window that took no taps.
If the app cannot be opened, the terminal says why and the first test carries the reason (category Infrastructure).

**Every code is explained in one line.** HTTP status codes (e.g. `403 Forbidden: the server understood the request but refuses
it…`), MediaWiki API error codes (e.g. `ratelimited`), exit codes, Android signals (`SIG: 9`), install errors (`INSTALL_FAILED_…`),
Android log levels (E/W/F) and severities (P0–P3) all come with their meaning: on hover over a status chip, in each call's details,
in a **Codes in this run** table on the API tab, under errors and warnings in the test drawer, in `api-log.txt` and in the terminal
summary. The list lives in `test/support/report/codes.js`; add a code there and every place picks it up.

**Emulator problems are not app problems.** After every test the recorder also checks the Android log for signs that the emulator
itself is stuck (taps that reach no window: "No new touched window"; screen animations that never finish) and for crashes of
other processes (for example WebView's sandboxed helper). These show as **device** warnings, and a failure with a stuck screen is
filed as **Environment** with the advice to cold boot the emulator. Only a crash of the app's own process counts as an app crash. The recorder reads those lines after every test and saves each call; full responses go to
`reports/runs/<runId>/network/`. Cookies and other secret headers are never stored. API problems that are understood (for example the dev build's
analytics settings request, refused with 403 by Wikimedia's test servers) are listed under `knownApi` in `test/triage.json` and shown grey.

Colour is only used for meaning and always comes with a word or icon: red = blockers and new failures, amber = flaky and warnings, grey = known issues.

**Severity, modules, owners, known issues: `test/triage.json`** (shared through git). Severity comes from there or from a `[P0]`/`[P1]` tag in
the test title (default P2); a crash is always P0. Assign / ticket / known changes made on the dashboard are saved in your browser first;
the yellow bar then offers **Download triage.json**. Replace `test/triage.json` with it and commit, and everyone sees them.

### Failure analysis (phase 2)

| What | How the dashboard decides it |
|---|---|
| **REGRESSION** (↯) | The test passed on an older app build and started failing on a newer one **with the same test code**. Shown first, counted in the verdict (P0/P1 regressions block), category Product bug. |
| **Test code changed** | The test code (this project's commit, or uncommitted edits) changed between the last pass and the first failure: category Test bug, with both commits. |
| **FLAKY** (≈) | The **same app build and the same test code** gave both a pass and a fail in the last 10 runs. A fix (pass → fail → pass with a change in between) is no longer called flaky. For older runs without the test commit: 3+ flips on one build. |
| **Category** | Product bug · Test bug · Environment · Infrastructure · Needs review, each with the reason (the matched error, the crash line, the network error, the session log). Filter with **Category**; change one by hand in the panel; add your own rules in `categoryRules`. |
| **Quarantine** (‖) | **Quarantine…** in a test's panel (reason, days). Until that date its failures don't count towards the verdict; afterwards they count again and the verdict says "quarantine expired". Saved in `quarantine` in `test/triage.json` (via Download triage.json). |
| **Compare** tab | Any two runs (A → B): numbers side by side, what changed around the tests (app build and commit with a GitHub compare link, test code, device, tools), newly failing / fixed / still failing / added / removed tests, much slower or faster tests, and API calls per API with status and timing changes. "compare" links in the runs table and in a failure's panel. |
| **Session could not start** | The reason now comes from WebdriverIO's and Appium's own logs (`reports/logs/`, kept per run in `runs/<id>/logs/`): e.g. no emulator connected, Appium not reachable, install refused, driver missing. |

Retries stay off: the tour suite is a chain, so re-running one test on its own would fail for the wrong reason.

### API calls: from request to outcome

Every call the app makes is recorded with its whole life: **request started → request sent → response headers (time) → body complete
(size, total time)**, or **no response, with the reason**: the network error explained (no internet/DNS, timeout, connection refused,
TLS, cancelled by the app…), the app crashed (time, process), its process died or was stopped, the test closed the app on purpose
(which step), the same app thread moved on without logging an answer, or the session
ended first. Each call also says what the response holds (JSON fields and sizes, HTML page title, binary type) and why there is no
body when there isn't one. The **API calls** tab shows Problems, By API, Every call (filter **No response**), and the **API log**: the
whole run in order, also saved as `reports/runs/<id>/api-log.txt`. A test or run with no calls says exactly why.

**Settings** (`.env`): `DASHBOARD_SCREENSHOTS` (all|failed), `DASHBOARD_VIDEO` (failed|all|off; screen recording, kept for failures by default),
`DASHBOARD_PERF` (on|off; memory, frames, launch time), `DASHBOARD_API_BODIES` (on|off; full API responses), `DASHBOARD_SLOW_API_MS` (2000),
`DASHBOARD_LARGE_API_KB` (500), `DASHBOARD_SLOW_MS`, `DASHBOARD_KEEP_RUNS`. Frame stats and full API responses use `adb shell`, so the config starts
Appium with `--allow-insecure uiautomator2:adb_shell`; that is fine on your own emulator, and off when both `DASHBOARD_PERF` and `DASHBOARD_API_BODIES` are `off`.

Warnings are raised for: an app crash or error lines in the app's Android log, slow tests (over their limit in `test/budgets.json`, or `DASHBOARD_SLOW_MS`), tests that only
passed on retry, and screenshot problems. At the end of each run the terminal prints a summary, failures in red, warnings in yellow.

**Suite filter.** Pick smoke or tour so trends and totals compare like with like. The "vs last" numbers always compare
with the previous run **of the same suite**, even when the filter shows all suites.

**Run details** (the link under the verdict, or `#/triage?open=run:<runId>`): what started the run (manual on your PC,
GitHub Actions push / pull request / schedule, Bitbucket), who, the CI job link, the branch and commit of this test project
(and whether it had uncommitted changes), the machine and its time zone, the emulator's Android build and WebView,
and the versions of Node, WebdriverIO, Appium and the UiAutomator2 driver. Times are stored in UTC and shown in your time.
The local user name and computer name are recorded; nothing leaves your PC unless you publish the reports.

**Links you can share:** every view is in the address, including one API call (`Copy link to this call`).
In a test's panel, **Filter these log lines** searches its app-log errors and warnings; "full log" opens the whole log.

**Files and format.** `reports/runs/<runId>/` (run.json, tests/*.json, screenshots/, videos/, logcat/, network/) and
`reports/data/` (what the page reads). Every file carries `schemaVersion`; the format is documented in
[docs/RESULTS-FORMAT.md](docs/RESULTS-FORMAT.md), and runs recorded in an older format still open (they are upgraded when read).
The page is `test/support/report/template/index.html` (copied into `reports/` on every rebuild). Runs beyond `DASHBOARD_KEEP_RUNS` are deleted.

### Budgets, trends and response formats (phase 3)

The **Performance** tab starts with three sections. Going over a limit is a **warning** (the run shows "passed with warnings"),
never a failed run: timings on an emulator vary too much to fail on them.

- **Budgets and trends.** Limits are in `test/budgets.json` (shared through git, explained in its `_help`):
  - per API: p95 response time (95 in 100 calls answer faster), the slowest single call, the largest response;
  - the app: cold launch time (Android's "Displayed" line), peak memory, janky frames (off by default: emulator frame timing says little);
  - each test's duration.

  Each value is also compared with the **median of earlier passing runs of the same suite on the same device and Android
  version**. It counts as "slower than usual" when it is more than 50% slower *and* more than a minimum difference (300 ms for APIs
  and launch, 5 s for tests, 30 MB for memory), with at least 3 earlier runs. "Needs a look" lists only what is over budget or
  slower than usual; "All" lists everything. Each row says in one line what was measured, against what, and on how many calls, with a
  small chart of the last runs (the dashed line is the budget). APIs under `knownApi` in `test/triage.json` are shown, never warned.
- **API response times.** p50 / p95 / max per API, and the API tab's "By API" table shows p50 and p95 too.
- **Response formats.** `test/api-formats.json` lists, per API, the fields the app relies on and their types (e.g. the featured feed's
  `mostread.articles[].title` is text). Every response is checked against it, using the whole body file. A problem shows on the call
  as a failure with the exact path, what was expected and what came, and counts as a run warning. Calls that cannot be checked say why:
  no full body (status-line logging), a different status, or **text lost in the Android log**. Android keeps at most 4,059 bytes
  of one log line, the app logs bodies in 4,000-character pieces, and characters such as "–" or "é" take 2-3 bytes, so some pieces
  of large bodies lose their last characters. The recorder now counts those cut pieces.

Launch times were not recorded on Android 15 and newer, whose "Displayed" line ends in "for user 0: +6s311ms". That is fixed, and
older runs are re-read from their saved Android log.

### Testing the dashboard itself

The dashboard has its own tests, separate from the app tests. They need no emulator.

```bash
npm run test:dashboard:unit   # node:test: API log parser, error signatures, result format, run details, builder, retention (~2 s)
npm run test:dashboard:page   # Playwright: every tab, filters, drawer, keyboard, phone width, dark mode, no browser errors (~1 min)
npm run test:dashboard        # both
npm run dashboard:demo        # demo runs (no device) in reports-demo/: open reports-demo/index.html
```

The page tests build demo runs with the real recorder and a pretend device (`test/dashboard/fixtures.mjs`): new, recurring, flaky and
grouped failures, a crash, a slow test, smoke and tour runs, two devices, a GitHub Actions run, a run that could not start and a run
in the old format. Screenshots of every view (desktop, dark, phone) go to `.dashboard-test/screenshots/`, the HTML report to
`.dashboard-test/report/`. Run the dashboard tests after changing anything in `test/support/report/`.

## Project structure

| Path | What |
|---|---|
| `scripts/build-apk.sh` | **Step 1**: source → named APK + receipt |
| `scripts/run-bash.mjs` | Lets `npm run build:apk` use Git Bash on Windows (not WSL) and passes `.env` settings |
| `scripts/doctor.mjs` | Pre-flight checks for both steps |
| `wdio.conf.js` | **Step 2**: device, APK, timeouts, reporters |
| `test/support/apk.js` | Finds the newest APK in `out/` and verifies its SHA-256 |
| `test/support/app.js` | App-level helpers (in foreground? back to main screen) |
| `test/support/report/` | Results recorder (steps, screenshots, video, app log, API calls, performance, warnings), API log parser (`network.js`), dashboard builder and page template |
| `test/triage.json` | Severity and module per test, module owners, known issues and tickets (used by the dashboard) |
| `test/budgets.json` | Performance and API budgets, and trend settings (phase 3) |
| `test/api-formats.json` | Response format rules: the fields the app relies on, per API (phase 3) |
| `test/dashboard/` | The dashboard's own tests: `unit/` (node:test), `page/` (Playwright), `fixtures.mjs` (demo runs) |
| `docs/RESULTS-FORMAT.md` | The result files, field by field, and how the format is versioned |
| `test/pageobjects/` | One file per screen; only these know the selectors |
| `test/specs/smoke/smoke.e2e.js` | The smoke suite |
| `test/data/searchTerms.js` | Test data (overridable in `.env`) |
| `.github/workflows/smoke.yml` | GitHub Actions: compile + smoke on every push / PR (free, has KVM) |
| `.github/workflows/capture-locators.yml` | GitHub Actions: compile + crawl the real app screens, upload `locators/` |
| `scripts/locator-capture/` | Locator capture tool (from the eGenome.ai project); `config.mjs` set for Wikipedia |
| `locators/` | Captured screens: JSON locators, screenshots, generated page classes |
| `app-src/`, `out/`, `reports/`, `reports-demo/`, `.dashboard-test/` | Generated, git-ignored |

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

Then: rename screens to clear names (`node scripts/locator-capture/capture.mjs rename MainScreen3 SearchScreen`) and regenerate the classes (`npm run locators:pages`). Hand-written page objects in `test/pageobjects/` extend the generated classes, and suites in `test/specs/` are organised per screen.

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
