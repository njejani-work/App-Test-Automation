# eGenome tests – MCP server

Lets an AI assistant (Claude / Cowork, Claude Code, VS Code) read the eGenome app test results through the
**Model Context Protocol**: the same data as the dashboard, in answers to questions like *"what failed in today's smoke
run, and is it a regression?"*. It can also **run** the unit tests, and start a device suite **after you confirm** (see
below). It never returns `.env` values or OTP codes.

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
| `run_unit_tests` | Runs `npm run test:unit` (or with coverage): seconds, no phone, changes nothing on the device. Returns the result. |
| `start_test_run` | Starts **smoke / regression / layout** on the device in `.env` (`DEVICE_UDID`) as a background job. **Without `confirm: true` nothing starts**: it answers with what would happen (device, *the app's data is cleared*, expected minutes, a warning on a real phone), for the assistant to show you. Only after you agree does it start. Marked *destructive*, so Claude also asks before calling it. |
| `check_test_run` | While running: tests finished / passed / failed and the test running now (from the recorder's live log). At the end: the verdict and the failures. |
| `stop_test_run` | Stops the run and everything it started (WebdriverIO, Appium); its record is closed as interrupted. |

Safety: one device run at a time (also refused while a run started in your terminal is going); adb must see the device
ready; time limits (unit tests 5 min, suites 60 min, then the whole process tree is stopped); every line of output passed
back has the `.env` phone numbers / OTPs / tokens replaced with `••••••`; the extended suite cannot be started from here.
Apps like Claude Desktop may start the server without your terminal's `ANDROID_HOME` / `JAVA_HOME`, which Appium needs
to start a session. `start_test_run` fills in missing ones from the usual folders (Android SDK in
`%LOCALAPPDATA%\Android\Sdk`, Java in Android Studio's `jbr`), lists which it uses, and refuses with how to fix it if it
finds none. When a run fails, `check_test_run` shows WebdriverIO's / Appium's error lines, not only the summary.
Why jobs: MCP clients stop waiting for one tool call after about a minute, and a suite takes 5-45 minutes.

**Resources** (documents it can read): `egenome://docs/readme`, `egenome://settings/triage`, `egenome://settings/budgets`,
`egenome://layout-specs/<Screen>`. **Prompt:** `triage_latest_run` (verdict → failures → cause → next action).

The read tools use `reports/data/` and `reports/unit/` (rebuilt first when a newer run exists; parsed files are cached
until they change).

**Settings** (environment variables, checked at start; see `src/config.mjs`):

| Variable | Default | Meaning |
|---|---|---|
| `DASHBOARD_DIR` | `reports` | Reports folder; must be inside the project |
| `MCP_UNIT_TIMEOUT_MIN` / `MCP_SUITE_TIMEOUT_MIN` | 5 / 60 | Time limits |
| `MCP_LOG_LEVEL` | `info` | `debug` logs each call with its time and answer size (stderr) |
| `MCP_STRUCTURED_OUTPUT` | `0` | `1` also sends the data as JSON `structuredContent` (for programs; Claude then shows the JSON instead of the text) |

## Setup (once)

```bash
npm run mcp:install          # = cd mcp && npm install  (MCP SDK + zod, only in mcp/)
npm run mcp:test             # its tests (also shown in the dashboard's Unit tests tab)
npm run mcp:inspect          # try it by hand in MCP Inspector (browser): Connect -> Tools / Resources / Prompts
```

## Connect an assistant

- **Claude Code:** `.mcp.json` in the project root is picked up when Claude Code starts in this folder (approve it once).
- **VS Code (Copilot agent mode):** `.vscode/mcp.json` is picked up; start it from the MCP view.
- **Claude Desktop / Cowork (recommended: install the extension file):**
  1. Once: `npm run mcp:install` in the project (installs the MCP packages in `mcp/`).
  2. Install **`mcp/egenome-tests.mcpb`** in Claude Desktop, any of these ways (menu names vary between versions):
     double-click the file; or drag it onto **Settings → Extensions**; or use the install / upload button there, which
     opens a file window: pick the file.
  3. When asked for **eGenome.ai project folder**, choose the project folder (the one with `mcp/` and `reports/`).
  4. Make sure the extension is **enabled**. Its tools appear in a new chat (tools / connectors menu).
  The extension is only a 2 KB launcher (`mcp/extension/`): it starts `mcp/server.mjs` from your project, so it always
  runs the project's current code. Rebuild it after changing `mcp/extension/`: `npm run mcp:pack`.
- **Claude Desktop, by config file (alternative):** the **Edit Config** button opens File Explorer *at* the file
  `claude_desktop_config.json` (it is not an upload). Open that file with Notepad, add the block below inside the outer
  `{ }` (keep anything already there), save, then **quit Claude fully** (tray icon → Quit) and start it again:

```json
{
  "mcpServers": {
    "egenome-tests": { "command": "node", "args": ["<full path to the project>/mcp/server.mjs"] }
  }
}
```

Then ask, for example: *"Triage the latest smoke run"*, *"Show SMK-07's failed step and its app log"*, *"Which unit tests
fail and what was expected?"*, *"Is a phone connected, and which app version is on it?"*

## How it works

`server.mjs` only starts the server and talks over **stdio** (stdout carries the MCP messages, so everything else goes to
stderr). The code is in `src/`, in layers: `registry.mjs` (the list of tools and how every answer is wrapped) →
`tools/` (one file per tool) → `services/` (the logic, reusing the dashboard's rules) → `adapters/` (files, `.env`,
processes). **To add a tool, read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)**: folder tree, naming conventions,
the example tool (`list_failures`), a 7-step checklist, trade-offs and the security table.
