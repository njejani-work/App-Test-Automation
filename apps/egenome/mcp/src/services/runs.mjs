// Device runs: pick one, its verdict, its summary, and the comparison of two runs. Plain data in, plain data out.
import { fail } from '../shared/types.mjs';

export const suiteOf = (r) => (r.suites || []).join('+');
export const appOf = (r) => ({ version: r.apk?.version_name || null, build: r.apk?.build_id || null });
export const deviceOf = (r) => (r.device ? [r.device.deviceModel || r.device.deviceName, r.device.platformVersion ? `Android ${r.device.platformVersion}` : null, r.device.screen].filter(Boolean).join(' · ') : null);
/** The first sentence of a long explanation (the dashboard has the rest). */
export const firstSentence = (s) => String(s || '').split(/(?<=\.)\s/)[0];
/** Why no API calls were recorded, in one sentence. */
export const apiNoteOf = (run) => (run.apiLevel === 'NONE' ? `not recorded: ${firstSentence(run.apiLevelReason)} (details: dashboard → API calls)` : null);
export const failedIds = (r) => (r?.problems || []).filter((p) => p.status === 'failed').map((p) => p.id || p.title);

/** The dashboard's verdict rule: a failing P0 test or a crash blocks; other failures make the build unstable. */
export function verdictOf(run, index) {
  const sev = (id) => index.tests.find((t) => t.id === id || t.title === id)?.severity;
  const failed = failedIds(run);
  const p0 = failed.filter((id) => sev(id) === 'P0');
  if (run.summary.crashes) return { verdict: 'BLOCKED', why: `${run.summary.crashes} app crash(es)` };
  if (p0.length) return { verdict: 'BLOCKED', why: `${p0.length} P0 test(s) failed: ${p0.join(', ')}` };
  if (failed.length) return { verdict: 'UNSTABLE', why: `${failed.length} non-P0 failure(s)` };
  if (run.summary.total === 0) return { verdict: 'NO TESTS', why: run.setupError || 'no test ran' };
  return { verdict: 'PASS', why: `${run.summary.passed} passed${run.summary.withWarnings ? `, ${run.summary.withWarnings} with warnings` : ''}` };
}

/** The previous run of the same suite (older than `run`). */
export const previousOf = (index, run) => index.runs.slice(index.runs.indexOf(run) + 1).find((r) => suiteOf(r) === suiteOf(run)) || null;

/** The run asked for (or the latest, or the latest of a suite); a clear error listing what exists otherwise. */
export function pickRun(index, { runId, suite } = {}) {
  if (!index?.runs?.length) fail('No test runs recorded yet. Run npm run test:smoke (or another suite); the results appear here and on the dashboard.');
  const pool = suite ? index.runs.filter((r) => (r.suites || []).some((s) => s.includes(suite))) : index.runs;
  const run = runId ? index.runs.find((r) => r.id === runId) : pool[0];
  if (!run) fail(`${runId ? `Run "${runId}"` : `No run of suite "${suite}"`} not found. Kept runs (newest first): ${index.runs.slice(0, 12).map((r) => `${r.id} (${suiteOf(r)})`).join(', ')}`);
  return run;
}

/** Verdict, counts, app, device and what changed since the previous run of the same suite. */
export function summaryOf(index, run, reportsFile) {
  const previous = previousOf(index, run);
  const now = failedIds(run), before = failedIds(previous);
  return {
    run: run.id, suite: suiteOf(run), startedAt: run.startedAt, durationMin: Math.round((run.durationMs || 0) / 6000) / 10,
    ...verdictOf(run, index),
    counts: { total: run.summary.total, passed: run.summary.passed, failed: run.summary.failed, skipped: run.summary.skipped, withWarnings: run.summary.withWarnings, crashes: run.summary.crashes, budgetWarnings: run.summary.budgetWarnings, unexplainedAppErrors: run.summary.appErrors },
    layoutChecks: run.summary.layout || null,
    app: appOf(run), device: deviceOf(run), environment: run.env || null,
    apiCalls: apiNoteOf(run) || run.api || null,
    testCode: run.details?.project ? { branch: run.details.project.branch, commit: run.details.project.commit?.slice(0, 10), uncommittedChanges: !!run.details.project.dirty } : null,
    comparedWith: previous ? { run: previous.id, newlyFailing: now.filter((x) => !before.includes(x)), fixed: before.filter((x) => !now.includes(x)), stillFailing: now.filter((x) => before.includes(x)) } : null,
    dashboard: reportsFile('index.html'),
  };
}

/** Two runs side by side: counts, failures that appeared / disappeared, tests added / removed, app and code changes. */
export function compareRuns(index, a, b) {
  const testsIn = (r) => index.tests.filter((t) => t.results.some((x) => x.runId === r.id)).map((t) => t.id || t.title);
  const fa = failedIds(a), fb = failedIds(b), ta = testsIn(a), tb = testsIn(b);
  const pick = (r) => ({ run: r.id, suite: suiteOf(r), startedAt: r.startedAt, ...verdictOf(r, index), total: r.summary.total, passed: r.summary.passed, failed: r.summary.failed, skipped: r.summary.skipped, crashes: r.summary.crashes || 0, durationMin: Math.round((r.durationMs || 0) / 6000) / 10, app: appOf(r).build || appOf(r).version, testCode: r.details?.project?.commit?.slice(0, 10) || null });
  const A = pick(a), B = pick(b);
  return {
    newer: A, older: B, sameSuite: A.suite === B.suite,
    appChanged: !!(A.app && B.app && A.app !== B.app), testCodeChanged: !!(A.testCode && B.testCode && A.testCode !== B.testCode),
    newlyFailing: fa.filter((x) => !fb.includes(x)), fixed: fb.filter((x) => !fa.includes(x)), stillFailing: fa.filter((x) => fb.includes(x)),
    testsAdded: ta.filter((x) => !tb.includes(x)), testsRemoved: tb.filter((x) => !ta.includes(x)),
  };
}
