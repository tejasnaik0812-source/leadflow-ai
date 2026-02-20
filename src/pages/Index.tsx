import { AppLayout } from '@/components/layout/AppLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { useCRM } from '@/context/CRMContext';
import { weeklyLeadData, performanceData } from '@/data/mockData';
import { Users, CalendarCheck, ListTodo, TrendingUp, IndianRupee, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LEAD_STATUS_CONFIG } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { leads, activities, tasks, stats } = useCRM();
  const navigate = useNavigate();
  const urgentTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);
  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good morning, Rajesh</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's your sales overview for today</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard title="Total Leads" value={stats.totalLeads} subtitle="All time" icon={Users} />
          <MetricCard title="Today's Leads" value={stats.todayLeads} change={`${stats.todayLeads} new today`} changeType="positive" icon={Users} />
          <MetricCard title="Follow-ups Due" value={stats.followUpsDue} change={`${tasks.filter(t => t.status === 'overdue').length} overdue`} changeType="negative" icon={ListTodo} />
          <MetricCard title="Site Visits" value={stats.siteVisitsScheduled} subtitle="Scheduled" icon={CalendarCheck} />
          <MetricCard title="Bookings" value={stats.bookingsThisMonth} subtitle="This month" icon={Target} />
          <MetricCard title="Conversion" value={`${stats.conversionRate}%`} change="Lead to booking" changeType="neutral" icon={TrendingUp} />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Weekly Leads Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyLeadData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="conversions" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Pipeline Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(LEAD_STATUS_CONFIG).map(([status, config]) => {
                const count = leads.filter(l => l.status === status).length;
                return (
                  <div key={status} className="flex items-center justify-between">
                    <Badge variant="secondary" className={`${config.color} text-[10px] px-2`}>{config.label}</Badge>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ActivityFeed activities={activities.slice(0, 6)} />
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Recent Leads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentLeads.map(lead => (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.projectInterest} · {lead.budget}</p>
                  </div>
                  <Badge variant="secondary" className={`${LEAD_STATUS_CONFIG[lead.status].color} text-[10px]`}>
                    {LEAD_STATUS_CONFIG[lead.status].label}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {performanceData.map((person) => (
                <div key={person.name} className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-sm font-medium">{person.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Leads:</span> <span className="font-semibold">{person.leads}</span></div>
                    <div><span className="text-muted-foreground">Conversions:</span> <span className="font-semibold">{person.conversions}</span></div>
                    <div><span className="text-muted-foreground">Visits:</span> <span className="font-semibold">{person.visits}</span></div>
                    <div><span className="text-muted-foreground">Revenue:</span> <span className="font-semibold">{person.revenue}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
