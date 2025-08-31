import { WEBHOOKS, TaskStatus } from './constants';
import { dataStore } from './dataStore';

interface TaskUpdatePayload {
  employee_id: string;
  task_id: string;
  status: TaskStatus;
}

interface NewHirePayload {
  employee_id: string;
  name: string;
  email: string;
  manager: string;
  start_date: string;
}

const API_HEADERS = {
  "Content-Type": "application/json",
  "X-API-Key": "sk_live_8q2",
};

export const postTaskUpdate = async (payload: TaskUpdatePayload): Promise<void> => {
  try {
    const response = await fetch(WEBHOOKS.TASK_UPDATE, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Task update failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error posting task update:', error);
    throw error;
  }
};

export const createNewHire = async (payload: NewHirePayload): Promise<void> => {
  try {
    const response = await fetch(WEBHOOKS.NEW_HIRE, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`New hire creation failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error creating new hire:', error);
    throw error;
  }
};

// Mock API methods for compatibility with existing code
const mockApi = {
  getEmployeeTasks: async (employeeId: string) => {
    // Get tasks from dataStore
    return dataStore.getEmployeeTasks(employeeId);
  },

  updateTaskStatus: async (params: { employee_id: string; task_id: string; status: TaskStatus }) => {
    // Call the webhook
    await postTaskUpdate({
      employee_id: params.employee_id,
      task_id: params.task_id,
      status: params.status,
    });
  },

  getEmployeeFeedbackSurveys: async (employeeId: string) => {
    // Get feedback surveys from dataStore
    return dataStore.getEmployeeFeedbackSurveys(employeeId);
  },

  checkAndTriggerFeedbackSurveys: async () => {
    // Check and trigger feedback surveys from dataStore
    return dataStore.checkAndTriggerFeedbackSurveys();
  },

  getEmployeeData: async () => {
    // Get employees from dataStore
    console.log('API: getEmployeeData called');
    const employees = dataStore.getEmployees();
    console.log('API: Returning employees:', employees.length, 'employees');
    console.log('API: First employee:', employees[0]);
    return employees;
  },

  getFeedbackAnalytics: async () => {
    // Get feedback analytics from dataStore
    return dataStore.getFeedbackAnalytics();
  },

  getFeedbackQuestions: async () => {
    // Get feedback questions from dataStore
    return dataStore.getFeedbackQuestions();
  },

  submitFeedbackSurvey: async (surveyId: string, responses: any[], comments: string) => {
    // Submit feedback survey to dataStore
    return dataStore.submitFeedbackSurvey(surveyId, responses, comments);
  },

  getMetrics: async () => {
    // Get metrics from dataStore
    return dataStore.getMetrics();
  },

  createOnboardingWorkflow: async (employeeId: string) => {
    // Mock implementation - create default onboarding tasks
    console.log('Creating onboarding workflow for employee:', employeeId);
    return Promise.resolve();
  },
};

export const api = mockApi;