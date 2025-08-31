import React, { useEffect, useRef, useState } from 'react';
import { useBuddy, type BuddyMessage } from '@/hooks/useBuddyHook';
import { CheckCircle2, Circle, Clock, MessageCircle, FileText, Paperclip } from 'lucide-react';

// Status pill component
function StatusPill({ status }: { status: 'todo' | 'doing' | 'done' | 'blocked' }) {
  const configs = {
    todo: { label: 'Todo', className: 'bg-gray-100 text-gray-700 border-gray-200' },
    doing: { label: 'In Progress', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    done: { label: 'Done', className: 'bg-green-100 text-green-700 border-green-200' },
    blocked: { label: 'Blocked', className: 'bg-red-100 text-red-700 border-red-200' },
  };

  const config = configs[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}

// Progress ring for guided mode
function ProgressRing({ value = 0, size = 24 }: { value?: number; size?: number }) {
  const r = size / 2 - 2, c = 2 * Math.PI * r, o = c - (value/100)*c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Progress ${value}%`}>
      <circle cx={size/2} cy={size/2} r={r} stroke="#e5e7eb" strokeWidth="2" fill="none"/>
      <circle cx={size/2} cy={size/2} r={r} stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray={c} strokeDashoffset={o} className="text-primary transition-all"/>
    </svg>
  );
}

// Scroll fade component
function ScrollFade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isAtTop, setIsAtTop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsAtTop(container.scrollTop === 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className={`absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white via-white/70 to-transparent pointer-events-none transition-opacity duration-200 z-10 ${isAtTop ? 'opacity-0' : 'opacity-100'}`} />
      <div ref={containerRef} className="h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

// Collapsible component
function Collapsible({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>⌃</span>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

// Steps list component
function StepsList({ onStepClick }: { onStepClick: (step: number) => void }) {
  const steps = [
    { id: 1, title: 'Prepare Required Information', time: '5 mins', done: false },
    { id: 2, title: 'Access Required Systems', time: '3 mins', done: false },
    { id: 3, title: 'Complete Main Task', time: '5 mins', done: false },
    { id: 4, title: 'Verify and Submit', time: '5 mins', done: false },
  ];

  return (
    <ol className="px-4 space-y-2">
      {steps.map(s => (
        <StepItem key={s.id} step={s} onClick={() => onStepClick(s.id)} />
      ))}
    </ol>
  );
}

function StepItem({ step, onClick }: { step: any; onClick: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="group">
      <button
        onClick={() => {
          onClick();
          setExpanded(!expanded);
        }}
        className="w-full rounded-md border border-gray-200 px-3 py-2 hover:border-gray-300 hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {step.done ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1 text-left">
              <div className={`text-sm truncate ${step.done ? 'line-through text-gray-500' : 'font-medium text-gray-900'}`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500">{step.time}</div>
            </div>
          </div>
          <button className="text-xs px-2 py-1 rounded border border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors">
            {step.done ? 'Review' : 'Start'}
          </button>
        </div>
      </button>

      {expanded && (
        <div className="mt-2 ml-7 space-y-1">
          <div className="text-xs text-gray-600 flex items-center space-x-1">
            <Circle className="w-3 h-3" />
            <span>Gather required documents</span>
          </div>
          <div className="text-xs text-gray-600 flex items-center space-x-1">
            <Circle className="w-3 h-3" />
            <span>Verify information accuracy</span>
          </div>
          <div className="text-xs text-gray-600 flex items-center space-x-1">
            <Circle className="w-3 h-3" />
            <span>Prepare supporting files</span>
          </div>
        </div>
      )}
    </li>
  );
}

// Message components
function AssistantMsg({ message }: { message: BuddyMessage }) {
  return (
    <div className="flex space-x-3 max-w-[85%]">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
        <MessageCircle className="w-3 h-3 text-gray-600" />
      </div>
      <div className="flex-1">
        <div className="rounded-md bg-gray-50 border border-gray-100 px-3 py-2 text-sm text-gray-800">
          {message.text}
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {new Date(message.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

function UserMsg({ message }: { message: BuddyMessage }) {
  return (
    <div className="flex space-x-3 max-w-[85%] ml-auto">
      <div className="flex-1">
        <div className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm ml-auto">
          {message.text}
        </div>
        <div className="text-xs text-gray-500 mt-1 text-left">
          {new Date(message.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
        <span className="text-xs text-primary-foreground font-medium">U</span>
      </div>
    </div>
  );
}

// Main BuddyPanel component
export default function BuddyPanel() {
  const {
    open,
    closeBuddy,
    width,
    setBuddyWidth,
    snapWidth,
    context,
    mode,
    setMode,
    setStep,
    messages,
    addMessage
  } = useBuddy();

  const panelRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [showSteps, setShowSteps] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1024);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get window width safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    console.log('BuddyPanel: Messages updated', messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close on ESC and focus trap
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBuddy();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeBuddy]);

  // Focus trap
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const focusableElements = panelRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTabKey);
  }, [open]);

  if (!open) {
    console.log('BuddyPanel: Panel not open, not rendering');
    return null;
  }

  console.log('BuddyPanel: Rendering panel, messages:', messages);

  // Drag handle with double-click snap
  const handleDragStart = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startW = width;

    const handleMouseMove = (ev: MouseEvent) => {
      const newWidth = Math.max(360, Math.min(760, startW - (ev.clientX - startX)));
      setBuddyWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  const handleDoubleClick = () => {
    snapWidth(width);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    console.log('Sending message:', text);
    addMessage({ role: 'user', text: text.trim() });
    setInputValue('');

    // Simulate assistant response
    setTimeout(() => {
      console.log('Adding assistant response');
      addMessage({
        role: 'assistant',
        text: 'I understand your question. Let me help you with that step.'
      });
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const pct = context.progressPct ?? Math.round(((context.step ?? 0) / Math.max(context.totalSteps ?? 1, 1)) * 100);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={closeBuddy} aria-hidden="true" />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-labelledby="buddy-title"
        className="fixed top-0 right-0 z-50 h-screen bg-white border-l border-gray-200 flex flex-col"
        style={{ width }}
      >
        {/* Drag handle */}
        <div
          onMouseDown={handleDragStart}
          onDoubleClick={handleDoubleClick}
          className="absolute left-0 top-0 h-full w-1 cursor-col-resize group"
          aria-hidden="true"
        >
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-16 w-1 bg-gray-300/60 rounded-full group-hover:bg-gray-400 transition-colors" />
        </div>

        {/* Header */}
        <div className="border-b border-gray-100 px-4 py-3 bg-white">
          {/* Row 1: Title and status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {mode === 'guided' && <ProgressRing value={pct} size={24} />}
              <div className="min-w-0 flex-1">
                <h2 id="buddy-title" className="text-base font-semibold text-gray-900 truncate">
                  {context.taskTitle || 'Onboarding Task'}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <StatusPill status={context.status || 'todo'} />
                  <span className="text-xs text-gray-500">
                    Step {context.step ?? 0} of {context.totalSteps ?? 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <div className="flex rounded-md border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setMode('guided')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    mode === 'guided'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Guided
                </button>
                <button
                  onClick={() => setMode('chat')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    mode === 'chat'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Free Chat
                </button>
              </div>
              <button
                onClick={closeBuddy}
                className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Close assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Row 2: Toolbar */}
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20">
              Mark Complete
            </button>
            <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20">
              Save & Resume
            </button>
            <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20">
              Ask HR
            </button>
            <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20">
              Open Docs
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className={`flex-1 overflow-hidden ${mode === 'chat' && !showSteps ? 'grid-cols-1' : 'xl:grid-cols-[42%_58%] lg:grid-cols-1'} grid`}>
          {/* Steps column */}
          {(mode === 'guided' || showSteps) && (
            <div className="border-r border-gray-100 xl:block lg:hidden">
              <ScrollFade className="h-full">
                <div className="divide-y divide-gray-100">
                  <Collapsible title="Task Steps" defaultOpen>
                    <StepsList onStepClick={setStep} />
                  </Collapsible>
                  <Collapsible title="Resources" defaultOpen={false}>
                    <div className="px-4 pb-3">
                      <div className="space-y-2">
                        <a href="#" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1">
                          <FileText className="w-4 h-4" />
                          <span>Payroll Policy</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1">
                          <FileText className="w-4 h-4" />
                          <span>Benefits Guide</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1">
                          <FileText className="w-4 h-4" />
                          <span>Security Checklist</span>
                        </a>
                      </div>
                    </div>
                  </Collapsible>
                </div>
              </ScrollFade>
            </div>
          )}

          {/* Chat column */}
          <div className="flex flex-col">
            {/* Steps toggle for mobile/chat mode */}
            {(mode === 'chat' || windowWidth < 1024) && (
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="px-4 py-2 border-b border-gray-100 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
              >
                {showSteps ? 'Hide Steps' : 'Show Steps ▸'}
              </button>
            )}

            {/* Messages */}
            <ScrollFade className="flex-1">
              <div className="px-4 py-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Start a conversation to get help with your task.</p>
                  </div>
                )}

                {messages.map(message => (
                  <div key={message.id}>
                    {message.role === 'assistant' ? (
                      <AssistantMsg message={message} />
                    ) : message.role === 'user' ? (
                      <UserMsg message={message} />
                    ) : (
                      <div className="text-center">
                        <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                          {message.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>
            </ScrollFade>

            {/* Smart chips */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    console.log('Smart chip clicked: What to prepare?');
                    handleSendMessage("What do I need to prepare?");
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  What to prepare?
                </button>
                <button
                  onClick={() => {
                    console.log('Smart chip clicked: Show step-by-step');
                    handleSendMessage("Show step-by-step");
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  Show step-by-step
                </button>
                <button
                  onClick={() => {
                    console.log('Smart chip clicked: I\'m stuck');
                    handleSendMessage("I'm stuck");
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  I'm stuck
                </button>
              </div>
            </div>

            {/* Composer */}
            <div className="border-t border-gray-100 px-4 py-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log('Form submitted with input:', inputValue);
                  handleSendMessage(inputValue);
                }}
                className="flex items-end space-x-2"
              >
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => {
                      console.log('Input value changed to:', e.target.value);
                      setInputValue(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      console.log('Key pressed:', e.key, 'Ctrl:', e.ctrlKey, 'Meta:', e.metaKey);
                      handleKeyDown(e);
                    }}
                    placeholder="Ask about this task..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[40px] max-h-32"
                    rows={1}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {inputValue.includes('\n') ? '⌘+Enter to send' : '⌘+Enter'}
                  </div>
                </div>
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
              <div className="mt-2 text-xs text-gray-500">
                Use /commands for quick actions • Type your message and press ⌘+Enter
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
