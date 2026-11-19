// The bar above every view: the view's name, the main filters (build, suite, run), the rest behind "Filters", search,
// the command palette, live refresh, refresh and theme.
import { Moon, RefreshCw, Search, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterSelect } from './FilterSelect.jsx';
import { MoreFilters } from './MoreFilters.jsx';
import { viewOf } from './views.js';
import { cn } from '@/lib/utils';

function IconButton({ label, onClick, children, pressed }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" aria-label={label} aria-pressed={pressed} onClick={onClick}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function Header({ S, go, opts, data, theme, toggleTheme, openPalette, searchRef }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur md:px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-5" />
      <h1 className="mr-2 min-w-0 truncate font-display text-base font-semibold xl:sr-only">{viewOf(S.tab).label}</h1>
      <div className="hidden min-w-0 flex-1 items-center gap-2 xl:flex">
        <FilterSelect label="Build" value={S.build} options={opts.build} allLabel="All builds" onChange={(v) => go({ build: v, run: '' })} />
        <FilterSelect label="Suite" value={S.suite} options={opts.suite} allLabel="All suites" onChange={(v) => go({ suite: v, run: '' })} />
        <FilterSelect label="Run" value={S.run} options={opts.run} allLabel="Latest run" onChange={(v) => go({ run: v })} />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <MoreFilters S={S} go={go} opts={opts} />
        <div className="relative hidden lg:block">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input ref={searchRef} type="search" value={S.q} onChange={(e) => go({ q: e.target.value }, { replace: true })}
            placeholder="Search tests, errors, modules" aria-label="Search (/)" className="h-8 w-40 bg-card/60 pl-8 xl:w-36 2xl:w-52" />
        </div>
        <Button variant="outline" size="sm" className="bg-card/60 text-muted-foreground" onClick={openPalette} aria-label="Command palette (Ctrl+K)">
          <Search className="2xl:hidden" /><span className="hidden 2xl:inline">Jump to…</span><Kbd className="hidden md:inline-flex">Ctrl K</Kbd>
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" aria-pressed={data.live} onClick={() => data.setLive(!data.live)} className="gap-1.5 px-2">
              <span className={cn('size-2 rounded-full', data.live ? 'bg-good-fill shadow-[0_0_8px_var(--good-fill)]' : 'bg-skipped')} aria-hidden="true" />
              <span className="hidden text-xs sm:inline">{data.live ? 'Live' : 'Paused'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{data.live ? 'Refreshes by itself when a test finishes. Click to pause.' : 'Paused. Click to refresh by itself again.'}</TooltipContent>
        </Tooltip>
        <IconButton label="Refresh now (r)" onClick={() => data.refresh({ manual: true })}><RefreshCw /></IconButton>
        <IconButton label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'} onClick={toggleTheme}>{theme === 'dark' ? <Sun /> : <Moon />}</IconButton>
      </div>
    </header>
  );
}
