// Top left: the app's logo (or badge) and name; a menu opens another app's dashboard (data/apps.js).
import { ChevronsUpDown, Check } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const STATUS = { passed: 'passed', warning: 'passed with warnings', failed: 'failed', running: 'running' };

export function AppLogo({ app, size = 32 }) {
  const style = { width: size, height: size };
  if (app?.logo) return <img src={app.logo} alt="" style={style} className="rounded-lg object-cover" />;
  const text = app?.badge || (app?.name || '?').replace(/[^A-Za-z0-9]/g, '').slice(0, 1).toUpperCase();
  return (
    <span aria-hidden="true" style={{ ...style, background: app?.color || 'var(--primary)' }}
      className="grid shrink-0 place-items-center rounded-lg font-display text-sm font-semibold text-white shadow-sm">{text}</span>
  );
}

/** The same page of another app: index.html or, while the redesign is previewed, next.html. */
function hrefOf(app, tab) {
  const page = location.pathname.split('/').pop() || 'index.html';
  return app.href.replace(/[^/]*$/, page) + '#/' + tab;
}

export function AppSwitcher({ apps, project, tab }) {
  const current = apps ? apps.apps.find((a) => a.id === apps.current) : null;
  const name = current?.title || project || current?.name || 'App tests';
  const head = (
    <>
      <AppLogo app={current || { name }} />
      <span className="grid flex-1 text-left leading-tight">
        <span className="truncate font-display font-semibold">{name}</span>
        <span className="truncate text-xs text-muted-foreground">Test dashboard</span>
      </span>
    </>
  );
  if (!apps) return <SidebarMenu><SidebarMenuItem><SidebarMenuButton size="lg" className="pointer-events-none">{head}</SidebarMenuButton></SidebarMenuItem></SidebarMenu>;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" aria-label="App: open another app's tests">{head}<ChevronsUpDown className="ml-auto size-4" /></SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-64" align="start">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Apps</DropdownMenuLabel>
            {apps.apps.map((a) => {
              const ready = a.ready || a.id === apps.current;
              return (
                <DropdownMenuItem key={a.id} disabled={!ready} onSelect={() => { if (a.id !== apps.current) location.href = hrefOf(a, tab); }} className="gap-2">
                  <AppLogo app={a} size={24} />
                  <span className="flex-1">{a.name}<span className="block text-xs text-muted-foreground">{!ready ? 'no runs yet' : a.latest ? `latest run ${STATUS[a.latest.status] || a.latest.status}` : ''}</span></span>
                  {a.id === apps.current && <Check className="size-4" aria-label="current" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
