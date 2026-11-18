// A unit test run as Markdown, shared by get_unit_test_results and run_unit_tests.
import { block, mark, secs, pageNote } from './md.mjs';

export function mdUnit(u, { heading = true } = {}) {
  const s = u.summary;
  const verdict = u.status === 'failed' ? '✖ FAILED' : u.status === 'coverage' ? '≈ COVERAGE LOW' : '✔ PASS';
  const cov = u.coverage
    ? `**Coverage:** ${u.coverage.lines?.toFixed(1)}% of lines (limit ${u.coverage.threshold ?? '—'}%)${u.coverage.belowThreshold ? ' **below the limit**' : ''} · lowest: ${u.coverage.lowestFiles.slice(0, 3).join(', ')}`
    : 'Coverage: not measured (npm run test:unit:coverage).';
  const out = [
    heading ? `## Unit tests ${u.run}: ${verdict}` : null,
    `**${s.passed} passed · ${s.failed} failed · ${s.skipped} skipped** of ${s.total} in ${secs(s.durationMs)} · \`${u.command}\`${u.previousSameCommand ? ` · previous run of this command: ${u.previousSameCommand.status}, ${u.previousSameCommand.failed} failed` : ''}`,
    cov,
  ].filter(Boolean);
  if (!u.tests.length) out.push(u.matching ? '' : 'No failed tests.');
  for (const t of u.tests) {
    out.push(`### ${mark(t.status)}: ${t.test}`);
    if (t.error) {
      out.push(`${t.error.kind}${t.error.where ? ` at \`${t.error.where}\`` : ''}`, block(t.error.message));
      if (t.error.expected !== undefined) out.push(`Expected:\n${block(t.error.expected)}\nActual:\n${block(t.error.actual)}`);
    }
    if (t.messages.length) out.push(`Messages from the test:\n${block(t.messages.join('\n'))}`);
  }
  return out.join('\n\n') + pageNote(u.tests.length, u.matching, u.offset);
}
