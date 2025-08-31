'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MetricsCards } from '@/components/MetricsCards';
import { EmployeeTable } from '@/components/EmployeeTable';
import { HRSummaryCard } from '@/components/HRSummaryCard';
import { NewHireModal } from '@/components/NewHireModal';
import { HRDrawer } from '@/components/hr-copilot/HRDrawer';
import { Fab } from '@/components/hr-copilot/Fab';
import { Button } from '@/components/ui/button';
import { Plus, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HRDashboardPage() {
  const { toast } = useToast();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [employeeCount] = useState(42); // Mock data - in real app from API
  const [atRiskCount] = useState(3); // Mock data - in real app from API

  const handleSendReminder = () => {
    toast({
      title: "Reminder Sent",
      description: "A reminder has been sent to all employees with pending tasks.",
    });
  };

  const handleOpenAssistant = () => {
    setIsAssistantOpen(true);
  };

  const handleCloseAssistant = () => {
    setIsAssistantOpen(false);
  };

  return (
    <ProtectedRoute requiredRole="hr">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                HR Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Monitor employee onboarding progress and manage the entire process
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleSendReminder}
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Reminder</span>
              </Button>
              <NewHireModal>
                <Button className="flex items-center space-x-2 bg-[#e99f75] hover:bg-orange-600">
                  <Plus className="w-4 h-4" />
                  <span>Add New Hire</span>
                </Button>
              </NewHireModal>
            </div>
          </div>
        </div>

        {/* Overall Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Overall Metrics
          </h2>
          <MetricsCards />
        </div>

        {/* Health Indicators */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Health Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">At Risk</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Need attention</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <button
                onClick={() => toast({ title: "Filter Applied", description: "Showing at-risk employees only." })}
                className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-[#e99f75] transition-colors"
              >
                View details →
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">On Track</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Progressing well</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">18</span>
              </div>
              <button
                onClick={() => toast({ title: "Filter Applied", description: "Showing on-track employees only." })}
                className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-[#e99f75] transition-colors"
              >
                View details →
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <button
                onClick={() => toast({ title: "Filter Applied", description: "Showing completed employees only." })}
                className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-[#e99f75] transition-colors"
              >
                View details →
              </button>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Employee Progress
          </h2>
          <EmployeeTable />
        </div>

        {/* Insights Panel */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Insights & Recommendations
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#e99f75] rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Task Completion Rate</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    3 employees haven't completed tasks in the last 7 days. Consider sending follow-up emails.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Quick Wins</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    5 employees are 90%+ complete. Schedule completion celebrations to boost morale.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Process Optimization</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The "HR paperwork" task has a 40% completion rate. Consider simplifying the process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HR Copilot */}
        <HRDrawer
          open={isAssistantOpen}
          onClose={handleCloseAssistant}
          context={{
            employeeCount,
            atRiskCount,
            // Add more context as needed
          }}
        />

        {/* Floating Copilot Button */}
        <Fab
          onClick={handleOpenAssistant}
          isOpen={isAssistantOpen}
          hasNotifications={atRiskCount > 0}
        />
      </div>
    </ProtectedRoute>
  );
}
