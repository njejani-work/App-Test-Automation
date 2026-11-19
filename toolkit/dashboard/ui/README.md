# Test dashboard UI (redesign, in progress)

The dashboard page, rebuilt with React, shadcn/ui, Magic UI and NumberFlow, in eGenome's colours. The plan and its
progress: [`PLAN.md`](PLAN.md).

- **The apps never need this folder.** It builds into one self-contained file, `../template/next/index.html` (committed).
  While the redesign is in progress, the builder writes it next to the current page as `reports/next.html`. In step 6
  it replaces `../template/index.html`.
- **Own packages.** This folder is not part of the workspace; install it only to change or rebuild the page:

```bash
npm run dashboard:ui:install   # at the workspace root, once (on the PC that builds: Tailwind and Vite include native parts)
npm run dashboard:ui:dev       # http://localhost:5173 with eGenome's reports (another app: DASH_DATA=../../../apps/wikipedia/reports)
npm run dashboard:ui:build     # writes ../template/next/index.html
npm run dashboard:ui:test      # the same answers as the old page on the demo runs and each app's runs; links / URL state
```

## Where things are

| Folder | What |
|---|---|
| `src/data/load.js` | The only code that reads the data files (`window.DASH_*`, loaded with `<script>`: works from `file://`) |
| `src/logic/` | The analysis (verdict, statuses, root causes), moved unchanged from the old page; checked by `test/parity.test.mjs` |
| `src/route/state.js` | The URL hash: the same parameter names as the old page, so shared links keep working |
| `src/app/` | The frame: sidebar, header, filters, command palette (Ctrl/Cmd+K), live refresh, theme |
| `src/views/` | One file per view |
| `src/components/ui/`, `src/components/magic/` | shadcn and Magic UI components (copied in by the `shadcn` tool; third-party code, not held to the 200-line rule) |
| `src/styles.css` | The theme: every colour, in light and dark |

Adding a shadcn component: `npx shadcn add <name>` (Magic UI: `npx shadcn add @magicui/<name>`). The tool may add packages
to `package.json` on its own: check the diff and remove anything not approved (it added `next-themes` and `cn` on 19 Nov).
