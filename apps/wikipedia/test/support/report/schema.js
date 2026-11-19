// Version of the result files written by the recorder and read by the dashboard builder.
// Documented in docs/RESULTS-FORMAT.md. Bump SCHEMA_VERSION when a field changes meaning or is removed
// (adding a new optional field does not need a bump), and teach upgradeRun/upgradeTest to read the old shape.
//
// History
//   0  (no schemaVersion field) runs recorded before 13 Nov 2026
//   1  schemaVersion added; run.json gets "details" (branch, commit, CI link, trigger, tool versions, time zone)
export const SCHEMA_VERSION = 1;

/** Bring a run.json written by any earlier version up to the current shape. Never throws. */
export function upgradeRun(run) {
  if (!run || typeof run !== 'object') return run;
  const out = { ...run };
  const v = Number(out.schemaVersion || 0);
  if (v < 1) {
    out.suites = Array.isArray(out.suites) ? out.suites : [];
    out.apk = out.apk || {};
    out.env = out.env || 'local';
    out.details = out.details || { trigger: 'unknown (recorded before run details existed)' };
  }
  out.recordedWith = v; // which format the file was written in (0 = before versioning)
  out.schemaVersion = SCHEMA_VERSION;
  return out;
}

/** Bring a tests/*.json record written by any earlier version up to the current shape. Never throws. */
export function upgradeTest(t) {
  if (!t || typeof t !== 'object') return t;
  const out = { ...t };
  const v = Number(out.schemaVersion || 0);
  if (v < 1) {
    out.warnings = Array.isArray(out.warnings) ? out.warnings : [];
    out.notes = Array.isArray(out.notes) ? out.notes : [];
    out.steps = Array.isArray(out.steps) ? out.steps : [];
    out.logcat = out.logcat || { errors: [], errorCount: 0, warnings: [], warningCount: 0 };
    out.state = out.state === 'failed' ? 'failed' : 'passed';
  }
  out.schemaVersion = SCHEMA_VERSION;
  return out;
}
