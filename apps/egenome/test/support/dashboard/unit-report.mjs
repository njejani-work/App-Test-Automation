// Unit test results for the dashboard. Used as a node:test reporter by `npm run test:unit` (next to the normal "spec"
// output in the terminal): it collects every test with its status, time, error (expected vs actual, stack), the
// messages it attached (t.diagnostic: API data, what the pretend phone did...), the console output of each test file
// and the coverage, saves the run to reports/unit/<run-id>.json and rebuilds the dashboard ("Unit tests" tab).
//
//   DASHBOARD_UNIT_ID=<id>      use this run id (the dashboard's own tests)
//   DASHBOARD_UNIT_NO_BUILD=1   save the run but do not rebuild the page
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { options, PROJECT_ROOT } from './options.js';
import { runDetails } from './lib/run-details.js';

export const UNIT_SCHEMA = 1;
const MAX_OUTPUT_LINES = 300; // console lines kept per test file
const MAX_VALUE = 4000; // characters of an expected / actual value
const ANSI = /\x1b\[[0-9;]*m/g;

const pad = (n) => String(n).padStart(2, '0');
export const unitRunId = (d = new Date()) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
const toPath = (f) => (f && f.startsWith('file:') ? fileURLToPath(f) : f || '');
const rel = (f, root) => (f ? path.relative(root, toPath(f)).split(path.sep).join('/') : '');
const show = (v) => { const s = typeof v === 'string' ? JSON.stringify(v) : util.inspect(v, { depth: 6, breakLength: 100, maxArrayLength: 50 }); return s.length > MAX_VALUE ? s.slice(0, MAX_VALUE) + ' …' : s; };
/** "vscode://file/C:/x/y.js:12:5": opens the line in VS Code (also on Windows) */
const vscode = (abs, line, col) => `vscode://file/${abs.replace(/\\/g, '/').replace(/^\//, '')}${line ? ':' + line + (col ? ':' + col : '') : ''}`;
/** [3,4,5,9] -> "3-5 9" */
export function ranges(nums) {
  const out = [];
  for (const n of [...nums].sort((a, b) => a - b)) {
    const last = out[out.length - 1];
    if (last && n === last[1] + 1) last[1] = n; else out.push([n, n]);
  }
  return out.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join(' ');
}

/** The error of a failed test in plain parts: message, expected / actual, where in the test code, stack. */
export function errorOf(details, root) {
  const e = details?.error;
  if (!e) return null;
  const c = e.cause && typeof e.cause === 'object' ? e.cause : e;
  const frames = String(c.stack || '').split('\n').slice(1).map((l) => l.trim()).filter((l) => l && !/node:internal|node_modules/.test(l));
  let location = null;
  for (const f of frames) {
    const m = f.match(/\(?((?:file:\/\/)?[^()\s]+?):(\d+):(\d+)\)?$/);
    if (!m) continue;
    const abs = toPath(m[1]);
    if (!abs.startsWith(root) || abs.includes(`${path.sep}node_modules${path.sep}`)) continue;
    location = { file: rel(abs, root), line: Number(m[2]), column: Number(m[3]), href: vscode(abs, m[2], m[3]) };
    break;
  }
  const isAssert = c.code === 'ERR_ASSERTION';
  return {
    kind: e.failureType === 'hookFailed' ? 'Setup failed (a before/after hook)' : e.failureType === 'cancelledByParent' ? 'Cancelled (an outer test failed)' : e.failureType === 'testTimeoutFailure' ? 'Timed out (took longer than its time limit)' : isAssert ? 'Assertion failed' : 'Error thrown',
    failureType: e.failureType || null,
    name: c.name || 'Error',
    code: c.code || null,
    message: String(c.message ?? e.message ?? '').replace(ANSI, ''),
    ...(isAssert && 'expected' in c ? { expected: show(c.expected), actual: show(c.actual), operator: c.operator || null } : {}),
    location,
    stack: frames.slice(0, 12).join('\n'),
  };
}

/**
 * Turn the reporter events of one `node --test` run into the run saved for the dashboard. Pure (no files), so it
 * can be unit-tested with recorded events.
 */
export function collectUnitRun(events, { root = PROJECT_ROOT, id = unitRunId(), startedAt = Date.now(), finishedAt = Date.now(), argv = process.execArgv, command = process.env.npm_lifecycle_event || null } = {}) {
  const tests = [];
  const files = new Map(); // rel file -> { file, stdout: [], stderr: [] }
  const fileOf = (f) => { const r = rel(f, root); if (!files.has(r)) files.set(r, { file: r, stdout: [], stderr: [] }); return files.get(r); };
  const stack = new Map(); // file -> names by nesting (describe blocks)
  const byLine = new Map(); // "file:line" -> test (for messages that arrive after the result)
  let coverage = null;
  let counts = null;
  const hookFails = []; // describe blocks whose before/after hook failed: their tests were cancelled because of it
  for (const ev of events) {
    const d = ev.data || {};
    switch (ev.type) {
      case 'test:start': {
        const s = stack.get(d.file) || []; s.length = d.nesting; s[d.nesting] = d.name; stack.set(d.file, s);
        break;
      }
      case 'test:pass':
      case 'test:fail': {
        const type = d.details?.type;
        if (type === 'suite') {
          if (d.details?.error?.failureType === 'hookFailed') hookFails.push({ file: rel(d.file, root), path: [...(stack.get(d.file) || []).slice(0, d.nesting).filter(Boolean), d.name], error: errorOf(d.details, root) });
          break;
        }
        const f = rel(d.file, root);
        const fileWrapper = d.nesting === 0 && d.name === path.basename(toPath(d.file || ''));
        if (fileWrapper && ev.type === 'test:fail' && d.details?.error?.failureType === 'subtestsFailed') break; // only says "a test in the file failed"
        if (fileWrapper && ev.type === 'test:pass') break;
        const suite = (stack.get(d.file) || []).slice(0, d.nesting).filter(Boolean);
        const status = ev.type === 'test:fail' ? (d.details?.error?.failureType === 'cancelledByParent' ? 'cancelled' : 'failed') : d.todo ? 'todo' : d.skip ? 'skipped' : 'passed';
        const t = {
          key: [f, ...suite, fileWrapper ? '(file)' : d.name].join(' › '),
          file: f,
          line: d.line || null,
          href: d.file ? vscode(toPath(d.file), d.line, d.column) : null,
          suite,
          name: fileWrapper ? `${f} could not run` : d.name,
          status,
          durationMs: Math.round((d.details?.duration_ms || 0) * 10) / 10,
          ...(typeof d.skip === 'string' ? { skipReason: d.skip } : typeof d.todo === 'string' ? { skipReason: d.todo } : {}),
          error: status === 'failed' || status === 'cancelled' ? errorOf(d.details, root) : null,
          messages: [],
        };
        fileOf(d.file);
        tests.push(t);
        byLine.set(`${d.file}:${d.line}`, t);
        break;
      }
      case 'test:diagnostic': {
        const t = d.file && byLine.get(`${d.file}:${d.line}`);
        if (t) t.messages.push(String(d.message).replace(ANSI, ''));
        break;
      }
      case 'test:stdout':
      case 'test:stderr': {
        if (!d.file) break;
        const out = fileOf(d.file)[ev.type === 'test:stdout' ? 'stdout' : 'stderr'];
        for (const l of String(d.message).replace(ANSI, '').split(/\r?\n/)) if (l && out.length < MAX_OUTPUT_LINES) out.push(l);
        break;
      }
      case 'test:coverage': {
        const sum = d.summary || {};
        const threshold = Number((argv.find((a) => a.startsWith('--test-coverage-lines=')) || '').split('=')[1]) || null;
        coverage = {
          threshold,
          totals: { lines: sum.totals?.coveredLinePercent ?? null, branches: sum.totals?.coveredBranchPercent ?? null, functions: sum.totals?.coveredFunctionPercent ?? null, lineCount: sum.totals?.totalLineCount ?? null },
          files: (sum.files || []).map((x) => ({
            file: rel(x.path, root),
            lines: x.coveredLinePercent, branches: x.coveredBranchPercent, functions: x.coveredFunctionPercent,
            lineCount: x.totalLineCount,
            uncovered: ranges((x.lines || []).filter((l) => l.count === 0).map((l) => l.line)),
          })).sort((a, b) => a.lines - b.lines),
        };
        coverage.belowThreshold = threshold != null && coverage.totals.lines != null && coverage.totals.lines < threshold;
        break;
      }
      case 'test:summary':
        if (!d.file) counts = d.counts;
        break;
      default:
    }
  }
  // a cancelled test whose group's setup failed: show the setup's error (that is the reason it did not run)
  for (const t of tests.filter((x) => x.status === 'cancelled')) {
    const h = hookFails.find((x) => x.file === t.file && x.path.every((p, i) => t.suite[i] === p));
    if (h && h.error) t.error = { ...h.error, kind: `Not run: the setup of "${h.path.join(' › ')}" failed (before/after hook)` };
  }
  const n = (s) => tests.filter((t) => t.status === s).length;
  const summary = { total: tests.length, passed: n('passed'), failed: n('failed') + n('cancelled'), skipped: n('skipped') + n('todo'), durationMs: finishedAt - startedAt };
  const status = summary.failed ? 'failed' : coverage?.belowThreshold ? 'coverage' : 'passed';
  return {
    schemaVersion: UNIT_SCHEMA, id, startedAt: new Date(startedAt).toISOString(), finishedAt: new Date(finishedAt).toISOString(),
    status, summary, counts, command: command ? `npm run ${command}` : 'node --test',
    details: runDetails(root),
    files: [...files.values()].map((f) => ({ ...f, tests: tests.filter((t) => t.file === f.file).length, failed: tests.filter((t) => t.file === f.file && t.status === 'failed').length, durationMs: Math.round(tests.filter((t) => t.file === f.file).reduce((a, t) => a + t.durationMs, 0)) })),
    tests, coverage,
  };
}

/** reports/data/unit.js for the page: the kept unit runs, newest first (old runs beyond DASHBOARD_KEEP_RUNS are deleted). */
export function writeUnitData(reportsDir = options.reportsDir, keep = options.keepRuns || 30) {
  const dir = path.join(reportsDir, 'unit');
  const ids = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^\d{8}-\d{6}\.json$/.test(f)).sort().reverse() : [];
  for (const old of ids.slice(keep)) { try { fs.rmSync(path.join(dir, old)); } catch {} }
  const runs = ids.slice(0, keep).map((f) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } }).filter(Boolean);
  fs.mkdirSync(path.join(reportsDir, 'data'), { recursive: true });
  const file = path.join(reportsDir, 'data', 'unit.js');
  fs.writeFileSync(`${file}.tmp`, `window.DASH_UNIT=${JSON.stringify({ schemaVersion: UNIT_SCHEMA, generatedAt: new Date().toISOString(), runs }).replace(/</g, '\\u003c')};\n`);
  fs.renameSync(`${file}.tmp`, file);
  return runs.length;
}

/** The reporter: collects the events, then saves the run and rebuilds the dashboard. */
export default async function* unitReporter(source) {
  const startedAt = Date.now();
  const events = [];
  for await (const ev of source) events.push(ev);
  const run = collectUnitRun(events, { id: process.env.DASHBOARD_UNIT_ID || unitRunId(new Date(startedAt)), startedAt, finishedAt: Date.now() });
  const dir = path.join(options.reportsDir, 'unit');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${run.id}.json`), JSON.stringify(run, null, 1));
  let where = path.join(options.reportsDir, 'index.html');
  if (!process.env.DASHBOARD_UNIT_NO_BUILD) {
    try {
      const { buildIndex } = await import(pathToFileURL(path.join(path.dirname(fileURLToPath(import.meta.url)), 'builder.js')).href);
      where = buildIndex(options.reportsDir, { keepRuns: options.keepRuns }).file || where;
    } catch (e) { yield `\n[dashboard] unit results saved, but the page could not be rebuilt: ${e.message}\n`; }
  }
  const s = run.summary;
  yield `\nUnit tests: ${s.passed} passed · ${s.failed} failed · ${s.skipped} skipped${run.coverage?.totals.lines != null ? ` · line coverage ${run.coverage.totals.lines.toFixed(1)}%` : ''}\n`
    + `Saved for the dashboard (Unit tests tab): ${path.relative(process.cwd(), where)} · run ${run.id}\n`;
}
