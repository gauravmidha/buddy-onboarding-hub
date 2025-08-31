'use client';

import { useState, useRef, useEffect } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import {
  Send,
  Bot,
  User,
  CheckCircle2,
  Clock,
  Circle,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Play,
  Paperclip,
  FileText,
  ExternalLink,
  Check,
  Pause,
  HelpCircle,
  Zap,
  Users,
  Settings,
  BookOpen,
  ChevronRight,
  X,
  Target,
  Trophy,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDataRefresh } from '@/hooks/useDataRefresh';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface TaskChatbotProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  isUpdating: boolean;
}

interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  estimatedTime: string;
}

type Mode = 'guided' | 'fast';

export const TaskChatbot = ({ task, isOpen, onClose, onStatusChange, isUpdating }: TaskChatbotProps) => {
  const { triggerRefresh } = useDataRefresh();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<Mode>('guided');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [attachments, setAttachments] = useState<Array<{name: string, type: string, url?: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && task) {
      initializeChat();
    }
  }, [isOpen, task]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateStepsForTask = (task: Task): Step[] => {
    const baseSteps: Step[] = [
      {
        id: '1',
        title: 'Prepare Required Information',
        description: 'Gather all necessary documents, credentials, and information needed for this task.',
        completed: false,
        estimatedTime: '5 mins'
      },
      {
        id: '2',
        title: 'Access Required Systems',
        description: 'Log in to necessary platforms and ensure you have the right permissions.',
        completed: false,
        estimatedTime: '3 mins'
      },
      {
        id: '3',
        title: 'Complete Main Task',
        description: 'Follow the step-by-step instructions to complete the core requirements.',
        completed: false,
        estimatedTime: task.estimated_time || '10 mins'
      },
      {
        id: '4',
        title: 'Verify and Submit',
        description: 'Double-check your work and submit any required forms or confirmations.',
        completed: false,
        estimatedTime: '5 mins'
      }
    ];

    // Customize steps based on task category
    if (task.category?.toLowerCase().includes('communication')) {
      return [
        {
          id: '1',
          title: 'Update Profile Information',
          description: 'Set up your professional profile with photo, bio, and contact details.',
          completed: false,
          estimatedTime: '5 mins'
        },
        {
          id: '2',
          title: 'Configure Communication Tools',
          description: 'Set up email signature, Slack profile, and join relevant channels.',
          completed: false,
          estimatedTime: '10 mins'
        },
        {
          id: '3',
          title: 'Test Communication Channels',
          description: 'Send test messages and ensure everything is working properly.',
          completed: false,
          estimatedTime: '3 mins'
        }
      ];
    }

    if (task.category?.toLowerCase().includes('security')) {
      return [
        {
          id: '1',
          title: 'Review Security Policies',
          description: 'Read and understand company security requirements and best practices.',
          completed: false,
          estimatedTime: '5 mins'
        },
        {
          id: '2',
          title: 'Set Up Multi-Factor Authentication',
          description: 'Configure 2FA for all required accounts and systems.',
          completed: false,
          estimatedTime: '10 mins'
        },
        {
          id: '3',
          title: 'Change Default Passwords',
          description: 'Update all system passwords to strong, unique credentials.',
          completed: false,
          estimatedTime: '5 mins'
        }
      ];
    }

    return baseSteps;
  };

  const initializeChat = () => {
    if (!task) return;

    const taskSteps = generateStepsForTask(task);
    setSteps(taskSteps);

    const userName = user?.name?.split(' ')[0] || 'there';
    const progressPercentage = task.status === 'done' ? 100 : task.status === 'doing' ? 50 : 0;

    const welcomeMessages: Message[] = [
      {
        id: '1',
        type: 'assistant',
        content: `Hello ${userName}! I'm Buddy, your AI onboarding assistant. I'm here to help you complete **${task.title}**.`,
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'assistant',
        content: `You're ${progressPercentage}% through this task, which should take about ${task.estimated_time}. Let's get you to 100%!`,
        timestamp: new Date()
      }
    ];

    setMessages(welcomeMessages);
  };

  const simulateTyping = async (message: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setIsTyping(false);
    return message;
  };

  const getTaskSpecificResponses = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Enhanced keyword matching with context
    const keywords = {
      pto: ['pto', 'vacation', 'time off', 'holiday', 'leave'],
      benefits: ['benefits', 'health', 'insurance', 'dental', 'vision', 'medical'],
      payroll: ['payroll', 'salary', 'payment', 'bank', 'direct deposit', 'tax'],
      communication: ['slack', 'teams', 'email', 'communication', 'chat', 'channel'],
      security: ['2fa', 'two factor', 'security', 'password', 'authentication', 'login'],
      hr: ['hr', 'human resources', 'manager', 'supervisor', 'boss'],
      help: ['help', 'what', 'how', 'guide', 'assist', 'support'],
      start: ['start', 'begin', 'ready', 'lets go', 'get started'],
      complete: ['complete', 'done', 'finished', 'finish', 'end'],
      questions: ['question', 'ask', 'confused', 'stuck', 'problem']
    };

    // Check for PTO-related questions
    if (keywords.pto.some(word => lowerMessage.includes(word))) {
      return `**🏖️ PTO & Time Off Policy**\n\n• **Annual PTO**: 15 days per year (120 hours)\n• **Accrual**: Monthly - you'll get ~10 hours per month\n• **Carryover**: Up to 5 days (40 hours) to next year\n• **Sick Leave**: 5 days per year\n• **Request Process**: Submit through HR portal → Manager approval → Added to calendar\n\n**Quick Tips**:\n• Request PTO at least 2 weeks in advance\n• Use for vacation, personal time, or mental health days\n• Can be used in half-day increments\n\nWould you like me to help you check your current PTO balance or submit a request?`;
    }

    // Check for benefits-related questions
    if (keywords.benefits.some(word => lowerMessage.includes(word))) {
      return `**🏥 Benefits Overview**\n\n**Health Insurance**:\n• 3 plan options: Basic, Standard, Premium\n• Coverage starts your first day\n• Family coverage available\n• $0 deductible on preventive care\n\n**Dental & Vision**:\n• Included with health plans\n• Orthodontic coverage up to $2,000/year\n• Vision exams covered 100%\n\n**Additional Perks**:\n• 401(k) with 4% company match\n• Life insurance (2x salary)\n• Professional development budget ($1,000/year)\n• Gym membership reimbursement\n\nReady to enroll? I can guide you through the selection process step-by-step!`;
    }

    // Check for payroll-related questions
    if (keywords.payroll.some(word => lowerMessage.includes(word))) {
      return `**💰 Payroll Setup Guide**\n\n**What we'll set up**:\n• Direct deposit to your bank account\n• Tax withholding forms (W-4)\n• Multiple pay periods (bi-weekly)\n• Pay stub delivery preferences\n\n**Timeline**: Usually processed within 1-2 business days\n**Pay Schedule**: Every other Friday\n**Questions?** Ask about:\n• Tax implications\n• Garnishments\n• Multiple accounts\n• International payments\n\nLet's get your payroll information configured! What would you like to set up first?`;
    }

    // Check for communication tool questions
    if (keywords.communication.some(word => lowerMessage.includes(word))) {
      return `**💬 Communication Setup**\n\n**Slack Channels to Join**:\n• #general - Company announcements\n• #random - Water cooler chat\n• #team-[your-team] - Team discussions\n• #engineering - Tech updates\n• #help - Get assistance\n\n**Email Setup**:\n• Primary: your.name@company.com\n• Distribution lists auto-added\n• Signature template provided\n\n**Best Practices**:\n• Set your status when away\n• Use threads for organized conversations\n• @mention for urgent matters\n• Check notifications settings\n\nWant me to help you configure your Slack profile and join the right channels?`;
    }

    // Check for security-related questions
    if (keywords.security.some(word => lowerMessage.includes(word))) {
      return `**🔒 Security & Access**\n\n**Two-Factor Authentication (2FA)**:\n• Required for all accounts\n• Use Authenticator app (Google/Microsoft)\n• Backup codes saved automatically\n• Recovery process: 24-48 hours\n\n**Password Requirements**:\n• 12+ characters, mixed case\n• Special characters required\n• Changed every 90 days\n• Cannot reuse last 5 passwords\n\n**Account Recovery**:\n• Primary: Your registered email\n• Secondary: Manager's approval\n• Emergency: HR hotline\n\nLet's secure your account with 2FA! Do you have an authenticator app ready?`;
    }

    // Check for HR/manager questions
    if (keywords.hr.some(word => lowerMessage.includes(word))) {
      return `**👥 HR & Management Support**\n\n**Your Manager**: ${task?.employee_id === 'E-1027' ? 'Jordan Patel' : 'Check your employee profile'}\n\n**HR Contact Information**:\n• Email: hr@company.com\n• Phone: (555) 123-4567\n• Portal: hr.company.com\n• Office Hours: 9 AM - 5 PM EST\n\n**When to Contact HR**:\n• Benefits questions\n• Policy clarifications\n• Payroll issues\n• Performance concerns\n• Workplace accommodations\n\n**Quick Response Times**:\n• Urgent: Within 2 hours\n• Standard: Within 24 hours\n• Policy questions: Within 48 hours\n\nNeed to connect with HR right now?`;
    }

    // Check for help requests
    if (keywords.help.some(word => lowerMessage.includes(word))) {
      return `**🤖 I'm here to help!**\n\n**I can assist with**:\n• **Onboarding Tasks** - Step-by-step guidance\n• **Company Policies** - PTO, benefits, security\n• **Tool Setup** - Slack, email, software access\n• **HR Questions** - Benefits, payroll, procedures\n• **Technical Issues** - Account setup, permissions\n\n**Popular Questions**:\n• "How do I set up my email?"\n• "What's the PTO policy?"\n• "How do benefits work?"\n• "How do I join Slack channels?"\n• "What's my manager's name?"\n\n**Pro Tip**: Be specific about what you need help with for the best assistance!\n\nWhat can I help you with today?`;
    }

    // Check for starting/completion intents
    if (keywords.start.some(word => lowerMessage.includes(word))) {
      return `**🚀 Perfect! Let's get started!**\n\n**${task?.title}** - Estimated time: ${task?.estimated_time}\n\n**What I'll help you with**:\n• Step-by-step instructions\n• Common questions answered\n• Progress tracking\n• Completion confirmation\n\n**Ready to begin?** I'll guide you through each step. What's the first thing you'd like to know or do?`;
    }

    // Check for completion intents
    if (keywords.complete.some(word => lowerMessage.includes(word))) {
      return `**✅ Great progress!**\n\n**${task?.title}** is almost complete! 🎉\n\n**Next Steps**:\n1. Review what we've accomplished\n2. Confirm everything is working\n3. Mark the task as complete\n4. Move to the next onboarding item\n\n**Quick Check**: Is there anything else you need help with before we finish this task?\n\nReady to mark it complete? Just let me know!`;
    }

    // Check for questions about being stuck
    if (keywords.questions.some(word => lowerMessage.includes(word))) {
      return `**❓ No problem at all!**\n\n**Common questions I can help with**:\n\n**About the Process**:\n• "What do I need to do next?"\n• "How long will this take?"\n• "What if something goes wrong?"\n\n**Technical Help**:\n• "I can't access this system"\n• "The link isn't working"\n• "I forgot my password"\n\n**Policy Questions**:\n• "Can I work from home?"\n• "What's the dress code?"\n• "How do expenses work?"\n\n**Don't worry** - asking questions shows you're engaged! Every new hire has questions, and I'm here to help.\n\nWhat's on your mind?`;
    }

    // Context-aware responses based on task category
    const taskCategory = task?.category?.toLowerCase();
    if (taskCategory === 'admin' && (lowerMessage.includes('form') || lowerMessage.includes('paperwork'))) {
      return `**📄 Administrative Tasks**\n\nFor **${task?.title}**, you'll typically need:\n• Government-issued ID\n• Social Security Number\n• Address verification\n• Emergency contact info\n• Tax forms (W-4, etc.)\n\n**Pro Tips**:\n• Have these ready before starting\n• Take photos of documents\n• Process takes 5-10 minutes\n• You'll get confirmation emails\n\nLet's gather what you need and get this done efficiently!`;
    }

    if (taskCategory === 'communication' && (lowerMessage.includes('profile') || lowerMessage.includes('photo'))) {
      return `**📸 Profile Setup Best Practices**\n\n**Professional Photo Tips**:\n• Use a clear, well-lit photo\n• Business casual attire\n• Neutral background\n• Friendly, approachable expression\n\n**Profile Information**:\n• Full name (as you'd like to be addressed)\n• Job title and department\n• Contact information\n• Brief bio (optional)\n\n**Privacy Settings**:\n• Control who sees your info\n• Set notification preferences\n• Choose availability status\n\nYour profile represents you to the team - let's make it great!`;
    }

    // Fallback with context awareness
    const contextHints = [];
    if (task) {
      contextHints.push(`💡 This is about **${task.title}**`);
      if (task.category) contextHints.push(`📂 Category: ${task.category}`);
      if (task.estimated_time) contextHints.push(`⏱️ Estimated time: ${task.estimated_time}`);
    }

    return `**🤔 I see you're asking about "${userMessage}"**\n\n${contextHints.join('\n')}\n\n**I can help you with**:\n• Step-by-step guidance for this task\n• Answers to common questions\n• Best practices and tips\n• Troubleshooting issues\n\n**Try asking**:\n• "How do I get started?"\n• "What do I need to prepare?"\n• "Help me with [specific step]"\n• "I'm stuck on [particular issue]"\n\nWhat specific aspect would you like help with?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !task) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate assistant response
    const response = getTaskSpecificResponses(userMessage.content);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setIsTyping(true);
    await simulateTyping(response);
    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);

    // Auto-complete task if user seems ready
    if (userMessage.content.toLowerCase().includes('complete') || 
        userMessage.content.toLowerCase().includes('done') ||
        userMessage.content.toLowerCase().includes('finished')) {
      setTimeout(() => {
        onStatusChange(task.id, 'done');
        // Trigger refresh to update HR dashboard
        triggerRefresh();
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'doing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const smartActions = [
    {
      id: 'policies',
      title: 'View Policies',
      description: 'Access company policies and documentation',
      icon: FileText,
      color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
    },
    {
      id: 'hr',
      title: 'Ask HR',
      description: 'Get help from HR team',
      icon: Users,
      color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
    },
    {
      id: 'progress',
      title: 'Save Progress',
      description: 'Pause and resume later',
      icon: Pause,
      color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
    },
    {
      id: 'complete',
      title: 'Mark Complete',
      description: 'Finish this task',
      icon: Check,
      color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
    }
  ];

  const suggestedPrompts = [
    "Show me step-by-step instructions",
    "What do I need to prepare?",
    "I'm stuck, can you help?",
    "Explain this in simple terms"
  ];

  const handleSmartAction = (actionId: string) => {
    switch (actionId) {
      case 'complete':
        if (task) {
          onStatusChange(task.id, 'done');
          // Mark current step as completed
          setSteps(prev => prev.map((step, index) =>
            index === currentStepIndex ? { ...step, completed: true } : step
          ));
        }
        break;
      case 'progress':
        if (task) {
          onStatusChange(task.id, 'doing');
        }
        break;
      case 'hr':
        setInputValue('I need help with this task. Can you connect me with HR?');
        break;
      case 'policies':
        setAttachments(prev => [...prev, {
          name: 'Employee Handbook.pdf',
          type: 'pdf',
          url: '#'
        }]);
        setInputValue('Can you explain this policy document?');
        break;
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'guided' ? 'fast' : 'guided');
  };

  if (!task) return null;

  const completedSteps = steps.filter(step => step.completed).length;
  const totalStepsCount = steps.length;
  const progressPercentage = totalStepsCount > 0 ? Math.round((completedSteps / totalStepsCount) * 100) : 0;

  return (
    <div className={cn(
      "fixed right-0 top-0 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl transition-all duration-300 z-50",
      isOpen ? "w-[800px]" : "w-0"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center space-x-4">
          {/* Buddy Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#e99f75] via-orange-500 to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Buddy</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI Onboarding Assistant</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMode}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
                mode === 'guided'
                  ? "bg-[#e99f75] text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              {mode === 'guided' ? (
                <>
                  <BookOpen className="w-3 h-3 mr-1 inline" />
                  Guided
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 mr-1 inline" />
                  Fast
                </>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Progress Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#e99f75]/5 to-orange-50 dark:from-[#e99f75]/10 dark:to-orange-900/10 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStepIndex + 1} of {totalStepsCount} • {progressPercentage}% complete
            </p>
          </div>
          <Badge variant="outline" className="text-[#e99f75] border-[#e99f75]">
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="bg-[#e99f75] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="flex h-[calc(100vh-180px)]">
        {/* Left Panel - Task Steps */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="w-4 h-4 mr-2 text-[#e99f75]" />
              Task Steps
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {steps.map((step, index) => (
              <Card
                key={step.id}
                className={cn(
                  "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                  currentStepIndex === index
                    ? "ring-2 ring-[#e99f75] bg-[#e99f75]/5"
                    : step.completed
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
                onClick={() => handleStepClick(index)}
              >
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    step.completed
                      ? "bg-green-500 text-white"
                      : currentStepIndex === index
                        ? "bg-[#e99f75] text-white"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                  )}>
                    {step.completed ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className={cn(
                      "text-sm font-medium mb-1",
                      step.completed
                        ? "text-green-700 dark:text-green-300"
                        : "text-gray-900 dark:text-white"
                    )}>
                      {step.title}
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {step.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {step.estimatedTime}
                      </span>
                      {step.completed && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Conversation */}
        <div className="w-1/2 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm',
                    message.type === 'user'
                      ? 'bg-[#e99f75] text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  )}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'assistant' && (
                      <div className="w-6 h-6 bg-gradient-to-br from-[#e99f75] to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }}
                      />
                      <div className={cn(
                        'text-xs mt-2',
                        message.type === 'user' ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'
                      )}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#e99f75] to-orange-500 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length <= 2 && (
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-4 h-4 text-[#e99f75]" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Suggested</span>
              </div>
              <div className="space-y-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(prompt)}
                    className="w-full text-left px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Paperclip className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attachments</span>
              </div>
              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                    {attachment.type === 'pdf' ? (
                      <FileText className="w-4 h-4 text-red-500" />
                    ) : attachment.type === 'link' ? (
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Paperclip className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">{attachment.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {smartActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.id}
                    className={cn(
                      "p-3 cursor-pointer transition-all duration-200 hover:shadow-md",
                      action.color
                    )}
                    onClick={() => handleSmartAction(action.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <div>
                        <div className="text-sm font-medium">{action.title}</div>
                        <div className="text-xs opacity-75">{action.description}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Buddy anything..."
                  className="pr-12"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => {/* Handle file attachment */}}
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto text-gray-400 hover:text-gray-600"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="bg-[#e99f75] hover:bg-orange-600 disabled:bg-gray-300"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
