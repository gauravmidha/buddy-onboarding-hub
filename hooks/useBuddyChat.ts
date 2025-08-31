'use client';

import { useState, useCallback } from 'react';

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

interface ChatContext {
  taskId?: string;
  title?: string;
}

export const useBuddyChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I\'m Buddy, your AI onboarding assistant. I\'m here to help you navigate your onboarding process smoothly. What would you like to know?',
      timestamp: new Date(),
      actions: [
        { type: 'complete', label: 'Mark Complete' },
        { type: 'docs', label: 'View Docs' },
        { type: 'help', label: 'Get Help' }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ChatContext>({});

  const generateMockResponse = useCallback((userMessage: string): Message => {
    const message = userMessage.toLowerCase();

    let response = '';
    let actions: Message['actions'] = [];

    // Context-aware responses
    if (context.taskId && context.title) {
      if (message.includes('step') || message.includes('guide')) {
        response = `Here's a step-by-step guide for "${context.title}":\n\n1. Review the task requirements carefully\n2. Gather all necessary information\n3. Follow the checklist items\n4. Complete each step systematically\n5. Mark the task as complete when done\n\nWould you like me to help you with any specific step?`;
        actions = [
          { type: 'complete', label: 'Mark Complete' },
          { type: 'help', label: 'More Details' }
        ];
      } else if (message.includes('prepare') || message.includes('need')) {
        response = `To prepare for "${context.title}", you'll need:\n\n✅ Access to your work email\n✅ Company laptop/desktop\n✅ VPN credentials (if applicable)\n✅ Manager contact information\n\nI can help you get any of these if you're missing them.`;
        actions = [
          { type: 'docs', label: 'View Checklist' },
          { type: 'help', label: 'Get Help' }
        ];
      } else if (message.includes('stuck') || message.includes('help')) {
        response = `I understand you're working on "${context.title}". Let me help you get unstuck:\n\n1. What specific part are you having trouble with?\n2. Have you reviewed the documentation?\n3. Would you like me to walk you through it step by step?\n\nI'm here to help!`;
        actions = [
          { type: 'docs', label: 'View Docs' },
          { type: 'complete', label: 'Try Again' }
        ];
      } else {
        response = `I see you're working on "${context.title}". How can I assist you with this task? I can provide guidance, show you documentation, or help you complete it step by step.`;
        actions = [
          { type: 'complete', label: 'Mark Complete' },
          { type: 'docs', label: 'View Docs' },
          { type: 'help', label: 'Get Help' }
        ];
      }
    } else {
      // General responses
      if (message.includes('hello') || message.includes('hi')) {
        response = 'Hello! Welcome to your onboarding journey. I\'m Buddy, your AI assistant. How can I help you today?';
        actions = [
          { type: 'help', label: 'Show Tasks' },
          { type: 'docs', label: 'View Guide' }
        ];
      } else if (message.includes('task') || message.includes('complete')) {
        response = 'I can help you with your onboarding tasks! You can view all your tasks in the dashboard above. Would you like me to guide you through completing one?';
        actions = [
          { type: 'help', label: 'Show Tasks' },
          { type: 'docs', label: 'View Guide' }
        ];
      } else if (message.includes('help') || message.includes('support')) {
        response = 'I\'m here to help! I can assist you with:\n\n• Completing onboarding tasks\n• Finding documentation\n• Answering questions about processes\n• Guiding you through procedures\n\nWhat would you like help with?';
        actions = [
          { type: 'docs', label: 'View Docs' },
          { type: 'help', label: 'More Help' }
        ];
      } else {
        response = 'I understand you\'re asking about that. Let me help you find the right information or guide you through the process. What specific aspect would you like assistance with?';
        actions = [
          { type: 'help', label: 'Get Help' },
          { type: 'docs', label: 'View Docs' }
        ];
      }
    }

    return {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      actions
    };
  }, [context]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 600));

    // Generate and add assistant response
    const assistantResponse = generateMockResponse(content);
    setMessages(prev => [...prev, assistantResponse]);
    setIsTyping(false);
  }, [generateMockResponse]);

  const suggest = useCallback(async (suggestion: string) => {
    await sendMessage(suggestion);
  }, [sendMessage]);

  const markComplete = useCallback(async (taskId: string) => {
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      role: 'system',
      content: `Task ${taskId} marked as complete! Great job! 🎉`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, systemMessage]);
  }, []);

  return {
    messages,
    sendMessage,
    suggest,
    markComplete,
    isTyping,
    context,
    setContext
  };
};
