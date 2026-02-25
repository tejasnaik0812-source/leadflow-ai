import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useCRM } from '@/context/CRMContext';
import { LEAD_STATUS_CONFIG, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/data/mockData';
import { toast } from 'sonner';
import { ArrowLeft, Phone, Mail, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { ChatTimeline, TimelineEntry } from '@/components/lead-detail/ChatTimeline';
import { ChatInput } from '@/components/lead-detail/ChatInput';
import { LeadInfoCard } from '@/components/lead-detail/LeadInfoCard';
import { Badge } from '@/components/ui/badge';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLeadById, updateLead, addNoteToLead, addActivity, addTask, getActivitiesForLead, getTasksForLead, getVisitsForLead, updateVisit } = useCRM();
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [completingVisitId, setCompletingVisitId] = useState<string | null>(null);
  const chatInputRef = useRef<{ focus: () => void }>(null);

  const lead = getLeadById(id || '');
  const leadActivities = getActivitiesForLead(id || '');
  const leadTasks = getTasksForLead(id || '');
  const leadVisits = getVisitsForLead(id || '');

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

  const scheduledVisits = leadVisits.filter(v => v.status === 'scheduled');

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
    const currentUser = mockUsers[0];
    const now = new Date().toISOString();

    if (feedbackMode && completingVisitId) {
      // Site visit completion feedback
      updateVisit(completingVisitId, {
        status: 'completed',
        outcome: message,
        notes: message,
      });

      addActivity({
        id: `a-${Date.now()}`, leadId: lead.id, leadName: lead.name,
        type: 'site_visit_completed',
        description: message,
        createdAt: now, createdBy: currentUser.name,
      });

      addNoteToLead(lead.id, {
        id: `n-${Date.now()}`, content: `Site visit feedback: ${message}`, createdAt: now, createdBy: currentUser.name,
      });

      toast.success('Site visit marked as completed!');
      setFeedbackMode(false);
      setCompletingVisitId(null);
      return;
    }

    // Normal remark flow
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

  const handleSiteVisitComplete = (visitId: string) => {
    setCompletingVisitId(visitId);
    setFeedbackMode(true);
    // Focus will happen via ChatInput's useEffect or ref
    setTimeout(() => chatInputRef.current?.focus(), 100);
  };

  const handleCancelFeedback = () => {
    setFeedbackMode(false);
    setCompletingVisitId(null);
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
          {/* Left sidebar */}
          <div className="lg:w-72 shrink-0 space-y-3 overflow-y-auto lg:max-h-full">
            <LeadInfoCard lead={lead} onSave={handleSaveLead} />

            {/* Scheduled site visits with completion action */}
            {scheduledVisits.length > 0 && (
              <div className="glass-card border-border/50 rounded-xl p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Scheduled Visits ({scheduledVisits.length})
                </p>
                <div className="space-y-2">
                  {scheduledVisits.map(visit => (
                    <div key={visit.id} className="text-xs p-2.5 rounded-lg bg-muted/30 border border-border/20 space-y-2">
                      <div>
                        <p className="font-medium">{visit.project}</p>
                        <p className="text-muted-foreground">{visit.scheduledDate} · {visit.scheduledTime}</p>
                        <p className="text-muted-foreground">{visit.assignedToName}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full h-7 text-[11px] gap-1.5 border-success/30 text-success hover:bg-success/10 hover:text-success"
                        onClick={() => handleSiteVisitComplete(visit.id)}
                        disabled={feedbackMode}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Mark Completed
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
            <div className="px-4 py-2.5 border-b border-border/50 shrink-0 flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">Activity & Remarks</p>
              {feedbackMode && (
                <Badge variant="secondary" className="text-[10px] gap-1 bg-success/10 text-success border-0 animate-fade-in">
                  <CheckCircle2 className="h-3 w-3" />
                  Enter visit feedback below
                </Badge>
              )}
            </div>
            <ChatTimeline entries={timeline} />
            <ChatInput
              ref={chatInputRef}
              onSend={handleSendMessage}
              placeholder={feedbackMode ? 'Add site visit feedback...' : 'Add a remark or follow-up...'}
              feedbackMode={feedbackMode}
              onCancelFeedback={handleCancelFeedback}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LeadDetail;
