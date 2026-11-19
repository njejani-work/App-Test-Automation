// Loads the data (data/load.js), keeps the viewed run loaded, and refreshes by itself while tests run: every 3 s it
// reads data/latest.js and reloads when the builder wrote something new. Say what changed in a short message.
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { loadIndex, loadApps, loadRun, loadLatest } from '@/data/load.js';
import { store } from '@/lib/store.js';

const AUTO_KEY = 'egDashAuto';

export function useDashboardData(runId) {
  const [idx, setIdx] = useState(null);
  const [apps, setApps] = useState(null);
  const [runs, setRuns] = useState({}); // id -> full run (data/runs/<id>.js)
  const [live, setLiveState] = useState(() => store.get(AUTO_KEY, true));
  const idxRef = useRef(null);
  const busy = useRef(false); // e.g. the screenshot viewer is open: refresh after it closes

  const refresh = useCallback(async ({ manual = false } = {}) => {
    const before = idxRef.current && idxRef.current.runs[0];
    const next = await loadIndex();
    idxRef.current = next;
    setIdx(next);
    const now = next.runs[0];
    if (now && (!before || before.id !== now.id)) { if (before) toast(`New run started: ${now.id}`); }
    else if (now && before && before.status === 'running' && now.status !== 'running') toast(`Run ${now.id} finished`);
    else if (manual) toast('Refreshed');
    else if (now) toast(`Updated: ${now.summary.total} test(s) in run ${now.id}`);
    setRuns({}); // reloaded on demand
  }, []);

  useEffect(() => { refresh(); loadApps().then(setApps); }, [refresh]);

  useEffect(() => {
    if (!idx || !runId || runs[runId]) return;
    let gone = false;
    loadRun(runId, true).then((r) => { if (!gone) setRuns((m) => ({ ...m, [runId]: r })); });
    return () => { gone = true; };
  }, [idx, runId, runs]);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(async () => {
      const L = await loadLatest();
      if (!L || !idxRef.current || L.generatedAt === idxRef.current.generatedAt || busy.current) return;
      refresh();
    }, 3000);
    return () => clearInterval(t);
  }, [live, refresh]);

  const setLive = useCallback((on) => { store.set(AUTO_KEY, on); setLiveState(on); }, []);
  return { idx, apps, run: runId ? runs[runId] || null : null, live, setLive, refresh, busy };
}
