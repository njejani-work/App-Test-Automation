// Ordering of root causes. compareRows: the old page's triage-table order (moved unchanged). actNow: what to fix first
// on release day: crashes, then P0, then regressions, then new failures, then the rest (in the table's order).
import { SEV_ORDER, ST_ORDER } from './format.js';

/** The old page's row order: severity, new first, status, module, test name. Takes rows { g }. */
export const compareRows = (a, b) => SEV_ORDER[a.g.severity] - SEV_ORDER[b.g.severity] || (b.g.isNew - a.g.isNew) || ST_ORDER[a.g.st] - ST_ORDER[b.g.st] || a.g.modules[0].localeCompare(b.g.modules[0]) || a.g.tests[0].T.name.localeCompare(b.g.tests[0].T.name, undefined, { numeric: true });

const crashed = (g) => g.st === 'CRASH' || g.tests.some((t) => t.crash);
const rank = (g) => (crashed(g) ? 0 : g.severity === 'P0' ? 1 : g.st === 'REGRESSION' ? 2 : g.isNew ? 3 : 4);

/** Open root causes (not known, not quarantined), most urgent first. */
export function actNow(groups) {
  return groups
    .filter((g) => g.st !== 'KNOWN' && g.st !== 'QUARANTINED')
    .map((g) => ({ g }))
    .sort((a, b) => rank(a.g) - rank(b.g) || compareRows(a, b))
    .map((x) => x.g);
}
