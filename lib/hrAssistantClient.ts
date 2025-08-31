// HR Assistant Client - Mock service for HR dashboard AI assistant
// TODO(API): Replace all mock implementations with real API calls to /api/buddy

export interface HRGuideStep {
  id: string;
  title: string;
  eta: string;
  status: 'todo' | 'doing' | 'done';
}

export interface HRGuide {
  title: string;
  steps: HRGuideStep[];
}

export interface HRActionResult {
  ok: boolean;
  message: string;
}

// Mock data for demonstration
const MOCK_GUIDE: HRGuide = {
  title: "New Employee Onboarding",
  steps: [
    { id: "welcome", title: "Send Welcome Email", eta: "5 min", status: "done" },
    { id: "paperwork", title: "Process Paperwork", eta: "15 min", status: "doing" },
    { id: "setup", title: "Set up Workstation", eta: "30 min", status: "todo" },
    { id: "training", title: "Schedule Training", eta: "1 hour", status: "todo" },
    { id: "checkin", title: "First Check-in Meeting", eta: "30 min", status: "todo" },
  ]
};

const MOCK_RESPONSES = {
  welcome: "Welcome to the team! I'm here to help you navigate the onboarding process.",
  prepare: "To prepare for a new hire, you'll need to:\n\n1. Review their resume and job requirements\n2. Prepare necessary paperwork\n3. Coordinate with IT for workstation setup\n4. Schedule initial training sessions\n\nWould you like me to guide you through any of these steps?",
  stuck: "I understand you're feeling stuck. Let me help you navigate this. Could you tell me which part of the process is causing difficulty?",
  stepByStep: "Here's a step-by-step breakdown of the current onboarding process:\n\n**Current Phase:** Paperwork Processing\n**Next Steps:**\n1. Verify all forms are complete\n2. Submit to HR for approval\n3. Schedule equipment delivery\n4. Coordinate with manager\n\nWould you like details on any specific step?",
  atRisk: "Based on current data, here are employees who may need attention:\n\n- Sarah Johnson (Day 30 check-in overdue)\n- Mike Chen (Incomplete paperwork)\n- Lisa Wong (No workstation assigned)\n\nWould you like me to send reminders or create a follow-up plan?"
};

// Mock streaming response generator
export async function* sendHRChat(message: string): AsyncGenerator<string> {
  // TODO(API): Replace with fetch('/api/buddy', { method: 'POST', body: JSON.stringify({ role: 'hr', mode: 'chat', message }) })

  const lowerMessage = message.toLowerCase();

  let response: string;
  if (lowerMessage.includes('prepare') || lowerMessage.includes('what do i need')) {
    response = MOCK_RESPONSES.prepare;
  } else if (lowerMessage.includes('stuck') || lowerMessage.includes('help')) {
    response = MOCK_RESPONSES.stuck;
  } else if (lowerMessage.includes('step') || lowerMessage.includes('guide')) {
    response = MOCK_RESPONSES.stepByStep;
  } else if (lowerMessage.includes('risk') || lowerMessage.includes('at risk')) {
    response = MOCK_RESPONSES.atRisk;
  } else {
    response = MOCK_RESPONSES.welcome;
  }

  // Simulate streaming by yielding chunks
  const chunks = response.split(' ').reduce((acc: string[], word, index) => {
    const chunkIndex = Math.floor(index / 3);
    if (!acc[chunkIndex]) acc[chunkIndex] = '';
    acc[chunkIndex] += (acc[chunkIndex] ? ' ' : '') + word;
    return acc;
  }, []);

  for (const chunk of chunks) {
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    yield chunk;
  }
}

export async function runHRAction(action: 'new_hire' | 'remind' | 'export' | 'at_risk'): Promise<HRActionResult> {
  // TODO(API): Replace with fetch('/api/buddy/actions', { method: 'POST', body: JSON.stringify({ action }) })

  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

  switch (action) {
    case 'new_hire':
      return {
        ok: true,
        message: "New hire checklist created successfully. Welcome email sent and onboarding tasks initialized."
      };
    case 'remind':
      return {
        ok: true,
        message: "Reminder emails sent to 3 employees with overdue tasks. Follow-up scheduled for next week."
      };
    case 'export':
      return {
        ok: true,
        message: "Employee data export completed. CSV file generated and sent to your email."
      };
    case 'at_risk':
      return {
        ok: true,
        message: "At-risk report generated. 5 employees identified for follow-up. Detailed report sent to your dashboard."
      };
    default:
      return {
        ok: false,
        message: "Unknown action requested."
      };
  }
}

export async function getGuide(taskId?: string): Promise<HRGuide> {
  // TODO(API): Replace with fetch('/api/buddy/guide', { method: 'GET', body: JSON.stringify({ taskId }) })

  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

  return MOCK_GUIDE;
}

export async function updateStepStatus(stepId: string, status: 'todo' | 'doing' | 'done'): Promise<{ ok: boolean }> {
  // TODO(API): Replace with fetch('/api/buddy/steps', { method: 'PATCH', body: JSON.stringify({ stepId, status }) })

  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));

  return { ok: true };
}
