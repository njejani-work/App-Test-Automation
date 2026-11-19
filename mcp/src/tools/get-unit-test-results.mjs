// get_unit_test_results: a recorded unit test run, failures first with expected vs actual.
import { z } from 'zod';
import { READ_ONLY } from '../shared/types.mjs';
import { limit, offset } from '../shared/schemas.mjs';
import { pickUnitRun, unitOf } from '../services/unit.mjs';
import { mdUnit } from '../format/unit.mjs';

export default {
  name: 'get_unit_test_results',
  title: 'Unit test results',
  description: 'A recorded unit test run (npm run test:unit; the project\'s own code, no device), default the latest: counts, coverage, and each failure with its kind, message, expected vs actual, where, and the messages the test attached.',
  input: {
    runId: z.string().regex(/^\d{8}-\d{6}$/).optional().describe('Unit run id; default: the latest'),
    onlyFailures: z.boolean().default(true),
    limit: limit(20),
    offset,
  },
  annotations: READ_ONLY,

  async run({ runId, onlyFailures, limit: max, offset: from }, ctx) {
    await ctx.reports.freshen();
    const runs = ctx.reports.unitRuns();
    const data = unitOf(runs, pickUnitRun(runs, runId), { onlyFailures, limit: max, offset: from });
    return { text: mdUnit(data), data };
  },
};
