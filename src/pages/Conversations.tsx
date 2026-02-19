import { AppLayout } from '@/components/layout/AppLayout';
import { mockConversations } from '@/data/mockData';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/types';

const Conversations = () => {
  const [selected, setSelected] = useState<Conversation | null>(mockConversations[0]);
  const [message, setMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleSelectConversation = (conv: Conversation) => {
    setSelected(conv);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-4">
          <h1 className="text-xl font-bold tracking-tight">Conversations</h1>
          <p className="text-sm text-muted-foreground">WhatsApp & chat messages</p>
        </div>

        <div className="glass-card rounded-xl overflow-hidden h-[calc(100vh-200px)] md:h-[calc(100vh-200px)]">
          {/* Desktop: side-by-side | Mobile: toggle list/chat */}
          <div className="grid lg:grid-cols-3 h-full">
            {/* Conversation list - hidden on mobile when chat is open */}
            <div className={cn(
              'border-r border-border/50 overflow-y-auto',
              showChat ? 'hidden lg:block' : 'block'
            )}>
              {mockConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={cn(
                    'p-4 border-b border-border/30 cursor-pointer hover:bg-muted/30 transition-colors',
                    selected?.id === conv.id && 'bg-muted/50'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center text-[10px] font-semibold text-success shrink-0">
                        {conv.leadName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <p className="text-sm font-medium">{conv.leadName}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">{conv.unreadCount}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate ml-10">{conv.lastMessage}</p>
                </div>
              ))}
            </div>

            {/* Chat area - hidden on mobile when list is showing */}
            <div className={cn(
              'lg:col-span-2 flex flex-col',
              showChat ? 'block' : 'hidden lg:flex'
            )}>
              {selected ? (
                <>
                  <div className="p-4 border-b border-border/50 flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 lg:hidden"
                      onClick={handleBack}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center text-[10px] font-semibold text-success">
                      {selected.leadName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selected.leadName}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> WhatsApp
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selected.messages.map(msg => (
                      <div key={msg.id} className={cn('flex', msg.sender === 'agent' ? 'justify-end' : 'justify-start')}>
                        <div className={cn(
                          'max-w-[80%] sm:max-w-[70%] rounded-xl px-3 py-2 text-sm',
                          msg.sender === 'agent'
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-muted rounded-bl-sm'
                        )}>
                          <p>{msg.content}</p>
                          <p className={cn(
                            'text-[10px] mt-1',
                            msg.sender === 'agent' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          )}>
                            {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 md:p-4 border-t border-border/50 flex gap-2">
                    <Input
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 h-9 bg-muted/50 border-none text-sm"
                      onKeyDown={e => e.key === 'Enter' && setMessage('')}
                    />
                    <Button size="sm" className="h-9 px-3">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Select a conversation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Conversations;
