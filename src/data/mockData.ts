import { Lead, Activity, Task, SiteVisit, Conversation, User, Project } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Rajesh Kumar', email: 'rajesh@propcorp.in', role: 'admin', phone: '+91 98765 43210', isActive: true },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@propcorp.in', role: 'sales_manager', phone: '+91 98765 43211', isActive: true },
  { id: 'u3', name: 'Amit Patel', email: 'amit@propcorp.in', role: 'sales_executive', phone: '+91 98765 43212', isActive: true },
  { id: 'u4', name: 'Sneha Gupta', email: 'sneha@propcorp.in', role: 'sales_executive', phone: '+91 98765 43213', isActive: true },
  { id: 'u5', name: 'Vikram Singh', email: 'vikram@propcorp.in', role: 'sales_executive', phone: '+91 98765 43214', isActive: true },
];

export const mockProjects: Project[] = [
  { id: 'p1', name: 'Skyline Towers', location: 'Bandra West, Mumbai', type: '2/3 BHK', priceRange: '₹1.5Cr - ₹3.2Cr', status: 'active' },
  { id: 'p2', name: 'Green Valley Villas', location: 'Whitefield, Bangalore', type: 'Villa', priceRange: '₹2.1Cr - ₹4.5Cr', status: 'active' },
  { id: 'p3', name: 'Metro Heights', location: 'Sector 150, Noida', type: '2/3/4 BHK', priceRange: '₹85L - ₹1.8Cr', status: 'active' },
  { id: 'p4', name: 'Palm Residency', location: 'Hinjewadi, Pune', type: '1/2 BHK', priceRange: '₹45L - ₹95L', status: 'upcoming' },
];

export const mockLeads: Lead[] = [
  { id: 'l1', name: 'Ananya Reddy', email: 'ananya@gmail.com', phone: '+91 99887 76655', status: 'new', source: 'website', budget: '₹1.5Cr - ₹2Cr', projectInterest: 'Skyline Towers', assignedTo: 'u3', assignedToName: 'Amit Patel', createdAt: '2026-02-19T09:30:00', lastActivity: '2026-02-19T09:30:00', notes: [], score: 72 },
  { id: 'l2', name: 'Rohit Mehta', email: 'rohit.m@outlook.com', phone: '+91 88776 65544', status: 'contacted', source: 'whatsapp', budget: '₹90L - ₹1.2Cr', projectInterest: 'Metro Heights', assignedTo: 'u4', assignedToName: 'Sneha Gupta', createdAt: '2026-02-18T14:20:00', lastActivity: '2026-02-19T08:15:00', notes: [{ id: 'n1', content: 'Interested in 3BHK, east-facing preferred', createdAt: '2026-02-18T14:25:00', createdBy: 'Sneha Gupta' }], score: 65 },
  { id: 'l3', name: 'Kavitha Nair', email: 'kavitha.n@yahoo.com', phone: '+91 77665 54433', status: 'interested', source: 'referral', budget: '₹2.5Cr - ₹3.5Cr', projectInterest: 'Green Valley Villas', assignedTo: 'u3', assignedToName: 'Amit Patel', createdAt: '2026-02-15T10:00:00', lastActivity: '2026-02-18T16:30:00', notes: [{ id: 'n2', content: 'Looking for 4BHK villa, has visited competitor project', createdAt: '2026-02-15T11:00:00', createdBy: 'Amit Patel' }, { id: 'n3', content: 'Follow up call done, interested in site visit', createdAt: '2026-02-17T14:00:00', createdBy: 'Amit Patel' }], score: 85 },
  { id: 'l4', name: 'Suresh Iyer', email: 'suresh.i@gmail.com', phone: '+91 66554 43322', status: 'site_visit', source: 'property_portal', budget: '₹1.8Cr - ₹2.5Cr', projectInterest: 'Skyline Towers', assignedTo: 'u5', assignedToName: 'Vikram Singh', createdAt: '2026-02-12T09:00:00', lastActivity: '2026-02-19T07:00:00', notes: [{ id: 'n4', content: 'Site visit scheduled for Feb 20th, 3PM', createdAt: '2026-02-18T16:00:00', createdBy: 'Vikram Singh' }], score: 88 },
  { id: 'l5', name: 'Deepika Joshi', email: 'deepika.j@gmail.com', phone: '+91 55443 32211', status: 'negotiation', source: 'walk_in', budget: '₹60L - ₹80L', projectInterest: 'Palm Residency', assignedTo: 'u4', assignedToName: 'Sneha Gupta', createdAt: '2026-02-08T11:00:00', lastActivity: '2026-02-18T18:00:00', notes: [], score: 92 },
  { id: 'l6', name: 'Manoj Tiwari', email: 'manoj.t@hotmail.com', phone: '+91 44332 21100', status: 'booked', source: 'social_media', budget: '₹1Cr - ₹1.3Cr', projectInterest: 'Metro Heights', assignedTo: 'u3', assignedToName: 'Amit Patel', createdAt: '2026-02-01T09:00:00', lastActivity: '2026-02-17T10:00:00', notes: [], score: 100 },
  { id: 'l7', name: 'Fatima Sheikh', email: 'fatima.s@gmail.com', phone: '+91 33221 10099', status: 'new', source: 'whatsapp', budget: '₹50L - ₹70L', projectInterest: 'Palm Residency', assignedTo: 'u5', assignedToName: 'Vikram Singh', createdAt: '2026-02-19T10:00:00', lastActivity: '2026-02-19T10:00:00', notes: [], score: 45 },
  { id: 'l8', name: 'Arjun Kapoor', email: 'arjun.k@gmail.com', phone: '+91 22110 09988', status: 'contacted', source: 'phone', budget: '₹3Cr - ₹4Cr', projectInterest: 'Green Valley Villas', assignedTo: 'u3', assignedToName: 'Amit Patel', createdAt: '2026-02-17T15:00:00', lastActivity: '2026-02-18T11:00:00', notes: [], score: 58 },
  { id: 'l9', name: 'Lakshmi Venkat', email: 'lakshmi.v@gmail.com', phone: '+91 11009 98877', status: 'interested', source: 'website', budget: '₹1.2Cr - ₹1.6Cr', projectInterest: 'Skyline Towers', assignedTo: 'u4', assignedToName: 'Sneha Gupta', createdAt: '2026-02-14T08:30:00', lastActivity: '2026-02-19T09:00:00', notes: [], score: 78 },
  { id: 'l10', name: 'Nikhil Bansal', email: 'nikhil.b@gmail.com', phone: '+91 99001 12233', status: 'site_visit', source: 'referral', budget: '₹95L - ₹1.1Cr', projectInterest: 'Metro Heights', assignedTo: 'u5', assignedToName: 'Vikram Singh', createdAt: '2026-02-10T13:00:00', lastActivity: '2026-02-18T14:00:00', notes: [], score: 81 },
];

export const mockActivities: Activity[] = [
  { id: 'a1', leadId: 'l1', leadName: 'Ananya Reddy', type: 'note', description: 'New lead from website inquiry for Skyline Towers', createdAt: '2026-02-19T09:30:00', createdBy: 'System' },
  { id: 'a2', leadId: 'l7', leadName: 'Fatima Sheikh', type: 'whatsapp', description: 'WhatsApp inquiry about Palm Residency pricing', createdAt: '2026-02-19T10:00:00', createdBy: 'System' },
  { id: 'a3', leadId: 'l4', leadName: 'Suresh Iyer', type: 'site_visit', description: 'Site visit confirmed for Feb 20th, 3:00 PM', createdAt: '2026-02-18T16:00:00', createdBy: 'Vikram Singh' },
  { id: 'a4', leadId: 'l5', leadName: 'Deepika Joshi', type: 'call', description: 'Negotiation call — discussing payment plan options', createdAt: '2026-02-18T18:00:00', createdBy: 'Sneha Gupta' },
  { id: 'a5', leadId: 'l3', leadName: 'Kavitha Nair', type: 'call', description: 'Follow-up call, confirmed interest in villa plot A-12', createdAt: '2026-02-18T16:30:00', createdBy: 'Amit Patel' },
  { id: 'a6', leadId: 'l2', leadName: 'Rohit Mehta', type: 'email', description: 'Sent brochure and floor plans for Metro Heights', createdAt: '2026-02-19T08:15:00', createdBy: 'Sneha Gupta' },
  { id: 'a7', leadId: 'l6', leadName: 'Manoj Tiwari', type: 'status_change', description: 'Status changed to Booked — Unit B-1204', createdAt: '2026-02-17T10:00:00', createdBy: 'Amit Patel' },
  { id: 'a8', leadId: 'l9', leadName: 'Lakshmi Venkat', type: 'meeting', description: 'Virtual meeting scheduled for Feb 20th', createdAt: '2026-02-19T09:00:00', createdBy: 'Sneha Gupta' },
];

export const mockTasks: Task[] = [
  { id: 't1', leadId: 'l1', leadName: 'Ananya Reddy', title: 'Initial follow-up call', description: 'Call new lead about Skyline Towers inquiry', dueDate: '2026-02-19T14:00:00', priority: 'high', status: 'pending', assignedTo: 'u3', assignedToName: 'Amit Patel' },
  { id: 't2', leadId: 'l3', leadName: 'Kavitha Nair', title: 'Schedule site visit', description: 'Arrange Green Valley Villas site visit', dueDate: '2026-02-20T10:00:00', priority: 'high', status: 'pending', assignedTo: 'u3', assignedToName: 'Amit Patel' },
  { id: 't3', leadId: 'l5', leadName: 'Deepika Joshi', title: 'Send payment plan', description: 'Share EMI and payment options for Palm Residency', dueDate: '2026-02-19T16:00:00', priority: 'urgent', status: 'pending', assignedTo: 'u4', assignedToName: 'Sneha Gupta' },
  { id: 't4', leadId: 'l2', leadName: 'Rohit Mehta', title: 'Follow up on brochure', description: 'Check if brochure was reviewed', dueDate: '2026-02-20T11:00:00', priority: 'medium', status: 'pending', assignedTo: 'u4', assignedToName: 'Sneha Gupta' },
  { id: 't5', leadId: 'l8', leadName: 'Arjun Kapoor', title: 'Share villa details', description: 'Send Green Valley available plots info', dueDate: '2026-02-18T17:00:00', priority: 'medium', status: 'overdue', assignedTo: 'u3', assignedToName: 'Amit Patel' },
  { id: 't6', leadId: 'l10', leadName: 'Nikhil Bansal', title: 'Confirm visit logistics', description: 'Confirm transport and timing for site visit', dueDate: '2026-02-19T12:00:00', priority: 'high', status: 'pending', assignedTo: 'u5', assignedToName: 'Vikram Singh' },
  { id: 't7', leadId: 'l4', leadName: 'Suresh Iyer', title: 'Prepare site visit folder', description: 'Print brochure, pricing, and floor plans', dueDate: '2026-02-20T09:00:00', priority: 'high', status: 'pending', assignedTo: 'u5', assignedToName: 'Vikram Singh' },
];

export const mockVisits: SiteVisit[] = [
  { id: 'v1', leadId: 'l4', leadName: 'Suresh Iyer', project: 'Skyline Towers', scheduledDate: '2026-02-20', scheduledTime: '15:00', status: 'scheduled', assignedTo: 'u5', assignedToName: 'Vikram Singh' },
  { id: 'v2', leadId: 'l10', leadName: 'Nikhil Bansal', project: 'Metro Heights', scheduledDate: '2026-02-21', scheduledTime: '11:00', status: 'scheduled', assignedTo: 'u5', assignedToName: 'Vikram Singh' },
  { id: 'v3', leadId: 'l3', leadName: 'Kavitha Nair', project: 'Green Valley Villas', scheduledDate: '2026-02-22', scheduledTime: '10:30', status: 'scheduled', assignedTo: 'u3', assignedToName: 'Amit Patel' },
  { id: 'v4', leadId: 'l6', leadName: 'Manoj Tiwari', project: 'Metro Heights', scheduledDate: '2026-02-15', scheduledTime: '14:00', status: 'completed', assignedTo: 'u3', assignedToName: 'Amit Patel', outcome: 'Positive — proceeded to booking', notes: 'Client loved the amenities and location' },
  { id: 'v5', leadId: 'l9', leadName: 'Lakshmi Venkat', project: 'Skyline Towers', scheduledDate: '2026-02-23', scheduledTime: '16:00', status: 'scheduled', assignedTo: 'u4', assignedToName: 'Sneha Gupta' },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1', leadId: 'l2', leadName: 'Rohit Mehta', lastMessage: 'Can you share the floor plans?', lastMessageAt: '2026-02-19T08:10:00', unreadCount: 1,
    messages: [
      { id: 'm1', content: 'Hi, I saw your ad for Metro Heights on Instagram', sender: 'lead', timestamp: '2026-02-18T14:20:00', type: 'text' },
      { id: 'm2', content: 'Hello Rohit! Yes, Metro Heights is our premium project in Noida. Would you like to know more?', sender: 'agent', timestamp: '2026-02-18T14:22:00', type: 'text' },
      { id: 'm3', content: 'Yes, what are the prices for 3BHK?', sender: 'lead', timestamp: '2026-02-18T14:25:00', type: 'text' },
      { id: 'm4', content: '3BHK units start from ₹1.05Cr. We have units ranging from 1450-1800 sq ft.', sender: 'agent', timestamp: '2026-02-18T14:28:00', type: 'text' },
      { id: 'm5', content: 'Can you share the floor plans?', sender: 'lead', timestamp: '2026-02-19T08:10:00', type: 'text' },
    ],
  },
  {
    id: 'c2', leadId: 'l7', leadName: 'Fatima Sheikh', lastMessage: 'What is the booking amount?', lastMessageAt: '2026-02-19T10:00:00', unreadCount: 2,
    messages: [
      { id: 'm6', content: 'Hello, I am interested in Palm Residency', sender: 'lead', timestamp: '2026-02-19T09:50:00', type: 'text' },
      { id: 'm7', content: 'What is the booking amount?', sender: 'lead', timestamp: '2026-02-19T10:00:00', type: 'text' },
    ],
  },
];

// Dashboard stats
export const dashboardStats = {
  todayLeads: 3,
  followUpsDue: 5,
  siteVisitsScheduled: 4,
  bookingsThisMonth: 1,
  conversionRate: 12.5,
  totalLeads: 10,
  revenue: '₹1.15Cr',
};

export const performanceData = [
  { name: 'Amit Patel', leads: 4, conversions: 1, visits: 2, revenue: '₹1.15Cr' },
  { name: 'Sneha Gupta', leads: 3, conversions: 0, visits: 1, revenue: '₹0' },
  { name: 'Vikram Singh', leads: 3, conversions: 0, visits: 2, revenue: '₹0' },
];

export const weeklyLeadData = [
  { day: 'Mon', leads: 4, conversions: 0 },
  { day: 'Tue', leads: 6, conversions: 1 },
  { day: 'Wed', leads: 3, conversions: 0 },
  { day: 'Thu', leads: 5, conversions: 0 },
  { day: 'Fri', leads: 7, conversions: 1 },
  { day: 'Sat', leads: 2, conversions: 0 },
  { day: 'Sun', leads: 1, conversions: 0 },
];
