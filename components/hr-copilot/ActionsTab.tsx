'use client';

import { useState } from 'react';
import { UserPlus, Send, FileDown, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { addNewHire, sendReminder, exportCSV, generateRiskReport } from '@/lib/hrCopilot';
import { NewHireModal } from './NewHireModal';

interface ActionsTabProps {
  context?: any;
}

export const ActionsTab = ({ context }: ActionsTabProps) => {
  const [showNewHireModal, setShowNewHireModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleNewHire = async (data: any) => {
    setLoadingAction('new-hire');
    try {
      await addNewHire(data);
      // Show success toast
      console.log('New hire added successfully');
    } catch (error) {
      console.error('Failed to add new hire:', error);
    } finally {
      setLoadingAction(null);
      setShowNewHireModal(false);
    }
  };

  const handleSendReminder = async () => {
    setLoadingAction('reminder');
    try {
      await sendReminder({
        employees: ['selected-employees'],
        template: 'onboarding_reminder',
        message: 'Please complete your onboarding tasks.'
      });
      console.log('Reminder sent successfully');
    } catch (error) {
      console.error('Failed to send reminder:', error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExportCSV = async () => {
    setLoadingAction('export');
    try {
      const result = await exportCSV(context?.filters);
      if (result.success) {
        // Trigger download
        console.log('CSV export completed:', result.downloadUrl);
      }
    } catch (error) {
      console.error('Failed to export CSV:', error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRiskReport = async () => {
    setLoadingAction('risk-report');
    try {
      const result = await generateRiskReport(context?.filters);
      if (result.success) {
        console.log('Risk report generated:', result.reportUrl);
      }
    } catch (error) {
      console.error('Failed to generate risk report:', error);
    } finally {
      setLoadingAction(null);
    }
  };

  const actions = [
    {
      id: 'new-hire',
      title: 'Add New Hire',
      description: 'Create onboarding checklist for new employee',
      icon: UserPlus,
      color: 'from-green-500 to-green-600',
      action: () => setShowNewHireModal(true)
    },
    {
      id: 'reminder',
      title: 'Send Reminder',
      description: 'Notify employees about pending tasks',
      icon: Send,
      color: 'from-blue-500 to-blue-600',
      action: handleSendReminder
    },
    {
      id: 'export',
      title: 'Export CSV',
      description: 'Download employee data and reports',
      icon: FileDown,
      color: 'from-purple-500 to-purple-600',
      action: handleExportCSV
    },
    {
      id: 'risk-report',
      title: 'At-Risk Report',
      description: 'Generate risk assessment for employees',
      icon: AlertTriangle,
      color: 'from-amber-500 to-amber-600',
      action: handleRiskReport
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Common HR tasks and automated workflows
        </p>
      </div>

      {/* Actions Grid */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Card
              key={action.id}
              className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border border-gray-200 dark:border-gray-700"
              onClick={action.action}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {action.description}
                </p>
                <Button
                  className={`w-full bg-gradient-to-r ${action.color} hover:opacity-90 transition-opacity`}
                  disabled={loadingAction === action.id}
                >
                  {loadingAction === action.id ? 'Processing...' : 'Execute'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Actions */}
        <div className="mt-8 space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Recent Actions
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Added Sarah Johnson
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                Success
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Sent onboarding reminders
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    4 hours ago
                  </p>
                </div>
              </div>
              <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                Sent
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Hire Modal */}
      <NewHireModal
        open={showNewHireModal}
        onClose={() => setShowNewHireModal(false)}
        onSubmit={handleNewHire}
        loading={loadingAction === 'new-hire'}
      />
    </div>
  );
};
