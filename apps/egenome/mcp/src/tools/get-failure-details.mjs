// get_failure_details: one test in full. Long parts (stack, app log, layout checks) are cut, with a note how to get more.
import { z } from 'zod';
import { READ_ONLY } from '../shared/types.mjs';
import { runId, testId } from '../shared/schemas.mjs';
import { pickRun } from '../services/runs.mjs';
import { findTest, detailsOf } from '../services/failures.mjs';
import { table, list, block, mark, secs } from '../format/md.mjs';

export default {
  name: 'get_failure_details',
  title: 'One test in full',
  description: 'Everything recorded for one test (usually a failure from list_failures): the error and where, each step with layout results, app log errors, API calls, history, and screenshot / video / log file paths.',
  input: {
    test: testId,
    runId,
    logLines: z.number().int().min(0).max(200).default(15).describe('App log error lines to include (newest)'),
    fullStack: z.boolean().default(false).describe('The whole stack trace instead of the first 8 lines'),
  },
  annotations: READ_ONLY,

  async run({ test, runId: id, logLines, fullStack }, ctx) {
    await ctx.reports.freshen();
    const index = ctx.reports.index();
    const run = pickRun(index, { runId: id });
    const full = ctx.reports.run(run.id);
    const d = detailsOf(index, run, findTest(full, run, test), ctx.reports.abs, { logLines, stackLines: fullStack ? 500 : 8 });
    return { text: toMarkdown(d, fullStack), data: d };
  },
};

function toMarkdown(d, full) {
  const out = [`## ${d.test}: ${mark(d.status)} (run ${d.run})`, list([
    `**Title:** ${d.title}`,
    `**Priority / module:** ${d.severity || '—'} · ${d.module || '—'} · **Time:** ${secs(d.durationMs)}`,
    d.category ? `**Category:** ${d.category}: ${d.categoryWhy || ''}` : null,
    d.history ? `**History:** ${d.history.status}` : null,
  ])];
  if (d.error) {
    out.push('### Error', block(d.error.message));
    if (d.error.where.length) out.push(`**Where:** ${d.error.where.join(' · ')}`);
    if (d.error.stack && (full || !d.error.where.length)) out.push(block(d.error.stack) + (d.error.stackLinesCut ? `\n_${d.error.stackLinesCut} more stack lines: call again with fullStack: true._` : ''));
    else if (d.error.stack) out.push('_Stack trace: call again with fullStack: true._');
  }
  const note = (s) => [s.error, s.layout ? `layout ${s.layout.spec}: ${s.layout.passed}/${s.layout.total}${s.layout.failed ? `, **${s.layout.failed} failed**` : ''}` : null, s.warnings.length ? `⚠ ${s.warnings.join(' · ')}` : null].filter(Boolean).join(' · ');
  out.push(`### Steps (${d.steps.length})`, table(['#', 'Result', 'Step', 'Time', 'Notes'], d.steps.map((s) => [s.n, mark(s.status), s.title, secs(s.durationMs), note(s)])));
  const checks = d.steps.flatMap((s) => s.layout?.failedChecks || []);
  const moreChecks = d.steps.reduce((n, s) => n + (s.layout?.moreFailedChecks || 0), 0);
  if (checks.length) out.push('### Failed layout checks', list(checks) + (moreChecks ? `\n- _…and ${moreChecks} more (dashboard → Steps)_` : ''));
  if (d.warnings.length) out.push('### Warnings', list(d.warnings.slice(0, 10)));
  out.push('### App log', !d.appLog ? 'Not recorded for this run.'
    : `${d.appLog.errorLines} error line(s), ${d.appLog.unexplained} not explained.${d.appLog.lastErrors.length ? `\n\n${block(d.appLog.lastErrors.join('\n'))}` : ''}${d.appLog.linesCut ? `\n_${d.appLog.linesCut} older lines left out: call again with a larger logLines._` : ''}`);
  out.push('### API calls', d.apiCalls.length
    ? table(['Call', 'Status', 'Time', 'Step', 'Problems'], d.apiCalls.map((c) => [`${c.method} ${c.url}`, c.status ?? 'no response', c.ms != null ? `${c.ms} ms` : '—', c.step, c.problems.join(' · ') || '—']))
    : d.apiNote);
  out.push('### Files', list([d.files.screenshot && `Screenshot: ${d.files.screenshot}`, d.files.video && `Video: ${d.files.video}`, d.files.appLog && `App log: ${d.files.appLog}`]) || 'None.');
  return out.join('\n\n');
}
