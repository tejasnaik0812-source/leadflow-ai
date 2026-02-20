import { AppLayout } from '@/components/layout/AppLayout';
import { useCRM } from '@/context/CRMContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertTriangle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types';

const FollowUps = () => {
  const { tasks } = useCRM();
  const navigate = useNavigate();

  const overdue = tasks.filter(t => t.status === 'overdue');
  const pending = tasks.filter(t => t.status === 'pending');
  const completed = tasks.filter(t => t.status === 'completed');

  const priorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return 'bg-destructive/10 text-destructive';
      case 'high': return 'bg-warning/10 text-warning';
      case 'medium': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const TaskList = ({ tasks: taskList, emptyMsg }: { tasks: Task[]; emptyMsg: string }) => (
    <div className="space-y-2">
      {taskList.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">{emptyMsg}</p>
      ) : (
        taskList.map(task => (
          <div key={task.id} onClick={() => navigate(`/leads/${task.leadId}`)}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-border/30 cursor-pointer">
            <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${
              task.status === 'overdue' ? 'bg-destructive' :
              task.priority === 'urgent' ? 'bg-destructive' :
              task.priority === 'high' ? 'bg-warning' : 'bg-muted-foreground'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{task.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{task.leadName} · {task.assignedToName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant="secondary" className={cn('text-[10px]', priorityColor(task.priority))}>{task.priority}</Badge>
              <span className="text-[10px] text-muted-foreground">
                {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Follow-ups</h1>
            <p className="text-sm text-muted-foreground">{tasks.length} total tasks</p>
          </div>
          <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Task</Button>
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Overdue ({overdue.length})</CardTitle></CardHeader>
            <CardContent><TaskList tasks={overdue} emptyMsg="No overdue tasks!" /></CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-warning" /> Pending ({pending.length})</CardTitle></CardHeader>
            <CardContent><TaskList tasks={pending} emptyMsg="All caught up!" /></CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Completed ({completed.length})</CardTitle></CardHeader>
            <CardContent><TaskList tasks={completed} emptyMsg="Nothing completed yet" /></CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default FollowUps;
