export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  manager: string;
  start_date: string;
  department: string;
  status: 'on-track' | 'at-risk' | 'completed';
  progress: number;
  last_updated: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  category: string;
  estimated_time: string;
  employee_id: string;
  updated_at: string;
}

export interface MetricData {
  avgCompletionTime: number;
  onTrackPercentage: number;
  avgSatisfactionScore: number;
  totalEmployees: number;
}

export interface NewHirePayload {
  employee_id: string;
  name: string;
  email: string;
  manager: string;
  start_date: string;
}

export interface TaskUpdatePayload {
  employee_id: string;
  task_id: string;
  status: string;
}

export interface FeedbackSurvey {
  id: string;
  employee_id: string;
  employee_name: string;
  type: 'day-30' | 'day-90' | 'ad-hoc';
  status: 'pending' | 'sent' | 'completed' | 'overdue';
  sent_date: string;
  completed_date?: string;
  responses: FeedbackResponse[];
  overall_score?: number;
  comments?: string;
}

export interface FeedbackResponse {
  question_id: string;
  question_text: string;
  answer: number; // 1-5 scale
  category: 'onboarding' | 'manager' | 'workplace' | 'resources' | 'overall';
}

export interface FeedbackQuestion {
  id: string;
  text: string;
  category: 'onboarding' | 'manager' | 'workplace' | 'resources' | 'overall';
  type: 'rating' | 'text';
}

export interface FeedbackAnalytics {
  totalSurveysSent: number;
  totalCompleted: number;
  averageSatisfaction: number;
  completionRate: number;
  categoryAverages: {
    onboarding: number;
    manager: number;
    workplace: number;
    resources: number;
    overall: number;
  };
  trends: {
    month: string;
    averageScore: number;
    responseCount: number;
  }[];
}