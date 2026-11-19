// The page state, kept in the URL hash (route/state.js). Back / Forward and pasted links work.
import { useCallback, useEffect, useState } from 'react';
import { readState, hashOf, nextState } from '@/route/state.js';

export function useHashState() {
  const [S, setS] = useState(() => readState(location.hash));
  useEffect(() => {
    const onHash = () => setS(readState(location.hash));
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  /** setState(patch, { replace }): replace = no new history entry (e.g. typing in the search box) */
  const setState = useCallback((patch, { replace = false } = {}) => {
    setS((S0) => {
      const S1 = nextState(S0, patch);
      const h = hashOf(S1);
      if (h !== location.hash) { if (replace) history.replaceState(null, '', h); else history.pushState(null, '', h); }
      return S1;
    });
  }, []);
  return [S, setState];
}
