// get_latest_run: the verdict of the latest run (or the one given) with the reason and what changed.
import { READ_ONLY } from '../shared/types.mjs';
import { runId, suite } from '../shared/schemas.mjs';
import { pickRun, summaryOf } from '../services/runs.mjs';
import { mdSummary } from '../format/run.mjs';

export default {
  name: 'get_latest_run',
  title: 'Latest run and verdict',
  description: 'Start here. Verdict of the latest device run (or the runId / suite given): PASS / UNSTABLE / BLOCKED with the reason, counts, app build, device, and newly failing / fixed tests since the previous run of the same suite.',
  input: { runId, suite },
  annotations: READ_ONLY,

  async run({ runId: id, suite: name }, ctx) {
    await ctx.reports.freshen();
    const index = ctx.reports.index();
    const data = summaryOf(index, pickRun(index, { runId: id, suite: name }), ctx.reports.file);
    return { text: mdSummary(data), data };
  },
};
