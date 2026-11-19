// The choices of each header filter, from the runs the OTHER filters allow (as in the old page's renderFilters).
import { runsFiltered, suiteKey, platKey, runState } from '@/logic/runs.js';
import { buildKey, buildLabel, verLabel } from '@/logic/format.js';

const uniq = (pairs) => [...new Map(pairs).entries()].map(([value, label]) => ({ value, label }));

export function filterOptions(runs, S) {
  return {
    build: uniq(runsFiltered(runs, S, 'build').map((r) => [buildKey(r), buildLabel(r.apk) + ' · ' + verLabel(r.apk)])),
    suite: uniq(runsFiltered(runs, S, 'suite').map((r) => [suiteKey(r), suiteKey(r) === 'all' ? 'all specs' : suiteKey(r)])),
    env: uniq(runsFiltered(runs, S, 'env').map((r) => [r.env, r.env])),
    platform: uniq(runsFiltered(runs, S, 'platform').map((r) => [platKey(r), platKey(r)])),
    run: runsFiltered(runs, S).map((r) => ({ value: r.id, label: `${r.id} · ${buildLabel(r.apk)} · ${runState(r)}` })),
  };
}
