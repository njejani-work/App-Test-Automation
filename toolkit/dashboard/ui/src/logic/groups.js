// One row per root cause: problem tests grouped by their error signature. Moved unchanged from the old page; triage
// settings come in as `ctx` (triage-settings.js).
import { SEV_ORDER } from './format.js';

// Group problem tests by error signature: one row per root cause.
export function groupRows(A, ctx) {
  const groups = new Map();
  for (const t of A.tests.filter((x) => x.problem)) {
    const key = t.cur.sig || 't:' + t.T.name;
    if (!groups.has(key)) groups.set(key, { key, sig: t.cur.sig, sigText: t.cur.sigText, tests: [] });
    groups.get(key).tests.push(t);
  }
  return [...groups.values()].map((g) => {
    const iss = g.sig ? ctx.issueOf(g.sig) : {};
    const sts = g.tests.map((t) => t.st);
    const st = g.tests.some((t) => t.crash) && !iss.known ? 'CRASH' : iss.known ? 'KNOWN' : sts.every((x) => x === 'QUARANTINED') ? 'QUARANTINED' : sts.includes('REGRESSION') ? 'REGRESSION' : sts.includes('NEW') ? 'NEW' : sts.every((x) => x === 'FLAKY') ? 'FLAKY' : 'RECURRING';
    const catT = g.tests.find((t) => t.categoryBy === 'person') || g.tests[0];
    const severity = g.tests.map((t) => t.severity).sort((a, b) => SEV_ORDER[a] - SEV_ORDER[b])[0];
    const modules = [...new Set(g.tests.map((t) => t.module))];
    const sinceIds = g.tests.map((t) => t.sinceRun).filter(Boolean).sort();
    const flakyT = g.tests.find((t) => t.flaky);
    return Object.assign(g, { st, severity, modules, sinceRun: sinceIds[0], category: catT.category, categoryWhy: catT.categoryWhy, owner: iss.owner || '', ownerFromModule: iss.owner ? '' : ctx.moduleOwner(modules[0]), ticket: iss.ticket || '', isNew: sts.includes('NEW'), flakyText: flakyT ? flakyT.fails + '/' + flakyT.n : '' });
  });
}
