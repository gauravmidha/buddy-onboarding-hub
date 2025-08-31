'use client';

import { CheckCircle, TrendingUp, Clock, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KPIMetricsProps {
  tasksCompletedThisWeek: number;
  progressRate: number;
  avgCompletionTime: string;
  className?: string;
}

export const KPIMetrics: React.FC<KPIMetricsProps> = ({
  tasksCompletedThisWeek,
  progressRate,
  avgCompletionTime,
  className = ""
}) => {
  const metrics = [
    {
      title: "Tasks Completed This Week",
      value: tasksCompletedThisWeek.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      title: "Progress Rate",
      value: `${progressRate}%`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      title: "Avg Completion Time",
      value: avgCompletionTime,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-800",
      borderColor: "border-gray-200 dark:border-gray-700"
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {metrics.map((metric, index) => (
        <Card key={index} className={`border ${metric.borderColor} hover:shadow-md transition-shadow duration-200`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
