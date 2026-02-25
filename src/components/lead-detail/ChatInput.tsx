import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Send, CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ChatInputProps {
  onSend: (message: string, followUpDate?: Date) => void;
  placeholder?: string;
  feedbackMode?: boolean;
  onCancelFeedback?: () => void;
}

export const ChatInput = forwardRef<{ focus: () => void }, ChatInputProps>(
  ({ onSend, placeholder = 'Add a remark or follow-up...', feedbackMode, onCancelFeedback }, ref) => {
    const [message, setMessage] = useState('');
    const [followUpDate, setFollowUpDate] = useState<Date | undefined>();
    const [calendarOpen, setCalendarOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
    }));

    useEffect(() => {
      textareaRef.current?.focus();
    }, []);

    useEffect(() => {
      if (feedbackMode) {
        textareaRef.current?.focus();
      }
    }, [feedbackMode]);

    const autoResize = () => {
      const el = textareaRef.current;
      if (el) {
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 120) + 'px';
      }
    };

    const handleSend = () => {
      if (!message.trim()) return;
      onSend(message.trim(), followUpDate);
      setMessage('');
      setFollowUpDate(undefined);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      textareaRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <div className={cn(
        "border-t border-border/50 bg-card/80 backdrop-blur-sm p-3",
        feedbackMode && "border-t-success/30 bg-success/5"
      )}>
        {feedbackMode && (
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-medium text-success">✔ Enter site visit feedback</span>
            <button onClick={onCancelFeedback} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
          </div>
        )}
        {followUpDate && !feedbackMode && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <Badge variant="secondary" className="text-[11px] gap-1.5 bg-primary/10 text-primary border-0 pr-1">
              <CalendarIcon className="h-3 w-3" />
              Follow-up: {format(followUpDate, 'dd MMM yyyy')}
              <button
                onClick={() => setFollowUpDate(undefined)}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}
        <div className="flex items-end gap-2">
          {!feedbackMode && (
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-9 w-9 shrink-0 rounded-full',
                    followUpDate && 'text-primary bg-primary/10'
                  )}
                  title="Set follow-up date"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="top">
                <Calendar
                  mode="single"
                  selected={followUpDate}
                  onSelect={(d) => { setFollowUpDate(d); setCalendarOpen(false); }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          )}

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => { setMessage(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className={cn(
                'w-full resize-none rounded-2xl border border-input bg-background px-4 py-2.5 text-sm',
                'ring-offset-background placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                'min-h-[40px] max-h-[120px] leading-relaxed',
                feedbackMode && 'border-success/30 focus-visible:ring-success/50'
              )}
            />
          </div>

          <Button
            size="icon"
            className={cn("h-9 w-9 shrink-0 rounded-full", feedbackMode && "bg-success hover:bg-success/90")}
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';
