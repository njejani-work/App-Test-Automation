// Failures by app module in this run (as the old page's chart): new, other failures and flaky; a click filters Triage.
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function Modules({ A, go }) {
  const per = new Map();
  for (const t of A.tests) {
    if (!per.has(t.module)) per.set(t.module, { m: t.module, fail: 0, newF: 0, flaky: 0, total: 0 });
    const x = per.get(t.module); x.total++;
    if (t.problem) { x.fail++; if (t.isNew) x.newF++; if (t.st === 'FLAKY') x.flaky++; }
  }
  const list = [...per.values()].filter((x) => x.fail).sort((a, b) => b.fail - a.fail || b.newF - a.newF);
  const ok = per.size - list.length;
  const max = Math.max(1, ...list.map((x) => x.fail));
  return (
    <Card className="gap-3 bg-card/70">
      <CardHeader>
        <CardTitle className="font-display">Failures by module</CardTitle>
        <CardDescription className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-destructive" />new</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-destructive/50" />other</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-warn" />flaky</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {!list.length && <p className="py-2 text-sm text-muted-foreground">No failures in this run ({per.size} module{per.size === 1 ? '' : 's'} tested).</p>}
        {list.map((x) => (
          <button key={x.m} type="button" onClick={() => go({ tab: 'triage', module: x.m })} title={`Show ${x.m} in Triage`}
            className="grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-2 rounded text-left text-sm hover:text-link">
            <span className="truncate">{x.m}</span>
            <span className="flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <i className="bg-destructive" style={{ width: `${(x.newF / max) * 100}%` }} />
              <i className="bg-destructive/50" style={{ width: `${((x.fail - x.newF - x.flaky) / max) * 100}%` }} />
              <i className="bg-warn" style={{ width: `${(x.flaky / max) * 100}%` }} />
            </span>
            <span className="font-mono text-xs">{x.fail}<span className="sr-only"> failed: {x.newF} new, {x.flaky} flaky, of {x.total} tests</span></span>
          </button>
        ))}
        {list.length > 0 && ok > 0 && <p className="text-xs text-muted-foreground">{ok} other module{ok === 1 ? '' : 's'} passed</p>}
      </CardContent>
    </Card>
  );
}
