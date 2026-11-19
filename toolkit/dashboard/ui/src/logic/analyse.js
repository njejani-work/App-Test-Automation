// The analysis of one run against its history: each test's status (NEW, RECURRING, FLAKY, REGRESSION, KNOWN,
// QUARANTINED, WARNING, PASS), its category and since when it fails, plus the run's KPIs. Moved unchanged from the old
// page (template/index.legacy.html, 19 Nov 2026); what it read from the page (all tests, triage edits, today) is now `ctx`
// (logic/triage-settings.js triageContext).
import { pct, bl, shortC, CATS } from './format.js';

// For every test in `run`: NEW (passed last time) / RECURRING / FLAKY (flips in last 10) / KNOWN, and since which build.
export function analyse(run, runs, ctx) {
  if (!run) return null;
  const order = runs.map((r) => r.id);
  const at = order.indexOf(run.id);
  const tests = [];
  const failed = (x) => x.status === 'failed';
  const bad = (x) => failed(x) || !!x.crash;
  // Same code = same app build AND same committed test code (both recorded); then a pass and a fail = flaky
  const sameCode = (x, y) => !!(x.buildId && x.buildId === y.buildId && x.projectCommit && x.projectCommit === y.projectCommit && !x.projectDirty && !y.projectDirty);
  for (const T of ctx.tests) {
    const byRun = new Map(T.results.map((x) => [x.runId, x]));
    const cur = byRun.get(run.id);
    if (!cur) continue;
    const older = order.slice(at).map((id) => byRun.get(id)).filter((x, i) => x && (i === 0 || x.status !== 'skipped')); // cur first, then older runs that ran
    const prev = older[1];
    const last10 = older.slice(0, 10);
    const fails = last10.filter(failed).length;
    let flips = 0; for (let i = 1; i < last10.length; i++) if (failed(last10[i]) !== failed(last10[i - 1])) flips++;
    let pair = null;
    for (const x of last10) { if (!failed(x)) continue; const y = last10.find((z) => !bad(z) && sameCode(x, z)); if (y) { pair = [x, y]; break; } }
    const sameBuildFlips = !pair && flips >= 3 && last10.every((x) => x.buildId && x.buildId === cur.buildId);
    const flaky = !!pair || sameBuildFlips;
    const flakyWhy = pair
      ? `Failed in run ${pair[0].runId} and passed in run ${pair[1].runId} with the same app build (${bl(pair[0])}) and the same test code (${shortC(pair[0].projectCommit)}): the result changes without any code change.`
      : sameBuildFlips ? `Changed result ${flips} times in the last ${last10.length} runs on the same app build ${bl(cur)} (the test-code version was not recorded for these runs).` : '';
    const problem = bad(cur);
    let sinceRun = null;
    if (problem) { sinceRun = cur.runId; for (const x of older.slice(1)) { if (bad(x) && x.sig === cur.sig) sinceRun = x.runId; else break; } }
    const isNew = problem && (!prev || !bad(prev) || prev.sig !== cur.sig);
    const lastPass = older.slice(1).find((x) => !bad(x)) || null;
    let regression = false, regressionWhy = '', testChanged = false, testChangedWhy = '';
    // What changed when this failure STARTED (first failing run of the current streak vs the last pass before it)
    const ff = (sinceRun && older.find((x) => x.runId === sinceRun)) || cur;
    const lastPassBefore = lastPass && lastPass.runId < ff.runId ? lastPass : null;
    if (problem && lastPassBefore) {
      const lp = lastPassBefore;
      const buildChanged = !!(lp.buildId && ff.buildId && lp.buildId !== ff.buildId);
      const codeKnown = !!(lp.projectCommit && ff.projectCommit);
      const codeChanged = codeKnown && lp.projectCommit !== ff.projectCommit;
      const startTxt = ff.runId === cur.runId ? 'fails now' : `started failing in run ${ff.runId} (build ${bl(ff)})`;
      if (codeChanged) { testChanged = true; testChangedWhy = `The test code changed between the last pass (run ${lp.runId}, commit ${shortC(lp.projectCommit)}) and the first failure (run ${ff.runId}, commit ${shortC(ff.projectCommit)}${ff.projectDirty ? ' + uncommitted changes' : ''}).`; }
      else if (codeKnown && ff.projectDirty && !lp.projectDirty) { testChanged = true; testChangedWhy = `The first failure (run ${ff.runId}) ran with uncommitted changes to the test code (commit ${shortC(ff.projectCommit)} + local edits); the last pass (run ${lp.runId}) did not.`; }
      if (buildChanged && !testChanged) { regression = true; regressionWhy = `Passed on build ${bl(lp)} (run ${lp.runId}) and ${startTxt}${codeKnown ? ` with the same test code (${shortC(ff.projectCommit)})` : ''}: the app change between build ${bl(lp)} and ${bl(ff)} is the likely cause.`; }
    }
    const iss = cur.sig ? ctx.issueOf(cur.sig) : {};
    let category = cur.category, categoryWhy = cur.categoryWhy, categoryBy = 'rule';
    if (problem && category === 'review') {
      if (regression) { category = 'product'; categoryWhy = `When this failure started, the app build changed and the test code did not (details under Status), so the app is the likely cause.`; }
      else if (testChanged) { category = 'test'; categoryWhy = testChangedWhy + ' The failure started after that change, so the test is the likely cause.'; }
    }
    if (problem && iss.category) { category = iss.category; categoryWhy = `Set by a person${iss.categoryNote ? ': ' + iss.categoryNote : ''} (rule said: ${CATS[cur.category] || '—'}).`; categoryBy = 'person'; }
    const q = ctx.quarantineOf(T);
    const qActive = !!(q && (!q.until || q.until >= ctx.today()));
    const qExpired = !!(q && q.until && q.until < ctx.today());
    const known = !!(cur.sig && iss.known);
    let st = 'PASS';
    if (problem) st = known ? 'KNOWN' : qActive ? 'QUARANTINED' : flaky && !cur.crash ? 'FLAKY' : regression ? 'REGRESSION' : isNew ? 'NEW' : 'RECURRING';
    else if (cur.status === 'warning') st = 'WARNING';
    else if (cur.status === 'skipped') st = 'SKIPPED';
    const streak = sinceRun ? older.findIndex((x) => x.runId === sinceRun) + 1 : 0;
    tests.push({ T, cur, prev, st, isNew: isNew && !flaky && !known && !qActive, flaky, flakyWhy, fails, n: last10.length, sinceRun, streak, problem, crash: !!cur.crash, module: T.module, severity: cur.severity || T.severity,
      lastPass, regression: regression && !qActive && !known, regressionWhy, testChanged, testChangedWhy, category: problem ? category : null, categoryWhy: problem ? categoryWhy : null, categoryBy, quarantine: q, qActive, qExpired });
  }
  const s = run.summary;
  return {
    run, tests,
    kpi: {
      total: s.total, passRate: pct(s.total - s.failed - (s.skipped || 0), s.total - (s.skipped || 0)), failed: s.failed, skipped: s.skipped || 0,
      newF: tests.filter((t) => t.isNew).length, flaky: tests.filter((t) => t.flaky).length,
      regressions: tests.filter((t) => t.st === 'REGRESSION').length, quarantined: tests.filter((t) => t.st === 'QUARANTINED').length,
      crash: tests.filter((t) => t.crash).length, warnings: s.withWarnings, apiFailed: (run.api || {}).failed || 0,
    },
  };
}
