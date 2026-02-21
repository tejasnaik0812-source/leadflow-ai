import { AppLayout } from '@/components/layout/AppLayout';
import { useCRM } from '@/context/CRMContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CheckCircle2, Clock, AlertTriangle, Plus, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types';
import { mockUsers } from '@/data/mockData';
import { useState } from 'react';
import { toast } from 'sonner';

const FollowUps = () => {
  const { tasks, leads, addTask, addActivity } = useCRM();
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', leadId: '', assignedTo: '', priority: 'high' as Task['priority'] });
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const overdue = tasks.filter(t => t.status === 'overdue');
  const pending = tasks.filter(t => t.status === 'pending');
  const completed = tasks.filter(t => t.status === 'completed');

  const salesExecs = mockUsers.filter(u => u.role === 'sales_executive' || u.role === 'sales_manager');

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.leadId || !dueDate) {
      toast.error('Title, lead, and due date are required');
      return;
    }
    const lead = leads.find(l => l.id === newTask.leadId);
    const assignee = mockUsers.find(u => u.id === newTask.assignedTo) || mockUsers[2];
    if (!lead) return;

    addTask({
      id: `t-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      title: newTask.title,
      description: newTask.description,
      dueDate: dueDate.toISOString(),
      priority: newTask.priority,
      status: 'pending',
      assignedTo: assignee.id,
      assignedToName: assignee.name,
    });

    addActivity({
      id: `a-${Date.now()}`, leadId: lead.id, leadName: lead.name,
      type: 'note', description: `Task created: ${newTask.title}`,
      createdAt: new Date().toISOString(), createdBy: assignee.name,
    });

    setNewTask({ title: '', description: '', leadId: '', assignedTo: '', priority: 'high' });
    setDueDate(undefined);
    setAddOpen(false);
    toast.success('Task added successfully!');
  };

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
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>Create a follow-up task for a lead.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Title *</label>
                  <Input placeholder="e.g., Follow up on pricing" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Lead *</label>
                  <Select value={newTask.leadId} onValueChange={v => setNewTask(p => ({ ...p, leadId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
                    <SelectContent>
                      {leads.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description</label>
                  <Textarea placeholder="Task details..." value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} rows={2} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Due Date *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !dueDate && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Priority</label>
                  <Select value={newTask.priority} onValueChange={v => setNewTask(p => ({ ...p, priority: v as Task['priority'] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Assign To</label>
                  <Select value={newTask.assignedTo} onValueChange={v => setNewTask(p => ({ ...p, assignedTo: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select person" /></SelectTrigger>
                    <SelectContent>
                      {salesExecs.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleAddTask} disabled={!newTask.title.trim() || !newTask.leadId || !dueDate}>
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
