// The newest runs (with the filters applied): verdict colour, suite, build, counts. A click opens that run.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIcon } from '@/components/app/chips.jsx';
import { buildLabel, fmtDate } from '@/logic/format.js';
import { suiteKey, runState } from '@/logic/runs.js';
import { cn } from '@/lib/utils';

const ICON = { passed: 'PASS', warning: 'WARNING', failed: 'BLOCKED', running: 'RUNNING', incomplete: 'NONE' };

export function RecentRuns({ runsF, current, go }) {
  return (
    <Card className="gap-3 bg-card/70">
      <CardHeader><CardTitle className="font-display">Recent runs</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-0.5">
        {runsF.slice(0, 6).map((r) => (
          <button key={r.id} type="button" onClick={() => go({ run: r.id, open: '' })} aria-current={r.id === current.id ? 'true' : undefined}
            className={cn('grid grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent/50', r.id === current.id && 'bg-accent/70')}>
            <StatusIcon s={ICON[runState(r)] || 'NONE'} />
            <span className="min-w-0"><span className="font-mono text-xs">{r.id}</span><span className="block truncate text-xs text-muted-foreground">{suiteKey(r)} · {buildLabel(r.apk)} · {fmtDate(r.startedAt)}</span></span>
            <span className="font-mono text-xs"><span className={r.summary.failed ? 'text-destructive' : 'text-muted-foreground'}>{r.summary.failed} failed</span><span className="text-muted-foreground"> / {r.summary.total}</span></span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
