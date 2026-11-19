// list_runs: the recorded device runs, newest first, one table row each.
import { READ_ONLY } from '../shared/types.mjs';
import { suite, limit, offset } from '../shared/schemas.mjs';
import { appOf, deviceOf, suiteOf, verdictOf } from '../services/runs.mjs';
import { table, when, mark, pageNote } from '../format/md.mjs';

export default {
  name: 'list_runs',
  title: 'List test runs',
  description: 'The recorded device test runs, newest first: id, suite, verdict, counts, app version, device. Use the id with the other tools.',
  input: { suite, limit: limit(10, 30), offset },
  annotations: READ_ONLY,

  async run({ suite: name, limit: max, offset: from }, ctx) {
    await ctx.reports.freshen();
    const index = ctx.reports.index();
    const all = (index?.runs || []).filter((r) => !name || suiteOf(r).includes(name));
    const runs = all.slice(from, from + max).map((r) => ({
      id: r.id, suite: suiteOf(r), startedAt: r.startedAt, verdict: verdictOf(r, index).verdict, status: r.summary.status,
      total: r.summary.total, passed: r.summary.passed, failed: r.summary.failed, skipped: r.summary.skipped, app: appOf(r), device: deviceOf(r),
    }));
    const text = runs.length
      ? `## Test runs (newest first)\n\n${table(['Run', 'Suite', 'Verdict', 'Passed', 'Failed', 'App', 'Device', 'Started'], runs.map((r) => [r.id, r.suite, mark(r.verdict), `${r.passed}/${r.total}`, r.failed, r.app.version, r.device, when(r.startedAt)]))}${pageNote(runs.length, all.length, from)}`
      : 'No recorded runs match. Run npm run test:smoke (or another suite) first.';
    return { text, data: { total: all.length, offset: from, runs } };
  },
};
