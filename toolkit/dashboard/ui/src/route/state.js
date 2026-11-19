// The page state lives in the URL hash, with the same names as the old page so every shared link still works:
//   #/<view>?app=&build=&suite=&run=&env=&platform=&mine=1&q=&f=&module=&open=&t=&dt=&call=&cat=&a=&b=&sec=&urun=&uf=&af=&bf=
// Defaults are left out of the hash (f=failures, af=all, bf=problems, uf=all).

export const VIEWS = ['overview', 'triage', 'coverage', 'performance', 'devices', 'history', 'api', 'compare', 'unit'];
const PLAIN = ['app', 'build', 'suite', 'run', 'env', 'platform', 'q', 'module', 'open', 't', 'dt', 'call', 'cat', 'a', 'b', 'sec', 'urun'];
const DEFAULTS = { f: 'failures', af: 'all', bf: 'problems', uf: 'all' };

/** State from a hash like "#/triage?run=20261118-160308&f=all". An unknown view falls back to the overview. */
export function readState(hash) {
  const [path, qs] = String(hash || '').replace(/^#\/?/, '').split('?');
  const p = new URLSearchParams(qs || '');
  const S = { tab: VIEWS.includes(path) ? path : 'overview', mine: p.get('mine') === '1' };
  for (const k of PLAIN) S[k] = p.get(k) || '';
  for (const [k, d] of Object.entries(DEFAULTS)) S[k] = p.get(k) || d;
  return S;
}

/** The hash for a state (the inverse of readState). */
export function hashOf(S) {
  const p = new URLSearchParams();
  for (const k of PLAIN) if (S[k]) p.set(k, S[k]);
  for (const [k, d] of Object.entries(DEFAULTS)) if (S[k] && S[k] !== d) p.set(k, S[k]);
  if (S.mine) p.set('mine', '1');
  return '#/' + S.tab + (p.toString() ? '?' + p : '');
}

/** A new state from a change: another view starts on its first section; another test starts on its default tab. */
export function nextState(S, patch) {
  let x = patch;
  if (x.tab !== undefined && x.tab !== S.tab && !('sec' in x)) x = { ...x, sec: '' };
  if (x.open !== undefined && x.open !== S.open && !('dt' in x)) x = { ...x, dt: '' };
  return { ...S, ...x };
}
