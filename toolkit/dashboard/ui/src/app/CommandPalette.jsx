// Ctrl/Cmd+K: jump to a test (by id or title), a view, a run or another app, or run a page action.
import { toast } from 'sonner';
import { Link2, Moon, RefreshCw, Radio, CircleDot } from 'lucide-react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command';
import { VIEW_LIST } from './views.js';
import { AppLogo } from './AppSwitcher.jsx';
import { buildLabel } from '@/logic/format.js';
import { runState } from '@/logic/runs.js';

const ST_TONE = { CRASH: 'text-crash', REGRESSION: 'text-destructive', NEW: 'text-destructive', RECURRING: 'text-destructive', FLAKY: 'text-warn', WARNING: 'text-warn', PASS: 'text-good', KNOWN: 'text-known' };

export function CommandPalette({ open, setOpen, S, go, sel, apps, data, toggleTheme }) {
  const run = (fn) => () => { setOpen(false); fn(); };
  const tests = sel?.A ? sel.A.tests : [];
  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Jump to" description="Search tests, views, runs and apps">
      <CommandInput placeholder="Test id or title, view, run, app…" />
      <CommandList>
        <CommandEmpty>Nothing matches.</CommandEmpty>
        {tests.length > 0 && (
          <CommandGroup heading={`Tests in run ${sel.current.id}`}>
            {tests.map((t) => (
              <CommandItem key={t.T.name} value={`${t.T.id || ''} ${t.cur.title || t.T.title || t.T.name} ${t.st}`}
                onSelect={run(() => go({ tab: 'triage', open: t.cur.sig || 't:' + t.T.name }))}>
                <CircleDot className={ST_TONE[t.st] || 'text-muted-foreground'} />
                <span className="truncate">{t.cur.title || t.T.title || t.T.name}</span>
                <CommandShortcut className={ST_TONE[t.st]}>{t.st}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandGroup heading="Views">
          {VIEW_LIST.map((v) => (
            <CommandItem key={v.key} value={`view ${v.label} ${v.about}`} onSelect={run(() => go({ tab: v.key }))}><v.icon />{v.label}<span className="truncate text-xs text-muted-foreground">{v.about}</span></CommandItem>
          ))}
        </CommandGroup>
        {sel?.runsF?.length > 0 && (
          <CommandGroup heading="Runs">
            {sel.runsF.slice(0, 30).map((r) => (
              <CommandItem key={r.id} value={`run ${r.id} ${(r.suites || []).join(' ')} ${buildLabel(r.apk)}`} onSelect={run(() => go({ run: r.id }))}>
                <span className="font-mono">{r.id}</span><span className="text-xs text-muted-foreground">{(r.suites || []).join('+')} · {buildLabel(r.apk)} · {runState(r)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {apps && (
          <CommandGroup heading="Apps">
            {apps.apps.filter((a) => a.id !== apps.current && a.ready).map((a) => (
              <CommandItem key={a.id} value={`app ${a.name}`} onSelect={run(() => { location.href = a.href.replace(/[^/]*$/, location.pathname.split('/').pop() || 'index.html') + '#/' + S.tab; })}>
                <AppLogo app={a} size={18} />{a.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={run(() => navigator.clipboard.writeText(location.href).then(() => toast('Link to this view copied'), () => toast('Could not copy: the browser blocked the clipboard')))}><Link2 />Copy a link to this view</CommandItem>
          <CommandItem onSelect={run(() => data.refresh({ manual: true }))}><RefreshCw />Refresh now<CommandShortcut>R</CommandShortcut></CommandItem>
          <CommandItem onSelect={run(() => data.setLive(!data.live))}><Radio />{data.live ? 'Pause live refresh' : 'Resume live refresh'}</CommandItem>
          <CommandItem onSelect={run(toggleTheme)}><Moon />Switch light / dark</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
