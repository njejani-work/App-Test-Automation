// test/triage.json plus this browser's unsaved edits (owner, ticket, known, category, quarantine). Moved from the old
// page; the storage keys are the same, so edits made in the old page show here too.
import { store } from '../lib/store.js';

export const LOCAL_KEY = 'egDashTriageEdits';
export const Q_KEY = 'egDashQuarantineEdits';

export const today = () => new Date().toISOString().slice(0, 10);

/** Everything the analysis needs to know about triage settings, for one index (data/index.js). */
export function triageContext(idx) {
  const triage = idx.triage || {};
  const edits = () => store.get(LOCAL_KEY, {});
  const qEdits = () => store.get(Q_KEY, {});
  const issueOf = (sig) => Object.assign({}, (triage.issues || {})[sig] || {}, edits()[sig] || {});
  function quarantineList() {
    const list = (triage.quarantine || []).map((q) => ({ ...q }));
    for (const [test, e] of Object.entries(qEdits())) {
      const i = list.findIndex((q) => q.test === test);
      if (e.removed) { if (i > -1) list.splice(i, 1); } else if (i > -1) list[i] = { ...list[i], ...e, test }; else list.push({ ...e, test });
    }
    return list;
  }
  const quarantineOf = (T) => quarantineList().find((q) => q.test === T.id || q.test === T.name) || null;
  const moduleOwner = (m) => ((triage.modules || {})[m] || {}).owner || '';
  const allOwners = () => [...new Set([...Object.values(triage.modules || {}).map((m) => m.owner), ...Object.values(triage.issues || {}).map((i) => i.owner), ...Object.values(edits()).map((i) => i.owner)].filter(Boolean))].sort();
  return { tests: idx.tests || [], issueOf, quarantineList, quarantineOf, moduleOwner, allOwners, today, edits, qEdits };
}

export function editIssue(sig, patch) {
  const e = store.get(LOCAL_KEY, {});
  e[sig] = Object.assign({}, e[sig] || {}, patch);
  store.set(LOCAL_KEY, e);
}
