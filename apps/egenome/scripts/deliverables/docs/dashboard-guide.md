# How to Read the Dashboard

Every `npm run wdio` creates a **run**. The dashboard (`reports/index.html` in the project; `dashboard/index.html` in this
folder) shows the runs, what failed and why, step by step. It opens directly in a browser, needs no server and works offline.
Every view is in the address bar, so you can bookmark or send a link to exactly what you are looking at.

## Triage (the first screen)

- **Verdict:** PASS, UNSTABLE (failures that don't block: flaky, P2/P3, quarantined) or **BLOCKED** (a P0 failure, a crash,
  or a regression in a P0/P1 test), with the reason in one line.
- **8 numbers:** pass rate, failed, regressions, new failures, flaky, crashes, tests with warnings, API failures, each
  compared with the previous run of the same suite. Click one to list those tests.
- **One row per root cause:** the same error in several tests is one row. Each row has a status:

| Status | Meaning |
|---|---|
| NEW | Passed in the previous run, fails now |
| RECURRING | Was already failing |
| REGRESSION | Passed on an older app build, fails on a newer one with the same test code: the app changed |
| FLAKY | Both passed and failed on the same app build and the same test code |
| CRASH | The app crashed (found in its Android log) |
| QUARANTINED | Known unreliable; doesn't count towards the verdict until the date in `test/triage.json` |
| KNOWN | Marked as a known issue |

Each failure also has a **category** with the reason: product bug, test bug, environment (network, emulator, server),
infrastructure (Appium, WebdriverIO, the computer) or needs review (look at the screenshot to decide).

## A test's details (click a row)

The details open in **tabs**, one section at a time: **Summary** (analysis, triage buttons, error, warnings), **Steps**,
**Screen & device** (or **Screen & video**), **App log**, **API calls** and **History** (diff since the last pass and past
results). Each tab says what it holds in words ("2 failed", "no errors"). ← → move between tabs, and the open tab is part of
the link. Long pages (Triage, Performance, API calls, Compare) are split into tabs the same way, the most urgent first.
On a phone the filters fold behind a **Filters** button.

- **Analysis:** category, regression / flaky / quarantine, and buttons to assign an owner, create a ticket, mark as known or
  quarantine. These are saved in your browser; **Download triage.json** gives the file to share.
- **Error** with the code lines it came from (opens in VS Code) and a one-line meaning of any code in it.
- **Steps:** every page-object call and check, in order:

| Column | Meaning |
|---|---|
| # | Step number |
| Icon | ✔ passed, ✖ failed |
| Step | What was done, e.g. `Login · Request OTP`. The grey line is the exact code call. **Assertion** steps are the checks. Expand *N actions* for the individual taps, typing and scrolls. A **Layout** box lists the layout checks of that screen (failed and warnings first). *N API calls* lists the calls the app made during that step, each from request to response (opened when one failed). |
| Time | How long the step took |
| Screen | Screenshot taken **after** the step. Click it to enlarge; ← → move through the test's screens. On layout steps the boxes show **expected (dashed)** vs **actual (red)** positions. |

- **Screen at the end** and a **video** of failed tests.
- **App log:** the app's own error and warning lines from Android's log during the test (filterable). Lines caused by a known
  issue, or by Android itself, are listed but not counted. A crash of *another* process (e.g. WebView) or a stuck emulator
  screen is shown as a device warning, not as an app problem.
- **API calls** made during the test, **diff since the last pass** (app version, device, steps), and the test's **history**.

OTP codes are masked (`••••••`); login tokens and cookies are never stored.

## Other tabs

- **Coverage:** tests and results per app module; modules without results.
- **Performance:** app start time, memory and janky frames per run. **Budgets and trends**: each value against its limit in
  `test/budgets.json` and against the usual value of earlier passing runs on the same device. Over a limit or much slower than
  usual = a warning, never a failure.
- **Device matrix:** pass rate per Android version and device.
- **History:** every test across the kept runs, with pass rate and flakiness.
- **API calls:** every API call of a run from request to outcome, with the test step and screen it was made on, and a
  **By screen** table (calls, failures, p50/p95 per screen). The eGenome staging app does not write its API calls to
  Android's log yet, so this tab says so; it fills in once a build logs them.
- **Compare:** any two runs side by side.
- **Unit tests:** the results of `npm run test:unit` (the project's own code, no device): verdict and numbers, failures
  first with expected vs actual, where it failed (opens in VS Code), the messages the test attached (API data, what the
  pretend phone did), all tests by file, coverage, history, console output and run details.

## Skipped tests

A test is *skipped* when it is written but not automated yet (`it.skip`, the EXT tests), or when an earlier setup hook failed
(for example the login in `before`), so the test never ran. A failed hook shows as a row named **Setup: … hook**. Fix its
error first. Skipped tests don't count in the pass rate.

## Several apps: the App filter

The same dashboard also shows the **Instagram** tests. Pick the app in the **App** filter (first in the filter bar) to
open its dashboard on the same page (Triage, History...); the logo and name at the top left show which app you are on
(set in `apps.json`: an image `logo`, or a `badge` text and `color`). Each app keeps its own results in its own project
(`<project>/reports/`); the list of apps is `../Test Dashboard/apps.json`, next to the projects, and
`../Test Dashboard/index.html` links to each one. To add an app, add it to `apps.json` and record its tests with this
dashboard's recorder (see the Instagram project's `wdio.conf.js`): `DASHBOARD_PROJECT_ROOT` (its folder) and
`DASHBOARD_APP_PACKAGE` (its Android package) are the only settings it needs.

## Where the files are

```
reports/
  index.html            the dashboard
  data/                 data the dashboard reads (generated)
  runs/<run-id>/
    meta.json           the run: app version, device, where it came from
    workers/<id>.json   every test with its steps (as recorded)
    run.json            full results in one file (for CI or scripts)
    run.log             plain-text log of every step
    screenshots/        one PNG per step
    logcat/             the app's Android log, one file per test
    videos/             screen recordings of failed tests
    network/, api-log.txt   API responses and the API log (when the app logs its calls)
```

Old runs are deleted automatically (the 30 newest are kept; change this with `DASHBOARD_KEEP_RUNS`). If a run was
interrupted, `npm run dashboard:build` repairs the data.
