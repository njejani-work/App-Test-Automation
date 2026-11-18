// check_test_run: progress of a run started here; when it has finished, its verdict and failures.
import { READ_ONLY, fail } from '../shared/types.mjs';
import { jobId } from '../shared/schemas.mjs';
import { activeRunElsewhere, progressOf } from '../adapters/run-log.mjs';
import { summaryOf } from '../services/runs.mjs';
import { failuresOf } from '../services/failures.mjs';
import { mdSummary, failureLine } from '../format/run.mjs';
import { list, block, mark } from '../format/md.mjs';

export default {
  name: 'check_test_run',
  title: 'Progress or result of a test run',
  description: 'For a run started with start_test_run (default: the newest): while running, tests finished / passed / failed and the test running now; when finished, the verdict and the failures, one line each.',
  input: { job: jobId },
  annotations: { ...READ_ONLY, idempotentHint: false },

  async run({ job: id }, ctx) {
    const job = id ? ctx.jobs.find(id) : ctx.jobs.newest('suite');
    if (!job) {
      const elsewhere = activeRunElsewhere(ctx.config.reportsDir);
      fail(id ? `No job "${id}" (jobs only live while this server runs). Known: ${ctx.jobs.ids().join(', ') || 'none'}.`
        : `No test run was started from here.${elsewhere ? ` A run started elsewhere is going: ${elsewhere.runId}.` : ''} For recorded runs use get_latest_run.`);
    }
    const runId = ctx.jobs.runIdOf(job);
    const progress = runId ? progressOf(ctx.config.reportsDir, runId) : null;
    const minutes = Math.round((Date.parse(job.endedAt || new Date().toISOString()) - job.startedMs) / 6000) / 10;
    const base = { job: job.id, status: job.status, suite: job.suite, minutes, run: runId, exitCode: job.exitCode, progress };

    if (job.status === 'running') {
      const p = progress;
      const text = [`## … ${job.suite} running for ${minutes} min (job \`${job.id}\`${runId ? `, run ${runId}` : ''})`, p
        ? list([`**Finished:** ${p.finished} test(s): ✔ ${p.passed} passed · ✖ ${p.failed} failed · – ${p.skipped} skipped`, p.runningNow && `**Running now:** ${p.runningNow}`, p.setupFailed.length && `**Setup failed:** ${p.setupFailed.join(' · ')}`])
        : 'Starting (installing the helper app on the device, opening the session)…'].join('\n\n');
      return { text, data: base };
    }

    await ctx.reports.freshen();
    const index = ctx.reports.index();
    const run = runId && index?.runs.find((r) => r.id === runId);
    const tail = job.status === 'passed' ? [] : job.lines.slice(-15);
    const out = [`## Job \`${job.id}\`: ${mark(job.status)} after ${minutes} min (exit code ${job.exitCode ?? '—'})`];
    let summary = null, failures = [];
    if (run) {
      summary = summaryOf(index, run, ctx.reports.file);
      failures = failuresOf(index, run, ctx.reports.run(run.id));
      out.push(mdSummary(summary), failures.length ? `### Failures\n${failures.map((f) => `- ${failureLine(f)}`).join('\n')}` : '');
    } else out.push('No recorded run was found for this job (it may have stopped before the first test).');
    const errors = job.status === 'passed' ? [] : job.errors.slice(-12);
    if (errors.length) out.push(`### Errors in the output\n${block(errors.join('\n'))}`);
    if (tail.length) out.push(`### Last output\n${block(tail.slice(errors.length ? -6 : -15).join('\n'))}`);
    return { text: out.filter(Boolean).join('\n\n'), data: { ...base, summary, failures, errorLines: errors, outputTail: tail } };
  },
};
