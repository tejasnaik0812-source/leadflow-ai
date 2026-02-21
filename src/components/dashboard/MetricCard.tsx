import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  subtitle?: string;
  onClick?: () => void;
}

export function MetricCard({ title, value, change, changeType = 'neutral', icon: Icon, subtitle, onClick }: MetricCardProps) {
  return (
    <div
      className={cn('glass-card rounded-xl p-4 lead-card-hover', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold mt-1 tracking-tight">{value}</p>
          {change && (
            <p className={cn(
              'text-xs mt-1 font-medium',
              changeType === 'positive' && 'text-success',
              changeType === 'negative' && 'text-destructive',
              changeType === 'neutral' && 'text-muted-foreground',
            )}>
              {change}
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
