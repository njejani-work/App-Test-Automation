# eGenome.ai – Android App Test Automation

End-to-end tests for the eGenome Android app (`com.egenome.app`, React Native). Tests drive the real app on an emulator or a phone, check every screen's behaviour and layout, and record each step with a screenshot in an offline HTML dashboard.

**Stack:** Node.js · WebdriverIO 10 · Appium 3 · UiAutomator2 · Mocha · page object pattern.

| What | Where |
|---|---|
| 84 automated tests (smoke 8, regression 60, layout 16) + 25 pending | `test/specs/` |
| Page objects for 26 screens | `test/pageobjects/` |
| Layout specs for 16 screens | `test/layout/specs/` |
| Results dashboard | `reports/index.html` |
| Hand-over package for testers | `deliverables/` |

---

## Contents

1. [How it works](#how-it-works)
2. [Prerequisites](#prerequisites)
3. [Setup](#setup)
4. [Running tests](#running-tests)
5. [Running on a real phone](#running-on-a-real-phone)
6. [Test suites](#test-suites)
7. [Configuration (`.env`)](#configuration-env)
8. [Page objects and locators](#page-objects-and-locators)
9. [Writing a new test](#writing-a-new-test)
10. [Unit tests](#unit-tests)
11. [Layout checks](#layout-checks)
12. [Dashboard](#dashboard)
13. [MCP server (AI assistant access)](#mcp-server-ai-assistant-access)
14. [Capturing locators](#capturing-locators)
15. [Deliverables for testers](#deliverables-for-testers)
16. [Project structure](#project-structure)
17. [Troubleshooting](#troubleshooting)
18. [Known gaps](#known-gaps)

---

## How it works

```
npm run test:smoke
   └─ WebdriverIO + Mocha (wdio.conf.js)       picks the suite, device, timeouts, hooks
        └─ spec file (test/specs/…)             test steps written as page-object calls
             └─ page objects (test/pageobjects) know how to find and use each screen
                  └─ Appium server (port 4723)  turns WebDriver HTTP calls into device commands
                       └─ UiAutomator2 helper   on the phone: taps, types, reads the element tree
                            └─ eGenome app

Every page-object call is recorded as a step (+ screenshot) → reports/runs/<id>/ → reports/index.html
verifyLayout() compares the screen's element tree with test/layout/specs/<Screen>.json
```

Tests never use raw selectors: they call page objects, and only page objects know the selectors. When the app changes, you update one page object, not every test.

## Prerequisites

| Tool | Notes |
|---|---|
| Node.js 20+ | `node -v` |
| Android Studio | Android SDK + an emulator (AVD) |
| Java JDK 17+ | Needed by Appium / adb |
| `ANDROID_HOME` | Points to the Android SDK; `platform-tools` (adb) on `PATH` |
| eGenome app | Staging build installed on the emulator or phone |
| Test account | A test number with a **fixed OTP** on staging |

```bash
adb devices          # should list e.g. "emulator-5554   device"
```

## Setup

```bash
npm install                 # WebdriverIO, Appium, dotenv, xmldom/xpath …
npm run appium:setup        # installs the UiAutomator2 driver (first time only)
cp .env.example .env        # then fill in .env (see Configuration)
```

At minimum set `TEST_PHONE`, `TEST_OTP` and `TEST_USER_NAME`. If your device isn't `emulator-5554`, set `DEVICE_UDID`.

## Running tests

Start the emulator (or connect the phone) first. WebdriverIO starts Appium itself, so **don't run `npm run appium` at the same time** – both use port 4723.

| Command | What it runs |
|---|---|
| `npm run test:smoke` | **Smoke** – ~5 min, every build: login → Home → Reports → one report → Settings → every screen once → sign out |
| `npm run test:regression` | **Regression** – nightly / before release: every P0/P1 flow |
| `npm run test:layout` | **Layout audit** – visits all 16 screens and checks their layout |
| `npm run test:extended` | **Extended** – pending P2 / destructive tests (reported as skipped with their prerequisite) |
| `npm run test:login` | Only the login and session spec |
| `npm run wdio` | Smoke + regression |
| `npx wdio run ./wdio.conf.js --spec ./test/specs/<path>.js` | Any single spec |
| `npm run test:unit` | **Unit tests** – the project's own code, no device needed, ~5 s (see [Unit tests](#unit-tests)) |
| `npm run test:unit:coverage` | Unit tests + coverage report; fails below 75% line coverage |
| `npm run test:unit:error-demo` | 13 tests that fail **on purpose**, one per kind of error, to see how failures are reported (not part of `test:unit`) |

> ⚠️ Smoke, `regression/01-login` and the layout audit **clear the app's data** before they start, so they always begin logged out. Don't run them on a phone where you use eGenome with your own account.

Results appear in the console, in the dashboard (`npm run dashboard`) and in `allure-results/` (`npx allure generate allure-results --clean && npx allure open`, needs `allure-commandline`).

## Running on a real phone

1. **Phone settings:** Developer options (tap Build number 7×) → turn on **USB debugging**, **Stay awake**, and set the three animation scales to off.
   - Xiaomi / Redmi / POCO: also **Install via USB** and **USB debugging (Security settings)**.
   - OnePlus / Oppo / Realme: also **Disable permission monitoring**.
   - Android 16: turn off **Advanced Protection** on a test phone (it blocks USB installs).
2. **Connect:** plug in, accept "Allow USB debugging?", then `adb devices` shows its serial (e.g. `388a135b`).
   Wireless (Android 11+): Developer options → Wireless debugging → `adb pair <ip:port>` then `adb connect <ip:port>`.
3. **Point the tests at it** in `.env`: `DEVICE_NAME=MyPhone`, `DEVICE_UDID=<serial or ip:port>`.
4. **First run:** keep the phone unlocked and tap **Install** when Appium installs its two helper apps.

Layout positions are only compared on screens with the baseline's shape (720×1280 emulator). On a taller phone, text, alignment and order are still checked.

## Test suites

Every test title starts with an ID and a priority: `LGN-10 [P0] a wrong OTP keeps the user on the OTP screen`. Suites are defined in `wdio.conf.js`.

| Suite | Folder | Tests |
|---|---|---|
| Smoke | `smoke/` | SMK-01…08 – opens every screen at least once with its layout check. Read-only; ends signed out |
| Regression | `regression/01-login` | LGN-01…15 – intro, phone validation, double-tap Send OTP, resend countdown, wrong/correct OTP, restart, sign-out, permissions denied |
| | `regression/02-home` | HOM-01…10 – cards, routine tabs/slots, task counter, mark done, Monthly Progress, profile switching |
| | `regression/03-reports` | RPT-01…09 – report count, pending report locked, sections, diet plan, biomarkers, download |
| | `regression/04-payments` | PAY-01…08 – paywall, plans, Razorpay open/continue/exit (never pays unless Razorpay test mode) |
| | `regression/05-settings` | SET-01…15 – profile edit + validation, addresses, family, histories, subscription |
| | `regression/06-resilience` | RES-01…03 – offline/online, background/resume, mid-edit |
| Layout | `layout/` | LAY-01…16 – one layout check per screen |
| Extended | `extended/` | 25 pending tests, each with `[needs: …]` |

**What regression changes on the account:** sends the OTP up to 4 times, switches to the dependent and back, marks one routine item done, and edits then restores the profile weight and the dependent's last name. Tests whose data is missing (e.g. no pending payment) **skip** rather than fail.

**Gated tests** (off unless enabled in `.env`):

- `TEST_ALLOW_DATA_CHANGES=true` – SET-15 adds a real address (can't be deleted by the tests).
- `RAZORPAY_TEST_MODE=true` – PAY-07/08 payment success/failure; only with Razorpay test keys and once the card form is captured.

## Configuration (`.env`)

All environment-specific values live in `.env` (copy of `.env.example`, never committed). Specs read them through `test/data/users.js`, never `process.env` directly.

| Variable | Purpose |
|---|---|
| `DEVICE_NAME`, `DEVICE_UDID` | Device to use (serial from `adb devices`) |
| `APPIUM_WAIT_FOR_IDLE_MS` | How long UiAutomator2 waits for the UI to settle (default 100; raise if taps happen too early) |
| `TEST_USER_NAME`, `TEST_COUNTRY_CODE`, `TEST_PHONE`, `TEST_OTP` | Main test account (phone without country code, fixed staging OTP) |
| `TEST_USER2_*` | Optional second account |
| `TEST_WRONG_OTP` | For negative tests (default `000000`) |
| `TEST_DEPENDENT_NAME`, `TEST_COMPLETED_REPORT`, `TEST_PENDING_REPORT`, `TEST_BOOKING_SERVICE` | Data the account is expected to have |
| `TEST_ALLOW_DATA_CHANGES`, `TEST_ADDRESS_SEARCH`, `RAZORPAY_TEST_MODE` | Gated tests (above) |
| `LAYOUT_CHECKS` | `on` (fail on layout differences) · `warn` (report only) · `off` |
| `TEST_ENV`, `DASHBOARD_SCREENSHOTS`, `DASHBOARD_KEEP_RUNS`, `DASHBOARD_LOGCAT`, `DASHBOARD_VERBOSE`, `DASHBOARD_VIDEO`, `DASHBOARD_PERF`, `DASHBOARD_SLOW_MS` | Dashboard settings (see `.env.example`) |

```js
import { getUser, accountData, flags } from '../data/users.js';
const user = getUser();            // { name, countryCode, phone, otp } – fails fast if missing
```

## Page objects and locators

Import everything from `test/pageobjects/index.js` (these exports are recorded as dashboard steps):

```js
import { LoginPage, HomePage, ReportsPage, SettingsPage } from '../pageobjects/index.js';
```

| Page object | Screen | Examples |
|---|---|---|
| `OnboardingPage` | Intro carousel | `skip()`, `skipIfShown()` |
| `LoginPage` | Mobile number | `requestOtp(phone)`, `login(user)`, `ensureLoggedIn()` |
| `OtpPage` | "OTP, please" | `submitOtp(code)`, `getResendSeconds()`, `resendOtp()` |
| `HomePage` | Home tab | `getVital('BMI')`, `markSlot(slot, action)`, `openProfileSwitcher()` |
| `SwitchProfileSheet` | Profile switcher | `switchTo(name)` |
| `MonthlyProgressPage` | Calendar | `getMonth()`, `goToMonth('August 2026')`, `selectDay(15)` |
| `ReportsPage`, `ReportDetailPage` | Reports | `getReportCount()`, `openReport(title)`, `openSection('Diet Plan')` |
| `PremiumPage`, `RazorpayCheckoutPage` | Plan + checkout | `choosePlan('emi')`, `getTotal()`, `exit()` |
| `SettingsPage` | Settings tab | `openProfile()`, `openSignOutDialog()`, `logout()` |
| `ProfilePage`, `EditProfilePage` | Profile | `edit()`, `update({ weight: 60 })` |
| `AddressesPage`, `DependentsPage`, … | Settings sub-screens | `getAddressCount()`, `getMemberCount()` |
| `BottomNav` | Bottom tabs | `openHome()`, `openReports()`, `openSettings()` (recovers if a screen was left open) |
| `SystemDialogs` | Android permission pop-ups | `handleAll({ allow: true })` |

Every page also inherits from `BasePage`: `waitForOpen()`, `isOpen()`, `tap()`, `type()`, `scrollTo()`, `scrollToTop()`, `goBack()`, `hideKeyboard()`, `verifyLayout()`.

**Locator conventions.** The app is React Native, so most elements have no resource-id; their accessibility labels often include icon characters and live data. Use the stable part through the `S` helpers in `BasePage.js`:

```js
S.desc('Send OTP')                          // exact content-desc
S.descContains(', Manage Addresses')        // partial
S.textMatches('[0-9]+ reports? found')      // regex – write [0-9], not \d
S.fieldAfter('FIRST NAME')                  // the input after a caption
```

Order of preference: exact label → partial label → text → caption-relative XPath. Avoid index-based or absolute XPaths. Pattern selectors are sent without backslashes automatically (`\d` → `[0-9]`), because backslashes get doubled on the way to the device.

## Writing a new test

```js
// test/specs/regression/07-example.e2e.js
import { LoginPage, ReportsPage, ReportDetailPage } from '../../pageobjects/index.js';
import { getUser, accountData } from '../../data/users.js';

describe('Example', () => {
  before(async () => {
    await LoginPage.ensureLoggedIn(getUser());
  });

  it('EXM-01 [P1] the completed report opens', async () => {
    await ReportsPage.open();
    await ReportsPage.openReport(accountData.completedReport);
    await ReportDetailPage.waitForOpen();
    await ReportDetailPage.verifyLayout();
    await expect(ReportDetailPage.downloadBtn).toBeExisting();
  });
});
```

- Start from a known state (`ensureLoggedIn()`); don't rely on another spec having run.
- New screen logic goes in a page object, not in the spec.
- Wait for state (`waitForOpen`, `waitUntil`), never `pause` to "be safe".
- Put back anything you change; skip (`this.skip()`) when required data isn't there.
- To record something that isn't a page call as a step: `await step('Clear app data', () => …)`.

## Unit tests

The suites above test **the app** on a device (end-to-end). Unit tests test **this project's own code** – page objects,
the layout checker, the recorder, the scripts – one small piece at a time, with **no phone, emulator, Appium or network**.
108 tests run in about 5 seconds, so run them before every device run and after every change to the test code.

```bash
npm run test:unit            # all unit tests (test/unit + the dashboard's own unit tests)
npm run test:unit:coverage   # the same + which lines the tests ran; fails if line coverage drops below 75%
```

| File (`test/unit/`) | What it checks |
|---|---|
| `layout.test.mjs` | Reading a screen dump; building a spec; comparing a screen with a spec (moved, missing, changed text vs. a line break, other screen shape, 48dp tap targets, top-to-bottom order, the month calendar); the real Addresses spec on the real screen |
| `pageobjects.test.mjs` | Page objects on a **pretend phone**: Google's phone picker (new and old design), the keyboard covering "Send OTP", the tab bar never pressing Back on the login/OTP screen, phone number clean-up, OTP typed one digit per box, permission dialogs allowed/denied |
| `selectors.test.mjs` | `S.*` selector builders; no page-object locator sends a backslash to the device |
| `recorder.test.mjs` | OTP codes masked in steps, actions and saved files; step numbering and errors |
| `test-data.test.mjs` | Clear messages for a missing or badly formatted test account in `.env` (real values are never printed) |
| `locator-parser.test.mjs` | Element names and locators the capture tool suggests, on the real Login screen |
| `api-formats.test.mjs` | API response format checks (`test/api-formats.json` rules) |
| `scripts.test.mjs` | `run-with-env.mjs` passes the setting and the exit code on |
| `unit-report.test.mjs` | The unit-test reporter: every kind of failure in the error demo reaches the dashboard with its reason, expected / actual, location and messages |

- **Pretend phone** (`test/unit/helpers/fake-device.mjs`): stands in for WebdriverIO's `driver` and `$()`. A test says what
  is on screen and what Back or a tap does; the fake records what the page object did and uses a pretend clock, so a
  20-second wait takes milliseconds.
- **Real screens** (`test/unit/fixtures/`): screen dumps from an emulator run, so the layout and locator tests use what the
  app really shows.
- **Rule:** every bug fix in the test code comes with a unit test that fails without the fix. The picker, keyboard and
  tab-bar tests were checked this way against the old code.

**On the dashboard:** every unit run is saved (`reports/unit/<run>.json`, the last 30 kept) and shown in the **Unit tests**
tab of `npm run dashboard`: the verdict and numbers compared with the previous run of the same command; **Failures**
first, each with the kind of error, the message, **expected vs actual** side by side, *where it failed* (opens the line in
VS Code), the stack trace, the **messages the test attached** (API calls and response bodies, what the pretend phone did,
what the layout checker said) and its history; **All tests** by file with filters and search; **Coverage** per file with
the uncovered lines; **History** of the runs with unstable and slowest tests; **Console output**; **Run details** (command,
commit, Node). The results are saved by a node:test reporter (`test/support/dashboard/unit-report.mjs`), so the terminal
output stays the same.

**Seeing the error reporting:** `npm run test:unit:error-demo` runs `test/unit/error-demo/error-demo.mjs`, where every test
fails on purpose in a different way: a wrong value, an object and a list that differ, a pattern that does not match, an
error thrown inside a page object, a test-data error, a page object that cannot close Google's picker, a layout that
moved, an API answer in the wrong format, a setup hook that fails, a timeout, plus one pass and one todo. Nothing in the
project is broken. The next `npm run test:unit` shows a green run again.

How to write one: [`test/unit/README.md`](test/unit/README.md).

## Layout checks

`await HomePage.verifyLayout()` reads the screen's element tree once and compares it with `test/layout/specs/Home.json` – proportionally, not by pixels.

| Element | How it's checked |
|---|---|
| Fixed text and labels | Exact text, state, position and size (as a share of the screen) |
| Live values (prices, dates, counts) | Format only, e.g. `₹[0-9][0-9,.]*`, plus position |
| Account names | `{{TEST_USER_NAME}}`-style tokens, filled from `.env` |
| Bars, rings, images, icons | Present near their place, with the right height |
| Calendar | Every day of the shown month once, under the right weekday, even rows |
| Relations | Order, same row, inside, gaps, alignment, centring, no overlap |
| Tap targets < 48 dp | Warning only |

Positions are compared only when the screen has the baseline's aspect ratio (±3%). Each check saves the screen tree with the run (`reports/runs/<id>/layout/<Screen>.xml`).

| Command | Use |
|---|---|
| `npm run layout:baseline` | Re-record every spec from the live app (after an intended design change) |
| `npm run layout:accept -- latest Home Premium` | Rebuild those specs from what a run saw (`--all` = every screen in the run, `--dry` = preview) |
| `npm run layout:generate` | Create missing specs from the captures in `locators/` |
| `LAYOUT_CHECKS=warn` | Report differences without failing tests |

Specs are `"reviewed": false` until checked against the design. To exclude an element, list it in the spec's `"ignore"` array or edit its `"checks"`.

## Dashboard

Open `reports/index.html` (or `npm run dashboard`). It opens straight from disk (no server, works offline and in CI) and
**reloads itself after every test** while a run is going (Auto in the header). It is the same dashboard as the Wikipedia
app project, with eGenome's step-by-step recording and layout checks inside each test.

| Tab | What it answers |
|---|---|
| **Triage** | Can this build ship? A verdict (PASS / UNSTABLE / BLOCKED) with the reason, 8 numbers (pass rate, failed, regressions, new, flaky, crashes, warnings, API failures), and one row per root cause: the same error in several tests is one row. Each row says if it is **new**, **recurring**, a **regression** (passed on an older app build, fails on a newer one with the same test code), **flaky** (both results on the same build and test code) or **quarantined**, and its category (product bug / test bug / environment / infrastructure / needs review) with the reason. |
| **Coverage** | Tests and results per module of the app (`test/triage.json`), and modules without results |
| **Performance** | App start time, memory, janky frames per run; **budgets and trends** (`test/budgets.json`): over a limit or much slower than usual = a warning, never a failure; p50 / p95 per API; response-format checks |
| **Device matrix** | Pass rate per Android version and device |
| **History** | Every test across the kept runs, with pass rate and flakiness |
| **API calls** | Every call the app made, from request to outcome (see below) |
| **Compare** | Any two runs side by side: app version, device, results, timings |

**A test's details** (click a row): the analysis (category, why, regression / flaky / quarantine), the error with links into
the code (VS Code), **every step** with its duration, actions, the exact page-object call, the **screen after it** and its
**layout-check results** (click a screenshot: ← → through the test, expected (dashed) vs actual (red) element boxes), the
app's Android log (errors and warnings, filterable), a **video** of failed tests, memory and frames, the API calls made
during the test, a diff against the last time it passed, and its history. Every code shown (HTTP status, exit codes,
signals, P0–P3) has a one-line meaning. OTPs are masked; `Authorization` and cookies are never stored.

To keep scrolling short, a test's details open in **tabs** (Summary · Steps · Screen & device · App log · API calls ·
History), and the long pages are split into tabs too (Triage: triage table · overview · all runs; Performance; API calls;
Compare), most urgent first. Each tab label says what it holds in words, ← → move between tabs, and the open tab is part of
the link (`dt=` for the details, `sec=` for a page). On a phone the header scrolls away and the filters fold behind a
**Filters** button.

**What is recorded on the device** (read-only, with `adb` from this computer, so Appium's settings stay as they are): the
app's version and a fingerprint of the installed APK at the start of each run (so the dashboard can tell an app change
from a test change), the app's Android log for every test (errors, crashes, a stuck emulator screen, launch times, API
calls), memory and frame stats, and a screen recording of failed tests. If a session cannot start, `adb devices` is
checked and the reason is shown (no device, wrong `DEVICE_UDID`, …). `adb` must be on `PATH` (or `ANDROID_HOME` set).

**API calls.** They are read from the app's own Android log, where OkHttp's `HttpLoggingInterceptor` writes each call. The
eGenome staging app does not log its network traffic, so the API tab says so (with the exact reason) and stays empty. It
fills in by itself, with request and response bodies, timelines, status codes, format checks (`test/api-formats.json`)
and per-API budgets, as soon as a build logs its calls: the developers add `HttpLoggingInterceptor` (level `BODY`, staging
builds only) to React Native's OkHttp client (`OkHttpClientProvider`) in `MainApplication`.

Each call is placed in the **test step and screen** it happened in: the step's row lists its calls (opened when one
failed), every call says "step 2 · Reports" (or "after step 2" / "before step 1" when it started between steps or while
the app was opening), and the API tab has a **By screen** table. To line up the device's log times with the steps, the
hooks read the device clock once per session (`adb shell date`, read-only). Runs recorded before 13 Nov 2026 have no
clock reading, so their calls say they could not be matched to a step.

| File | |
|---|---|
| `test/triage.json` | Module and owner per test, severity (or `[P0]` in the title), known issues, tickets, quarantine, category rules. The dashboard's Assign / Ticket / Known / Quarantine buttons edit it in your browser; **Download triage.json** gives you the file to commit. |
| `test/budgets.json` | Limits: app start, memory, per-API p95 and size, test duration per test ID; trend settings |
| `test/api-formats.json` | Fields the app relies on, per API (empty until the app logs its calls) |

| Command | |
|---|---|
| `npm run dashboard` | Rebuild everything and open the dashboard |
| `npm run dashboard:build` | Rebuild only (e.g. after an interrupted run) |
| `npm run dashboard:demo` | Demo runs (no device) in `reports-demo/`: open `reports-demo/index.html` |
| `npm run test:dashboard:unit` | The dashboard's own tests (node:test, no device, ~2 s) |
| `npm run test:dashboard:page` | The dashboard in a real browser: every tab, desktop / dark / phone (needs `@playwright/test`, see below) |

A run that stopped (Ctrl+C, closed terminal) shows as **incomplete** after 30 minutes. Runs beyond `DASHBOARD_KEEP_RUNS` are
deleted. Runs recorded before 13 Nov 2026 still open; their parts that did not exist yet (app version, Android log for
passed tests, performance, API calls) say so instead of showing zeros. `reports/runs/<id>/run.json` keeps eGenome's own
format (used by `npm run deliverables` and CI).

## MCP server (AI assistant access)

The **Model Context Protocol** server is shared by all apps: `app-tests/mcp/`, one server per app (`MCP_APP=egenome`
for this one). It lets an AI assistant (Claude / Cowork, Claude Code, VS Code) read the test results – runs and
verdicts, failures with their causes and history, one test in full, the unit tests, code meanings, the connected phone –
and run the unit tests or start a device suite **only after you confirm**. What it knows about eGenome (package, suites,
what a run does to the device) is in [`mcp.json`](mcp.json). Setup and the Claude config:
[`../../mcp/README.md`](../../mcp/README.md). Then ask e.g. *"Triage the latest eGenome smoke run"*.

## Capturing locators

When a screen is new or has changed, capture it again and update its page object.

```bash
npm run appium               # terminal 1 (stop it before running tests)
npm run locators:attach      # terminal 2 – captures from wherever the app is now
```

Navigate the app; each screen is saved to `locators/<Screen>.json` with a screenshot. In the capture terminal press `n` to name the screen, `q` to quit. `npm run locators:crawl` explores by itself. Details: `scripts/locator-capture/README.md`.

## Deliverables for testers

`npm run deliverables` regenerates `deliverables/` from the project (takes ~2 min with many runs):

| Folder | Contents |
|---|---|
| `01-Getting-Started` | Setup guide, README, `.env` template |
| `02-Locators` | Locator catalogue (HTML with screenshots), CSV/JSON, layout specs |
| `03-Page-Objects` | Every page object's actions and elements |
| `04-Test-Cases` | Test-case list with IDs, priorities, prerequisites and latest results |
| `05-Test-Data` | Test users, OTP rules, `.env` variables |
| `06-Execution-Reports` | Dashboard snapshot of the newest runs |
| `07-Known-Issues` | Open issues and recommendations for developers |
| `08-Tools-and-How-To` | Adding a test, fixing a locator, capture guide |

## Project structure

```
.
├── wdio.conf.js                 WebdriverIO config: device, suites, timeouts, dashboard hooks
├── package.json                 dependencies + npm scripts
├── .env.example                 template for .env (the real .env is git-ignored)
├── locators/                    locator captures, one JSON (+ screenshot) per screen
├── test/
│   ├── specs/                   smoke/ regression/ layout/ extended/ (_archive = old specs)
│   ├── pageobjects/             BasePage, index.js, components/, one class per screen
│   ├── data/users.js            test users, account data, flags (from .env)
│   ├── layout/specs/            layout baselines, one JSON per screen
│   └── support/
│       ├── app.js               clear data, restart, background, network on/off
│       ├── layout/              hierarchy.js · spec-builder.js · check.js · index.js
│       └── dashboard/           recorder.js (steps) · hooks.js · device-recorder.js (log, API, perf, video)
│                                egenome-run.js (reads runs) · analysis.mjs (shared with the Wikipedia project)
│                                builder.js · cli.mjs · lib/ (API log, codes, budgets, formats, adb) · template/
│   ├── triage.json · budgets.json · api-formats.json   dashboard settings (shared through git)
│   ├── dashboard/               the dashboard's own tests: unit/ page/ fixtures.mjs (demo runs)
│   └── unit/                    unit tests of the project code: *.test.mjs · helpers/fake-device.mjs · fixtures/ (real screens)
├── mcp.json                     what the shared MCP server (app-tests/mcp) knows about this app
├── scripts/
│   ├── locator-capture/         capture tool
│   ├── layout/                  generate.mjs · accept.mjs
│   ├── deliverables/            build.mjs + docs/ (hand-written guides)
│   └── run-with-env.mjs         sets env vars for an npm script (Windows-friendly)
├── reports/                     runs + dashboard (generated, git-ignored)
└── deliverables/                tester package (generated, git-ignored)
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `ECONNREFUSED 127.0.0.1:4723` | Appium isn't running – use the `npm run test:*` scripts (they start it) |
| `address already in use :4723` | A separate `npm run appium` is still running – stop it |
| `Could not find a connected Android device` | Start the emulator / connect the phone; check `adb devices` and `DEVICE_UDID` |
| Phone: `adbExec … install … timed out` | Unlock the phone and tap Install; enable the OEM settings in [Running on a real phone](#running-on-a-real-phone) |
| `Test user "default" is missing phone and otp` | Fill `TEST_PHONE` / `TEST_OTP` in `.env` |
| `<Page> did not open within …ms` | The screen changed or a pop-up is in the way – re-capture with `npm run locators:attach` |
| Every command on a screen takes 10 s+ | The screen animates constantly; keep `APPIUM_WAIT_FOR_IDLE_MS` low (default 100) |
| `Layout "X": n checks failed` but the screenshot looks right | The baseline is out of date – `npm run layout:accept -- latest X` |
| Login stuck on the OTP screen | Check the dashboard's first failed step; confirm `TEST_OTP` is the fixed OTP for `TEST_PHONE` on that backend |
| Dashboard shows an old run as Running | It was interrupted; run `npm run dashboard:build` (it becomes Aborted after 30 min) |

## Known gaps

- **Razorpay card form** not captured → payment success/failure tests (PAY-07/08) skip.
- **Date-of-birth picker** in Add Dependent not captured → saving a new dependent is still pending (EXT-19).
- **Icon-only buttons** are found by icon character; asking developers for `testID` / `accessibilityLabel` would make them stable.
- **Layout specs** are unreviewed and recorded on a 720×1280 emulator; record a separate baseline per device shape if needed.
- **Tap targets** on the login country picker, phone field and several icon buttons are under 48 dp (reported as warnings).
