'use client';

import { TrendingUp, Clock, Target, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface WeeklySummaryProps {
  tasksCompleted: number;
  hoursSaved: number;
  progressVsCompany: number;
  className?: string;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  tasksCompleted,
  hoursSaved,
  progressVsCompany,
  className = ""
}) => {
  const summaryItems = [
    {
      label: "Tasks Completed",
      value: tasksCompleted,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      label: "Hours Saved",
      value: `${hoursSaved}h`,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      label: "vs Company Avg",
      value: `${progressVsCompany > 0 ? '+' : ''}${progressVsCompany}%`,
      icon: TrendingUp,
      color: progressVsCompany > 0 ? "text-green-600" : "text-red-600",
      bgColor: progressVsCompany > 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
    }
  ];

  return (
    <Card className={`border border-gray-200 dark:border-gray-700 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            This Week
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Summary
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {summaryItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center mx-auto mb-1`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
