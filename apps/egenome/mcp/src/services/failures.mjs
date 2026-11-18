// Failed tests of a run: a compact list (one line each), and one test in full.
import { fail } from '../shared/types.mjs';
import { historyOf, historyTag } from './history.mjs';
import { apiNoteOf } from './runs.mjs';

/** Stack frames and links as short project paths: test/pageobjects/BasePage.js:106 */
export const shortPath = (s) => String(s).split('\n').map((line) => {
  const m = [...line.matchAll(/((?:test|scripts|mcp\/src)\/[^():\s]+:\d+)/g)].pop();
  if (!m) return line;
  const open = line.indexOf('(');
  return /^\s*at /.test(line) && open > 0 ? `${line.slice(0, open)}(${m[1]})` : m[1];
}).join('\n');

const firstLine = (s) => String(s || '').split('\n')[0];
const idOf = (t) => t.id || t.title;

/** Each failed (or crashed, or optionally warned) test, short: the cause, the group it belongs to, NEW/FLAKY/... */
export function failuresOf(index, run, full, { includeWarnings = false } = {}) {
  const tests = (full?.tests || []).filter((t) => t.status === 'failed' || t.crash || (includeWarnings && t.status === 'warning'));
  return tests.map((t) => {
    const h = historyOf(index, run, idOf(t));
    return {
      test: idOf(t), title: t.title, severity: t.severity || null, module: t.module || null, status: t.status, crash: !!t.crash,
      error: firstLine(t.error?.message) || null,
      failedStep: (t.stepsDetail || []).find((s) => s.status === 'failed')?.title || null,
      category: t.category || null, categoryWhy: t.categoryWhy || null,
      sameCauseAs: t.sig ? tests.filter((x) => x.sig === t.sig && x !== t).map(idOf) : [],
      warnings: (t.warnings || []).length,
      history: h ? { status: h.status, tag: historyTag(h), lastPass: h.lastPass } : null,
    };
  });
}

/** Find a test by id (exact) or by part of its title. */
export function findTest(full, run, query) {
  const tests = full?.tests || [];
  const q = query.toLowerCase();
  const t = tests.find((x) => (x.id || '').toLowerCase() === q) || tests.find((x) => x.title.toLowerCase().includes(q));
  if (!t) fail(`No test "${query}" in run ${run.id}. Tests in it: ${tests.map(idOf).join(', ') || 'none'}`);
  return t;
}

/** One test in full. Long parts are cut to the limits given; `cut` says what was left out. */
export function detailsOf(index, run, t, abs, { logLines = 15, stackLines = 8, layoutChecks = 10 } = {}) {
  const stack = String(t.error?.stack || '').split('\n');
  const lc = t.logcat || {};
  const errors = lc.errors || [];
  const steps = (t.stepsDetail || []).map((s) => {
    const failedChecks = (s.layout?.results || []).filter((r) => r.status === 'failed').map((r) => r.message);
    return {
      n: s.n, title: s.title, call: s.call || null, status: s.status, durationMs: s.durationMs || 0,
      error: s.error?.message ? firstLine(s.error.message) : null,
      layout: s.layout?.summary ? { spec: s.layout.spec, ...s.layout.summary, failedChecks: failedChecks.slice(0, layoutChecks), moreFailedChecks: Math.max(0, failedChecks.length - layoutChecks) } : null,
      warnings: (s.warnings || []).slice(0, 5),
    };
  });
  return {
    run: run.id, test: idOf(t), title: t.title, status: t.status, severity: t.severity || null, module: t.module || null, durationMs: t.durationMs || 0,
    category: t.category || null, categoryWhy: t.categoryWhy || null,
    error: t.error ? { message: t.error.message, where: (t.links || []).map((l) => shortPath(l.label)), stack: shortPath(stack.slice(0, stackLines).join('\n')), stackLinesCut: Math.max(0, stack.length - stackLines) } : null,
    steps,
    warnings: (t.warnings || []).map((w) => w.message),
    appLog: lc.notRecorded ? null : { errorLines: lc.errorCount || 0, unexplained: lc.unexplained ?? lc.errorCount ?? 0, lastErrors: errors.slice(-logLines), linesCut: Math.max(0, errors.length - logLines) },
    apiCalls: (t.api || []).map((c) => ({ method: c.method, url: c.url, status: c.status ?? null, ms: c.ms ?? null, step: c.step ? `step ${c.step.n} · ${c.step.screen}` : null, outcome: c.resolution || null, problems: (c.issues || []).map((i) => i.reason) })),
    apiNote: (t.api || []).length ? null : apiNoteOf(run) || 'no API calls during this test',
    performance: t.perf || null,
    files: { screenshot: abs(t.screenshot), video: abs(t.video), appLog: abs(t.logcatFile) },
    history: historyOf(index, run, idOf(t)),
  };
}
