// Labels and small formatters. Moved unchanged from the old page (template/index.legacy.html, 19 Nov 2026).

export const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);
export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—');
export const dur = (ms) => { if (ms == null) return '—'; if (ms < 1000) return Math.round(ms) + ' ms'; const s = Math.round(ms / 1000); return s < 60 ? (ms / 1000).toFixed(1) + ' s' : Math.floor(s / 60) + 'm ' + String(s % 60).padStart(2, '0') + 's'; };
export const devName = (d) => (d ? [d.deviceModel || d.deviceName, d.platformVersion ? 'Android ' + d.platformVersion : ''].filter(Boolean).join(' · ') : 'unknown device');
export const buildLabel = (a) => (a && a.build_number ? '#' + a.build_number : a && a.build_id ? a.build_id.slice(0, 15) : 'build not recorded');
/** Short label for chart axes: the build, or the run's date for runs without one */
export const axisLabel = (r) => (r.apk && (r.apk.build_number || r.apk.build_id) ? buildLabel(r.apk) : `${r.id.slice(6, 8)}/${r.id.slice(4, 6)} ${r.id.slice(9, 11)}:${r.id.slice(11, 13)}`);
export const buildKey = (r) => (r.apk.build_number ? 'n' + r.apk.build_number : r.apk.build_id || '?');
export const verLabel = (a) => (a && a.version_name ? 'v' + a.version_name : 'version not recorded');
export const shortC = (c) => (c ? String(c).slice(0, 7) : '?');
/** A test result's build: #number, or the start of the build id */
export const bl = (x) => (x && x.buildNumber ? '#' + x.buildNumber : x && x.buildId ? x.buildId.slice(0, 15) : 'not recorded');

export const SEV_ORDER = { P0: 0, P1: 1, P2: 2, P3: 3 };
export const ST_ORDER = { CRASH: 0, REGRESSION: 1, NEW: 2, RECURRING: 3, FLAKY: 4, QUARANTINED: 5, KNOWN: 6, WARNING: 7, RUNNING: 8, PASS: 9 };
export const CATS = { product: 'Product bug', test: 'Test bug', environment: 'Environment', infrastructure: 'Infrastructure', review: 'Needs review' };
