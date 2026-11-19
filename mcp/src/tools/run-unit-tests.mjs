// run_unit_tests: runs npm run test:unit (seconds, no phone) and answers with the result.
import { z } from 'zod';
import { ACTION, fail } from '../shared/types.mjs';
import { progressSender } from '../shared/progress.mjs';
import { unitOf } from '../services/unit.mjs';
import { mdUnit } from '../format/unit.mjs';
import { block, mark } from '../format/md.mjs';

export default {
  name: 'run_unit_tests',
  title: 'Run the unit tests',
  description: 'Runs the project\'s unit tests (about 5-10 s, no phone, changes nothing on the device) and returns the result: counts and each failure with expected vs actual. coverage: true also measures line coverage (fails under 75%).',
  input: { coverage: z.boolean().default(false) },
  annotations: ACTION,

  async run({ coverage }, ctx, extra) {
    const has = ctx.config.unitScripts;
    if (!has.unit) fail(`${ctx.config.app.name} has no unit tests (no "test:unit" script in apps/${ctx.config.app.id}/package.json). Its device suites: start_test_run.`);
    if (coverage && !has.coverage) fail(`${ctx.config.app.name} has no coverage run (no "test:unit:coverage" script). Run without coverage.`);
    if (ctx.jobs.running('unit')) fail('The unit tests are already running; wait for them to finish.');
    const progress = progressSender(extra);
    const started = Date.now();
    let done = 0;
    const job = ctx.jobs.startUnit(coverage, (line) => { if (/^\s*[✔✖]/.test(line) && ++done % 10 === 0) progress(`${done} unit tests done`); });
    await job.done;
    await ctx.reports.freshen();
    const runs = ctx.reports.unitRuns();
    const saved = runs.find((r) => Date.parse(r.startedAt) >= started - 2000);
    const tail = job.lines.slice(-15);
    const data = { status: job.status, exitCode: job.exitCode, seconds: Math.round((Date.now() - started) / 100) / 10, result: saved ? unitOf(runs, saved) : null, outputTail: job.status === 'passed' ? [] : tail };
    const head = `## Unit tests: ${mark(job.status)} in ${data.seconds} s (exit code ${job.exitCode ?? '—'})`;
    const text = saved
      ? [head, mdUnit(data.result, { heading: false }), data.outputTail.length ? `### Last output\n${block(tail.join('\n'))}` : ''].filter(Boolean).join('\n\n')
      : [head, 'No unit run was saved for the dashboard; the last lines of the output:', block(tail.join('\n'))].join('\n\n');
    return { text, data };
  },
};
