// Which runs the filters select, and a run's state. Moved from the old page; the filter state is now a parameter.
import { devName, buildKey } from './format.js';

export const platKey = (r) => devName(r.device);
export const suiteKey = (r) => (r.suites || []).join('+') || 'all';

/** The runs matching the filters in `S` (app, build, env, platform, suite), newest first; `except` ignores one filter. */
export function runsFiltered(runs, S, except) {
  return runs.filter((r) =>
    (except === 'app' || !S.app || r.apk.application_id === S.app) &&
    (except === 'build' || !S.build || buildKey(r) === S.build) &&
    (except === 'env' || !S.env || r.env === S.env) &&
    (except === 'platform' || !S.platform || platKey(r) === S.platform) &&
    (except === 'suite' || !S.suite || suiteKey(r) === S.suite));
}

/** "running" for 15 minutes without any activity = "incomplete" (the run was stopped without closing its record) */
export const runState = (r, now = Date.now()) => (r.status === 'running' && r.lastActivity && now - Date.parse(r.lastActivity) > 15 * 60000 ? 'incomplete' : r.status);
