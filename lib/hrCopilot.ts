// HR Copilot API stubs - Ready for n8n integration
// All functions return mocked data; endpoints will be proxied to n8n later

export interface NewHirePayload {
  name: string;
  email: string;
  role: string;
  manager: string;
  startDate: string;
  department?: string;
}

export interface ReminderPayload {
  employees: string[];
  template: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: File[];
}

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  status: 'todo' | 'doing' | 'done' | 'blocked';
  subSteps?: string[];
}

export interface GuidePlaybook {
  id: string;
  title: string;
  steps: GuideStep[];
}

// Mock data
const MOCK_GUIDES: GuidePlaybook[] = [
  {
    id: 'onboarding',
    title: 'Employee Onboarding',
    steps: [
      {
        id: 'welcome-email',
        title: 'Send Welcome Email',
        description: 'Automated welcome email with login credentials and first-day info',
        estimatedTime: '5 min',
        status: 'done'
      },
      {
        id: 'paperwork',
        title: 'Process Paperwork',
        description: 'Review and process W-4, emergency contacts, and company policies',
        estimatedTime: '15 min',
        status: 'doing'
      },
      {
        id: 'workstation',
        title: 'Setup Workstation',
        description: 'Configure laptop, accounts, and access permissions',
        estimatedTime: '30 min',
        status: 'todo'
      },
      {
        id: 'training',
        title: 'Schedule Training',
        description: 'Book orientation sessions and department-specific training',
        estimatedTime: '1 hour',
        status: 'todo'
      },
      {
        id: 'checkin',
        title: 'First Check-in Meeting',
        description: 'Schedule and conduct initial one-on-one meeting',
        estimatedTime: '30 min',
        status: 'todo'
      }
    ]
  }
];

// Chat responses based on prompts
const getChatResponse = (prompt: string): string => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('risk') || lowerPrompt.includes('/risk')) {
    return "Based on current data, 3 employees are at risk of delayed onboarding:\n\n• Sarah Johnson (Day 15 - paperwork incomplete)\n• Mike Chen (Day 12 - workstation setup pending)\n• Aria Nakamura (Day 8 - training not scheduled)\n\nI've sent automated reminders and created follow-up tasks.";
  }

  if (lowerPrompt.includes('remind') || lowerPrompt.includes('/remind')) {
    return "I've sent reminder emails to 5 employees with overdue tasks. Templates used:\n\n• Welcome email follow-up\n• Paperwork completion reminder\n• Training session confirmation\n\nAll recipients will receive personalized messages within the next 5 minutes.";
  }

  if (lowerPrompt.includes('export') || lowerPrompt.includes('/export')) {
    return "Export initiated! Your CSV file includes:\n\n• Employee onboarding status\n• Completion percentages\n• Overdue tasks\n• Department breakdowns\n\nDownload link: [Generating CSV...]";
  }

  if (lowerPrompt.includes('prepare') || lowerPrompt.includes('/prepare')) {
    return "Here's what you need to prepare for the next onboarding wave:\n\n✅ Welcome email templates updated\n✅ Workstation setup checklist reviewed\n✅ Training schedules cleared\n✅ Manager notifications sent\n\nEverything is ready for the new hires starting next week!";
  }

  if (lowerPrompt.includes('step') || lowerPrompt.includes('/step')) {
    return "Here's the current onboarding pipeline:\n\n**Week 1:** Welcome & Setup (Days 1-3)\n**Week 2:** Training & Integration (Days 4-7)\n**Week 3:** Check-in & Optimization (Days 8-10)\n\nNext milestone: Sarah's workstation setup (due today at 3 PM)";
  }

  if (lowerPrompt.includes('stuck') || lowerPrompt.includes('/stuck')) {
    return "I noticed 2 employees might need help:\n\n• Alex Rivera: Stuck on benefits enrollment\n• Jordan Lee: Having IT setup issues\n\nI've sent them direct assistance links and scheduled follow-up calls for tomorrow morning.";
  }

  return "I'm here to help with your HR tasks! You can ask me about:\n\n• Employee onboarding status\n• Risk assessments\n• Reminder automation\n• Data exports\n• Preparation checklists\n\nWhat would you like to know?";
};

// API Functions - Ready for n8n integration

export async function chat(prompt: string, context?: any): Promise<ChatMessage> {
  // TODO: POST /api/hr/copilot/chat -> n8n endpoint
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: getChatResponse(prompt),
    timestamp: new Date()
  };
}

export async function startGuide(guideId: string): Promise<{ success: boolean; message: string }> {
  // TODO: POST /api/hr/copilot/guide/start -> n8n endpoint
  await new Promise(resolve => setTimeout(resolve, 500));

  const guide = MOCK_GUIDES.find(g => g.id === guideId);
  if (guide) {
    return {
      success: true,
      message: `Started ${guide.title} guide. Step 1: ${guide.steps[0].title}`
    };
  }

  return {
    success: false,
    message: 'Guide not found'
  };
}

export async function quickAction(action: 'risk' | 'prepare' | 'steps' | 'stuck', context?: any): Promise<ChatMessage> {
  // TODO: POST /api/hr/copilot/quick -> n8n endpoint
  const prompts = {
    risk: "What's the current risk assessment?",
    prepare: "What do I need to prepare?",
    steps: "Show me the current step-by-step status",
    stuck: "Which employees are stuck?"
  };

  return chat(prompts[action], context);
}

export async function addNewHire(payload: NewHirePayload): Promise<{ success: boolean; employeeId: string }> {
  // TODO: POST /api/hr/copilot/add-hire -> n8n endpoint
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    employeeId: `EMP-${Date.now()}`
  };
}

export async function sendReminder(payload: ReminderPayload): Promise<{ success: boolean; sentCount: number }> {
  // TODO: POST /api/hr/copilot/reminder -> n8n endpoint
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    success: true,
    sentCount: payload.employees.length
  };
}

export async function exportCSV(filters?: any): Promise<{ success: boolean; downloadUrl: string }> {
  // TODO: GET /api/hr/copilot/export -> n8n endpoint
  await new Promise(resolve => setTimeout(resolve, 1200));

  return {
    success: true,
    downloadUrl: '/downloads/onboarding-report.csv'
  };
}

export async function generateRiskReport(filters?: any): Promise<{ success: boolean; reportUrl: string }> {
  // TODO: POST /api/hr/copilot/risk-report -> n8n endpoint
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    success: true,
    reportUrl: '/reports/risk-assessment.pdf'
  };
}

export async function getGuides(): Promise<GuidePlaybook[]> {
  // TODO: GET /api/hr/copilot/guides -> n8n endpoint
  await new Promise(resolve => setTimeout(resolve, 300));

  return MOCK_GUIDES;
}

export async function getGuide(guideId: string): Promise<GuidePlaybook | null> {
  // TODO: GET /api/hr/copilot/guides/{id} -> n8n endpoint
  await new Promise(resolve => setTimeout(resolve, 300));

  return MOCK_GUIDES.find(g => g.id === guideId) || null;
}

// Analytics stub
export function useCopilotAnalytics(event: string, payload?: any) {
  // TODO: Track analytics events
  console.log('Copilot Analytics:', event, payload);
}
