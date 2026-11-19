// The 8 numbers, each compared with the previous run of the same suite. Numbers roll to their new value (NumberFlow) when
// the run, a filter or the live data changes. Clicking one lists those tests (as on the old page).
import NumberFlow from '@number-flow/react';
import { MagicCard } from '@/components/magic/magic-card';
import { cn } from '@/lib/utils';

// [key, label, filter it opens, higher is better, unit, alert when > 0]
export const KPIS = [
  ['passRate', 'Pass rate', 'all', true, '%'], ['failed', 'Failed', 'failures', false], ['regressions', 'Regressions', 'regressions', false, '', true],
  ['newF', 'New failures', 'new', false, '', true], ['flaky', 'Flaky', 'flaky', false], ['crash', 'Crashes', 'crash', false, '', true],
  ['warnings', 'With warnings', 'warnings', false], ['apiFailed', 'API failures', 'api', false, '', true],
];

function Delta({ now, before, goodIsUp, unit }) {
  if (before == null) return <span className="text-xs text-muted-foreground">no earlier run</span>;
  const d = Math.round((now - before) * 10) / 10;
  if (!d) return <span className="text-xs text-muted-foreground">= last run</span>;
  const bad = goodIsUp ? d < 0 : d > 0;
  return (
    <span className={cn('flex items-center gap-0.5 font-mono text-xs', bad ? 'text-destructive' : 'text-good')}>
      <span aria-hidden="true">{d > 0 ? '▲' : '▼'}</span>
      <NumberFlow value={Math.abs(d)} suffix={unit === '%' ? ' pts' : ''} />
      <span className="font-sans text-muted-foreground">&nbsp;vs last</span>
    </span>
  );
}

export function Kpis({ A, Aprev, go }) {
  const k = A.kpi, p = Aprev ? Aprev.kpi : null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {KPIS.map(([key, label, f, goodIsUp, unit = '', alert]) => {
        const v = k[key] ?? 0;
        const hot = alert && v > 0;
        return (
          <button key={key} type="button" aria-label={`${label}: ${v}${unit}. Show these tests`}
            onClick={() => go(f === 'api' ? { tab: 'api', af: 'failed', open: '' } : { tab: 'triage', f, open: '' })}
            className="group rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <MagicCard gradientSize={160} gradientColor="color-mix(in srgb, var(--primary) 18%, transparent)" gradientFrom="var(--brand-from)" gradientTo="var(--brand-to)"
              className={cn('h-full rounded-xl', hot && 'ring-1 ring-destructive/60')}>
              <div className="flex h-full flex-col gap-1 p-3.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className={cn('font-mono text-2xl font-semibold tabular', hot ? 'text-destructive' : 'text-foreground')} data-kpi={key} data-value={`${v}${unit}`}>
                  <NumberFlow value={v} suffix={unit} />
                </span>
                <Delta now={v} before={p ? p[key] : null} goodIsUp={goodIsUp} unit={unit} />
              </div>
            </MagicCard>
          </button>
        );
      })}
    </div>
  );
}
