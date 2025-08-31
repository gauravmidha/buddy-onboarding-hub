'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProgressStrip } from '@/components/ProgressStrip';
import { TaskChecklist } from '@/components/TaskChecklist';
import { KPIMetrics } from '@/components/KPIMetrics';
import { WeeklySummary } from '@/components/WeeklySummary';
import BuddyFab from '@/components/BuddyFab';
import BuddyPanel from '@/components/BuddyPanel';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useBuddy } from '@/hooks/useBuddyHook';

export default function EmployeePage() {
  const { user } = useAuth();
  const buddy = useBuddy();

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

          {/* New Buddy Components - Single Trigger + Panel */}
          <BuddyFab />
          <BuddyPanel />
        </div>
      </div>
    </ProtectedRoute>
  );
}