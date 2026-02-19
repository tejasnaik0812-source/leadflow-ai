import { AppLayout } from '@/components/layout/AppLayout';
import { mockVisits } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarPlus, MapPin, Clock } from 'lucide-react';

const statusColors: Record<string, string> = {
  scheduled: 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
  no_show: 'bg-warning/10 text-warning',
};

const SiteVisits = () => {
  const upcoming = mockVisits.filter(v => v.status === 'scheduled');
  const past = mockVisits.filter(v => v.status !== 'scheduled');

  return (
    <AppLayout>
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Site Visits</h1>
            <p className="text-sm text-muted-foreground">{upcoming.length} upcoming visits</p>
          </div>
          <Button size="sm" className="gap-2"><CalendarPlus className="h-4 w-4" /> Schedule Visit</Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.map(visit => (
                <div key={visit.id} className="p-3 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{visit.leadName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {visit.project}
                      </p>
                    </div>
                    <Badge variant="secondary" className={`${statusColors[visit.status]} text-[10px]`}>
                      {visit.status}
                    </Badge>
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Past Visits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {past.map(visit => (
                <div key={visit.id} className="p-3 rounded-lg border border-border/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{visit.leadName}</p>
                      <p className="text-xs text-muted-foreground">{visit.project}</p>
                    </div>
                    <Badge variant="secondary" className={`${statusColors[visit.status]} text-[10px]`}>
                      {visit.status}
                    </Badge>
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
