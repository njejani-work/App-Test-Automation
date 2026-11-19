// Reads a device run while it is being recorded: reports/.current-run, runs/<id>/meta.json and the live run.log.
import fs from 'node:fs';
import path from 'node:path';

const json = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
export const currentRunId = (reportsDir) => { try { return fs.readFileSync(path.join(reportsDir, '.current-run'), 'utf8').trim(); } catch { return null; } };
export const runMeta = (reportsDir, id) => json(path.join(reportsDir, 'runs', id, 'meta.json'));

/** Mark a run that was stopped or timed out as finished, so it does not look unfinished (or block new runs). */
export function closeRun(reportsDir, id, exitCode, reason) {
  const f = path.join(reportsDir, 'runs', id, 'meta.json');
  const meta = json(f);
  if (meta && !meta.finishedAt) fs.writeFileSync(f, JSON.stringify({ ...meta, finishedAt: Date.now(), exitCode, interrupted: reason }, null, 1));
}

/** A device run started somewhere else (e.g. in a terminal) that is still being written. */
export function activeRunElsewhere(reportsDir, maxIdleMs = 15 * 60000) {
  const id = currentRunId(reportsDir);
  const meta = id && runMeta(reportsDir, id);
  if (!meta || meta.finishedAt) return null;
  const dir = path.join(reportsDir, 'runs', id);
  const last = Math.max(...['run.log', 'meta.json'].map((f) => { try { return fs.statSync(path.join(dir, f)).mtimeMs; } catch { return 0; } }));
  return Date.now() - last < maxIdleMs ? { runId: id, lastActivity: new Date(last).toISOString() } : null;
}

/** What the recorder's live log says so far: tests finished, passed / failed / skipped, the test running now. */
export function progressOf(reportsDir, id) {
  let lines;
  try { lines = fs.readFileSync(path.join(reportsDir, 'runs', id, 'run.log'), 'utf8').split(/\r?\n/).filter(Boolean); } catch { return null; }
  const clean = (l) => l.replace(/^\S+ \[[^\]]+\] /, '').slice(0, 200);
  const count = (re) => lines.filter((l) => re.test(l)).length;
  const results = lines.filter((l) => / [✔✖–] TEST /.test(l) || / ✖ HOOK /.test(l)); // a passed setup hook is not a test
  const lastStart = lines.findLast((l) => / ▶ TEST /.test(l));
  const lastResult = results[results.length - 1];
  return {
    finished: count(/ [✔✖–] TEST /), passed: count(/ ✔ TEST /), failed: count(/ ✖ TEST /), skipped: count(/ – TEST /),
    setupFailed: lines.filter((l) => / ✖ HOOK /.test(l)).map(clean),
    runningNow: lastStart && (!lastResult || lines.lastIndexOf(lastStart) > lines.lastIndexOf(lastResult)) ? clean(lastStart).replace(/^▶ TEST /, '') : null,
    lastTests: results.slice(-3).map(clean),
  };
}
