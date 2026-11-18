// The run summary and the one-line failure list, shared by get_latest_run, list_failures and check_test_run.
import { table, list, when, mark, names } from './md.mjs';

export function mdSummary(s) {
  const c = s.counts;
  const cmp = s.comparedWith
    ? `vs run ${s.comparedWith.run}: newly failing **${names(s.comparedWith.newlyFailing)}** · fixed ${names(s.comparedWith.fixed)} · still failing ${names(s.comparedWith.stillFailing)}`
    : 'no earlier run of this suite';
  return [
    `## ${s.suite} run ${s.run}: ${mark(s.verdict)}`,
    `**Why:** ${s.why}`,
    table(['Tests', 'Passed', 'Failed', 'Skipped', 'Warnings', 'Crashes'], [[c.total, c.passed, c.failed, c.skipped, c.withWarnings, c.crashes]]),
    list([
      `**Started:** ${when(s.startedAt)} · ${s.durationMin} min`,
      `**App:** ${s.app.version ? `${s.app.version} (build ${s.app.build})` : 'not recorded'} · **Device:** ${s.device || 'not recorded'}`,
      `**Changes:** ${cmp}`,
      c.unexplainedAppErrors || c.budgetWarnings ? `**Also:** ${c.unexplainedAppErrors || 0} unexplained app log errors · ${c.budgetWarnings || 0} performance warnings` : null,
      s.layoutChecks ? `**Layout checks:** ${s.layoutChecks.total} · ${s.layoutChecks.failed} failed · ${s.layoutChecks.warnings} warnings` : null,
      `**API calls:** ${typeof s.apiCalls === 'string' ? s.apiCalls : `${s.apiCalls?.calls ?? 0} calls, ${s.apiCalls?.failed ?? 0} failed`}`,
      s.testCode ? `**Test code:** ${s.testCode.branch || '?'} @ ${s.testCode.commit || '?'}${s.testCode.uncommittedChanges ? ' (uncommitted changes)' : ''}` : null,
      `**Dashboard:** ${s.dashboard}`,
    ]),
  ].join('\n\n');
}

/** One line per failure: what failed, where, the likely cause and the history tag. */
export const failureLine = (f) => [
  `${f.crash ? '💥 CRASH' : f.status === 'failed' ? '✖' : '⚠'} **${f.test}**${f.severity ? ` [${f.severity}]` : ''}`,
  f.history?.tag,
  f.category,
  f.error ? `\`${f.error.slice(0, 160)}\`` : null,
  f.failedStep ? `at "${f.failedStep}"` : null,
  f.sameCauseAs.length ? `same cause as ${f.sameCauseAs.join(', ')}` : null,
].filter(Boolean).join(' · ');
