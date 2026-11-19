// Page-wide keys: Ctrl/Cmd+K command palette, "/" search, "r" refresh. Not while typing in a field.
import { useEffect } from 'react';

const typing = (e) => /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;

export function useShortcuts({ setPalette, searchRef, refresh }) {
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((o) => !o); return; }
      if (typing(e) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); }
      else if (e.key === 'r') refresh({ manual: true });
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [setPalette, searchRef, refresh]);
}
