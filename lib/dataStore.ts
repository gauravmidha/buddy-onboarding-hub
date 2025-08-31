// Data store for persisting task updates and employee data
// This simulates a backend database using localStorage

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  category: string;
  estimated_time: string;
  employee_id: string;
  updated_at: string;
}

interface Employee {
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

interface FeedbackSurvey {
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

interface FeedbackResponse {
  question_id: string;
  question_text: string;
  answer: number;
  category: 'onboarding' | 'manager' | 'workplace' | 'resources' | 'overall';
}

interface FeedbackQuestion {
  id: string;
  text: string;
  category: 'onboarding' | 'manager' | 'workplace' | 'resources' | 'overall';
  type: 'rating' | 'text';
}

class DataStore {
  private static instance: DataStore;
  private tasks: Map<string, Task[]> = new Map();
  private employees: Employee[] = [];
  private feedbackSurveys: FeedbackSurvey[] = [];
  private feedbackQuestions: FeedbackQuestion[] = [];

  private constructor() {
    this.loadFromStorage();
    this.initializeDefaultData();
  }

  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined') {
        console.log('DataStore: Loading from localStorage...');
        const savedTasks = localStorage.getItem('acme_tasks');
        const savedEmployees = localStorage.getItem('acme_employees');
        const savedFeedbackSurveys = localStorage.getItem('acme_feedback_surveys');
        const savedFeedbackQuestions = localStorage.getItem('acme_feedback_questions');

        console.log('DataStore: Found saved data:', {
          tasks: !!savedTasks,
          employees: !!savedEmployees,
          surveys: !!savedFeedbackSurveys,
          questions: !!savedFeedbackQuestions
        });

        if (savedTasks) {
          const tasksData = JSON.parse(savedTasks);
          this.tasks = new Map(Object.entries(tasksData));
          console.log('DataStore: Loaded tasks:', this.tasks.size);
        }

        if (savedEmployees) {
          this.employees = JSON.parse(savedEmployees);
          console.log('DataStore: Loaded employees:', this.employees.length);
        }

        if (savedFeedbackSurveys) {
          this.feedbackSurveys = JSON.parse(savedFeedbackSurveys);
          console.log('DataStore: Loaded surveys:', this.feedbackSurveys.length);
        }

        if (savedFeedbackQuestions) {
          this.feedbackQuestions = JSON.parse(savedFeedbackQuestions);
          console.log('DataStore: Loaded questions:', this.feedbackQuestions.length);
        }
      } else {
        console.log('DataStore: Not in browser environment, skipping localStorage load');
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        const tasksData = Object.fromEntries(this.tasks);
        localStorage.setItem('acme_tasks', JSON.stringify(tasksData));
        localStorage.setItem('acme_employees', JSON.stringify(this.employees));
        localStorage.setItem('acme_feedback_surveys', JSON.stringify(this.feedbackSurveys));
        localStorage.setItem('acme_feedback_questions', JSON.stringify(this.feedbackQuestions));
      }
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  }

  private initializeDefaultData() {
    console.log('DataStore: Initializing default data...');
    console.log('DataStore: Current tasks count:', this.tasks.size);
    console.log('DataStore: Current employees count:', this.employees.length);

    // Initialize default tasks if none exist
    if (this.tasks.size === 0) {
      // Emily Chen's tasks
      const emilyTasks: Task[] = [
        { 
          id: 'payroll', 
          title: 'Complete Payroll Setup', 
          description: 'Set up your direct deposit, tax forms, and payment preferences. Our AI assistant will guide you through each step!', 
          status: 'todo', 
          category: 'Admin', 
          estimated_time: '5 mins',
          employee_id: 'E-1027',
          updated_at: new Date().toISOString()
        },
        { 
          id: 'slack', 
          title: 'Slack & Communication Setup', 
          description: 'Configure your Slack profile, join team channels, and set up notifications. Get help with best practices!', 
          status: 'doing', 
          category: 'Communication', 
          estimated_time: '3 mins',
          employee_id: 'E-1027',
          updated_at: new Date().toISOString()
        },
        { 
          id: '2fa', 
          title: 'Two-Factor Authentication', 
          description: 'Secure your account with 2FA using an authenticator app. Our assistant will walk you through the setup process.', 
          status: 'done', 
          category: 'Security', 
          estimated_time: '2 mins',
          employee_id: 'E-1027',
          updated_at: new Date().toISOString()
        },
        { 
          id: 'benefits', 
          title: 'Benefits Enrollment', 
          description: 'Choose your health, dental, and vision insurance plans. Get personalized recommendations and answers to your questions!', 
          status: 'todo', 
          category: 'HR', 
          estimated_time: '5 mins',
          employee_id: 'E-1027',
          updated_at: new Date().toISOString()
        },
        { 
          id: 'pto', 
          title: 'PTO & Vacation Policy', 
          description: 'Learn about our PTO policy, vacation days, and how to request time off. Ask any questions about time-off benefits!', 
          status: 'todo', 
          category: 'HR', 
          estimated_time: '3 mins',
          employee_id: 'E-1027',
          updated_at: new Date().toISOString()
        },
      ];

      // Marcus Johnson's tasks (more completed)
      const marcusTasks: Task[] = [
        { 
          id: 'payroll', 
          title: 'Complete Payroll Setup', 
          description: 'Set up your direct deposit, tax forms, and payment preferences.', 
          status: 'done', 
          category: 'Admin', 
          estimated_time: '5 mins',
          employee_id: 'E-1028',
          updated_at: new Date().toISOString()
        },
        { 
          id: 'slack', 
          title: 'Slack & Communication Setup', 
          description: 'Configure your Slack profile and join team channels.', 
          status: 'done', 
          category: 'Communication', 
          estimated_time: '3 mins',
          employee_id: 'E-1028',
          updated_at: new Date().toISOString()
        },
        { 
          id: '2fa', 
          title: 'Two-Factor Authentication', 
          description: 'Secure your account with 2FA using an authenticator app.', 
          status: 'done', 
          category: 'Security', 
          estimated_time: '2 mins',
          employee_id: 'E-1028',
          updated_at: new Date().toISOString()
        },
        { 
          id: 'benefits', 
          title: 'Benefits Enrollment', 
          description: 'Choose your health, dental, and vision insurance plans.', 
          status: 'done', 
          category: 'HR', 
          estimated_time: '5 mins',
          employee_id: 'E-1028',
          updated_at: new Date().toISOString()
        },
        { 
          id: 'pto', 
          title: 'PTO & Vacation Policy', 
          description: 'Learn about our PTO policy and vacation days.', 
          status: 'doing', 
          category: 'HR', 
          estimated_time: '3 mins',
          employee_id: 'E-1028',
          updated_at: new Date().toISOString()
        },
      ];

      // Aria Nakamura's tasks (at risk)
      const ariaTasks: Task[] = [
        { 
          id: 'payroll', 
          title: 'Complete Payroll Setup', 
          description: 'Set up your direct deposit, tax forms, and payment preferences.', 
          status: 'done', 
          category: 'Admin', 
          estimated_time: '5 mins',
          employee_id: 'E-1029',
          updated_at: new Date().toISOString()
        },
        { 
          id: 'slack', 
          title: 'Slack & Communication Setup', 
          description: 'Configure your Slack profile and join team channels.', 
          status: 'todo', 
          category: 'Communication', 
          estimated_time: '3 mins',
          employee_id: 'E-1029',
          updated_at: new Date().toISOString()
        },
        { 
          id: '2fa', 
          title: 'Two-Factor Authentication', 
          description: 'Secure your account with 2FA using an authenticator app.', 
          status: 'todo', 
          category: 'Security', 
          estimated_time: '2 mins',
          employee_id: 'E-1029',
          updated_at: new Date().toISOString()
        },
        { 
          id: 'benefits', 
          title: 'Benefits Enrollment', 
          description: 'Choose your health, dental, and vision insurance plans.', 
          status: 'todo', 
          category: 'HR', 
          estimated_time: '5 mins',
          employee_id: 'E-1029',
          updated_at: new Date().toISOString()
        },
        { 
          id: 'pto', 
          title: 'PTO & Vacation Policy', 
          description: 'Learn about our PTO policy and vacation days.', 
          status: 'todo', 
          category: 'HR', 
          estimated_time: '3 mins',
          employee_id: 'E-1029',
          updated_at: new Date().toISOString()
        },
      ];

      this.tasks.set('E-1027', emilyTasks);
      this.tasks.set('E-1028', marcusTasks);
      this.tasks.set('E-1029', ariaTasks);
      console.log('DataStore: Default tasks initialized for 3 employees');
    }

    // Initialize default employees if none exist
    if (this.employees.length === 0) {
      this.employees = [
        { 
          id: 'E-1027', 
          name: 'Emily Chen', 
          email: 'emily.chen@acme.com',
          role: 'Software Engineer', 
          manager: 'Jordan Patel', 
          start_date: '2025-01-20',
          department: 'Engineering', 
          progress: 40, 
          status: 'on-track', 
          last_updated: new Date().toISOString() 
        },
        { 
          id: 'E-1028', 
          name: 'Marcus Johnson', 
          email: 'marcus.johnson@acme.com',
          role: 'Product Manager', 
          manager: 'Sarah Kim', 
          start_date: '2025-01-19',
          department: 'Product', 
          progress: 80, 
          status: 'on-track', 
          last_updated: new Date().toISOString() 
        },
        { 
          id: 'E-1029', 
          name: 'Aria Nakamura', 
          email: 'aria.nakamura@acme.com',
          role: 'UX Designer', 
          manager: 'David Liu', 
          start_date: '2025-01-18',
          department: 'Design', 
          progress: 30, 
          status: 'at-risk', 
          last_updated: new Date().toISOString() 
        },
        { 
          id: 'E-1030', 
          name: 'Carlos Rodriguez', 
          email: 'carlos.rodriguez@acme.com',
          role: 'Data Analyst', 
          manager: 'Jennifer Wong', 
          start_date: '2025-01-20',
          department: 'Analytics', 
          progress: 90, 
          status: 'on-track', 
          last_updated: new Date().toISOString() 
        },
        { 
          id: 'E-1031', 
          name: 'Zoe Thompson', 
          email: 'zoe.thompson@acme.com',
          role: 'Marketing Specialist', 
          manager: 'Alex Foster', 
          start_date: '2025-01-17',
          department: 'Marketing', 
          progress: 45, 
          status: 'at-risk', 
          last_updated: new Date().toISOString() 
        },
      ];
      console.log('DataStore: Default employees initialized');
    }

    console.log('DataStore: Final state - Tasks:', this.tasks.size, 'Employees:', this.employees.length);
    this.saveToStorage();
    console.log('DataStore: Data saved to localStorage');
  }

  // Task methods
  getEmployeeTasks(employeeId: string): Task[] {
    return this.tasks.get(employeeId) || [];
  }

  updateTaskStatus(employeeId: string, taskId: string, status: 'todo' | 'doing' | 'done'): boolean {
    const employeeTasks = this.tasks.get(employeeId);
    if (!employeeTasks) return false;

    const taskIndex = employeeTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return false;

    employeeTasks[taskIndex].status = status;
    employeeTasks[taskIndex].updated_at = new Date().toISOString();

    // Update employee progress
    this.updateEmployeeProgress(employeeId);

    this.saveToStorage();
    return true;
  }

  // Employee methods
  getEmployees(): Employee[] {
    return this.employees;
  }

  getEmployee(employeeId: string): Employee | undefined {
    return this.employees.find(emp => emp.id === employeeId);
  }

  private updateEmployeeProgress(employeeId: string): void {
    const employeeTasks = this.tasks.get(employeeId);
    if (!employeeTasks) return;

    const totalTasks = employeeTasks.length;
    const completedTasks = employeeTasks.filter(task => task.status === 'done').length;
    const progress = Math.round((completedTasks / totalTasks) * 100);

    const employeeIndex = this.employees.findIndex(emp => emp.id === employeeId);
    if (employeeIndex !== -1) {
      this.employees[employeeIndex].progress = progress;
      this.employees[employeeIndex].last_updated = new Date().toISOString();
      
      // Update status based on progress
      if (progress >= 90) {
        this.employees[employeeIndex].status = 'completed';
      } else if (progress >= 60) {
        this.employees[employeeIndex].status = 'on-track';
      } else {
        this.employees[employeeIndex].status = 'at-risk';
      }
    }
  }

  // Metrics methods
  getMetrics() {
    const allEmployees = this.getEmployees();
    const totalEmployees = allEmployees.length;

    if (totalEmployees === 0) {
      return {
        avgCompletionTime: 0,
        onTrackPercentage: 0,
        avgSatisfactionScore: 4.8,
        totalEmployees: 0
      };
    }

    const onTrackCount = allEmployees.filter(emp => emp.status === 'on-track').length;
    const onTrackPercentage = Math.round((onTrackCount / totalEmployees) * 100);

    const avgProgress = allEmployees.reduce((sum, emp) => sum + emp.progress, 0) / totalEmployees;
    const avgCompletionTime = Math.round((100 - avgProgress) / 10) + 2; // Rough estimate

    return {
      avgCompletionTime,
      onTrackPercentage,
      avgSatisfactionScore: 4.8,
      totalEmployees
    };
  }

  addEmployee(employee: Employee): void {
    const existingIndex = this.employees.findIndex(emp => emp.id === employee.id);
    if (existingIndex === -1) {
      this.employees.push(employee);
    } else {
      this.employees[existingIndex] = { ...this.employees[existingIndex], ...employee };
    }
    this.saveToStorage();
  }

  updateEmployee(employee: Partial<Employee> & { id: string }): void {
    const index = this.employees.findIndex(emp => emp.id === employee.id);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...employee };
      this.saveToStorage();
    }
  }

  addTask(task: Task): void {
    const employeeTasks = this.tasks.get(task.employee_id) || [];
    const existingIndex = employeeTasks.findIndex(t => t.id === task.id);
    if (existingIndex === -1) {
      employeeTasks.push(task);
    } else {
      employeeTasks[existingIndex] = { ...employeeTasks[existingIndex], ...task };
    }
    this.tasks.set(task.employee_id, employeeTasks);
    this.saveToStorage();
  }

  // Feedback methods
  initializeFeedbackQuestions(): void {
    if (this.feedbackQuestions.length === 0) {
      this.feedbackQuestions = [
        { id: 'onboarding-1', text: 'How smooth was your onboarding process?', category: 'onboarding', type: 'rating' },
        { id: 'onboarding-2', text: 'Did you receive clear instructions for setting up your accounts?', category: 'onboarding', type: 'rating' },
        { id: 'onboarding-3', text: 'Were you able to complete tasks without excessive delays?', category: 'onboarding', type: 'rating' },
        { id: 'manager-1', text: 'How helpful has your manager been during onboarding?', category: 'manager', type: 'rating' },
        { id: 'manager-2', text: 'Have you received regular check-ins from your manager?', category: 'manager', type: 'rating' },
        { id: 'workplace-1', text: 'How well do you understand your role and responsibilities?', category: 'workplace', type: 'rating' },
        { id: 'workplace-2', text: 'Do you feel comfortable asking questions to your team?', category: 'workplace', type: 'rating' },
        { id: 'resources-1', text: 'Do you have access to all the tools and resources you need?', category: 'resources', type: 'rating' },
        { id: 'resources-2', text: 'Have you received adequate training for your role?', category: 'resources', type: 'rating' },
        { id: 'overall-1', text: 'Overall, how satisfied are you with your onboarding experience?', category: 'overall', type: 'rating' },
        { id: 'comments', text: 'Any additional comments or suggestions?', category: 'overall', type: 'text' }
      ];
    }
  }

  getFeedbackQuestions(): FeedbackQuestion[] {
    this.initializeFeedbackQuestions();
    return this.feedbackQuestions;
  }

  createFeedbackSurvey(employeeId: string, type: 'day-30' | 'day-90' | 'ad-hoc'): FeedbackSurvey {
    const employee = this.getEmployee(employeeId);
    if (!employee) throw new Error('Employee not found');

    const survey: FeedbackSurvey = {
      id: `survey-${Date.now()}`,
      employee_id: employeeId,
      employee_name: employee.name,
      type,
      status: 'pending',
      sent_date: new Date().toISOString(),
      responses: []
    };

    this.feedbackSurveys.push(survey);
    this.saveToStorage();
    return survey;
  }

  getFeedbackSurveys(): FeedbackSurvey[] {
    return this.feedbackSurveys;
  }

  getEmployeeFeedbackSurveys(employeeId: string): FeedbackSurvey[] {
    return this.feedbackSurveys.filter(survey => survey.employee_id === employeeId);
  }

  submitFeedbackSurvey(surveyId: string, responses: FeedbackResponse[], comments?: string): boolean {
    const surveyIndex = this.feedbackSurveys.findIndex(s => s.id === surveyId);
    if (surveyIndex === -1) return false;

    const survey = this.feedbackSurveys[surveyIndex];
    survey.responses = responses;
    survey.status = 'completed';
    survey.completed_date = new Date().toISOString();
    survey.comments = comments;

    // Calculate overall score
    const ratingResponses = responses.filter(r => r.category !== 'overall');
    survey.overall_score = ratingResponses.length > 0
      ? Math.round(ratingResponses.reduce((sum, r) => sum + r.answer, 0) / ratingResponses.length * 10) / 10
      : 0;

    this.saveToStorage();
    return true;
  }

  checkAndTriggerFeedbackSurveys(): FeedbackSurvey[] {
    const today = new Date();
    const newSurveys: FeedbackSurvey[] = [];

    this.employees.forEach(employee => {
      const startDate = new Date(employee.start_date);
      const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      // Check for Day-30 survey
      if (daysSinceStart === 30) {
        const existing30Day = this.feedbackSurveys.find(s =>
          s.employee_id === employee.id && s.type === 'day-30'
        );
        if (!existing30Day) {
          newSurveys.push(this.createFeedbackSurvey(employee.id, 'day-30'));
        }
      }

      // Check for Day-90 survey
      if (daysSinceStart === 90) {
        const existing90Day = this.feedbackSurveys.find(s =>
          s.employee_id === employee.id && s.type === 'day-90'
        );
        if (!existing90Day) {
          newSurveys.push(this.createFeedbackSurvey(employee.id, 'day-90'));
        }
      }
    });

    return newSurveys;
  }

  getFeedbackAnalytics(): any {
    const completedSurveys = this.feedbackSurveys.filter(s => s.status === 'completed');

    if (completedSurveys.length === 0) {
      return {
        totalSurveysSent: this.feedbackSurveys.length,
        totalCompleted: 0,
        averageSatisfaction: 0,
        completionRate: 0,
        categoryAverages: {
          onboarding: 0,
          manager: 0,
          workplace: 0,
          resources: 0,
          overall: 0
        },
        trends: []
      };
    }

    // Calculate category averages
    const categories = ['onboarding', 'manager', 'workplace', 'resources', 'overall'];
    const categoryAverages: any = {};

    categories.forEach(category => {
      const categoryResponses = completedSurveys.flatMap(survey =>
        survey.responses.filter(r => r.category === category)
      );
      categoryAverages[category] = categoryResponses.length > 0
        ? Math.round(categoryResponses.reduce((sum, r) => sum + r.answer, 0) / categoryResponses.length * 10) / 10
        : 0;
    });

    // Generate monthly trends (simplified)
    const monthlyTrends = completedSurveys.reduce((acc: any, survey) => {
      const month = new Date(survey.completed_date || survey.sent_date).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { count: 0, totalScore: 0 };
      }
      acc[month].count++;
      acc[month].totalScore += survey.overall_score || 0;
      return acc;
    }, {});

    const trends = Object.entries(monthlyTrends).map(([month, data]: [string, any]) => ({
      month,
      averageScore: Math.round((data.totalScore / data.count) * 10) / 10,
      responseCount: data.count
    }));

    return {
      totalSurveysSent: this.feedbackSurveys.length,
      totalCompleted: completedSurveys.length,
      averageSatisfaction: Math.round(completedSurveys.reduce((sum, s) => sum + (s.overall_score || 0), 0) / completedSurveys.length * 10) / 10,
      completionRate: Math.round((completedSurveys.length / this.feedbackSurveys.length) * 100),
      categoryAverages,
      trends
    };
  }

  // Clear all data (for testing)
  clearAllData(): void {
    this.tasks.clear();
    this.employees = [];
    this.feedbackSurveys = [];
    this.feedbackQuestions = [];
    localStorage.removeItem('acme_tasks');
    localStorage.removeItem('acme_employees');
    localStorage.removeItem('acme_feedback_surveys');
    localStorage.removeItem('acme_feedback_questions');
    this.initializeDefaultData();
  }
}

export const dataStore = DataStore.getInstance();
