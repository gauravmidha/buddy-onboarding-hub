'use client';

import { useState } from 'react';
import { MetricsCards } from '@/components/MetricsCards';
import { EmployeeTable } from '@/components/EmployeeTable';
import { HRSummaryCard } from '@/components/HRSummaryCard';
import { FeedbackAnalytics } from '@/components/FeedbackAnalytics';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { NewHireModal } from '@/components/NewHireModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function HRDashboardPage() {
  console.log('HR Dashboard rendering');

  const [showAddNewHireModal, setShowAddNewHireModal] = useState(false);
  const [newHireForm, setNewHireForm] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    manager: '',
    start_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNewHire = async () => {
    if (!newHireForm.name || !newHireForm.email || !newHireForm.role) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const employeeId = `E-${Date.now().toString().slice(-6)}`;
      const employeeData = {
        id: employeeId,
        name: newHireForm.name,
        email: newHireForm.email,
        role: newHireForm.role,
        manager: newHireForm.manager || 'TBD',
        start_date: newHireForm.start_date || new Date().toISOString().split('T')[0],
        department: newHireForm.department || 'General',
        status: 'on-track' as const,
        progress: 0,
        last_updated: new Date().toISOString()
      };

      // Add to dataStore
      const dataStore = (await import('@/lib/dataStore')).dataStore;
      dataStore.addEmployee(employeeData);

      // Create onboarding workflow
      await api.createOnboardingWorkflow(employeeId);

      alert(`New hire ${newHireForm.name} has been added successfully!`);
      setShowAddNewHireModal(false);
      setNewHireForm({
        name: '',
        email: '',
        role: '',
        department: '',
        manager: '',
        start_date: ''
      });

      // Refresh the page to show the new employee
      window.location.reload();
    } catch (error) {
      console.error('Error adding new hire:', error);
      alert('Error adding new hire. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Last updated</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <button className="px-4 py-2 bg-[#e99f75] hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                Export CSV
              </button>
            </div>
          </div>

          {/* Overall Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-[#e99f75]">23</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Employees</div>
                </div>
                <div className="w-12 h-12 bg-[#e99f75] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">78%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Success Rate</div>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">12 days</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Avg Completion Time</div>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Health Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {/* Filter to on-track */}}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">18</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">On Track</div>
                  <div className="text-xs text-green-500 mt-1">Great progress!</div>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {/* Filter to at-risk */}}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-600">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Need Support</div>
                  <div className="text-xs text-red-500 mt-1">⚠️ Click to review</div>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {/* Filter to completed */}}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">2</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
                  <div className="text-xs text-blue-500 mt-1">🎉 Well done!</div>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center mt-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Employee Progress</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Click on any health indicator above to filter the table below
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">Send Reminder</Button>
              <NewHireModal>
                <Button>Add New Hire</Button>
              </NewHireModal>
            </div>
          </div>

                                {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Takes 2/3 on lg screens and up */}
          <div className="lg:col-span-2 space-y-6">
            <HRSummaryCard />
          </div>

          {/* Right Column - Takes 1/3 on lg screens and up */}
          <div className="space-y-6">
            <MetricsCards />

            {/* Insights Panel */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insights</h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Design department completion rate is 35% below average
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Consider assigning mentors or additional training resources.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Engineering team has 95% task completion rate
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Excellent performance! Consider sharing best practices with other departments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <FeedbackAnalytics />
          </div>
        </div>
      </div>

      <EmployeeTable />
    </div>
    </ProtectedRoute>
  );
}