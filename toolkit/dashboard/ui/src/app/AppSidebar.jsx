// The left column: the app, the views (with a count of things to act on), and the run being viewed.
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { AppSwitcher } from './AppSwitcher.jsx';
import { VIEW_LIST, viewCount } from './views.js';
import { buildLabel, verLabel, devName } from '@/logic/format.js';
import { runState } from '@/logic/runs.js';

export function AppSidebar({ S, go, apps, idx, sel, groups }) {
  const run = sel?.current;
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader><AppSwitcher apps={apps} project={idx?.project} tab={S.tab} /></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Views</SidebarGroupLabel>
          <SidebarMenu>
            {VIEW_LIST.map((v) => {
              const n = viewCount(v.key, sel, groups);
              return (
                <SidebarMenuItem key={v.key}>
                  <SidebarMenuButton isActive={S.tab === v.key} tooltip={v.label} onClick={() => go({ tab: v.key })} aria-current={S.tab === v.key ? 'page' : undefined}>
                    <v.icon /><span>{v.label}</span>
                  </SidebarMenuButton>
                  {n > 0 && <SidebarMenuBadge className="font-mono text-destructive" aria-label={`${n} to act on`}>{n}</SidebarMenuBadge>}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {run && (
        <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          <div className="rounded-lg border bg-card/60 p-3 text-xs leading-relaxed">
            <div className="text-muted-foreground">Viewing run</div>
            <div className="font-mono text-sm">{run.id}</div>
            <div className="text-muted-foreground">{buildLabel(run.apk)} · {verLabel(run.apk)}</div>
            <div className="truncate text-muted-foreground">{devName(run.device)} · {runState(run)}</div>
          </div>
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
