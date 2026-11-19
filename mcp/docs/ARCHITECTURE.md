# App tests MCP server: layout and conventions

Goal: **fast and small** (quick start, little memory, short answers, few tokens) and **easy to read** (a new developer
finds, understands and adds a tool in under 10 minutes).

## Assumptions

- JavaScript (ES modules, JSDoc types), Node 22+ (the team PC has 24). No build step.
- UI test results: the dashboard's data (`reports/data/index.js`, `reports/data/runs/<id>.js`) built from
  `reports/runs/<id>/` (steps, screenshots, videos, logcat). Unit tests: `node:test`, results in `reports/unit/<id>.json`.
- Logic reused from the dashboard, never copied: `@apptest/toolkit/dashboard/builder.js`, `lib/codes.js`, `lib/device.js`.
- One server process per app (`MCP_APP`; the toolkit's dashboard code reads one app folder per process). What differs
  between apps is data in `apps/<id>/mcp.json` (name, package, device key, suites, effects of a run), read by
  `src/config.mjs` into `config.app`. A tool whose description or input depends on the app gives a function
  `(config) => ...` instead of a value (`start_test_run`, `device_status`).
- Clients: Claude Desktop / Cowork (stdio, `claude_desktop_config.json`), Claude Code (`app-tests/.mcp.json`), VS Code
  (`app-tests/.vscode/mcp.json`): three entries, one per app.

## 1. Folder tree

```text
mcp/
├─ server.mjs                 entry point: stdout guard, create the server, connect stdio. No tool logic.
├─ package.json               own dependencies (MCP SDK, zod) and scripts: start, inspect, test
├─ README.md                  how to install, connect and use it
├─ docs/ARCHITECTURE.md       this file
├─ src/
│  ├─ stdout-guard.mjs        routes console.log to stderr (stdout = MCP messages only)
│  ├─ logger.mjs              the one logger: stderr, levels error/warn/info/debug
│  ├─ config.mjs              env vars + defaults, validated once; folder allowlist; the only runnable commands
│  ├─ create-server.mjs       builds ctx (config, log, mask, reports, jobs) and registers everything
│  ├─ registry.mjs            THE list of tools + the one wrapper that turns run() into an MCP answer
│  ├─ resources.mjs           README, triage.json, budgets.json, layout specs (fixed files only)
│  ├─ prompts.mjs             triage_latest_run
│  ├─ shared/
│  │  ├─ types.mjs            JSDoc types (ToolDef, ToolAnswer, Ctx), ToolError, READ_ONLY / ACTION annotations
│  │  ├─ schemas.mjs          shared zod inputs: runId, suite, limit, offset, testId, jobId
│  │  └─ progress.mjs         MCP progress notifications (only when the client asks)
│  ├─ tools/                  one file per tool; file name = tool name in kebab-case
│  │  ├─ get-latest-run.mjs        verdict + why + what changed (start here)
│  │  ├─ list-failures.mjs         failures, one line each, paged          ← the example to copy
│  │  ├─ get-failure-details.mjs   one test in full, long parts cut
│  │  ├─ compare-runs.mjs          two runs side by side
│  │  ├─ list-runs.mjs             recorded runs, paged
│  │  ├─ get-unit-test-results.mjs unit run: failures with expected vs actual, coverage
│  │  ├─ explain-codes.mjs         HTTP / exit / Android codes
│  │  ├─ device-status.mjs         phones adb sees, app version (read-only)
│  │  ├─ run-unit-tests.mjs        ACTION: npm run test:unit
│  │  ├─ start-test-run.mjs        ACTION (destructive): device suite, after confirmation
│  │  ├─ check-test-run.mjs        progress / result of a started run
│  │  └─ stop-test-run.mjs         ACTION: stop a started run
│  ├─ services/               the logic, plain data in and out (no MCP, no Markdown)
│  │  ├─ runs.mjs             pick a run, verdict, summary, compare
│  │  ├─ history.mjs          NEW / RECURRING / FLAKY / REGRESSION
│  │  ├─ failures.mjs         failure list, find a test, one test in full (with cut limits)
│  │  ├─ unit.mjs             unit runs
│  │  ├─ devices.mjs          adb device list
│  │  └─ jobs.mjs             runs started by this server: one device run at a time, close interrupted runs
│  ├─ adapters/               the only code touching files and processes
│  │  ├─ reports.mjs          reads reports/ with a cache (path + mtime + size), rebuilds when newer runs exist
│  │  ├─ run-log.mjs          .current-run, meta.json, the live run.log
│  │  ├─ env-file.mjs         .env: device id, values to mask (never returned)
│  │  ├─ processes.mjs        start a job, time limit, kill the whole process tree, keep error lines
│  │  ├─ tool-env.mjs         ANDROID_HOME / JAVA_HOME for device suites (filled in when the client did not pass them)
│  │  └─ project.mjs          lazy imports of the dashboard modules
│  └─ format/                 Markdown for answers
│     ├─ md.mjs               table, list, block, mark (symbol + word), dates, page note
│     ├─ run.mjs              run summary + one-line failure (shared by 3 tools)
│     └─ unit.mjs             unit run (shared by 2 tools)
├─ test/                      mirrors src/; run with `npm test`
│  ├─ tools/list-failures.test.mjs   unit test of one tool with a fixture (the example)
│  ├─ registry.test.mjs       conventions (names, descriptions, limit/offset, ≤150 lines) + error handling
│  ├─ config.test.mjs         settings validation, the folder allowlist, MCP_APP and each app's mcp.json
│  ├─ server.test.mjs         integration: a real MCP client, in memory and over stdio, on demo runs; MCP_APP=wikipedia
│  ├─ run-tools.test.mjs      the action tools with a pretend suite and a pretend adb
│  ├─ fixtures/runs-small.json  tiny recorded history (two smoke runs)
│  └─ helpers/                fake-ctx.mjs (ctx from a fixture), fake-suite.mjs (plays a device run)
```

Dependencies flow one way: `server.mjs → create-server → registry → tools → services → adapters`.
`format/` is used by tools only; services never format, adapters never decide.

## 2. Naming conventions

| What | Rule | Example |
|---|---|---|
| Tool name | `snake_case`, verb_noun; `list_*` for lists, `get_*` for one thing, a verb for actions | `list_failures`, `get_failure_details`, `start_test_run` |
| Tool file | tool name in kebab-case, in `src/tools/` | `list-failures.mjs` |
| Inputs | camelCase; reuse `shared/schemas.mjs` (`runId`, `suite`, `limit`, `offset`, `testId`, `jobId`) | `{ runId, limit: 20, offset: 0 }` |
| Lists | always `limit` (default 20) and `offset`; data says `total` and `offset` | `list_failures` |
| Output `text` | Markdown, summary first: `## <what>: <verdict>`, then one line per item | `## 2 failed test(s) in smoke run …` |
| Output `data` | an object (never a bare array), the same facts as the text, camelCase; sent as `structuredContent` only when switched on | `{ run, total, failures: [...] }` |
| Status words | symbol AND word, never colour or symbol alone | `✖ failed`, `■ BLOCKED` |
| Services | `xxxOf(...)` computes, `pickXxx(...)` selects or throws `ToolError` | `summaryOf`, `pickRun` |
| Adapters | `createXxx()` for stateful ones, plain functions otherwise | `createReportStore` |
| Errors | `fail('what is wrong. What exists / what to do.')` | `Run "x" not found. Kept runs: …` |

## 3. The example tool

- Tool: [`src/tools/list-failures.mjs`](../src/tools/list-failures.mjs). It shows the schema (shared zod fields), the
  description written for the AI, the service calls (`pickRun`, `failuresOf`), the output (one-line Markdown + `data`),
  paging, and the error handling (`pickRun` throws a `ToolError`; the registry turns it into a clear message).
- Its unit test: [`test/tools/list-failures.test.mjs`](../test/tools/list-failures.test.mjs), with the fixture
  `test/fixtures/runs-small.json`. No server, no files, no device: it calls `tool.run(input, fakeCtx(...))`.

Output for the fixture:

```markdown
## 2 failed test(s) in smoke run 20261116-110316

- ✖ **SMK-02** [P0] · REGRESSION · product bug · `LoginPage did not open within 20000ms` · at "LoginPage.open" · same cause as SMK-03
- ✖ **SMK-03** [P1] · FLAKY · product bug · `LoginPage did not open within 20000ms` · at "LoginPage.open" · same cause as SMK-02
```

## 4. Registry and entry point

- [`src/registry.mjs`](../src/registry.mjs): `TOOLS` (the one list) and `answer(tool, ctx)`, which wraps every call:
  - runs the tool;
  - masks secrets in the text and in the data;
  - sends `content` (Markdown), plus `structuredContent` (data) when `MCP_STRUCTURED_OUTPUT=1`;
  - turns a `ToolError` into its message, and any other error into a one-line message (the full stack goes to stderr only).
- [`server.mjs`](../server.mjs): about 30 lines; it imports the stdout guard first, creates the server and connects stdio.

## 5. How to add a tool (about 10 minutes)

1. **Copy** `src/tools/list-failures.mjs` to `src/tools/<verb-noun>.mjs` and rename `name` (snake_case) and `title`.
2. **Describe it for the AI** in 1–3 sentences: when to use it, what it returns, what to call next.
3. **Inputs**: reuse `shared/schemas.mjs`; anything new is a zod field with `.describe()`, bounded (`max`, `regex`, `enum`). Never a free path or a command.
4. **Logic in a service** (`src/services/`, plain data in and out; throw `fail('…')` for expected problems). File access only through `ctx.reports` or an adapter.
5. **Answer** `{ text, data }`: Markdown summary first (helpers in `format/md.mjs`), `data` an object; add `limit` / `offset` to lists and cut long text with a note.
6. **Register** it in `TOOLS` in `src/registry.mjs`; mark `READ_ONLY`, or `ACTION` (+ `destructiveHint: true` if it changes data, + a `confirm` input).
7. **Test**: `test/tools/<verb-noun>.test.mjs` with a fixture and `fakeCtx`; run `npm test` (the registry test checks the naming, the description and the 150-line limit). Then add it to the README.

## 6. Trade-offs

| Chose | Why | Rejected |
|---|---|---|
| Plain JavaScript + JSDoc types | No build step: the client runs the project's files directly; editors still autocomplete | TypeScript (needs a compile step and a dist folder) |
| Markdown `text`; `structuredContent` only with `MCP_STRUCTURED_OUTPUT=1` | Claude's apps show `structuredContent` (raw JSON) instead of the text when both are sent, so the readable text is the default; programs and tests switch the data on | JSON-only text (hard to read, more tokens); an `outputSchema` per tool (adds a lot of schema code; the SDK only validates when one is given) |
| Reuse the dashboard's data and modules | One source of truth: the AI and the dashboard always agree | Parsing raw run folders again in the server (duplicate logic, drifts) |
| Cache by mtime + size, at most 25 files | Repeated questions cost a stat(); memory stays bounded | No cache (re-parses MB-sized run files each call); a watcher (more moving parts, Windows quirks) |
| Lazy imports of dashboard modules | Fast start: `adb` / builder code only loads when a tool needs it | Importing everything at start-up |
| Plain objects + one registry list | Easy to read and grep; no magic | Auto-discovery of tool files, decorators, classes |
| Background jobs + `check_test_run` | Clients stop waiting on a call after about a minute; suites take 5–45 min | One long blocking call |
| `ToolError` for expected problems | Clear, actionable text for the AI; real bugs are logged with their stack | Returning error objects from every function |

## 7. Security

| Tool | Can read | Can change | Safeguards |
|---|---|---|---|
| get_latest_run, list_runs, list_failures, compare_runs | `reports/data` (dashboard data) | rebuilds `reports/data` when newer runs exist (same as `npm run dashboard:build`) | read-only; run ids must match `YYYYMMDD-HHMMSS`; reports folder must be inside the project |
| get_failure_details | the same, plus file **paths** of screenshots, videos and logs | nothing | returns paths, never file contents; long text cut |
| get_unit_test_results | `reports/unit/*.json` | nothing | read-only |
| explain_codes | the dashboard's code tables | nothing | input limited to 2,000 characters |
| device_status | `adb devices`, package version, build fingerprint | nothing | read-only adb commands from the dashboard module; udid must match `[\w.:-]` |
| run_unit_tests | the unit test output | writes `reports/unit/` | only `npm run test:unit[:coverage]`; 5-min limit; one at a time; secrets masked |
| start_test_run | adb device state | **clears the app's data**, runs the suite on the device, writes `reports/runs/` | `confirm` required (first call only describes); suite is an enum; device from `.env`; real-phone warning; one device run at a time (also blocks if a terminal run is going); 60-min limit; process tree killed on stop / timeout / disconnect; secrets masked |
| check_test_run | the live run log, the job's last 15 output lines | nothing | output masked |
| stop_test_run | — | stops the job's process tree; closes the run record | only jobs this server started |
| resources | README, `test/triage.json`, `test/budgets.json`, `test/layout/specs/*.json` | nothing | fixed files; a spec name must be one of the listed specs |

Across all tools:

- `.env` values are never returned: they are masked in the text and the data of every answer.
- No tool takes a shell command or a free-form path.
- stdio only: nothing is opened to the network.

## 8. appium-mcp (optional, not reimplemented)

- **What it is:** [appium-mcp](https://github.com/appium/appium-mcp) is the Appium project's MCP server. It lets the
  assistant drive the emulator: find elements, tap, type and take screenshots.
- **How to run it:** as a **separate** server next to this one (its own entry in `.mcp.json` / the Desktop config). It
  must use a different Appium port from the test suite, and must not run at the same time as a device suite on the same
  device. `start_test_run` already refuses to start while another run is going, but it cannot see appium-mcp's session.
- **Use it for:** exploring a screen, checking a selector, or drafting a page object.
- **Use this server for:** results and test runs.
- **Before adding it:** it is a new dependency, so it is added only after approval.
