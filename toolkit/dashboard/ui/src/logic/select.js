// What the page shows: the runs the filters select, the run being viewed, and its analysis compared with the previous
// run of the SAME suite (a tour run is not compared with a smoke run). Moved from the old page's render().
import { runsFiltered, suiteKey } from './runs.js';
import { analyse } from './analyse.js';

export function selectRun(idx, S, ctx) {
  const runsF = runsFiltered(idx.runs || [], S);
  const current = runsF.find((r) => r.id === S.run) || runsF[0] || null;
  const prevRun = current ? runsF.slice(runsF.indexOf(current) + 1).find((r) => suiteKey(r) === suiteKey(current)) || null : null;
  return { runsF, current, prevRun, A: analyse(current, runsF, ctx), Aprev: analyse(prevRun, runsF, ctx) };
}
