'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { EMPLOYEE_UI_V2 } from '@/lib/flags';
import { CATEGORY_COLORS } from '@/lib/colors';

// New V2 Components
import { ProgressHero } from '@/components/employee/ProgressHero';
import { TaskGroup } from '@/components/employee/TaskGroup';
import { BuddyChatDrawer } from '@/components/chat/BuddyChatDrawer';
import { BuddyFab } from '@/components/chat/BuddyFab';

// Legacy Components
import { ProgressStrip } from '@/components/ProgressStrip';
import { TaskChecklist } from '@/components/TaskChecklist';
import { KPIMetrics } from '@/components/KPIMetrics';
import { WeeklySummary } from '@/components/WeeklySummary';
import BuddyFabLegacy from '@/components/BuddyFab';
import BuddyPanel from '@/components/BuddyPanel';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useBuddy } from '@/hooks/useBuddyHook';

// Conditional imports for feature flag
const LoginModal = EMPLOYEE_UI_V2
  ? require('@/components/auth/SignInModal').SignInModal
  : require('@/components/LoginModal').LoginModal;

export default function EmployeePage() {
  const { user } = useAuth();
  const buddy = useBuddy();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedTaskContext, setSelectedTaskContext] = useState<{
    taskId?: string;
    title?: string;
  }>({});

  // Mock data - in real app this would come from API
  const kpiData = {
    tasksCompletedThisWeek: 12,
    progressRate: 85,
    avgCompletionTime: "2.3h"
  };

  const weeklyData = {
    tasksCompleted: 12,
    hoursSaved: 8,
    progressVsCompany: 15
  };

  // Mock tasks grouped by category
  const mockTasks = [
    {
      id: '1',
      title: 'Complete HR paperwork',
      description: 'Fill out W-4 and emergency contact forms',
      status: 'done' as const,
      employee_id: 'E-1027',
      category: 'hr',
      estimated_time: '15 mins',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Set up workstation',
      description: 'Install software and configure laptop',
      status: 'doing' as const,
      employee_id: 'E-1027',
      category: 'admin',
      estimated_time: '30 mins',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Security training',
      description: 'Complete mandatory security awareness course',
      status: 'todo' as const,
      employee_id: 'E-1027',
      category: 'security',
      estimated_time: '45 mins',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    }
  ];

  // Group tasks by category
  const tasksByCategory = mockTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof mockTasks>);

  // Calculate progress
  const completedTasks = mockTasks.filter(task => task.status === 'done').length;
  const totalTasks = mockTasks.length;

  // Example task click handler
  const openBenefitsTask = () =>
    buddy.openBuddy({
      taskId: 'benefits',
      taskTitle: 'Benefits Enrollment',
      step: 1,
      totalSteps: 4,
      progressPct: 25,
      status: 'todo',
    });

  const handleTaskClick = (task: any) => {
    setSelectedTaskContext({ taskId: task.id, title: task.title });
    setChatOpen(true);
  };

  // Generate professional avatar initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <ProtectedRoute requiredRole="employee">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Professional Header with Avatar */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  {user?.name ? getInitials(user.name) : 'EM'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.name || 'Employee'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.role || 'New Team Member'} • Onboarding Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Rendering Based on Feature Flag */}
          {EMPLOYEE_UI_V2 ? (
            /* New V2 UI */
            <>
              {/* Enhanced Progress Hero */}
              <div className="mb-12">
                <ProgressHero completed={completedTasks} total={totalTasks} />
              </div>

              {/* Task Groups by Category */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Onboarding Tasks
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(tasksByCategory).map(([category, tasks]) => {
                    const categoryIcons = {
                      hr: '👥',
                      admin: '⚙️',
                      security: '🔒',
                      communication: '💬'
                    };

                    return (
                      <TaskGroup
                        key={category}
                        title={`${category.charAt(0).toUpperCase() + category.slice(1)} Tasks`}
                        icon={categoryIcons[category as keyof typeof categoryIcons] || '📋'}
                        color={category as keyof typeof CATEGORY_COLORS}
                        tasks={tasks}
                        onTaskClick={handleTaskClick}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white">📚</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">View Resources</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Access company guides</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setChatOpen(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                    >
                      Open Resources
                    </button>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <span className="text-white">📊</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">View Progress</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Track your completion</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {/* Scroll to progress hero */}}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium py-2 px-4 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200"
                    >
                      View Dashboard
                    </button>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white">🎯</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Need Help?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Chat with Buddy</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setChatOpen(true)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                    >
                      Ask Buddy
                    </button>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            /* Legacy UI */
            <>
              {/* Progress Overview */}
              <div className="mb-8">
                <ProgressStrip completed={7} total={12} />
              </div>

              {/* KPI Metrics */}
              <div className="mb-8">
                <KPIMetrics {...kpiData} />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                  {/* Onboarding Tasks */}
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Onboarding Tasks
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          Complete your remaining tasks to finish onboarding
                        </p>
                      </div>
                      <TaskChecklist employeeId="E-1027" />
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Weekly Summary */}
                  <WeeklySummary {...weeklyData} />

                  {/* Example Task with Buddy Integration */}
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Benefits Enrollment</h3>
                          <p className="text-sm text-gray-500">Choose plans, compare options, ask questions.</p>
                        </div>
                        <button
                          onClick={openBenefitsTask}
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                        >
                          Open Assistant
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* Conditional Buddy Components */}
          {EMPLOYEE_UI_V2 ? (
            <>
              <BuddyFab onClick={() => setChatOpen(true)} isOpen={chatOpen} />
              <BuddyChatDrawer
                open={chatOpen}
                onClose={() => setChatOpen(false)}
                context={selectedTaskContext}
              />
            </>
          ) : (
            <>
              <BuddyFabLegacy />
              <BuddyPanel />
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}