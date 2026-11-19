// TEMPORARY (step 2 only, replaced by the Overview in step 3): the verdict and the numbers computed by the moved logic,
// shown plainly so they can be compared with the current dashboard on the same run.
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { verdictOf } from '@/logic/verdict.js';
import { buildLabel, verLabel } from '@/logic/format.js';
import { suiteKey } from '@/logic/runs.js';

const KPIS = [['passRate', 'Pass rate', '%'], ['failed', 'Failed'], ['regressions', 'Regressions'], ['newF', 'New failures'], ['flaky', 'Flaky'], ['crash', 'Crashes'], ['warnings', 'With warnings'], ['apiFailed', 'API failures']];

export function LogicCheck({ sel, groups }) {
  if (!sel?.A) return null;
  const V = verdictOf(sel.A), r = sel.current;
  return (
    <Card className="bg-card/70" data-testid="logic-check">
      <CardHeader>
        <CardTitle className="font-display">Logic check: <span data-testid="verdict">{V.v}</span></CardTitle>
        <CardDescription data-testid="why">{V.why}</CardDescription>
        <CardDescription className="font-mono">{buildLabel(r.apk)} · {verLabel(r.apk)} · {suiteKey(r)} · run {r.id}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {KPIS.map(([k, label, unit]) => (
          <div key={k} className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="font-mono text-xl" data-kpi={k}>{sel.A.kpi[k]}{unit || ''}</div></div>
        ))}
        <div className="col-span-full text-sm text-muted-foreground" data-testid="groups"
          data-keys={JSON.stringify(groups.filter((g) => g.st !== 'KNOWN' && g.st !== 'QUARANTINED').map((g) => `${g.key} ${g.st}`))}>{groups.length} root cause(s): {groups.map((g) => `${g.st} ${g.tests.map((t) => t.T.id || t.T.name).join('+')}`).join(' · ') || 'none'}</div>
      </CardContent>
    </Card>
  );
}
