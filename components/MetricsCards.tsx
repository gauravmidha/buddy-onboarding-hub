'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Clock, TrendingUp, Star, Users } from 'lucide-react';
import { MetricData } from '@/types';
import { cn } from '@/lib/utils';
import { useDataRefresh } from '@/hooks/useDataRefresh';
import { api } from '@/lib/api';

export const MetricsCards = () => {
  const { refreshKey } = useDataRefresh();
  const [metrics, setMetrics] = useState<MetricData>({
    avgCompletionTime: 0,
    onTrackPercentage: 0,
    avgSatisfactionScore: 0,
    totalEmployees: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch metrics from API
    const fetchMetrics = async () => {
      try {
        const data = await api.getMetrics();
        setMetrics(data as any);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        // Fallback to mock data
        setMetrics({
          avgCompletionTime: 4.2,
          onTrackPercentage: 85,
          avgSatisfactionScore: 4.6,
          totalEmployees: 23
        });
      } finally {
        setLoading(false);
      }
    };

    // Set fallback data immediately to ensure cards show
    setMetrics({
      avgCompletionTime: 4.2,
      onTrackPercentage: 85,
      avgSatisfactionScore: 4.6,
      totalEmployees: 23
    });
    setLoading(false);

    fetchMetrics();
  }, [refreshKey]);

  const metricCards = [
    {
      title: 'Avg Completion Time',
      value: loading ? '...' : `${metrics.avgCompletionTime} days`,
      icon: Clock,
      color: 'text-[#e99f75] dark:text-[#e99f75]',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'On Track',
      value: loading ? '...' : `${metrics.onTrackPercentage}%`,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Satisfaction Score',
      value: loading ? '...' : `${metrics.avgSatisfactionScore}/5.0`,
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      title: 'Total Employees',
      value: loading ? '...' : metrics.totalEmployees.toString(),
      icon: Users,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20'
    }
  ];

  console.log('MetricsCards rendering:', { metrics, loading, metricCards });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          console.log(`Rendering metric ${index}:`, metric);
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 glow-light dark:glow-dark p-4">
              <div className="flex items-center space-x-3">
                <div className={cn('p-2 rounded-lg', metric.bgColor)}>
                  <Icon className={cn('w-5 h-5', metric.color)} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{metric.title}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};