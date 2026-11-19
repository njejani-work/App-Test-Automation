// Dark (the app's look) unless this browser chose light. Same storage key as the old page.
import { useCallback, useEffect, useState } from 'react';
import { store } from '@/lib/store.js';

const KEY = 'egDashTheme';

export function useTheme() {
  const [theme, setTheme] = useState(() => store.get(KEY, null) || 'dark');
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  const toggle = useCallback(() => setTheme((t) => { const n = t === 'dark' ? 'light' : 'dark'; store.set(KEY, n); return n; }), []);
  return [theme, toggle];
}
