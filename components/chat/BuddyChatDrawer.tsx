'use client';

import { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Maximize2,
  MessageCircle,
  Bot,
  User,
  Clock,
  FileText,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useBuddyChat } from '@/hooks/useBuddyChat';
import { MessageBubble } from './MessageBubble';
import { QuickActionPill } from './QuickActionPill';

interface BuddyChatDrawerProps {
  open: boolean;
  onClose: () => void;
  context?: {
    taskId?: string;
    title?: string;
  };
}

export const BuddyChatDrawer = ({ open, onClose, context }: BuddyChatDrawerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [resourcesCollapsed, setResourcesCollapsed] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    suggest,
    isTyping,
    context: chatContext,
    setContext
  } = useBuddyChat();

  // Update context when props change
  useEffect(() => {
    if (context) {
      setContext(context);
    }
  }, [context, setContext]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'step-by-step':
        await sendMessage("Show me step-by-step instructions for this task");
        break;
      case 'prepare':
        await sendMessage("What do I need to prepare for this task?");
        break;
      case 'stuck':
        await sendMessage("I'm stuck on this task. Can you help me?");
        break;
    }
  };

  const resources = [
    { title: 'Company Policies', description: 'HR policies and procedures' },
    { title: 'Benefits FAQ', description: 'Employee benefits information' },
    { title: 'Onboarding Guide', description: 'Complete onboarding process' },
    { title: 'IT Support', description: 'Technical assistance and resources' }
  ];

  if (!open) return null;

  const drawerWidth = isFullscreen ? 'w-full h-full' : 'w-[420px] h-full max-w-[100vw]';

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col transition-all duration-300 ${drawerWidth}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#e99f75] to-orange-500 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Buddy • AI Onboarding Assistant
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {chatContext?.title ? `Working on: ${chatContext.title}` : 'Ready to help with your onboarding'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <div
            className="h-full overflow-y-auto p-4 space-y-4"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onActionClick={handleQuickAction}
              />
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#e99f75] to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Resources Panel */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setResourcesCollapsed(!resourcesCollapsed)}
            className="w-full px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Resources & Help</span>
            {resourcesCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {!resourcesCollapsed && (
            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
              {resources.map((resource, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(`Show me ${resource.title.toLowerCase()}`)}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {resource.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {resource.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 mb-3">
            <QuickActionPill
              label="Show step-by-step"
              onClick={() => handleQuickAction('step-by-step')}
            />
            <QuickActionPill
              label="What to prepare?"
              onClick={() => handleQuickAction('prepare')}
            />
            <QuickActionPill
              label="I'm stuck"
              onClick={() => handleQuickAction('stuck')}
            />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Buddy anything about your onboarding..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e99f75] focus:border-transparent resize-none"
                rows={1}
                aria-label="Message Buddy"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                Press Enter to send, Shift+Enter for new line, / for commands
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-[#e99f75] to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
