# Dashboard redesign: step 1, inventory and plan

Status: **for review**. Nothing has been installed and no code has changed yet.

## 0. Decisions so far

| Question | Answer |
|---|---|
| Packages | Free and open source only. shadcn/ui alone is not enough (see below), so the packages it builds on get installed. |
| Built page | **Committed**: `toolkit/dashboard/template/index.html`. Apps and CI do not change. |
| Reference data | The latest **eGenome** run (layout checks) and **Wikipedia** run (API calls), plus the demo runs from `fixtures.mjs` (failures, crash, regression, flaky). |

### Can the UI be built with shadcn only?

No. shadcn/ui is not a library you install. It is **component source code copied into the project**, and that code is written for React,
styled with Tailwind CSS and built on Radix (menus, dialogs, tabs). So at least these are needed: React, Tailwind,
Radix, shadcn's three small style helpers, an icon set, and a build tool. Some shadcn components are themselves thin wrappers:

- the Command palette wraps `cmdk`;
- Chart wraps `recharts`;
- Sonner wraps `sonner`.

So those come with the components that use them.

Dropped from the first list, because plain code does the job:

- `@tanstack/react-table`: sorting and filtering stay as small functions, as in today's page.
- `@tanstack/react-virtual`: long lists show 200 rows plus a "Show more" button instead.

## 1. Packages to install (all free, all open source)

Each version was published at least two weeks ago. They go in `toolkit/dashboard/ui/package.json`, a separate package
outside the workspace (like `mcp/`). The apps, the root `npm install` and CI do not install any of it.

| Package | Version | Licence | Needed for |
|---|---|---|---|
| react, react-dom | 19.3.1 | MIT | shadcn/ui and Magic UI are React components |
| vite, @vitejs/plugin-react | 8.3.6, 6.2.1 | MIT | dev server and build |
| vite-plugin-singlefile | 2.3.4 | MIT | everything inlined into one `index.html` (opens from disk, offline) |
| tailwindcss, @tailwindcss/vite | 4.3.4 | MIT | shadcn's styling; the theme tokens |
| tw-animate-css | 1.4.0 | MIT | shadcn's open and close animations |
| shadcn (dev tool) | 4.23.0 | MIT | copies shadcn and Magic UI component code into `src/components/` |
| radix-ui | 1.8.1 | MIT | what shadcn components are built on |
| class-variance-authority, clsx, tailwind-merge | 0.7.1, 2.1.1, 3.7.0 | Apache-2.0, MIT, MIT | shadcn's variant helpers |
| lucide-react | 1.69.0 | ISC | icons (statuses never rely on colour alone) |
| cmdk | 1.1.1 | MIT | shadcn Command (the `Ctrl/Cmd+K` palette) |
| recharts | 3.10.1 | MIT | shadcn Chart (trends, performance) |
| sonner | 2.0.8 | MIT | shadcn Sonner ("Copied" messages) |
| @number-flow/react | 0.6.2 | MIT | animated KPI numbers and deltas |
| motion | 14.9.1 | MIT | used by the Magic UI components |
| @fontsource-variable/sora, /inter, /jetbrains-mono | 5.3.0 | OFL-1.1 | the three fonts, inlined so they work offline |

Install on **your PC** (Windows), not from my session. Tailwind and Vite ship native parts that differ between Windows and
Linux, and a Linux install in your folder would break on Windows (the Appium lesson). I develop and build in my own copy
and write the source and the built page into your folder. You run `npm install` in `toolkit/dashboard/ui` only when
you want to change or rebuild the dashboard yourself.

## 2. A finding that shapes the plan

Today's page is not only layout. About 40% of its 2,000 lines are the **analysis**:

- `analyse`, `verdictOf`, `groupRows`, `runsFiltered`;
- `callLevel`, `bugReport`;
- budgets and percentiles;
- the history statuses;
- quarantine.

The builder supplies the data, and the page decides the verdict, the statuses and the groups. So the redesign:

1. **Moves that logic unchanged** into plain modules (`ui/src/logic/*.js`, one job each). This is "move first", with no UI change.
2. Adds **unit tests** for those modules on the demo runs, and checks them against what the old page shows (same verdict,
   same KPIs, same rows) before any new view uses them.
3. Only then builds the new views on top of them.

The MCP server keeps reading the same data and its own logic, so it is not affected.

## 3. Parity checklist: every feature of today's page

**Header and filters**

- [ ] App switcher (`DASH_APPS`, logo or badge and name follow the app; switching keeps the view).
- [ ] Filters: build, suite, run, environment, platform; "Only mine"; search (`/` focuses it); phone: filters fold behind a button with a count.
- [ ] Live refresh (polls `latest.js`; on/off toggle; `r` refreshes; a pending refresh waits while the lightbox is open).
- [ ] Theme switch (light / dark), remembered.

**Verdict and numbers**

- [ ] PASS / UNSTABLE / BLOCKED / NO DATA with the reason, build, version, suite, run id.
- [ ] Run details link (trigger, branch) opening the run-details drawer: where it came from, when, app under test, device and machine, tool versions.
- [ ] 8 KPIs with "vs last" deltas: pass rate, failed, regressions, new, flaky, crashes, with warnings, API failures. Clicking one filters the list; alert style when bad.

**Triage**

- [ ] One row per root cause; filters (`f`: failures, all, new…; `cat`: category; `module`); `j`/`k`, `Enter`, `Esc`.
- [ ] Charts: failures by module, trend over the last 14 runs.
- [ ] "All runs" table (click a run to open it) and the consolidated view of all runs.
- [ ] Unsaved triage edits banner: Download `triage.json` / Discard.

**Test drawer** (`open`, tab `dt`; arrow keys move between tabs)

- [ ] Status, severity and category chips; analysis (category and why, change the category); quarantine (with expiry).
- [ ] Triage actions: owner (suggested from the module), Assign, Assign to me, Create ticket, Mark as known, ticket link, Copy bug report / Copy test summary.
- [ ] Error with code notes (status, exit codes explained) and links into the code.
- [ ] Warnings; steps (eGenome: screenshots, actions, layout checks per screen, "show every checked element"); steps to reproduce.
- [ ] Screen at the end and the video; device, OS and build.
- [ ] App log: errors and warnings, filter box, known lines listed but not counted, link to the full log.
- [ ] API calls of the test, per step; a call links to the API view.
- [ ] Diff since the last pass; history dots (last 30 runs, click to open that run).

**Screenshot viewer**

- [ ] Every step's screenshot, arrow keys, layout boxes drawn on the screen, `Esc`.

**Views**

- [ ] **Coverage**: by module from `triage.json`, modules without tests, exclusions.
- [ ] **Performance** (`bf`): budgets (app start, memory, frames, slow tests), sparklines, p50/p95 per API, "slower than usual".
- [ ] **Device matrix**: pass rate per Android version and device.
- [ ] **History**: every test across runs, pass rate, flakiness.
- [ ] **API calls** (`af`, `call`): problems first, by screen, by API, every call, the API log (request to outcome), status codes explained, secret headers hidden; a clear reason when the app logs no calls.
- [ ] **Compare** (`a`, `b`): numbers, newly failing / fixed, added / removed, what changed (app build, test code), API calls by API.
- [ ] **Unit tests** (`urun`, `uf`): verdict, failures first with expected vs actual and where, messages, by file, coverage per file, unit runs, unstable and slowest tests, console output, run details.

**Everywhere**

- [ ] Long pages in tabs (`sec`), urgent first; every view and filter in the URL hash, with the same parameter names, so old links keep working.
- [ ] Sessions that could not start say why; a failed setup hook and the tests it skipped; app crash vs another process crashing.
- [ ] No sideways scrolling on any view at phone width; no console errors; opens from `file://`.
- [ ] Masks: OTP `••••••`, secret headers never shown.

## 4. Information architecture

```
┌ Sidebar ─────────────┐┌ Header: [App ▾ eGenome.ai]  Build ▾  Suite ▾  Run ▾   ⌕ Search… (Ctrl K)  ● Live  ⟳  ◐ ┐
│ ◉ Overview    (new)  ││                                                                                      │
│ ▲ Triage        3    ││  (view)                                                                               │
│ ◔ Coverage           ││                                                                                      │
│ ⚡ Performance   1    ││                                                                                      │
│ ▦ Devices            ││                                                                                      │
│ ⟲ History            ││                                                                                      │
│ ⇄ API calls     2    ││                                                                                      │
│ ⇋ Compare            ││                                                                                      │
│ ✓ Unit tests         ││                                                                                      │
│ ───────────          ││                                                                                      │
│ Run 20261118-160308  ││                                                                                      │
│ v1.8.52 · emulator   ││                                                                                      │
└──────────────────────┘└──────────────────────────────────────────────────────────────────────────────────────┘
```

- **Sidebar** (shadcn Sidebar, collapses to icons; a sheet on phones): views with a count badge of things to act on, and the current run at the bottom.
- **Header**: app switcher (logo or badge), build, suite and run pickers. Environment, platform and "Only mine" go in a Filters popover, with a count of active filters.
- **Command palette** (`Ctrl/Cmd+K`): test ids and titles, views, runs, apps, "Copy link".
- **Overview** (new default; `#/triage` and every old link still work):

```
┌ BLOCKED ■ ─────────────────────────────── (glow) ┐ ┌ Pass rate ┐┌ Failed ┐┌ Regress. ┐┌ New ┐
│ SMK-05 [P0] fails since build #42 (regression)  │ │  87.5 %   ││   1    ││    1     ││  0  │  NumberFlow,
│ #43 · v2.4.0 · smoke · Pixel 7 · Android 14      │ │ ▼ 12.5 pts ││ ▲ 1    ││  ▲ 1     ││ =   │  deltas vs last
│ [Run details ›]                                  │ └───────────┘└────────┘└──────────┘└─────┘
└──────────────────────────────────────────────────┘ ┌ Flaky ┐┌ Crashes ┐┌ Warnings ┐┌ API failures ┐
┌ Act now ──────────────────────────────── 3 ┐ ┌ Trend · 14 runs ───────────────────────────┐
│ ■ P0  SMK-05 Reports did not open  REGRESS.│ │  passed / failed bars + pass-rate line     │
│       product bug · owner Ravi · 2 tests   │ │                                            │
│ ✖ CRASH SMK-07 NullPointerException        │ └────────────────────────────────────────────┘
│ ● NEW  REG-12 Payment button not displayed │ ┌ Failures by module ┐ ┌ Recent runs ──────────┐
└────────────────────────────────────────────┘ └────────────────────┘ └───────────────────────┘
```

- **Test drawer** (shadcn Sheet from the right, up to 960 px wide; full screen on phones):

```
┌ ✖ FAILED  P0  REGRESSION  product bug                         [⧉ Link] [Esc] ┐
│ SMK-05 [P0] the Reports tab opens                                            │
│ ReportsPage did not open within 20000 ms · step 4 of 6 · 31.2 s              │
│ [Copy steps to reproduce] [Copy as ticket (Markdown)] [Open in VS Code] [▶ Video] │
├ Summary │ Steps 6 │ Screen & device │ App log 3 │ API calls 1 │ History ───────┤
│ (one tab at a time, kept in the URL as dt=…)                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

The hand-off actions stay at the top on every tab. The triage actions (owner, ticket, known, quarantine) are in Summary.

## 5. Visual design

### Colours sampled from eGenome's screenshots

The most common pixels of each colour family, across 12 screens:

- primary: `#842890` → `#AC3ABA`;
- teal: `#089890`;
- amber: `#FE9800`;
- red: `#FE3C30`;
- background: `#100A20`.

Text colours were then adjusted until every pair passed WCAG AA (4.5:1). Ratios are measured.

| Token | Dark | Light | Contrast |
|---|---|---|---|
| background | `#100A20` + violet `#302460` / indigo `#1E3660` glows | `#F5F4F8` | text 17.5 (dark) / 16.0 (light) |
| card | white 5% over background (`≈#1A1430`), 1 px border white 10%, radius 16 | `#FFFFFF`, border `#E6E3EE` | |
| foreground / muted | `#F4F1FA` / `#A9A1BD` | `#1B1530` / `#5E5672` | muted 7.2 / 6.9 |
| primary (buttons) | gradient `#842890` → `#AC3ABA`, white text | `#842890`, white text | 8.0 / 5.5 at the light end |
| primary as text / link | `#C77DFF` | `#842890` | 6.6 / 8.0 |
| accent (teal: PASS, good) | `#2CC4B8` text; `#089890` fills with dark text | `#067A75` | 8.2 / 5.2 |
| warning (FLAKY, warnings) | `#FE9800` | `#9A5A00` | 8.0 / 5.5 |
| destructive (FAIL, BLOCKED, crash) | `#FF6B60` text; `#FE3C30` fills | `#C4271D` | 6.3 / 5.8 |

Notes:

- White text on teal `#089890` is only 3.6, so teal fills use dark text.
- Red `#FE3C30` as text on a dark card is 4.9 (passes), but `#FF6B60` is easier to read.

**Status = colour + icon + word**:

- ✓ PASS (teal);
- ≈ UNSTABLE (amber);
- ■ BLOCKED (red);
- ▲ REGRESSION (red);
- ● NEW (red);
- ◐ FLAKY (amber);
- ✖ CRASH (deep red);
- ⏸ QUARANTINED (grey);
- ◆ KNOWN (violet).

### Fonts (OFL, inlined)

| Use | Font | Why |
|---|---|---|
| Headings, verdict, view titles | **Sora** (variable) | geometric, close to the app's style |
| Text, tables, buttons | **Inter** (variable) | very readable at 13–14 px in dense tables |
| Ids, timings, codes, logs, all numbers | **JetBrains Mono** (variable), tabular figures | columns of numbers line up; NumberFlow uses it too |

### Motion

- **NumberFlow**: every KPI, delta and count. Numbers roll when the run, the filter or the live data changes.
- **Magic UI**:
  - `BlurFade` when a view opens;
  - `BorderBeam` around the verdict while a run is in progress;
  - `MagicCard` spotlight on KPI hover;
  - `DotPattern` with a soft violet glow behind the verdict, echoing the app.
- With `prefers-reduced-motion`, all of it is off: numbers change instantly.

## 6. Code layout

```
toolkit/dashboard/ui/
├─ package.json, vite.config.js, index.html, components.json (shadcn settings), README.md
├─ src/
│  ├─ main.jsx                 start: load data, render <App>
│  ├─ data/                    the ONLY code touching window.DASH_*: load index / runs / latest / unit / apps; live polling
│  ├─ logic/                   moved unchanged from today's page: analyse, verdict, groups, history, budgets, API levels, bug report
│  ├─ route/                   URL hash <-> state (same parameter names as today)
│  ├─ views/                   Overview, Triage, Coverage, Performance, Devices, History, Api, Compare, Unit
│  ├─ drawer/                  TestDrawer (+ one file per tab), RunDetails, ScreenViewer
│  ├─ components/ui/           shadcn components (copied in by the shadcn tool)
│  ├─ components/magic/        Magic UI components (copied in)
│  └─ styles.css               theme tokens, fonts
└─ test/                       unit tests for logic/ (node --test)
```

- **Build**: `npm run dashboard:ui:build` writes `toolkit/dashboard/template/index.html` (single file). The old page is kept as `template/index.legacy.html` until you approve removing it.
- **Dev**: `npm run dashboard:ui:dev` serves the page with the data of any app's `reports/` folder (default: eGenome).
- **Page tests**: the existing Playwright tests are rewritten for the new markup, checking the same behaviour. A few new ones cover the command palette, the hand-off buttons and reduced motion.

## 7. Steps after this one

| Step | What you get to review |
|---|---|
| 2. Shell | The new page with sidebar, header, theme, fonts, palette and routing, on real data, opening from disk. The logic moved and unit-tested. |
| 3. Overview | Verdict, KPIs with NumberFlow, Act now, trend. |
| 4. Triage + drawer | The triage table, the full test drawer, the hand-off actions, the screenshot viewer. |
| 5. Other views | Performance, API calls, Devices, History, Compare, Coverage, Unit tests. |
| 6. Parity and polish | All page tests green; screenshots of every view in both themes at 390 px and 1440 px; bundle size. |
| 7. Hand-over | README; the list of what to remove (the legacy page). |

## 8. Risks

- **Bundle size.** React, Radix, Recharts and the fonts come to roughly 600–900 KB inlined (today's page: 220 KB). It opens from disk, so this mostly costs disk space; I will report the real number in step 2.
- **Porting the logic.** This is where a regression would hide. Hence the "move unchanged and compare" step before any new view.
- **Live refresh with React.** New data must update numbers in place (NumberFlow) without closing the drawer or losing the scroll position. This will be tested with a pretend running run.
