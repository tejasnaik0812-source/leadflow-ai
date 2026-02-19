import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  MessageCircle,
  CalendarCheck,
  ListTodo,
  Building2,
  Settings,
  LogOut,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

const mainNav = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Leads', url: '/leads', icon: Users },
  { title: 'Pipeline', url: '/pipeline', icon: KanbanSquare },
  { title: 'Follow-ups', url: '/follow-ups', icon: ListTodo },
  { title: 'Site Visits', url: '/site-visits', icon: CalendarCheck },
  { title: 'Conversations', url: '/conversations', icon: MessageCircle },
];

const secondaryNav = [
  { title: 'Team', url: '/team', icon: Building2 },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <div className="h-14 flex items-center px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none">PropCRM</h1>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Real Estate CRM</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </div>

      <SidebarContent className="px-2 pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      activeClassName="sidebar-item-active"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                      {!collapsed && item.title === 'Conversations' && (
                        <span className="ml-auto bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full">3</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      activeClassName="sidebar-item-active"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              RK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Rajesh Kumar</p>
              <p className="text-[10px] text-muted-foreground">Admin</p>
            </div>
            <LogOut className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
