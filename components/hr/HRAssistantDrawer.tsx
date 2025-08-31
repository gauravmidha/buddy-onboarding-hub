import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, Settings, X, Send, MessageCircle, CheckCircle2, Circle, Clock } from 'lucide-react';
import { sendHRChat, runHRAction, getGuide, updateStepStatus, type HRGuideStep, type HRActionResult } from '@/lib/hrAssistantClient';

interface HRAssistantDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: Date;
}

type TabType = 'guide' | 'chat' | 'actions';

const HRAssistantDrawer: React.FC<HRAssistantDrawerProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('guide');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m Buddy, your HR assistant. I can help you manage onboarding, send reminders, and guide you through HR processes. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [guide, setGuide] = useState<HRGuideStep[]>([]);
  const [resourcesExpanded, setResourcesExpanded] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load guide data
  useEffect(() => {
    if (open && activeTab === 'guide') {
      getGuide().then(data => setGuide(data.steps));
    }
  }, [open, activeTab]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, scrollToBottom]);

  // Handle chat message
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsStreaming(true);
    setStreamingMessage('');

    try {
      let fullResponse = '';
      for await (const chunk of sendHRChat(userMessage.content)) {
        fullResponse += chunk;
        setStreamingMessage(fullResponse);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
    }
  }, [inputValue, isStreaming]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter for newline
        return;
      } else {
        // Enter to send
        e.preventDefault();
        handleSendMessage();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [handleSendMessage, onClose]);

  // Handle step click
  const handleStepClick = useCallback(async (stepId: string) => {
    const step = guide.find(s => s.id === stepId);
    if (!step) return;

    // Update step status
    try {
      await updateStepStatus(stepId, 'doing');

      // Add system message
      const systemMessage: ChatMessage = {
        id: `system-${Date.now()}`,
        role: 'system',
        content: `Starting: ${step.title}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, systemMessage]);

      // Simulate completion after delay
      setTimeout(async () => {
        await updateStepStatus(stepId, 'done');

        const completionMessage: ChatMessage = {
          id: `completion-${Date.now()}`,
          role: 'assistant',
          content: `✓ ${step.title} completed successfully.`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, completionMessage]);
      }, 3000);

    } catch (error) {
      console.error('Error updating step:', error);
    }
  }, [guide]);

  // Handle action click
  const handleActionClick = useCallback(async (action: 'new_hire' | 'remind' | 'export' | 'at_risk') => {
    try {
      const result: HRActionResult = await runHRAction(action);

      const actionMessage: ChatMessage = {
        id: `action-${Date.now()}`,
        role: 'assistant',
        content: result.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, actionMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'system',
        content: 'Action failed. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, []);

  // Handle resource click
  const handleResourceClick = useCallback((resource: string) => {
    const resourceMessage: ChatMessage = {
      id: `resource-${Date.now()}`,
      role: 'assistant',
      content: `Opened: ${resource}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, resourceMessage]);
  }, []);

  // Focus trap and keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Focus first element when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const quickChips = [
    { label: "What's at risk?", action: () => setInputValue("What's at risk?") },
    { label: "Show step-by-step", action: () => setInputValue("Show step-by-step") },
    { label: "What to prepare?", action: () => setInputValue("What to prepare?") },
    { label: "I'm stuck", action: () => setInputValue("I'm stuck") }
  ];

  const actions = [
    { id: 'new_hire', title: 'Add New Hire', description: 'Create onboarding checklist' },
    { id: 'remind', title: 'Send Reminder', description: 'Follow up on overdue tasks' },
    { id: 'export', title: 'Export CSV', description: 'Download employee data' },
    { id: 'at_risk', title: 'At-Risk Report', description: 'Generate risk assessment' }
  ];

  const resources = [
    { title: 'Company Policies', description: 'HR policies and procedures' },
    { title: 'Benefits FAQ', description: 'Employee benefits information' },
    { title: 'Onboarding Guide', description: 'Complete onboarding process' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-[420px] max-w-[100vw] bg-white border-l border-gray-200 shadow-2xl transition-transform duration-200 flex flex-col"
        role="dialog"
        aria-labelledby="hr-assistant-title"
        aria-describedby="hr-assistant-subtitle"
      >
        {/* Header */}
        <header className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 id="hr-assistant-title" className="text-lg font-semibold text-gray-900">
              Buddy — HR Assistant
            </h2>
            <p id="hr-assistant-subtitle" className="text-sm text-gray-600">
              HR Copilot
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Open documentation"
              title="Documentation"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Open settings"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Close assistant"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tabs */}
        <nav className="flex gap-1 p-2 border-b border-gray-200" role="tablist">
          {[
            { id: 'guide', label: 'Guide' },
            { id: 'chat', label: 'Chat' },
            { id: 'actions', label: 'Actions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'guide' && (
              <div className="h-full overflow-y-auto">
                <div className="p-4 space-y-3">
                  {guide.map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {step.status === 'done' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : step.status === 'doing' ? (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{step.title}</p>
                          <p className="text-xs text-gray-600">{step.eta}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStepClick(step.id)}
                        disabled={step.status === 'done'}
                        className="px-3 py-1 text-xs font-medium bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {step.status === 'done' ? 'Done' : 'Start'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div ref={chatContainerRef} className="h-full overflow-y-auto">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                          message.role === 'user'
                            ? 'bg-gray-900 text-white'
                            : message.role === 'assistant'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {streamingMessage && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-800 shadow-sm">
                        <div className="whitespace-pre-wrap">{streamingMessage}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="animate-pulse">●</span> Typing...
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="h-full overflow-y-auto">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleActionClick(action.id as any)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 text-left transition-colors"
                      >
                        <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resources */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => setResourcesExpanded(!resourcesExpanded)}
              className="w-full px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-between"
            >
              <span>Resources</span>
              <span className={`transition-transform ${resourcesExpanded ? 'rotate-180' : ''}`}>⌃</span>
            </button>
            {resourcesExpanded && (
              <div className="px-4 pb-3 space-y-2">
                {resources.map((resource) => (
                  <button
                    key={resource.title}
                    onClick={() => handleResourceClick(resource.title)}
                    className="w-full text-left p-2 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                    <div className="text-xs text-gray-600">{resource.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-gray-200 p-4">
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={chip.action}
                  className="px-2.5 py-1 text-xs border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about HR processes..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 min-h-[40px] max-h-32"
                  rows={1}
                  disabled={isStreaming}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isStreaming}
                className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HRAssistantDrawer;
