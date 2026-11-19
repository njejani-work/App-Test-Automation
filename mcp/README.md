# App tests – MCP server

Lets an AI assistant (Claude / Cowork, Claude Code, VS Code) read an app's test results through the
**Model Context Protocol**: the same data as the dashboard, in answers to questions like *"what failed in today's smoke
run, and is it a regression?"*. It can also **run** the unit tests, and start a device suite **after you confirm** (see
below). It never returns `.env` values, passwords or OTP codes.

**One server per app.** The same code serves eGenome.ai, Instagram and Wikipedia: `MCP_APP` (`egenome` by default,
`instagram`, `wikipedia`) picks the app folder `apps/<id>/`, its `reports/`, `.env` and settings. What the server needs
to know about an app is in its **`apps/<id>/mcp.json`**: name, package, the `.env` key of the device id, the suites the
assistant may start (with minutes and what they cover) and what a run does to the device (shown before a run starts).
A new app gets a server by adding its `mcp.json`. Why not one server for all: the shared dashboard code reads one app's
folder per process.

## What it offers

| Tool | Answers |
|---|---|
| `get_latest_run` | **Start here.** Verdict (PASS / UNSTABLE / BLOCKED) with the reason, counts, app build, device, newly failing / fixed since the previous run of the same suite |
| `list_failures` | One line per failure: id, priority, NEW / RECURRING / FLAKY / REGRESSION, category, error, failed step, same-cause tests (20 at a time: `limit`, `offset`) |
| `get_failure_details` | One test in full: error and where, steps with layout results, app-log errors (`logLines`), API calls per step, history, screenshot / video / log paths (stack trace with `fullStack: true`) |
| `compare_runs` | Two runs side by side (default: latest vs the previous run of the same suite): counts, newly failing / fixed, tests added / removed, app or test code changed |
| `list_runs` | Recorded runs, newest first (paged) |
| `get_unit_test_results` | A unit test run: failures with expected vs actual and where, coverage |
| `explain_codes` | What a code means: HTTP, exit codes, signals, severities |
| `device_status` | Phones / emulators adb sees, app version and APK fingerprint (read-only adb) |
| `list_layout_specs` | Screens with a layout spec: elements and rules checked, screen size recorded on, reviewed or not |

Answers are short Markdown, summary first: headings, small tables, one line per item, `✔ passed` / `✖ failed` (symbol
and word). Long parts are cut, with a note saying how to get more. Renamed in 0.3.0: `get_run_summary` →
`get_latest_run`, `get_test_details` → `get_failure_details`, `get_unit_results` → `get_unit_test_results`.

### Tools that run tests

| Tool | Does |
|---|---|
| `run_unit_tests` | Runs `npm run test:unit` (or with coverage): seconds, no phone, changes nothing on the device. Returns the result. An app without that script (Instagram) gets a clear "no unit tests". |
| `start_test_run` | Starts one of the app's suites from its `mcp.json` (eGenome: smoke / regression / layout; Instagram: smoke / home / profile / menu; Wikipedia: smoke / tour) on the device in `.env` (`DEVICE_UDID`; Instagram: `UDID`) as a background job. **Without `confirm: true` nothing starts**: it answers with what would happen (device, the app's `effects`, e.g. *the app's data is cleared*, expected minutes, a warning on a real phone), for the assistant to show you. Only after you agree does it start. Marked *destructive*, so Claude also asks before calling it. |
| `check_test_run` | While running: tests finished / passed / failed and the test running now (from the recorder's live log). At the end: the verdict and the failures. |
| `stop_test_run` | Stops the run and everything it started (WebdriverIO, Appium); its record is closed as interrupted. |

Safety: one device run at a time (also refused while a run started in your terminal is going); adb must see the device
ready; time limits (unit tests 5 min, suites 60 min, then the whole process tree is stopped); every line of output passed
back has the `.env` phone numbers / OTPs / tokens / passwords / account names replaced with `••••••`; only the suites in
the app's `mcp.json` can be started (not eGenome's extended suite).
Apps like Claude Desktop may start the server without your terminal's `ANDROID_HOME` / `JAVA_HOME`, which Appium needs
to start a session. `start_test_run` fills in missing ones from the usual folders (Android SDK in
`%LOCALAPPDATA%\Android\Sdk`, Java in Android Studio's `jbr`), lists which it uses, and refuses with how to fix it if it
finds none. When a run fails, `check_test_run` shows WebdriverIO's / Appium's error lines, not only the summary.
Why jobs: MCP clients stop waiting for one tool call after about a minute, and a suite takes 5-45 minutes.

**Resources** (documents it can read; the scheme is the app id): `<app>://docs/readme`, `<app>://settings/triage`,
`<app>://settings/budgets`, `<app>://layout-specs/<Screen>` (eGenome only has layout specs). **Prompt:** `triage_latest_run` (verdict → failures → cause → next action).

The read tools use `reports/data/` and `reports/unit/` (rebuilt first when a newer run exists; parsed files are cached
until they change).

**Settings** (environment variables, checked at start; see `src/config.mjs`):

| Variable | Default | Meaning |
|---|---|---|
| `MCP_APP` | `egenome` | Which app: a folder `apps/<id>/` with an `mcp.json` |
| `DASHBOARD_DIR` | `reports` | Reports folder; must be inside the app's folder |
| `MCP_UNIT_TIMEOUT_MIN` / `MCP_SUITE_TIMEOUT_MIN` | 5 / 60 | Time limits |
| `MCP_LOG_LEVEL` | `info` | `debug` logs each call with its time and answer size (stderr) |
| `MCP_STRUCTURED_OUTPUT` | `0` | `1` also sends the data as JSON `structuredContent` (for programs; Claude then shows the JSON instead of the text) |

## Setup (once)

In `app-tests/` (the workspace root):

```bash
npm run mcp:install          # = npm --prefix mcp install  (MCP SDK + zod, only in mcp/)
npm run mcp:test             # its tests
npm run mcp:inspect          # try it by hand in MCP Inspector (browser): eGenome; set MCP_APP for another app
```

## Connect an assistant

- **Claude Code:** `.mcp.json` in `app-tests/` is picked up when Claude Code starts there (approve it once): three
  servers, `app-tests-egenome`, `app-tests-instagram`, `app-tests-wikipedia`.
- **VS Code (Copilot agent mode):** `app-tests/.vscode/mcp.json`, the same three; start them from the MCP view.
- **Claude Desktop / Cowork:** **Settings → Developer → Edit Config** opens File Explorer *at* the file
  `claude_desktop_config.json`. Open it with Notepad, put the three servers inside `"mcpServers"` (keep anything else
  already there; remove an old `egenome-tests` entry or extension, which pointed at the old folder), save, then **quit
  Claude fully** (tray icon → Quit) and start it again. Use your full path, with `/` or `\\`:

```json
{
  "mcpServers": {
    "app-tests-egenome": { "command": "node", "args": ["<full path to app-tests>/mcp/server.mjs"], "env": { "MCP_APP": "egenome" } },
    "app-tests-instagram": { "command": "node", "args": ["<full path to app-tests>/mcp/server.mjs"], "env": { "MCP_APP": "instagram" } },
    "app-tests-wikipedia": { "command": "node", "args": ["<full path to app-tests>/mcp/server.mjs"], "env": { "MCP_APP": "wikipedia" } }
  }
}
```

Only the apps you want: each entry is independent. The Claude Desktop extension file (`.mcpb`) of version 0.3 is
retired: it could start only the eGenome server.

Then ask, for example: *"Triage the latest Wikipedia smoke run"*, *"Show SMK-07's failed step and its app log"*, *"Which unit tests
fail and what was expected?"*, *"Is a phone connected, and which app version is on it?"*

## How it works

`server.mjs` only starts the server and talks over **stdio** (stdout carries the MCP messages, so everything else goes to
stderr). The code is in `src/`, in layers: `registry.mjs` (the list of tools and how every answer is wrapped) →
`tools/` (one file per tool) → `services/` (the logic, reusing the dashboard's rules) → `adapters/` (files, `.env`,
processes). **To add a tool, read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)**: folder tree, naming conventions,
the example tool (`list_failures`), a 7-step checklist, trade-offs and the security table.
