'use client';

import { Bot, User, CheckCircle2, FileText, HelpCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: Date;
  actions?: Array<{
    type: 'complete' | 'docs' | 'help';
    label: string;
  }>;
}

interface MessageBubbleProps {
  message: Message;
  onActionClick?: (action: string) => void;
}

export const MessageBubble = ({ message, onActionClick }: MessageBubbleProps) => {
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'complete':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'docs':
        return <FileText className="w-4 h-4" />;
      case 'help':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'complete':
        return 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20';
      case 'docs':
        return 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20';
      case 'help':
        return 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20';
      default:
        return 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20';
    }
  };

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm px-4 py-2 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 ${isAssistant ? '' : 'justify-end'}`}>
      {isAssistant && (
        <div className="w-8 h-8 bg-gradient-to-br from-[#e99f75] to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="flex flex-col space-y-2 max-w-[75%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm",
            isAssistant
              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              : "bg-gradient-to-r from-[#e99f75] to-orange-500 text-white"
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {/* Action buttons */}
        {isAssistant && message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => onActionClick?.(action.type)}
                className={cn(
                  "inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
                  getActionColor(action.type)
                )}
                aria-label={action.label}
              >
                {getActionIcon(action.type)}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className={cn(
          "text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1",
          isAssistant ? "" : "justify-end"
        )}>
          <Clock className="w-3 h-3" />
          <span>{formatTime(message.timestamp)}</span>
        </div>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};
