// list_failures: the failed tests of a run, ONE LINE each (summary first; get_failure_details has the rest).
// This file is the example to copy when adding a tool: schema + description, a service call, Markdown + data out.
import { z } from 'zod';
import { READ_ONLY } from '../shared/types.mjs';
import { runId, suite, limit, offset } from '../shared/schemas.mjs';
import { pickRun, suiteOf } from '../services/runs.mjs';
import { failuresOf } from '../services/failures.mjs';
import { failureLine } from '../format/run.mjs';
import { pageNote } from '../format/md.mjs';

/** @type {import('../shared/types.mjs').ToolDef} */
export default {
  name: 'list_failures',
  title: 'Failures of a run',
  // written for the AI: when to use it, what comes back, what to call next
  description: 'Failed tests of a run (default: the latest), one line each: test id, priority, NEW/RECURRING/FLAKY/REGRESSION, category, the error, the failed step, tests with the same cause. Use get_failure_details for one test in full.',
  input: {
    runId,
    suite,
    includeWarnings: z.boolean().default(false).describe('Also list passed tests that have warnings'),
    limit: limit(20),
    offset,
  },
  annotations: READ_ONLY,

  async run({ runId: id, suite: name, includeWarnings, limit: max, offset: from }, ctx) {
    await ctx.reports.freshen();
    const index = ctx.reports.index();
    const run = pickRun(index, { runId: id, suite: name }); // throws a ToolError listing the kept runs if not found
    const all = failuresOf(index, run, ctx.reports.run(run.id), { includeWarnings });
    const page = all.slice(from, from + max);
    const failed = all.filter((f) => f.status === 'failed').length;

    const data = { run: run.id, suite: suiteOf(run), failed, total: all.length, offset: from, failures: page };
    const text = all.length
      ? `## ${failed} failed test(s) in ${data.suite} run ${run.id}\n\n${page.map((f) => `- ${failureLine(f)}`).join('\n')}${pageNote(page.length, all.length, from)}`
      : `## ${data.suite} run ${run.id}: no failures ✔`;
    return { text, data };
  },
};
