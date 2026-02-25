export type UserRole = 'admin' | 'sales_manager' | 'sales_executive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone: string;
  isActive: boolean;
}

export type LeadStatus = 'new' | 'contacted' | 'interested' | 'site_visit' | 'negotiation' | 'booked';
export type LeadSource = 'website' | 'whatsapp' | 'referral' | 'walk_in' | 'social_media' | 'property_portal' | 'phone';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  budget: string;
  projectInterest: string;
  assignedTo: string;
  assignedToName: string;
  createdAt: string;
  lastActivity: string;
  notes: Note[];
  score: number;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export type ActivityType = 'call' | 'email' | 'whatsapp' | 'site_visit' | 'site_visit_completed' | 'note' | 'status_change' | 'meeting';

export interface Activity {
  id: string;
  leadId: string;
  leadName: string;
  type: ActivityType;
  description: string;
  createdAt: string;
  createdBy: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'completed' | 'overdue';

export interface Task {
  id: string;
  leadId: string;
  leadName: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  assignedToName: string;
}

export type VisitStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface SiteVisit {
  id: string;
  leadId: string;
  leadName: string;
  project: string;
  scheduledDate: string;
  scheduledTime: string;
  status: VisitStatus;
  assignedTo: string;
  assignedToName: string;
  outcome?: string;
  notes?: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  messages: Message[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  sender: 'agent' | 'lead';
  timestamp: string;
  type: 'text' | 'image' | 'document';
}

export interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
  priceRange: string;
  status: 'active' | 'upcoming' | 'sold_out';
}

export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: 'New Lead', color: 'bg-primary/10 text-primary' },
  contacted: { label: 'Contacted', color: 'bg-chart-4/20 text-foreground' },
  interested: { label: 'Interested', color: 'bg-warning/10 text-warning' },
  site_visit: { label: 'Site Visit', color: 'bg-chart-3/20 text-foreground' },
  negotiation: { label: 'Negotiation', color: 'bg-chart-1/20 text-foreground' },
  booked: { label: 'Booked', color: 'bg-success/10 text-success' },
};

export const LEAD_SOURCE_CONFIG: Record<LeadSource, { label: string; icon: string }> = {
  website: { label: 'Website', icon: 'Globe' },
  whatsapp: { label: 'WhatsApp', icon: 'MessageCircle' },
  referral: { label: 'Referral', icon: 'Users' },
  walk_in: { label: 'Walk-in', icon: 'Footprints' },
  social_media: { label: 'Social Media', icon: 'Share2' },
  property_portal: { label: 'Property Portal', icon: 'Building' },
  phone: { label: 'Phone', icon: 'Phone' },
};
