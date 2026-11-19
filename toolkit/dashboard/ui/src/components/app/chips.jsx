// Status, severity and category as chips: colour + icon + word, so nothing depends on colour alone.
import { CircleCheck, TriangleAlert, OctagonX, TrendingDown, CircleDot, Shuffle, OctagonAlert, Pause, BookmarkCheck, Repeat, CircleMinus, Loader } from 'lucide-react';
import { CATS } from '@/logic/format.js';
import { cn } from '@/lib/utils';

const STATUS = {
  PASS: [CircleCheck, 'text-good', 'Passed'], WARNING: [TriangleAlert, 'text-warn', 'Warning'], SKIPPED: [CircleMinus, 'text-skipped', 'Skipped'],
  NEW: [CircleDot, 'text-destructive', 'New'], RECURRING: [Repeat, 'text-destructive', 'Recurring'], REGRESSION: [TrendingDown, 'text-destructive', 'Regression'],
  FLAKY: [Shuffle, 'text-warn', 'Flaky'], CRASH: [OctagonAlert, 'text-crash', 'Crash'], QUARANTINED: [Pause, 'text-skipped', 'Quarantined'],
  KNOWN: [BookmarkCheck, 'text-known', 'Known'], RUNNING: [Loader, 'text-link', 'Running'],
  // verdicts
  BLOCKED: [OctagonX, 'text-destructive', 'Blocked'], UNSTABLE: [TriangleAlert, 'text-warn', 'Unstable'], NONE: [CircleMinus, 'text-skipped', 'No data'],
};
export const statusTone = (s) => (STATUS[s] || STATUS.NONE)[1];
export const StatusIcon = ({ s, className }) => { const [I, tone] = STATUS[s] || STATUS.NONE; return <I aria-hidden="true" className={cn('size-4 shrink-0', tone, className)} />; };

export function StatusChip({ s, extra, className }) {
  const [I, tone, word] = STATUS[s] || [CircleMinus, 'text-muted-foreground', s];
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md border border-current/25 bg-current/10 px-1.5 py-0.5 text-xs font-medium whitespace-nowrap', tone, className)}>
      <I aria-hidden="true" className="size-3.5" />{word}{extra ? <span className="font-mono opacity-80">{extra}</span> : null}
    </span>
  );
}

const SEV_TONE = { P0: 'bg-[#c4271d] text-white', P1: 'bg-warn-fill text-[#1b1530]', P2: 'bg-secondary text-secondary-foreground', P3: 'bg-secondary text-muted-foreground' };
export const SeverityChip = ({ s }) => (
  <span title={`Severity ${s}`} className={cn('inline-flex rounded px-1.5 py-0.5 font-mono text-xs font-semibold', SEV_TONE[s] || SEV_TONE.P3)}>{s || 'P2'}</span>
);

export const CategoryChip = ({ c, why }) => (c
  ? <span title={why || ''} className="inline-flex items-center gap-1 text-xs text-muted-foreground"><span aria-hidden="true" className="size-1.5 rounded-full bg-current" />{CATS[c] || c}</span>
  : null);
