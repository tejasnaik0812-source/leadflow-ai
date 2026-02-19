import { AppLayout } from '@/components/layout/AppLayout';
import { mockUsers } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Mail, Phone, Shield, UserCheck, UserX } from 'lucide-react';

const roleColors: Record<string, string> = {
  admin: 'bg-primary/10 text-primary',
  sales_manager: 'bg-warning/10 text-warning',
  sales_executive: 'bg-success/10 text-success',
};

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  sales_manager: 'Sales Manager',
  sales_executive: 'Sales Executive',
};

const Team = () => {
  return (
    <AppLayout>
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Team</h1>
            <p className="text-sm text-muted-foreground">{mockUsers.length} members</p>
          </div>
          <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Member</Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockUsers.map(user => (
            <Card key={user.id} className="glass-card border-border/50 lead-card-hover">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      {user.isActive ? (
                        <div className="h-2 w-2 rounded-full bg-success shrink-0" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-muted-foreground shrink-0" />
                      )}
                    </div>
                    <Badge variant="secondary" className={`${roleColors[user.role]} text-[10px] mt-1`}>
                      {roleLabels[user.role]}
                    </Badge>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Mail className="h-3 w-3" /> {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Phone className="h-3 w-3" /> {user.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Team;
