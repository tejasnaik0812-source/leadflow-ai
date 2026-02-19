import { AppLayout } from '@/components/layout/AppLayout';
import { mockLeads } from '@/data/mockData';
import { LEAD_STATUS_CONFIG, LEAD_SOURCE_CONFIG, Lead } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter, Phone, Mail, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

const Leads = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.projectInterest.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Leads</h1>
            <p className="text-sm text-muted-foreground">{mockLeads.length} total leads</p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add Lead
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, project..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/50 border-none text-sm"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            <Button
              variant={statusFilter === null ? 'default' : 'ghost'}
              size="sm"
              className="text-xs h-9"
              onClick={() => setStatusFilter(null)}
            >
              All
            </Button>
            {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
              <Button
                key={key}
                variant={statusFilter === key ? 'default' : 'ghost'}
                size="sm"
                className="text-xs h-9"
                onClick={() => setStatusFilter(key)}
              >
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Lead</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs hidden md:table-cell">Project</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs hidden lg:table-cell">Budget</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs hidden sm:table-cell">Source</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs hidden lg:table-cell">Assigned</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs hidden xl:table-cell">Score</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={lead.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.phone}</p>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <p className="text-sm">{lead.projectInterest}</p>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <p className="text-sm">{lead.budget}</p>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary" className={`${LEAD_STATUS_CONFIG[lead.status].color} text-[10px]`}>
                        {LEAD_STATUS_CONFIG[lead.status].label}
                      </Badge>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <p className="text-xs text-muted-foreground">{LEAD_SOURCE_CONFIG[lead.source].label}</p>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <p className="text-xs">{lead.assignedToName}</p>
                    </td>
                    <td className="p-3 hidden xl:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{lead.score}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Leads;
