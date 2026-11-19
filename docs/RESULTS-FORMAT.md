# Test results format (schemaVersion 1)

What the recorder (`test/support/report/recorder.js`) writes for every run, and what the dashboard builder
(`test/support/report/dashboard.mjs`) reads. Other tools can read these files too: they are plain JSON.

The version lives in `test/support/report/schema.js` (`SCHEMA_VERSION`). Rules:

- **Adding** an optional field: no version change. Readers must ignore fields they don't know.
- **Renaming, removing or changing the meaning** of a field: bump `SCHEMA_VERSION`, and teach `upgradeRun()` /
  `upgradeTest()` in `schema.js` to turn the old shape into the new one. Old runs must keep opening.
- Files without `schemaVersion` are version **0** (runs recorded before 13 Nov 2026). They are upgraded when read;
  `recordedWith` on the run says which version the files were written in.

Times are ISO 8601 in **UTC** (`2026-11-12T05:38:31.267Z`). The run id is the **local** start time
(`YYYYMMDD-HHMMSS`); `details.timeZone` and `details.utcOffsetMinutes` say which time zone that was.

## Folder layout

```
reports/
  index.html                  the dashboard (copied from test/support/report/template/index.html)
  data/index.js               window.DASH_INDEX  = every kept run (summary) + every test's history
  data/runs/<runId>.js        window.DASH_RUNS[<runId>] = one run in full
  data/latest.js              window.DASH_LATEST = time stamp the open page checks for auto-refresh
  runs/<runId>/
    run.json                  the run                                   (below)
    device-<cid>.json         the device of one worker                  (below)
    network-<cid>.json        { schemaVersion, level: "BODY" | "BASIC", reason?, open: { ok, how | error }, at }  how API calls were logged (and why not in full), and how the app was opened
    api-log.txt               every API call of the run, from request to outcome (written by the builder)
    logs/                     WebdriverIO's and Appium's own logs for this run (wdio-0-0.log, wdio-appium.log)
    tests/<seq>-w<cid>-<slug>.json   one test                           (below)
    screenshots/<same name>.png      screen at the end of the test
    videos/<same name>.mp4           screen recording (failures by default)
    logcat/<same name>.txt           the Android log during the test
    network/<same name>-<n>.json|.txt  full body of API call n of that test
```

`data/*.js` are JavaScript, not JSON, so the page also works opened straight from disk (`file://`).

## run.json

| Field | Type | Meaning |
|---|---|---|
| `schemaVersion` | number | Format version (1) |
| `runId` | string | `YYYYMMDD-HHMMSS`, local start time; also the folder name |
| `suites` | string[] | Suites asked for (`["tour"]`); empty = all specs |
| `startedAt`, `endedAt` | ISO UTC | `endedAt` missing = still running, or stopped (Ctrl+C) |
| `exitCode` | number | WebdriverIO's exit code (0 = all passed) |
| `setupError` | string | Set when the run could not start (e.g. no APK) |
| `env` | string | `local` or `ci` (or `TEST_ENV`) |
| `apk` | object | The build receipt (`out/*.build-info.txt`): `build_number`, `build_id`, `version_name`, `version_code`, `commit`, `app_repo`, `variant`, `application_id`, `apk_file`, `apk_sha256`, `built_at_utc`, … |
| `details.trigger` | string | `manual (local)`, `GitHub Actions · push`, `Bitbucket Pipelines · pull request`, … |
| `details.startedBy` | string | CI user, or the local user name of the computer |
| `details.ci` | object \| null | `provider`, `url` (link to the job), `job`, `runNumber`, `event`, `actor`, `branch` |
| `details.project` | object | This test project: `branch`, `commit`, `commitMessage`, `dirty` (uncommitted changes), `remote` (tokens removed) |
| `details.host` | object | `name`, `os`, `arch` of the machine that ran the tests |
| `details.timeZone`, `details.utcOffsetMinutes` | string, number | Time zone of that machine |
| `details.tools` | object | Versions of `node`, `webdriverio`, `wdioCli`, `appium`, `uiautomator2Driver` |

## device-&lt;cid&gt;.json

`platformVersion` (Android version), `apiLevel`, `deviceName`, `deviceModel`, `deviceManufacturer`, `udid`, `screen`,
and, when Appium allows adb shell: `emulator` (true/false), `buildFingerprint`, `securityPatch`, `abi`, `webview`.

## tests/*.json (one test)

| Field | Type | Meaning |
|---|---|---|
| `schemaVersion` | number | Format version |
| `seq` | number | Order in the run |
| `id` | string | Test ID from the title (`TOUR-07`), `SESSION` when a worker could not start |
| `title`, `suite`, `file` | string | Mocha title, `describe` name, spec file (relative) |
| `state` | `passed` \| `failed` | Result |
| `durationMs`, `startedAt`, `finishedAt` | number, ISO UTC | |
| `error` | `{ message, stack }` \| null | Failure |
| `warnings` | `{ source, message, details? }[]` | `source`: `app` (crash / error log), `timing` (slow), `flaky` (passed on retry), `report` (screenshot failed), `test` (warn() in a test) |
| `notes` | string[] | Things the test did, e.g. pop-ups it closed |
| `steps` | `{ atMs, text }[]` | Taps, typing, Back, app close: "steps to reproduce" |
| `screenshot`, `video`, `logcatFile` | string \| null | Paths relative to the run folder |
| `logcat` | object | `errors[]`, `errorCount`, `warnings[]`, `warningCount`: the app's own error/warning lines (last 40 kept here) |
| `perf` | object | `launches[] {activity, ms}`, `memoryPssKb`, `frames {total, janky, jankyPct, p90Ms}` |
| `api` | object[] | API calls made during the test (below) |

## api[] (one API call)

| Field | Meaning |
|---|---|
| `seq`, `at`, `endAt` | Order, and the Android-log times of the request and of its outcome |
| `events` | `{ at, kind, text }[]`: the call's life. `kind`: `start` (request started), `sent` (request headers/body sent), `headers` (status line received, with time), `done` (body complete, size, total time), `failed` (network error, with what it means), `abandoned` (no response, with the reason) |
| `resolution` | One line: `200 · 8.2 KB application/json · headers after 440 ms, complete after 461 ms`, or `No response. <reason>` |
| `noResponse` | `{ reason, level }` when no response came. `level`: `fail` (network error, crash), `warn` (unexplained, or the app was stopped by something else), `info` (expected: the test or its setup closed the app) |
| `pid`, `thread` | App process and thread that made the call |
| `totalMs` | Request start to body complete (or to the outcome) |
| `shape` | What the response holds: `JSON with 4 fields: tfa (object, 2 fields), …`, `HTML page "Wikimedia Error"`, `Binary image/png, 634 KB` |
| `bodyCut` | Number of 4,000-character body pieces that Android's log cut (over 4,059 bytes); the body is then incomplete |
| `bodyMissing` | Why there is no body to show (status-line logging and its reason, empty body, body not passed through the logger) |
| `afterTestEnded` | The call finished, or was cut off, after the last test ended (added to the last test) |
| `method`, `url`, `finalUrl` | Request; `finalUrl` when redirected |
| `endpoint` | Stable name: `GET en.wikipedia.org/api/rest_v1/feed/featured/{yyyy}/{mm}/{dd}`, `GET thumb.wikimedia.org (image)`, `…/w/api.php?action=query&generator=random` |
| `status`, `statusText`, `ms`, `bytes` | Response; `status` null when there was none |
| `error` | Network failure (`java.net.UnknownHostException: …`) |
| `unfinished` | No response in the log |
| `contentType`, `reqHeaders`, `resHeaders` | Headers; `cookie`, `set-cookie`, `authorization`, `x-csrf-token` are stored as `(hidden)` |
| `bodyPreview`, `bodyLength`, `bodyFile`, `bodyNote` | First 6000 characters (JSON pretty-printed), full length, file with the whole body, or why there is none (`binary … omitted`) |
| `issues` | `{ level: "fail" \| "warn" \| "info", reason }[]`: HTTP error (with the server's message), network failure (with what it means), no response (with the reason), API error inside a 200, slow, large |
| `known` | Added by the builder: reason from `knownApi` in `test/triage.json` |
| `format` | Added by the builder: `{ rule, status: ok \| problems \| not-checked, problems[{ path, expected, got, text }], checked, reason }` against `test/api-formats.json` |
| `statusMeaning` | Added by the builder: one-line meaning of the status code |

## Added by the builder (data/*.js only)

Per test: `status` (`passed` / `warning` / `failed`), `crash`, `module`, `severity`, `category` and `categoryWhy`
(`product` / `test` / `environment` / `infrastructure` / `review`, from the rules in `dashboard.mjs` and `categoryRules` in
`test/triage.json`), `sig` and `sigText`
(error signature: the same error in different tests or runs gets the same `sig`), `links` (source lines for VS Code).
Per run: `summary`, `api` (calls, failed, warnings, known, noResponse, endpoints, bytes, slowestMs, `topIssues[]` with counts),
`perf`, `problems`, `apiLevel`, `apiLevelReason`, `apiLog`,
`metrics` (per API `{ n, p50, p95, max }`, `launchMs`, `memoryMb`), `deviceKey`, and `budget`: `items[]` (each budget: `key`, `area`,
`name`, `metric`, `value`, `limit`, `unit`, `ok`, `known`, `text`), `trends[]` (`now`, `baseline`, `runs`, `pct`, `slower`, `text`),
`formats[]` (per rule: `ok`, `problems`, `notChecked`, `examples`, `reasons`) and `warnings[]` (`kind`: budget \| trend \| format, `text`).
`data/codes.js` holds the code meanings (`window.DASH_CODES`).
In `data/index.js`, every test result also carries `buildId`, `buildNumber`, `projectCommit` and `projectDirty`: the page uses them
to tell **regressions** (the app build changed, the test code did not, when the failure started) from **test changes**
(the test code changed) and **flaky** tests (the same build and the same test code gave both results).
