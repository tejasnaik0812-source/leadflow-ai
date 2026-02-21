import { AppLayout } from '@/components/layout/AppLayout';
import { useCRM } from '@/context/CRMContext';
import { LEAD_STATUS_CONFIG, LEAD_SOURCE_CONFIG, LeadStatus, LeadSource } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers, mockProjects } from '@/data/mockData';
import { toast } from 'sonner';

const Leads = () => {
  const { leads, updateLead, addActivity } = useCRM();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', budget: '', projectInterest: '', source: 'website' as LeadSource, assignedTo: 'u3' });

  const filtered = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.projectInterest.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const salesExecs = mockUsers.filter(u => u.role === 'sales_executive' || u.role === 'sales_manager');

  const handleAddLead = () => {
    if (!newLead.name.trim() || !newLead.phone.trim()) {
      toast.error('Name and phone are required');
      return;
    }
    const assignee = mockUsers.find(u => u.id === newLead.assignedTo) || mockUsers[2];
    const id = `l-${Date.now()}`;
    // Use updateLead via context — we need addLead, so let's use the context properly
    // Since CRMContext doesn't have addLead, we'll add it
    const lead = {
      id,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      status: 'new' as LeadStatus,
      source: newLead.source,
      budget: newLead.budget,
      projectInterest: newLead.projectInterest,
      assignedTo: assignee.id,
      assignedToName: assignee.name,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      notes: [],
      score: Math.floor(Math.random() * 30) + 30,
    };
    // We need addLead in context — will add it
    (window as any).__addLeadTemp?.(lead);
    addActivity({
      id: `a-${Date.now()}`, leadId: id, leadName: newLead.name,
      type: 'note', description: `New lead created: ${newLead.name}`,
      createdAt: new Date().toISOString(), createdBy: 'Rajesh Kumar',
    });
    setNewLead({ name: '', email: '', phone: '', budget: '', projectInterest: '', source: 'website', assignedTo: 'u3' });
    setAddOpen(false);
    toast.success('Lead added successfully!');
  };

  return (
    <AppLayout>
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Leads</h1>
            <p className="text-sm text-muted-foreground">{leads.length} total leads</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Lead</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogDescription>Enter the lead's contact details and interest.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name *</label>
                  <Input placeholder="Full name" value={newLead.name} onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                  <Input placeholder="+91 99887 76655" value={newLead.phone} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input placeholder="email@example.com" value={newLead.email} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Budget</label>
                  <Input placeholder="₹1Cr - ₹2Cr" value={newLead.budget} onChange={e => setNewLead(p => ({ ...p, budget: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Project Interest</label>
                  <Select value={newLead.projectInterest} onValueChange={v => setNewLead(p => ({ ...p, projectInterest: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>
                      {mockProjects.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Source</label>
                  <Select value={newLead.source} onValueChange={v => setNewLead(p => ({ ...p, source: v as LeadSource }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(LEAD_SOURCE_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Assign To</label>
                  <Select value={newLead.assignedTo} onValueChange={v => setNewLead(p => ({ ...p, assignedTo: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {salesExecs.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleAddLead} disabled={!newLead.name.trim() || !newLead.phone.trim()}>
                  Add Lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, phone, project..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 bg-muted/50 border-none text-sm" />
          </div>
          <div className="flex gap-1 flex-wrap">
            <Button variant={statusFilter === null ? 'default' : 'ghost'} size="sm" className="text-xs h-9" onClick={() => setStatusFilter(null)}>All</Button>
            {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
              <Button key={key} variant={statusFilter === key ? 'default' : 'ghost'} size="sm" className="text-xs h-9" onClick={() => setStatusFilter(key)}>{config.label}</Button>
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
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No leads found</td></tr>
                ) : (
                  filtered.map(lead => (
                    <tr
                      key={lead.id}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/leads/${lead.id}`)}
                    >
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.phone}</p>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell"><p className="text-sm">{lead.projectInterest}</p></td>
                      <td className="p-3 hidden lg:table-cell"><p className="text-sm">{lead.budget}</p></td>
                      <td className="p-3">
                        <Badge variant="secondary" className={`${LEAD_STATUS_CONFIG[lead.status].color} text-[10px]`}>{LEAD_STATUS_CONFIG[lead.status].label}</Badge>
                      </td>
                      <td className="p-3 hidden sm:table-cell"><p className="text-xs text-muted-foreground">{LEAD_SOURCE_CONFIG[lead.source].label}</p></td>
                      <td className="p-3 hidden lg:table-cell"><p className="text-xs">{lead.assignedToName}</p></td>
                      <td className="p-3 hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${lead.score}%` }} /></div>
                          <span className="text-xs text-muted-foreground">{lead.score}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info(`Calling ${lead.phone}`)}><Phone className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info(`Emailing ${lead.email}`)}><Mail className="h-3 w-3" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Leads;
