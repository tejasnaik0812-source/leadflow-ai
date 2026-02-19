import { AppLayout } from '@/components/layout/AppLayout';
import { mockLeads } from '@/data/mockData';
import { LEAD_STATUS_CONFIG, LeadStatus, Lead } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Phone, GripVertical, User } from 'lucide-react';

const PIPELINE_STAGES: LeadStatus[] = ['new', 'contacted', 'interested', 'site_visit', 'negotiation', 'booked'];

const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId);
  };

  const handleDrop = (status: LeadStatus) => {
    if (!draggedLead) return;
    setLeads(prev => prev.map(l => l.id === draggedLead ? { ...l, status } : l));
    setDraggedLead(null);
  };

  return (
    <AppLayout>
      <div className="space-y-4 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-sm text-muted-foreground">Drag leads between stages</p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.status === stage);
            const config = LEAD_STATUS_CONFIG[stage];
            return (
              <div
                key={stage}
                className="kanban-column min-w-[260px] flex-shrink-0"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(stage)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`${config.color} text-[10px]`}>
                      {config.label}
                    </Badge>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground bg-muted rounded-full h-5 w-5 flex items-center justify-center">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => handleDragStart(lead.id)}
                      className={cn(
                        'bg-card border border-border/50 rounded-lg p-3 cursor-grab active:cursor-grabbing lead-card-hover',
                        draggedLead === lead.id && 'opacity-50'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary shrink-0">
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-tight">{lead.name}</p>
                            <p className="text-[10px] text-muted-foreground">{lead.phone}</p>
                          </div>
                        </div>
                        <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{lead.projectInterest}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{lead.budget}</span>
                        <div className="flex items-center gap-1">
                          <div className="h-1 w-8 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${lead.score}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{lead.score}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Pipeline;
