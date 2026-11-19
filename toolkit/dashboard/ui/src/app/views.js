// The views, in sidebar order. `step` = the redesign step that builds it (until then it shows a placeholder).
import { LayoutDashboard, Siren, ChartPie, Gauge, Smartphone, History, ArrowLeftRight, GitCompareArrows, FlaskConical } from 'lucide-react';

export const VIEW_LIST = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard, step: 3, about: 'Verdict, numbers, what to act on first, trend' },
  { key: 'triage', label: 'Triage', icon: Siren, step: 4, about: 'One row per root cause; the test details' },
  { key: 'coverage', label: 'Coverage', icon: ChartPie, step: 5, about: 'Results per app module; modules without tests' },
  { key: 'performance', label: 'Performance', icon: Gauge, step: 5, about: 'App start, memory, frames, slow tests, API times vs budgets' },
  { key: 'devices', label: 'Device matrix', icon: Smartphone, step: 5, about: 'Pass rate per Android version and device' },
  { key: 'history', label: 'History', icon: History, step: 5, about: 'Every test across runs, pass rate, flakiness' },
  { key: 'api', label: 'API calls', icon: ArrowLeftRight, step: 5, about: 'Every call, by screen and by API, status codes explained' },
  { key: 'compare', label: 'Compare', icon: GitCompareArrows, step: 5, about: 'Any two runs side by side' },
  { key: 'unit', label: 'Unit tests', icon: FlaskConical, step: 5, about: 'Unit test runs, failures with expected vs actual, coverage' },
];

export const viewOf = (key) => VIEW_LIST.find((v) => v.key === key) || VIEW_LIST[0];

/** The count shown next to a view: things to act on (0 = no badge). */
export function viewCount(key, sel, groups) {
  if (!sel || !sel.A) return 0;
  if (key === 'triage') return groups.filter((g) => g.st !== 'KNOWN' && g.st !== 'QUARANTINED').length;
  if (key === 'api') return sel.A.kpi.apiFailed || 0;
  if (key === 'performance') return (sel.current.budget && sel.current.budget.warnings.length) || 0;
  return 0;
}
