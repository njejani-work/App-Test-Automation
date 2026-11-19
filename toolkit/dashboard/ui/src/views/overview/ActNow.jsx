// What to fix first: the open root causes, most urgent first (logic/priority.js). One line each: status, severity, the
// test (or the shared error when several tests fail the same way), category and why, owner, since when. Opens the test.
import { ChevronRight, CircleCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusChip, SeverityChip, CategoryChip } from '@/components/app/chips.jsx';
import { actNow } from '@/logic/priority.js';
import { buildLabel } from '@/logic/format.js';

const MAX = 8;

export function ActNow({ groups, runs, current, go }) {
  const list = actNow(groups);
  const runLabel = (id) => (id === current.id ? 'this run' : buildLabel((runs.find((r) => r.id === id) || {}).apk));
  return (
    <Card className="gap-3 bg-card/70" data-testid="groups" data-keys={JSON.stringify(list.map((g) => `${g.key} ${g.st}`))}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">Act now <span className="font-mono text-sm text-muted-foreground">{list.length}</span></CardTitle>
        <CardDescription>Open root causes, most urgent first: crashes, P0, regressions, new failures.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        {!list.length && <p className="flex items-center gap-2 py-4 text-sm text-muted-foreground"><CircleCheck className="size-4 text-good" />Nothing to act on in this run.</p>}
        {list.slice(0, MAX).map((g) => {
          const t0 = g.tests[0];
          const several = g.tests.length > 1;
          const title = several ? t0.cur.message || g.sigText : t0.T.title;
          const sub = several ? `${g.tests.length} tests: ${g.tests.map((t) => t.T.id || t.T.title).join(', ')}` : t0.cur.message || g.sigText;
          return (
            <button key={g.key} type="button" onClick={() => go({ tab: 'triage', open: g.key })}
              className="group grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-lg border border-transparent px-2.5 py-2 text-left hover:border-border hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              <div className="flex flex-col items-start gap-1 pt-0.5"><StatusChip s={g.st} extra={g.st === 'FLAKY' ? g.flakyText : ''} /><SeverityChip s={g.severity} /></div>
              <div className="min-w-0">
                <div className="truncate font-medium">{title}</div>
                {sub && <div className="truncate font-mono text-xs text-destructive/90">{sub}</div>}
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <CategoryChip c={g.category} why={g.categoryWhy} />
                  <span>{g.modules.join(', ')}</span>
                  <span>{g.owner ? `owner ${g.owner}` : g.ownerFromModule ? `module owner ${g.ownerFromModule}` : 'no owner yet'}</span>
                  {g.sinceRun && <span>since {runLabel(g.sinceRun)}</span>}
                </div>
              </div>
              <ChevronRight className="mt-1 size-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          );
        })}
        {list.length > MAX && <button type="button" className="self-start px-2.5 text-sm text-link hover:underline" onClick={() => go({ tab: 'triage', f: 'failures' })}>All {list.length} in Triage</button>}
      </CardContent>
    </Card>
  );
}
