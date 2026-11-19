// Unit test runs (reports/unit/<id>.json, written by the unit-report reporter).
import { fail } from '../shared/types.mjs';

export function pickUnitRun(runs, runId) {
  if (!runs.length) fail('No unit test runs yet: run npm run test:unit (or the run_unit_tests tool).');
  const r = runId ? runs.find((x) => x.id === runId) : runs[0];
  if (!r) fail(`Unit run "${runId}" not found. Kept: ${runs.slice(0, 12).map((x) => x.id).join(', ')}`);
  return r;
}

const cut = (s, max = 1500) => (s === undefined ? undefined : String(s).length > max ? `${String(s).slice(0, max)}… (${String(s).length - max} more characters)` : String(s));

/** A unit run: counts, coverage, and its failures (or every test), at most `limit` tests from `offset`. */
export function unitOf(runs, r, { onlyFailures = true, limit = 20, offset = 0 } = {}) {
  const prev = runs.slice(runs.indexOf(r) + 1).find((x) => x.command === r.command);
  const all = r.tests.filter((t) => !onlyFailures || t.status === 'failed' || t.status === 'cancelled');
  return {
    run: r.id, command: r.command, status: r.status, summary: r.summary,
    previousSameCommand: prev ? { run: prev.id, status: prev.status, failed: prev.summary.failed } : null,
    coverage: r.coverage ? { ...r.coverage.totals, threshold: r.coverage.threshold ?? null, belowThreshold: !!r.coverage.belowThreshold, lowestFiles: r.coverage.files.slice(0, 5).map((f) => `${f.file}: ${f.lines.toFixed(1)}%`) } : null,
    matching: all.length, offset,
    tests: all.slice(offset, offset + limit).map((t) => ({
      test: [t.file, ...t.suite, t.name].join(' › '), status: t.status, durationMs: t.durationMs,
      error: t.error ? { kind: t.error.kind, message: cut(t.error.message), expected: cut(t.error.expected), actual: cut(t.error.actual), where: t.error.location ? `${t.error.location.file}:${t.error.location.line}` : null } : null,
      messages: (t.messages || []).slice(0, 10),
    })),
  };
}
