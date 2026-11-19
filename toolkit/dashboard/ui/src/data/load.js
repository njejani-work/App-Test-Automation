// The ONLY code that touches the data globals. The page opens from disk (file://), where fetch() of local files is not
// allowed, so the builder writes data/*.js files that set window.DASH_*; they are loaded with <script> tags.
//   data/index.js       DASH_INDEX   runs, test history, triage settings
//   data/runs/<id>.js   DASH_RUNS    one run in full, loaded when it is opened
//   data/latest.js      DASH_LATEST  tiny: polled every 3 s while live refresh is on
//   data/unit.js        DASH_UNIT    unit test runs
//   data/codes.js       DASH_CODES   one-line meanings of HTTP / exit / Android codes
//   data/apps.js        DASH_APPS    the apps for the App switcher

/** Load one data file; resolves true / false (a missing file is normal: e.g. no unit runs yet). */
export function loadScript(src) {
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = src + (src.includes('?') ? '&' : '?') + 't=' + Date.now(); // never a cached copy: the data changes during a run
    s.onload = () => { s.remove(); resolve(true); };
    s.onerror = () => { s.remove(); resolve(false); };
    document.head.appendChild(s);
  });
}

const EMPTY_INDEX = { runs: [], tests: [], triage: {} };

/** Runs, tests and triage settings (and the code meanings, once). */
export async function loadIndex() {
  if (!window.DASH_CODES) await loadScript('data/codes.js');
  await loadScript('data/index.js');
  return window.DASH_INDEX || EMPTY_INDEX;
}

/** One run in full (`fresh`: load again, e.g. while it is running). */
export async function loadRun(id, fresh = false) {
  window.DASH_RUNS = window.DASH_RUNS || {};
  if (fresh || !window.DASH_RUNS[id]) await loadScript('data/runs/' + encodeURIComponent(id) + '.js');
  return window.DASH_RUNS[id] || null;
}

/** The apps for the App switcher, or null with fewer than two apps. */
export async function loadApps() {
  await loadScript('data/apps.js');
  const A = window.DASH_APPS;
  return A && A.current && Array.isArray(A.apps) && A.apps.length >= 2 ? A : null;
}

/** The unit test runs (always loaded fresh). */
export async function loadUnit() {
  window.DASH_UNIT = null;
  await loadScript('data/unit.js');
  return window.DASH_UNIT || null;
}

/** When the data was last written ({ generatedAt, runId, status }), or null. */
export async function loadLatest() {
  window.DASH_LATEST = null;
  await loadScript('data/latest.js');
  return window.DASH_LATEST || null;
}

/** Code meanings: codes(): the DASH_CODES object or null. */
export const codes = () => window.DASH_CODES || null;
