import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Lead, Activity, Task, SiteVisit, Conversation, Note } from '@/types';
import {
  initialLeads,
  initialActivities,
  initialTasks,
  initialVisits,
  initialConversations,
} from '@/data/mockData';

interface CRMContextType {
  leads: Lead[];
  activities: Activity[];
  tasks: Task[];
  visits: SiteVisit[];
  conversations: Conversation[];
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
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [visits, setVisits] = useState<SiteVisit[]>(initialVisits);
  const [conversations] = useState<Conversation[]>(initialConversations);

  const addLead = useCallback((lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
  }, []);

  // Expose addLead globally for Leads page (temp bridge)
  useEffect(() => {
    (window as any).__addLeadTemp = addLead;
    return () => { delete (window as any).__addLeadTemp; };
  }, [addLead]);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, lastActivity: new Date().toISOString() } : l));
  }, []);

  const addNoteToLead = useCallback((leadId: string, note: Note) => {
    setLeads(prev => prev.map(l =>
      l.id === leadId ? { ...l, notes: [...l.notes, note], lastActivity: new Date().toISOString() } : l
    ));
  }, []);

  const addActivity = useCallback((activity: Activity) => {
    setActivities(prev => [activity, ...prev]);
  }, []);

  const addTask = useCallback((task: Task) => {
    setTasks(prev => [task, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const addVisit = useCallback((visit: SiteVisit) => {
    setVisits(prev => [visit, ...prev]);
  }, []);

  const updateVisit = useCallback((id: string, updates: Partial<SiteVisit>) => {
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
      leads, activities, tasks, visits, conversations,
      updateLead, addLead, addNoteToLead, addActivity, addTask, updateTask, addVisit, updateVisit,
      getLeadById, getActivitiesForLead, getTasksForLead, getVisitsForLead,
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
