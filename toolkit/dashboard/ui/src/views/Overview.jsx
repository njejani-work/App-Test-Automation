// Overview: decide in 5 seconds (verdict), see the numbers, then act (Act now) and spot trends.
import { BlurFade } from '@/components/magic/blur-fade';
import { verdictOf } from '@/logic/verdict.js';
import { Verdict } from './overview/Verdict.jsx';
import { Kpis } from './overview/Kpis.jsx';
import { ActNow } from './overview/ActNow.jsx';
import { Modules } from './overview/Modules.jsx';
import { Trend } from './overview/Trend.jsx';
import { RecentRuns } from './overview/RecentRuns.jsx';

export function Overview({ sel, groups, runs, go }) {
  const { A, Aprev, current, runsF } = sel;
  if (!A) return <p className="text-muted-foreground">No runs match the filters.</p>;
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <BlurFade delay={0}><Verdict V={verdictOf(A)} run={current} /></BlurFade>
      <BlurFade delay={0.05}><Kpis A={A} Aprev={Aprev} go={go} /></BlurFade>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <BlurFade delay={0.1} className="flex min-w-0 flex-col gap-4"><ActNow groups={groups} runs={runs} current={current} go={go} /><Trend runsF={runsF} current={current} go={go} /></BlurFade>
        <BlurFade delay={0.15} className="flex min-w-0 flex-col gap-4"><Modules A={A} go={go} /><RecentRuns runsF={runsF} current={current} go={go} /></BlurFade>
      </div>
    </div>
  );
}
