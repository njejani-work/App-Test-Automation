// compare_runs: two runs side by side (default: the latest and the previous run of the same suite).
import { z } from 'zod';
import { READ_ONLY, fail } from '../shared/types.mjs';
import { pickRun, previousOf, compareRuns } from '../services/runs.mjs';
import { table, list, mark, names } from '../format/md.mjs';

const id = z.string().regex(/^\d{8}-\d{6}$/).optional();

export default {
  name: 'compare_runs',
  title: 'Compare two runs',
  description: 'Two device runs side by side: verdicts, counts and time, newly failing / fixed / still failing tests, tests added or removed, and whether the app build or the test code changed. Default: the latest run vs the previous run of the same suite.',
  input: {
    newer: id.describe('Run id; default: the latest'),
    older: id.describe('Run id to compare with; default: the previous run of the same suite'),
  },
  annotations: READ_ONLY,

  async run({ newer, older }, ctx) {
    await ctx.reports.freshen();
    const index = ctx.reports.index();
    const a = pickRun(index, { runId: newer });
    const b = older ? pickRun(index, { runId: older }) : previousOf(index, a);
    if (!b) fail(`Run ${a.id} has no earlier run of the same suite to compare with; give "older" (see list_runs).`);
    if (a === b) fail('Pick two different runs.');
    const c = compareRuns(index, a, b);
    return { text: toMarkdown(c), data: c };
  },
};

function toMarkdown(c) {
  const { newer: A, older: B } = c;
  const row = (label, f) => [label, f(A), f(B)];
  return [
    `## Run ${A.run} vs ${B.run}${c.sameSuite ? ` (${A.suite})` : ` (${A.suite} vs ${B.suite}: different suites)`}`,
    table(['', `Newer ${A.run}`, `Older ${B.run}`], [
      row('Verdict', (r) => mark(r.verdict)), row('Passed', (r) => `${r.passed}/${r.total}`), row('Failed', (r) => r.failed),
      row('Crashes', (r) => r.crashes), row('Time', (r) => `${r.durationMin} min`), row('App build', (r) => r.app), row('Test code', (r) => r.testCode),
    ]),
    list([
      `**Newly failing:** ${names(c.newlyFailing)}`,
      `**Fixed:** ${names(c.fixed)}`,
      `**Still failing:** ${names(c.stillFailing)}`,
      c.testsAdded.length || c.testsRemoved.length ? `**Tests added:** ${names(c.testsAdded)} · **removed:** ${names(c.testsRemoved)}` : null,
      `**What changed:** ${[c.appChanged && 'the app build', c.testCodeChanged && 'the test code'].filter(Boolean).join(' and ') || 'neither the app build nor the test code'}`,
    ]),
  ].join('\n\n');
}
