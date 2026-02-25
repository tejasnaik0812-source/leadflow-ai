import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Phone, Mail, MessageCircle, MapPin, FileText, ArrowRight, CalendarIcon, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface TimelineEntry {
  id: string;
  type: string;
  text: string;
  date: string;
  by: string;
  followUpDate?: string;
}

const activityIcons: Record<string, React.ElementType> = {
  call: Phone, email: Mail, whatsapp: MessageCircle, site_visit: MapPin,
  note: FileText, status_change: ArrowRight, meeting: CalendarIcon, follow_up: Clock,
  remark: MessageCircle,
};

const typeLabels: Record<string, string> = {
  call: 'Call', email: 'Email', whatsapp: 'WhatsApp', site_visit: 'Site Visit',
  note: 'Note', status_change: 'Status Change', meeting: 'Meeting', follow_up: 'Follow-up',
  remark: 'Remark',
};

function formatTime(d: string) {
  const date = new Date(d);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  return format(date, 'dd MMM, h:mm a');
}

function groupByDate(entries: TimelineEntry[]) {
  const groups: Record<string, TimelineEntry[]> = {};
  for (const entry of entries) {
    const key = format(new Date(entry.date), 'dd MMM yyyy');
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  }
  return Object.entries(groups);
}

export function ChatTimeline({ entries }: { entries: TimelineEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const groups = groupByDate(sorted);

  if (sorted.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <MessageCircle className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-sm text-muted-foreground">No activity yet. Start by adding a remark below.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {groups.map(([dateLabel, items]) => (
        <div key={dateLabel} className="space-y-2">
          <div className="flex justify-center">
            <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
              {dateLabel}
            </span>
          </div>
          {items.map((item) => {
            const Icon = activityIcons[item.type] || FileText;
            const isSystem = item.type === 'status_change';

            if (isSystem) {
              return (
                <div key={item.id} className="flex justify-center">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full">
                    <ArrowRight className="h-3 w-3" />
                    <span>{item.text}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.id} className="flex items-start gap-2.5 animate-fade-in">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    'rounded-2xl rounded-tl-md px-3.5 py-2.5 max-w-[85%] border border-border/30',
                    'bg-card shadow-sm'
                  )}>
                    <p className="text-sm leading-relaxed">{item.text}</p>
                    {item.followUpDate && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px] gap-1 bg-primary/10 text-primary border-0">
                          <CalendarIcon className="h-3 w-3" />
                          Follow-up: {format(new Date(item.followUpDate), 'dd MMM, h:mm a')}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground font-medium">{item.by}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground">{formatTime(item.date)}</span>
                    {typeLabels[item.type] && (
                      <>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{typeLabels[item.type]}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
