// The page: sidebar, header, the current view, the command palette and the "Copied / Updated" messages.
import { useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AppSidebar } from './AppSidebar.jsx';
import { Header } from './Header.jsx';
import { CommandPalette } from './CommandPalette.jsx';
import { useHashState } from './use-hash-state.js';
import { useDashboardData } from './use-dashboard-data.js';
import { useTheme } from './use-theme.js';
import { useShortcuts } from './use-shortcuts.js';
import { filterOptions } from './filter-options.js';
import { triageContext } from '@/logic/triage-settings.js';
import { selectRun } from '@/logic/select.js';
import { groupRows } from '@/logic/groups.js';
import { Placeholder } from '@/views/Placeholder.jsx';
import { Overview } from '@/views/Overview.jsx';

export function App() {
  const [S, go] = useHashState();
  const [theme, toggleTheme] = useTheme();
  const [palette, setPalette] = useState(false);
  const searchRef = useRef(null);
  const data = useDashboardData(null);
  const { idx } = data;
  const ctx = useMemo(() => (idx ? triageContext(idx) : null), [idx]);
  const sel = useMemo(() => (idx ? selectRun(idx, S, ctx) : null), [idx, S, ctx]);
  const groups = useMemo(() => (sel?.A ? groupRows(sel.A, ctx) : []), [sel, ctx]);
  const opts = useMemo(() => filterOptions(idx ? idx.runs : [], S), [idx, S]);
  useShortcuts({ setPalette, searchRef, refresh: data.refresh });
  useEffect(() => { if (idx?.project) document.title = idx.project; }, [idx]);

  return (
    <MotionConfig reducedMotion="user">
    <TooltipProvider delayDuration={300}>
      <SidebarProvider>
        <AppSidebar S={S} go={go} apps={data.apps} idx={idx} sel={sel} groups={groups} />
        <SidebarInset className="min-w-0 bg-transparent">
          <Header S={S} go={go} opts={opts} data={data} theme={theme} toggleTheme={toggleTheme} openPalette={() => setPalette(true)} searchRef={searchRef} />
          <main className="flex-1 p-3 md:p-6">
            {!idx ? <p className="text-muted-foreground">Loading…</p>
              : !idx.runs.length ? <p className="text-muted-foreground">No test runs yet. Run a suite (for example <code>npm run test:smoke</code>); this page fills in by itself.</p>
              : S.tab === 'overview' ? <Overview sel={sel} groups={groups} runs={idx.runs} go={go} />
              : <Placeholder tab={S.tab} />}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <CommandPalette open={palette} setOpen={setPalette} S={S} go={go} sel={sel} apps={data.apps} data={data} toggleTheme={toggleTheme} />
      <Toaster theme={theme} position="bottom-right" />
    </TooltipProvider>
    </MotionConfig>
  );
}
