// The last 14 runs up to the one being viewed (the old page's trend): failed tests as bars, pass rate as a line.
// Plain SVG: Recharts would add 390 KB to the page for this one chart (19 Nov 2026). Each run is a focusable column:
// hover or focus shows its numbers below the chart; Enter or a click opens it.
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { pct, axisLabel, buildLabel } from '@/logic/format.js';

const W = 640, H = 180, L = 34, R = 26, T = 10, B = 24;

export function Trend({ runsF, current, go }) {
  const [hover, setHover] = useState(null);
  const at = runsF.indexOf(current);
  const runs = runsF.slice(at, at + 14).reverse();
  const iw = W - L - R, ih = H - T - B, step = iw / Math.max(runs.length, 1), bw = Math.min(24, step * 0.55);
  const maxF = Math.max(1, ...runs.map((r) => r.summary.failed));
  const x = (i) => L + step * i + step / 2;
  const yP = (p) => T + ih - (p / 100) * ih;
  const passOf = (r) => pct(r.summary.total - r.summary.failed, r.summary.total || 1);
  const line = runs.map((r, i) => `${x(i)},${yP(passOf(r))}`).join(' ');
  const shown = runs.find((r) => r.id === hover) || current;
  return (
    <Card className="min-w-0 gap-3 bg-card/70">
      <CardHeader>
        <CardTitle className="font-display">Trend · last {runs.length} run{runs.length === 1 ? '' : 's'}</CardTitle>
        <CardDescription className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1"><i className="h-0.5 w-3 rounded bg-good" />pass rate</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-destructive" />failed tests</span>
          <span>click a run to open it</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="-mx-1 overflow-x-auto px-1"><svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[520px]" role="group" aria-label={`Pass rate and failures over the last ${runs.length} runs`}>
          {[0, 50, 100].map((p) => (
            <g key={p}><line x1={L} x2={W - R} y1={yP(p)} y2={yP(p)} stroke="var(--border)" />
              <text x={L - 6} y={yP(p) + 3} fontSize="10" textAnchor="end" fill="var(--muted-foreground)">{p}%</text></g>
          ))}
          <text x={W - R + 4} y={T + ih - ih * 0.6 + 3} fontSize="10" fill="var(--muted-foreground)">{maxF}</text>
          {runs.map((r, i) => {
            const h = (r.summary.failed / maxF) * ih * 0.6, cur = r.id === current.id;
            return (
              <g key={r.id} role="button" tabIndex={0} aria-label={`Run ${r.id}, ${buildLabel(r.apk)}: ${passOf(r)}% pass, ${r.summary.failed} failed`}
                className="cursor-pointer outline-none focus-visible:[&>rect:first-child]:stroke-ring" onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(r.id)} onBlur={() => setHover(null)} onClick={() => go({ run: r.id, open: '' })} onKeyDown={(e) => e.key === 'Enter' && go({ run: r.id, open: '' })}>
                <rect x={x(i) - step / 2} y={T} width={step} height={ih} rx="4" fill={cur ? 'var(--accent)' : hover === r.id ? 'color-mix(in srgb, var(--accent) 50%, transparent)' : 'transparent'} strokeWidth="1.5" />
                {h > 0 && <rect x={x(i) - bw / 2} y={T + ih - h} width={bw} height={h} rx="3" fill="var(--destructive)" opacity={cur ? 1 : 0.6} />}
                <text x={x(i)} y={H - 7} fontSize="10" textAnchor="middle" fill={cur ? 'var(--foreground)' : 'var(--muted-foreground)'} fontWeight={cur ? 700 : 400}>{axisLabel(r)}</text>
              </g>
            );
          })}
          {runs.length > 1 && <polyline points={line} fill="none" stroke="var(--good)" strokeWidth="2" strokeLinejoin="round" pointerEvents="none" />}
          {runs.map((r, i) => <circle key={r.id} cx={x(i)} cy={yP(passOf(r))} r={r.id === current.id ? 4 : 3} fill="var(--good)" pointerEvents="none" />)}
        </svg></div>
        <p className="mt-1 font-mono text-xs text-muted-foreground" aria-live="polite">
          {shown.id} · {buildLabel(shown.apk)} · <span className="text-good">{passOf(shown)}% pass</span> · <span className={shown.summary.failed ? 'text-destructive' : ''}>{shown.summary.failed} failed</span> of {shown.summary.total}
        </p>
      </CardContent>
    </Card>
  );
}
