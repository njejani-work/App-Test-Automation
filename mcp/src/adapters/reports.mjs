// Reads what the dashboard recorded (reports/): the index of runs, one run in full, the unit runs.
// Parsed files are cached by path + modification time + size: a repeated question costs one stat() per file, and a
// file is parsed again only when it changed. At most MAX_CACHED files are kept in memory.
import fs from 'node:fs';
import path from 'node:path';
import { builder } from './project.mjs';

const MAX_CACHED = 25;
const UNIT_FILE = /^\d{8}-\d{6}\.json$/;

export function createReportStore(reportsDir, log) {
  const file = (...p) => path.join(reportsDir, ...p);
  const mtime = (f) => { try { return fs.statSync(f).mtimeMs; } catch { return 0; } };
  const cache = new Map();

  function cached(f, parse) {
    let st;
    try { st = fs.statSync(f); } catch { cache.delete(f); return null; }
    const hit = cache.get(f);
    if (hit && hit.mtime === st.mtimeMs && hit.size === st.size) return hit.value;
    const value = parse(fs.readFileSync(f, 'utf8'));
    cache.delete(f); cache.set(f, { mtime: st.mtimeMs, size: st.size, value });
    if (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value); // drop the oldest
    return value;
  }
  // the dashboard's data files are small scripts: window.DASH_INDEX = {...}
  const script = (f, key) => cached(f, (src) => { const w = {}; new Function('window', src)(w); return w[key]; });

  let builtAt = 0;
  return {
    reportsDir,
    file,
    /** Rebuild the dashboard data when a run (device or unit) is newer than it, so we and the dashboard agree. */
    async freshen() {
      const newest = Math.max(0, ...['runs', 'unit'].flatMap((d) => { try { return fs.readdirSync(file(d)).map((x) => mtime(file(d, x))); } catch { return []; } }));
      const data = Math.min(mtime(file('data', 'index.js')) || 0, mtime(file('data', 'unit.js')) || Infinity);
      if (newest > data && newest > builtAt && fs.existsSync(file('runs'))) {
        log.debug('newer results found: rebuilding the dashboard data');
        (await builder()).buildIndex(reportsDir, {});
        builtAt = Date.now();
      }
    },
    index: () => script(file('data', 'index.js'), 'DASH_INDEX'),
    run: (id) => (script(file('data', 'runs', `${id}.js`), 'DASH_RUNS') || {})[id] || null,
    unitRuns() {
      let names = [];
      try { names = fs.readdirSync(file('unit')).filter((f) => UNIT_FILE.test(f)).sort().reverse(); } catch { return []; }
      return names.map((n) => cached(file('unit', n), JSON.parse)).filter(Boolean);
    },
    /** A recorded file (screenshot, video, log) as an absolute path: paths, never contents. */
    abs: (rel) => (rel ? file(rel) : null),
  };
}
