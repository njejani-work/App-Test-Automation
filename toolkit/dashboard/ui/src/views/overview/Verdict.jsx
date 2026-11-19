// The verdict: can this build ship? The word and its reason first, then which build, suite, device and run.
// While the run is still going, a beam runs around the card (not with reduced motion).
import { useReducedMotion } from 'motion/react';
import { Clock, GitBranch, Smartphone, Play } from 'lucide-react';
import { BorderBeam } from '@/components/magic/border-beam';
import { DotPattern } from '@/components/magic/dot-pattern';
import { StatusIcon } from '@/components/app/chips.jsx';
import { buildLabel, verLabel, devName, fmtDate, dur, shortC } from '@/logic/format.js';
import { suiteKey, runState } from '@/logic/runs.js';
import { cn } from '@/lib/utils';

const LOOK = {
  BLOCKED: 'from-destructive/25 text-destructive', UNSTABLE: 'from-warn/25 text-warn', PASS: 'from-good/25 text-good', NONE: 'from-muted text-muted-foreground',
};

export function Verdict({ V, run }) {
  const reduce = useReducedMotion();
  const running = run && runState(run) === 'running';
  const d = run?.details || {}, p = d.project || {};
  const facts = run ? [
    [Play, `${d.trigger || 'unknown trigger'}${d.startedBy ? ' · ' + d.startedBy : ''}`],
    [Clock, `${fmtDate(run.startedAt)} · ${dur(run.durationMs)}`],
    [Smartphone, devName(run.device)],
    p.branch ? [GitBranch, `${p.branch} @ ${shortC(p.commit)}${p.dirty ? ' + uncommitted changes' : ''}`] : null,
  ].filter(Boolean) : [];
  return (
    <section aria-label="Verdict" className="relative overflow-hidden rounded-2xl border bg-card/70 p-5 md:p-6">
      <DotPattern width={18} height={18} className="text-foreground/[0.07] [mask-image:radial-gradient(420px_circle_at_0%_0%,white,transparent)]" />
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent to-60%', LOOK[V.v])} aria-hidden="true" />
      <div className="relative flex flex-col gap-3">
        <div role="status" className={cn('flex items-center gap-2.5', LOOK[V.v])}>
          <StatusIcon s={V.v} className="size-8" />
          <span className="font-display text-3xl font-bold tracking-tight md:text-4xl" data-testid="verdict">{V.v}</span>
        </div>
        <p className="max-w-3xl text-base text-foreground md:text-lg" data-testid="why">{V.why}</p>
        {run && (
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-foreground">{buildLabel(run.apk)}</span> · {verLabel(run.apk)} · {suiteKey(run)} · run {run.id}
          </p>
        )}
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          {facts.map(([I, text]) => <li key={text} className="flex items-center gap-1.5"><I className="size-3.5" aria-hidden="true" />{text}</li>)}
        </ul>
        {running && <p className="text-sm text-link">Running: {run.summary.total} test(s) done so far. This page updates after every test.</p>}
      </div>
      {running && !reduce && <BorderBeam size={120} duration={7} colorFrom="var(--brand-from)" colorTo="var(--brand-to)" borderWidth={2} />}
    </section>
  );
}
