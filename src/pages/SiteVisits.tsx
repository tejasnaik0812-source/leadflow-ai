import { AppLayout } from '@/components/layout/AppLayout';
import { useCRM } from '@/context/CRMContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarPlus, MapPin, Clock, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockUsers, mockProjects } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  scheduled: 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
  no_show: 'bg-warning/10 text-warning',
};

const SiteVisits = () => {
  const { visits, leads, addVisit, addActivity } = useCRM();
  const navigate = useNavigate();
  const upcoming = visits.filter(v => v.status === 'scheduled');
  const past = visits.filter(v => v.status !== 'scheduled');

  const [addOpen, setAddOpen] = useState(false);
  const [visitDate, setVisitDate] = useState<Date | undefined>();
  const [visitTime, setVisitTime] = useState('10:00');
  const [visitLeadId, setVisitLeadId] = useState('');
  const [visitProject, setVisitProject] = useState('');
  const [visitAssignee, setVisitAssignee] = useState('');

  const salesExecs = mockUsers.filter(u => u.role === 'sales_executive' || u.role === 'sales_manager');

  const handleScheduleVisit = () => {
    if (!visitLeadId || !visitDate || !visitProject) {
      toast.error('Lead, date, and project are required');
      return;
    }
    const lead = leads.find(l => l.id === visitLeadId);
    const assignee = mockUsers.find(u => u.id === visitAssignee) || mockUsers[2];
    if (!lead) return;

    addVisit({
      id: `v-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      project: visitProject,
      scheduledDate: format(visitDate, 'yyyy-MM-dd'),
      scheduledTime: visitTime,
      status: 'scheduled',
      assignedTo: assignee.id,
      assignedToName: assignee.name,
    });

    addActivity({
      id: `a-${Date.now()}`, leadId: lead.id, leadName: lead.name,
      type: 'site_visit', description: `Site visit scheduled for ${format(visitDate, 'dd MMM')} at ${visitTime} — ${visitProject}`,
      createdAt: new Date().toISOString(), createdBy: assignee.name,
    });

    setVisitLeadId('');
    setVisitDate(undefined);
    setVisitTime('10:00');
    setVisitProject('');
    setVisitAssignee('');
    setAddOpen(false);
    toast.success('Site visit scheduled!');
  };

  return (
    <AppLayout>
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Site Visits</h1>
            <p className="text-sm text-muted-foreground">{upcoming.length} upcoming visits</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2"><CalendarPlus className="h-4 w-4" /> Schedule Visit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Site Visit</DialogTitle>
                <DialogDescription>Schedule a property visit for a lead.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Lead *</label>
                  <Select value={visitLeadId} onValueChange={setVisitLeadId}>
                    <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
                    <SelectContent>
                      {leads.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Project *</label>
                  <Select value={visitProject} onValueChange={setVisitProject}>
                    <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>
                      {mockProjects.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Visit Date *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !visitDate && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {visitDate ? format(visitDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={visitDate} onSelect={setVisitDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Time</label>
                  <Input type="time" value={visitTime} onChange={e => setVisitTime(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Assign To</label>
                  <Select value={visitAssignee} onValueChange={setVisitAssignee}>
                    <SelectTrigger><SelectValue placeholder="Select person" /></SelectTrigger>
                    <SelectContent>
                      {salesExecs.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleScheduleVisit} disabled={!visitLeadId || !visitDate || !visitProject}>
                  Schedule Visit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Upcoming ({upcoming.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming visits</p>
              ) : upcoming.map(visit => (
                <div key={visit.id} onClick={() => navigate(`/leads/${visit.leadId}`)}
                  className="p-3 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{visit.leadName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {visit.project}</p>
                    </div>
                    <Badge variant="secondary" className={`${statusColors[visit.status]} text-[10px]`}>{visit.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {visit.scheduledDate} at {visit.scheduledTime}</span>
                    <span>· {visit.assignedToName}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Past Visits ({past.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {past.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No past visits</p>
              ) : past.map(visit => (
                <div key={visit.id} onClick={() => navigate(`/leads/${visit.leadId}`)}
                  className="p-3 rounded-lg border border-border/30 cursor-pointer hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{visit.leadName}</p>
                      <p className="text-xs text-muted-foreground">{visit.project}</p>
                    </div>
                    <Badge variant="secondary" className={`${statusColors[visit.status]} text-[10px]`}>{visit.status}</Badge>
                  </div>
                  {visit.outcome && <p className="text-xs text-success mt-1">{visit.outcome}</p>}
                  {visit.notes && <p className="text-xs text-muted-foreground mt-0.5">{visit.notes}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default SiteVisits;
