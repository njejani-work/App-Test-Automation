// PASS / UNSTABLE / BLOCKED / NONE with the reason, from analyse(). Moved unchanged from the old page.
import { runState } from './runs.js';

/** Blocked: a P0 failure, a crash, or a P0/P1 regression (not flaky, known or quarantined). Unstable: other failures or flaky. */
export function verdictOf(A) {
  if (!A) return { v: 'NONE', why: 'No runs match the filters.' };
  const r = A.run;
  if (r.setupError) return { v: 'BLOCKED', why: 'The run could not start: ' + r.setupError };
  const open = A.tests.filter((t) => t.problem && t.st !== 'KNOWN' && t.st !== 'QUARANTINED');
  const expired = A.tests.filter((t) => t.problem && t.qExpired);
  const blockers = open.filter((t) => t.st !== 'FLAKY' && (t.crash || t.severity === 'P0' || (t.st === 'REGRESSION' && t.severity !== 'P2' && t.severity !== 'P3')));
  const q = A.tests.filter((t) => t.st === 'QUARANTINED').length;
  const bw = (r.budget && r.budget.warnings.length) || 0;
  const tail = [q ? `${q} quarantined failure${q > 1 ? 's' : ''} not counted` : '', expired.length ? `quarantine expired for ${expired.map((t) => t.T.id || t.T.name).join(', ')}` : '', bw ? `${bw} performance / API budget warning${bw > 1 ? 's' : ''} (Performance tab)` : ''].filter(Boolean);
  const plural = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;
  if (blockers.length) {
    const crashes = blockers.filter((t) => t.crash).length, regs = blockers.filter((t) => !t.crash && t.st === 'REGRESSION').length, p0 = blockers.length - crashes - regs;
    return { v: 'BLOCKED', why: [p0 ? plural(p0, 'P0 failure') : '', regs ? plural(regs, 'regression') : '', crashes ? plural(crashes, 'crash').replace('crashs', 'crashes') : '', ...tail].filter(Boolean).join(' · ') };
  }
  if (open.length || A.kpi.flaky) {
    const fl = open.filter((t) => t.st === 'FLAKY').length;
    return { v: 'UNSTABLE', why: [open.length - fl ? plural(open.length - fl, 'non-blocking failure') : '', A.kpi.flaky ? A.kpi.flaky + ' flaky' : '', ...tail].filter(Boolean).join(' · ') };
  }
  if (!A.kpi.total) return { v: 'NONE', why: runState(r) === 'running' ? 'Waiting for the first test…' : 'No tests recorded.' };
  return { v: 'PASS', why: [A.kpi.warnings ? A.kpi.warnings + ' test(s) with warnings' : 'All tests passed', ...tail].join(' · ') };
}
