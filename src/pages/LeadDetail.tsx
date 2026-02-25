import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useCRM } from '@/context/CRMContext';
import { LEAD_STATUS_CONFIG, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/data/mockData';
import { toast } from 'sonner';
import { ArrowLeft, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import { ChatTimeline, TimelineEntry } from '@/components/lead-detail/ChatTimeline';
import { ChatInput } from '@/components/lead-detail/ChatInput';
import { LeadInfoCard } from '@/components/lead-detail/LeadInfoCard';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLeadById, updateLead, addNoteToLead, addActivity, addTask, getActivitiesForLead, getTasksForLead } = useCRM();

  const lead = getLeadById(id || '');
  const leadActivities = getActivitiesForLead(id || '');
  const leadTasks = getTasksForLead(id || '');

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

  // Build unified timeline
  const timeline: TimelineEntry[] = [
    ...leadActivities.map(a => ({
      id: a.id, type: a.type, text: a.description, date: a.createdAt, by: a.createdBy,
    })),
    ...lead.notes.map(n => ({
      id: n.id, type: 'remark' as const, text: n.content, date: n.createdAt, by: n.createdBy,
      followUpDate: leadTasks.find(t => t.description === n.content)?.dueDate,
    })),
  ];

  const handleSendMessage = (message: string, followUpDate?: Date) => {
    const currentUser = mockUsers[0]; // Rajesh Kumar (logged-in user)
    const now = new Date().toISOString();
    const noteId = `n-${Date.now()}`;

    addNoteToLead(lead.id, {
      id: noteId, content: message, createdAt: now, createdBy: currentUser.name,
    });

    addActivity({
      id: `a-${Date.now()}`, leadId: lead.id, leadName: lead.name,
      type: 'note',
      description: followUpDate
        ? `Remark added with follow-up scheduled`
        : `Remark: ${message.slice(0, 80)}`,
      createdAt: now, createdBy: currentUser.name,
    });

    if (followUpDate) {
      addTask({
        id: `t-${Date.now()}`, leadId: lead.id, leadName: lead.name,
        title: message.slice(0, 60), description: message,
        dueDate: followUpDate.toISOString(), priority: 'high', status: 'pending',
        assignedTo: currentUser.id, assignedToName: currentUser.name,
      });
    }

    toast.success(followUpDate ? 'Remark & follow-up saved!' : 'Remark added!');
  };

  const handleSaveLead = (data: Partial<typeof lead>) => {
    const oldStatus = lead.status;
    updateLead(lead.id, data);
    if (data.status && data.status !== oldStatus) {
      addActivity({
        id: `a-${Date.now()}`, leadId: lead.id, leadName: data.name || lead.name,
        type: 'status_change',
        description: `Status changed from ${LEAD_STATUS_CONFIG[oldStatus].label} to ${LEAD_STATUS_CONFIG[data.status as LeadStatus].label}`,
        createdAt: new Date().toISOString(), createdBy: mockUsers[0].name,
      });
    }
    toast.success('Lead updated!');
  };

  const pendingTasks = leadTasks.filter(t => t.status !== 'completed');

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)] animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 px-1 pb-3 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/leads')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold tracking-tight truncate">{lead.name}</h1>
            <p className="text-xs text-muted-foreground truncate">{lead.projectInterest} · {lead.budget}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Calling ${lead.phone}`)}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Emailing ${lead.email}`)}>
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`WhatsApp: ${lead.phone}`)}>
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/site-visits')}>
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Body: sidebar + chat */}
        <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0 overflow-hidden">
          {/* Left sidebar - lead info (collapsible on mobile) */}
          <div className="lg:w-72 shrink-0 space-y-3 overflow-y-auto lg:max-h-full">
            <LeadInfoCard lead={lead} onSave={handleSaveLead} />

            {/* Pending tasks summary */}
            {pendingTasks.length > 0 && (
              <div className="glass-card border-border/50 rounded-xl p-3 hidden lg:block">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Pending Tasks ({pendingTasks.length})
                </p>
                <div className="space-y-1.5">
                  {pendingTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="text-xs p-2 rounded-lg bg-muted/30 border border-border/20">
                      <p className="font-medium truncate">{task.title}</p>
                      <p className="text-muted-foreground mt-0.5">{task.assignedToName}</p>
                    </div>
                  ))}
                  {pendingTasks.length > 3 && (
                    <p className="text-[10px] text-muted-foreground text-center">+{pendingTasks.length - 3} more</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-h-0 glass-card border-border/50 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border/50 shrink-0">
              <p className="text-xs font-semibold text-muted-foreground">Activity & Remarks</p>
            </div>
            <ChatTimeline entries={timeline} />
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LeadDetail;
