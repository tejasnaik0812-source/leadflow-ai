import { Activity, ActivityType } from '@/types';
import { Phone, Mail, MessageCircle, MapPin, FileText, ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const activityIcons: Record<ActivityType, React.ElementType> = {
  call: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  site_visit: MapPin,
  note: FileText,
  status_change: ArrowRight,
  meeting: Calendar,
  site_visit_completed: CheckCircle2,
};

const activityColors: Record<ActivityType, string> = {
  call: 'bg-chart-1/10 text-primary',
  email: 'bg-chart-4/10 text-foreground',
  whatsapp: 'bg-success/10 text-success',
  site_visit: 'bg-warning/10 text-warning',
  note: 'bg-muted text-muted-foreground',
  status_change: 'bg-primary/10 text-primary',
  meeting: 'bg-chart-3/10 text-foreground',
  site_visit_completed: 'bg-success/10 text-success',
};

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-1">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type];
        return (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', activityColors[activity.type])}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.leadName}</span>
                <span className="text-muted-foreground"> — {activity.description}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.createdBy} · {formatTime(activity.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
