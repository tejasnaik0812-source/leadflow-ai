import { ReactNode, useState, useMemo } from 'react';
import { AppSidebar } from './AppSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCRM } from '@/context/CRMContext';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const { leads } = useCRM();
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return leads.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.projectInterest.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [search, leads]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center justify-between px-3 md:px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <SidebarTrigger className="hidden md:flex lg:hidden" />
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="pl-9 w-full h-8 bg-muted/50 border-none text-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                )}
                {searchFocused && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                    {searchResults.map(lead => (
                      <div
                        key={lead.id}
                        className="flex items-center gap-3 p-3 hover:bg-muted/30 cursor-pointer transition-colors"
                        onMouseDown={() => { navigate(`/leads/${lead.id}`); setSearch(''); }}
                      >
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary shrink-0">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lead.name}</p>
                          <p className="text-[10px] text-muted-foreground">{lead.projectInterest} · {lead.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {searchFocused && search.trim() && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 p-4 text-center">
                    <p className="text-sm text-muted-foreground">No leads found</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  3
                </Badge>
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                RK
              </div>
            </div>
          </header>
          <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-auto pb-20 md:pb-6">
            {children}
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </SidebarProvider>
  );
}
