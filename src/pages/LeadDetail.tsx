import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useCRM } from '@/context/CRMContext';
import { LEAD_STATUS_CONFIG, LEAD_SOURCE_CONFIG, LeadStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { mockUsers } from '@/data/mockData';
import { toast } from 'sonner';
import {
  ArrowLeft, Phone, Mail, Edit2, Save, X, Plus,
  CalendarIcon, Clock, FileText, MessageCircle, MapPin, ArrowRight, Users,
} from 'lucide-react';
import { useState } from 'react';

const activityIcons: Record<string, React.ElementType> = {
  call: Phone, email: Mail, whatsapp: MessageCircle, site_visit: MapPin,
  note: FileText, status_change: ArrowRight, meeting: CalendarIcon, follow_up: Clock,
};

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLeadById, updateLead, addNoteToLead, addActivity, addTask, getActivitiesForLead, getTasksForLead } = useCRM();

  const lead = getLeadById(id || '');
  const leadActivities = getActivitiesForLead(id || '');
  const leadTasks = getTasksForLead(id || '');

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '', budget: '', projectInterest: '', status: '' as LeadStatus });
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpNote, setFollowUpNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>();
  const [followUpAssignee, setFollowUpAssignee] = useState('');

  if (!lead) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Lead not found</p>
          <Button variant="outline" onClick={() => navigate('/leads')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Leads
          </Button>
        </div>
      </AppLayout>
    );
  }

  const startEdit = () => {
    setEditData({
      name: lead.name, email: lead.email, phone: lead.phone,
      budget: lead.budget, projectInterest: lead.projectInterest, status: lead.status,
    });
    setEditing(true);
  };

  const saveEdit = () => {
    updateLead(lead.id, editData);
    if (editData.status !== lead.status) {
      addActivity({
        id: `a-${Date.now()}`, leadId: lead.id, leadName: editData.name || lead.name,
        type: 'status_change',
        description: `Status changed from ${LEAD_STATUS_CONFIG[lead.status].label} to ${LEAD_STATUS_CONFIG[editData.status].label}`,
        createdAt: new Date().toISOString(), createdBy: 'Rajesh Kumar',
      });
    }
    setEditing(false);
    toast.success('Lead updated successfully!');
  };

  const handleAddFollowUp = () => {
    if (!followUpNote.trim() || !followUpDate) return;
    const assignee = mockUsers.find(u => u.id === followUpAssignee) || mockUsers[0];

    addNoteToLead(lead.id, {
      id: `n-${Date.now()}`, content: followUpNote,
      createdAt: new Date().toISOString(), createdBy: assignee.name,
    });

    addTask({
      id: `t-${Date.now()}`, leadId: lead.id, leadName: lead.name,
      title: followUpNote.slice(0, 60), description: followUpNote,
      dueDate: followUpDate.toISOString(), priority: 'high', status: 'pending',
      assignedTo: assignee.id, assignedToName: assignee.name,
    });

    addActivity({
      id: `a-${Date.now()}`, leadId: lead.id, leadName: lead.name,
      type: 'note', description: `Follow-up scheduled: ${followUpNote.slice(0, 80)}`,
      createdAt: new Date().toISOString(), createdBy: assignee.name,
    });

    setFollowUpNote('');
    setFollowUpDate(undefined);
    setFollowUpAssignee('');
    setFollowUpOpen(false);
    toast.success('Follow-up saved!');
  };

  const timeline = [
    ...leadActivities.map(a => ({ id: a.id, type: a.type, text: a.description, date: a.createdAt, by: a.createdBy })),
    ...lead.notes.map(n => ({ id: n.id, type: 'note' as const, text: n.content, date: n.createdAt, by: n.createdBy })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatTime = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000);
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    return format(date, 'dd MMM, h:mm a');
  };

  const salesExecs = mockUsers.filter(u => u.role === 'sales_executive' || u.role === 'sales_manager');

  return (
    <AppLayout>
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/leads')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight">{lead.name}</h1>
              <Badge variant="secondary" className={`${LEAD_STATUS_CONFIG[lead.status].color} text-[10px]`}>
                {LEAD_STATUS_CONFIG[lead.status].label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{lead.projectInterest} · {LEAD_SOURCE_CONFIG[lead.source].label}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={followUpOpen} onOpenChange={setFollowUpOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Follow-Up</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Follow-Up</DialogTitle>
                  <DialogDescription>Add a follow-up task for {lead.name}.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Note</label>
                    <Textarea
                      placeholder="e.g., Call to discuss pricing for Unit A-802..."
                      value={followUpNote}
                      onChange={e => setFollowUpNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Follow-up Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !followUpDate && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {followUpDate ? format(followUpDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={followUpDate} onSelect={setFollowUpDate} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Assign To</label>
                    <Select value={followUpAssignee} onValueChange={setFollowUpAssignee}>
                      <SelectTrigger><SelectValue placeholder="Select salesperson" /></SelectTrigger>
                      <SelectContent>
                        {salesExecs.map(u => (
                          <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={handleAddFollowUp} disabled={!followUpNote.trim() || !followUpDate}>
                    Save Follow-Up
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {!editing ? (
              <Button variant="outline" size="sm" className="gap-2" onClick={startEdit}><Edit2 className="h-4 w-4" /> Edit</Button>
            ) : (
              <div className="flex gap-1">
                <Button size="sm" className="gap-1" onClick={saveEdit}><Save className="h-4 w-4" /> Save</Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}><X className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {editing ? (
                <div className="space-y-3">
                  <div><label className="text-xs text-muted-foreground">Name</label><Input value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} className="h-8 text-sm" /></div>
                  <div><label className="text-xs text-muted-foreground">Email</label><Input value={editData.email} onChange={e => setEditData(p => ({ ...p, email: e.target.value }))} className="h-8 text-sm" /></div>
                  <div><label className="text-xs text-muted-foreground">Phone</label><Input value={editData.phone} onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))} className="h-8 text-sm" /></div>
                  <div><label className="text-xs text-muted-foreground">Budget</label><Input value={editData.budget} onChange={e => setEditData(p => ({ ...p, budget: e.target.value }))} className="h-8 text-sm" /></div>
                  <div><label className="text-xs text-muted-foreground">Project</label><Input value={editData.projectInterest} onChange={e => setEditData(p => ({ ...p, projectInterest: e.target.value }))} className="h-8 text-sm" /></div>
                  <div>
                    <label className="text-xs text-muted-foreground">Status</label>
                    <Select value={editData.status} onValueChange={(v) => setEditData(p => ({ ...p, status: v as LeadStatus }))}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>{config.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">Score: {lead.score}/100</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /><span>{lead.phone}</span></div>
                    <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /><span>{lead.email}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /><span>{lead.projectInterest}</span></div>
                    <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-muted-foreground" /><span>{lead.assignedToName}</span></div>
                  </div>
                  <div className="pt-2 border-t border-border/50 space-y-1.5">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Budget</span><span className="font-medium">{lead.budget}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Source</span><span className="font-medium">{LEAD_SOURCE_CONFIG[lead.source].label}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Created</span><span className="font-medium">{format(new Date(lead.createdAt), 'dd MMM yyyy')}</span></div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Pending Tasks ({leadTasks.filter(t => t.status !== 'completed').length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {leadTasks.filter(t => t.status !== 'completed').length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No pending tasks</p>
              ) : (
                leadTasks.filter(t => t.status !== 'completed').map(task => (
                  <div key={task.id} className="p-3 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start gap-2">
                      <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                        task.status === 'overdue' ? 'bg-destructive' :
                        task.priority === 'urgent' ? 'bg-destructive' :
                        task.priority === 'high' ? 'bg-warning' : 'bg-muted-foreground'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {task.assignedToName} · {format(new Date(task.dueDate), 'dd MMM, h:mm a')}
                        </p>
                      </div>
                      <Badge variant="secondary" className={cn('text-[10px]',
                        task.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                      )}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Lead Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="relative h-28 w-28">
                  <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                      strokeDasharray={`${lead.score * 2.64} 264`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{lead.score}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => toast.info(`Calling ${lead.phone}`)}><Phone className="h-3 w-3" /> Call</Button>
                <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => toast.info(`Emailing ${lead.email}`)}><Mail className="h-3 w-3" /> Email</Button>
                <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => toast.info(`Opening WhatsApp for ${lead.phone}`)}><MessageCircle className="h-3 w-3" /> WhatsApp</Button>
                <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => navigate('/site-visits')}><MapPin className="h-3 w-3" /> Site Visit</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {timeline.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No activity yet</p>
            ) : (
              <div className="space-y-1">
                {timeline.map(item => {
                  const Icon = activityIcons[item.type] || FileText;
                  return (
                    <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{item.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.by} · {formatTime(item.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default LeadDetail;
