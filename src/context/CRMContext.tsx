import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Lead, Activity, Task, SiteVisit, Conversation, Note } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// DB row mappers
function mapLeadRow(row: any): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email || '',
    phone: row.phone,
    status: row.status,
    source: row.source,
    budget: row.budget || '',
    projectInterest: row.project_interest || '',
    assignedTo: row.assigned_to || '',
    assignedToName: row.assigned_to_name || '',
    createdAt: row.created_at,
    lastActivity: row.last_activity,
    notes: [], // loaded separately
    score: row.score,
  };
}

function mapActivityRow(row: any): Activity {
  return {
    id: row.id,
    leadId: row.lead_id,
    leadName: row.lead_name,
    type: row.type,
    description: row.description,
    createdAt: row.created_at,
    createdBy: row.created_by,
  };
}

function mapTaskRow(row: any): Task {
  return {
    id: row.id,
    leadId: row.lead_id,
    leadName: row.lead_name,
    title: row.title,
    description: row.description || '',
    dueDate: row.due_date,
    priority: row.priority,
    status: row.status,
    assignedTo: row.assigned_to || '',
    assignedToName: row.assigned_to_name || '',
  };
}

function mapVisitRow(row: any): SiteVisit {
  return {
    id: row.id,
    leadId: row.lead_id,
    leadName: row.lead_name,
    project: row.project,
    scheduledDate: row.scheduled_date,
    scheduledTime: row.scheduled_time,
    status: row.status,
    assignedTo: row.assigned_to || '',
    assignedToName: row.assigned_to_name || '',
    outcome: row.outcome || undefined,
    notes: row.notes || undefined,
  };
}

function mapNoteRow(row: any): Note {
  return {
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    createdBy: row.created_by,
  };
}

interface CRMContextType {
  leads: Lead[];
  activities: Activity[];
  tasks: Task[];
  visits: SiteVisit[];
  conversations: Conversation[];
  loading: boolean;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  addLead: (lead: Lead) => void;
  addNoteToLead: (leadId: string, note: Note) => void;
  addActivity: (activity: Activity) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addVisit: (visit: SiteVisit) => void;
  updateVisit: (id: string, updates: Partial<SiteVisit>) => void;
  getLeadById: (id: string) => Lead | undefined;
  getActivitiesForLead: (leadId: string) => Activity[];
  getTasksForLead: (leadId: string) => Task[];
  getVisitsForLead: (leadId: string) => SiteVisit[];
  refreshData: () => void;
  stats: {
    totalLeads: number;
    todayLeads: number;
    followUpsDue: number;
    siteVisitsScheduled: number;
    siteVisitsCompleted: number;
    bookingsThisMonth: number;
    conversionRate: number;
    revenue: string;
  };
}

const CRMContext = createContext<CRMContextType | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── Fetch all data from Supabase ───
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, notesRes, activitiesRes, tasksRes, visitsRes, convsRes, msgsRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('notes').select('*').order('created_at', { ascending: true }),
        supabase.from('activities').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').order('due_date', { ascending: true }),
        supabase.from('site_visits').select('*').order('scheduled_date', { ascending: true }),
        supabase.from('conversations').select('*').order('last_message_at', { ascending: false }),
        supabase.from('messages').select('*').order('timestamp', { ascending: true }),
      ]);

      // Map notes by lead_id
      const notesByLead: Record<string, Note[]> = {};
      (notesRes.data || []).forEach(row => {
        const note = mapNoteRow(row);
        const lid = row.lead_id;
        if (!notesByLead[lid]) notesByLead[lid] = [];
        notesByLead[lid].push(note);
      });

      const mappedLeads = (leadsRes.data || []).map(row => {
        const lead = mapLeadRow(row);
        lead.notes = notesByLead[row.id] || [];
        return lead;
      });

      // Map conversations with messages
      const msgsByConv: Record<string, any[]> = {};
      (msgsRes.data || []).forEach(m => {
        if (!msgsByConv[m.conversation_id]) msgsByConv[m.conversation_id] = [];
        msgsByConv[m.conversation_id].push({
          id: m.id, content: m.content, sender: m.sender,
          timestamp: m.timestamp, type: m.type,
        });
      });

      const mappedConvs: Conversation[] = (convsRes.data || []).map(c => ({
        id: c.id, leadId: c.lead_id, leadName: c.lead_name,
        lastMessage: c.last_message || '', lastMessageAt: c.last_message_at || '',
        unreadCount: c.unread_count,
        messages: msgsByConv[c.id] || [],
      }));

      setLeads(mappedLeads);
      setActivities((activitiesRes.data || []).map(mapActivityRow));
      setTasks((tasksRes.data || []).map(mapTaskRow));
      setVisits((visitsRes.data || []).map(mapVisitRow));
      setConversations(mappedConvs);
    } catch (err) {
      console.error('Failed to fetch CRM data:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── CRUD operations ───
  const addLead = useCallback(async (lead: Lead) => {
    const { error } = await supabase.from('leads').insert([{
      name: lead.name, email: lead.email || null, phone: lead.phone,
      status: lead.status, source: lead.source, budget: lead.budget || null,
      project_interest: lead.projectInterest || null,
      assigned_to: lead.assignedTo || null, assigned_to_name: lead.assignedToName || null,
      score: lead.score, created_at: lead.createdAt, last_activity: lead.lastActivity,
    }]);
    if (error) { console.error(error); toast.error('Failed to add lead'); return; }
    fetchAll();
  }, [fetchAll]);

  const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
    const dbUpdates: any = { last_activity: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.source !== undefined) dbUpdates.source = updates.source;
    if (updates.budget !== undefined) dbUpdates.budget = updates.budget;
    if (updates.projectInterest !== undefined) dbUpdates.project_interest = updates.projectInterest;
    if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
    if (updates.assignedToName !== undefined) dbUpdates.assigned_to_name = updates.assignedToName;
    if (updates.score !== undefined) dbUpdates.score = updates.score;

    const { error } = await supabase.from('leads').update(dbUpdates).eq('id', id);
    if (error) { console.error(error); toast.error('Failed to update lead'); return; }
    // Optimistic local update
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, lastActivity: dbUpdates.last_activity } : l));
  }, []);

  const addNoteToLead = useCallback(async (leadId: string, note: Note) => {
    const { error } = await supabase.from('notes').insert([{
      lead_id: leadId, content: note.content, created_at: note.createdAt, created_by: note.createdBy,
    }]);
    if (error) { console.error(error); toast.error('Failed to add note'); return; }
    // Optimistic
    setLeads(prev => prev.map(l =>
      l.id === leadId ? { ...l, notes: [...l.notes, note], lastActivity: new Date().toISOString() } : l
    ));
    // Also update last_activity on lead
    await supabase.from('leads').update({ last_activity: new Date().toISOString() }).eq('id', leadId);
  }, []);

  const addActivity = useCallback(async (activity: Activity) => {
    const { error } = await supabase.from('activities').insert([{
      lead_id: activity.leadId, lead_name: activity.leadName,
      type: activity.type, description: activity.description,
      created_at: activity.createdAt, created_by: activity.createdBy,
    }]);
    if (error) { console.error(error); toast.error('Failed to add activity'); return; }
    setActivities(prev => [activity, ...prev]);
  }, []);

  const addTask = useCallback(async (task: Task) => {
    const { error } = await supabase.from('tasks').insert([{
      lead_id: task.leadId, lead_name: task.leadName,
      title: task.title, description: task.description,
      due_date: task.dueDate, priority: task.priority, status: task.status,
      assigned_to: task.assignedTo, assigned_to_name: task.assignedToName,
    }]);
    if (error) { console.error(error); toast.error('Failed to add task'); return; }
    setTasks(prev => [task, ...prev]);
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const dbUpdates: any = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;

    const { error } = await supabase.from('tasks').update(dbUpdates).eq('id', id);
    if (error) { console.error(error); toast.error('Failed to update task'); return; }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const addVisit = useCallback(async (visit: SiteVisit) => {
    const { error } = await supabase.from('site_visits').insert([{
      lead_id: visit.leadId, lead_name: visit.leadName, project: visit.project,
      scheduled_date: visit.scheduledDate, scheduled_time: visit.scheduledTime,
      status: visit.status, assigned_to: visit.assignedTo, assigned_to_name: visit.assignedToName,
    }]);
    if (error) { console.error(error); toast.error('Failed to add visit'); return; }
    setVisits(prev => [visit, ...prev]);
  }, []);

  const updateVisit = useCallback(async (id: string, updates: Partial<SiteVisit>) => {
    const dbUpdates: any = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.outcome !== undefined) dbUpdates.outcome = updates.outcome;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { error } = await supabase.from('site_visits').update(dbUpdates).eq('id', id);
    if (error) { console.error(error); toast.error('Failed to update visit'); return; }
    setVisits(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  }, []);

  const getLeadById = useCallback((id: string) => leads.find(l => l.id === id), [leads]);
  const getActivitiesForLead = useCallback((leadId: string) => activities.filter(a => a.leadId === leadId), [activities]);
  const getTasksForLead = useCallback((leadId: string) => tasks.filter(t => t.leadId === leadId), [tasks]);
  const getVisitsForLead = useCallback((leadId: string) => visits.filter(v => v.leadId === leadId), [visits]);

  const stats = React.useMemo(() => {
    const today = new Date().toDateString();
    const todayLeads = leads.filter(l => new Date(l.createdAt).toDateString() === today).length;
    const followUpsDue = tasks.filter(t => t.status !== 'completed').length;
    const siteVisitsScheduled = visits.filter(v => v.status === 'scheduled').length;
    const siteVisitsCompleted = visits.filter(v => v.status === 'completed').length;
    const bookingsThisMonth = leads.filter(l => l.status === 'booked').length;
    const conversionRate = leads.length > 0 ? Math.round((bookingsThisMonth / leads.length) * 1000) / 10 : 0;
    return {
      totalLeads: leads.length,
      todayLeads,
      followUpsDue,
      siteVisitsScheduled,
      siteVisitsCompleted,
      bookingsThisMonth,
      conversionRate,
      revenue: '₹1.15Cr',
    };
  }, [leads, tasks, visits]);

  return (
    <CRMContext.Provider value={{
      leads, activities, tasks, visits, conversations, loading,
      updateLead, addLead, addNoteToLead, addActivity, addTask, updateTask, addVisit, updateVisit,
      getLeadById, getActivitiesForLead, getTasksForLead, getVisitsForLead,
      refreshData: fetchAll,
      stats,
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used within CRMProvider');
  return ctx;
}
