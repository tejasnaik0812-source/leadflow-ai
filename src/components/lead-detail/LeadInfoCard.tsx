import { Lead, LEAD_STATUS_CONFIG, LEAD_SOURCE_CONFIG, LeadStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Users, Edit2, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

interface LeadInfoCardProps {
  lead: Lead;
  onSave: (data: Partial<Lead>) => void;
}

export function LeadInfoCard({ lead, onSave }: LeadInfoCardProps) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '', email: '', phone: '', budget: '', projectInterest: '', status: '' as LeadStatus,
  });

  const startEdit = () => {
    setEditData({
      name: lead.name, email: lead.email, phone: lead.phone,
      budget: lead.budget, projectInterest: lead.projectInterest, status: lead.status,
    });
    setEditing(true);
  };

  const saveEdit = () => {
    onSave(editData);
    setEditing(false);
  };

  return (
    <Card className="glass-card border-border/50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {lead.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold text-sm">{lead.name}</p>
              <p className="text-xs text-muted-foreground">Score: {lead.score}/100</p>
            </div>
          </div>
          {!editing ? (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={startEdit}>
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button size="icon" className="h-7 w-7" onClick={saveEdit}><Save className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(false)}><X className="h-3.5 w-3.5" /></Button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-2">
            <Input value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} className="h-8 text-sm" placeholder="Name" />
            <Input value={editData.phone} onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))} className="h-8 text-sm" placeholder="Phone" />
            <Input value={editData.email} onChange={e => setEditData(p => ({ ...p, email: e.target.value }))} className="h-8 text-sm" placeholder="Email" />
            <Input value={editData.budget} onChange={e => setEditData(p => ({ ...p, budget: e.target.value }))} className="h-8 text-sm" placeholder="Budget" />
            <Input value={editData.projectInterest} onChange={e => setEditData(p => ({ ...p, projectInterest: e.target.value }))} className="h-8 text-sm" placeholder="Project" />
            <Select value={editData.status} onValueChange={(v) => setEditData(p => ({ ...p, status: v as LeadStatus }))}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className={`${LEAD_STATUS_CONFIG[lead.status].color} text-[10px]`}>
                {LEAD_STATUS_CONFIG[lead.status].label}
              </Badge>
              <Badge variant="outline" className="text-[10px]">{LEAD_SOURCE_CONFIG[lead.source].label}</Badge>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /><span>{lead.phone}</span></div>
              <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /><span>{lead.email}</span></div>
              <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-muted-foreground" /><span>{lead.projectInterest}</span></div>
              <div className="flex items-center gap-2"><Users className="h-3 w-3 text-muted-foreground" /><span>{lead.assignedToName}</span></div>
            </div>
            <div className="pt-2 border-t border-border/50 space-y-1">
              <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">Budget</span><span className="font-medium">{lead.budget}</span></div>
              <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">Created</span><span className="font-medium">{format(new Date(lead.createdAt), 'dd MMM yyyy')}</span></div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
