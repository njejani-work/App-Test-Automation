# @apptest/toolkit

The tools every app's tests share, in one copy. An app folder (`apps/<id>/`) holds only its own config, page
objects, specs, data and settings, and imports these as `@apptest/toolkit/<folder>/<file>`.

| Folder | What | Used by an app as |
|---|---|---|
| `dashboard/` | Step recorder, device recorder (app log, memory, frames, video, API calls), analysis, page builder and template, unit-test reporter | `withDashboard(config)` from `dashboard/hooks.js` in `wdio.conf.js`; `instrument()` / `step()` from `dashboard/recorder.js` in page objects; `--test-reporter=@apptest/toolkit/dashboard/unit-report.mjs` |
| `dashboard/lib/` | Code meanings, adb and device, logcat, network, budgets, response formats, run details, the app list | through the dashboard; also directly (e.g. the MCP server) |
| `layout/` | Layout checker: reads a screen, builds and compares specs | `checkLayout(name)` from `layout/index.js` (via `BasePage.verifyLayout()`) |
| `locators/` | Locator capture: watch / crawl the app, save each screen's elements and locators, generate page classes and the catalogue | `npm run locators:watch` etc. (`node ../../toolkit/locators/capture.mjs`); settings in the app's own `locators.config.mjs` |
| `pageobjects/` | `BasePage` (anchors, waits, tap / type / scroll / swipe, keyboard, back, layout check), `S.*` UiSelector builders, Android permission dialogs and Health Connect (`SystemDialogs`), app reset / restart / background / network (`app.js`, for `DASHBOARD_APP_PACKAGE`) | `import BasePage, { S } from '@apptest/toolkit/pageobjects/BasePage.js'` (eGenome still re-exports them from its own `BasePage.js`, `components/SystemDialogs.js`, `support/app.js`) |
| `scripts/` | `run-with-env.mjs`: `VAR=value command` on every OS | `node ../../toolkit/scripts/run-with-env.mjs LAYOUT_UPDATE=true -- wdio ...` |
| `testing/` | `fake-device.mjs`: a pretend phone for page-object unit tests | `import { fakeDevice } from '@apptest/toolkit/testing/fake-device.mjs'` |

## Which app it works on

Everything reads the app from the folder the command runs in (`apps/<id>` for every npm script), or from
`DASHBOARD_PROJECT_ROOT` when set: its `reports/`, `.env`, `test/triage.json`, `test/budgets.json`,
`test/api-formats.json`, `test/layout/specs/` and `test/pageobjects/catalog.js`. The Android package is
`DASHBOARD_APP_PACKAGE` (default `com.egenome.app` until each app has its `app.config.js`).

## Changing it

A change here reaches every app. Run each app's unit tests (`npm run test:unit -w apps/<id>`) before committing.
If an app needs different behaviour, add a setting with a default that keeps the other apps unchanged; never copy a
file from here into an app.

Moved here from eGenome in steps 2-3 of the migration (18 Nov 2026); the base WebdriverIO config (`createConfig()`) follows
in step 4.
