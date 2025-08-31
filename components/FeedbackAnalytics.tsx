'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { FeedbackAnalytics as FeedbackAnalyticsType } from '@/types';
import { cn } from '@/lib/utils';

export const FeedbackAnalytics = () => {
  const [analytics, setAnalytics] = useState<FeedbackAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.getFeedbackAnalytics();
      setAnalytics(data as any);
    } catch (error) {
      console.error('Failed to load feedback analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card title="Feedback Analytics" subtitle="Loading feedback data...">
        <div className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!analytics || analytics.totalSurveysSent === 0) {
    return (
      <Card title="Feedback Analytics" subtitle="Employee feedback and satisfaction metrics">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-[#e99f75]" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            ⚠️ No Feedback Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto text-lg">
            Feedback surveys will automatically be sent to employees on their Day 30 and Day 90 milestones.
            <br /><strong>Click below to send your first survey and start gathering insights!</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => alert('Send Survey feature coming soon!')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#e99f75] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Send First Survey
            </button>
            <button
              onClick={() => alert('Add New Hire feature coming soon!')}
              className="inline-flex items-center px-6 py-3 border-2 border-orange-200 dark:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-semibold rounded-lg transition-all duration-200"
            >
              <Users className="w-5 h-5 mr-2" />
              Add New Hire First
            </button>
          </div>
        </div>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 dark:text-green-400';
    if (score >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 4) return 'bg-green-50 dark:bg-green-900/20';
    if (score >= 3) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  return (
    <Card title="Feedback Analytics" subtitle="Employee satisfaction and onboarding feedback insights">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {analytics.totalSurveysSent}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Surveys Sent</div>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {analytics.totalCompleted}
            </div>
            <div className="text-xs text-green-700 dark:text-green-300">Completed</div>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {analytics.averageSatisfaction.toFixed(1)}
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300">Avg Rating</div>
          </div>

          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {analytics.completionRate}%
            </div>
            <div className="text-xs text-orange-700 dark:text-orange-300">Completion Rate</div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Category Performance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analytics.categoryAverages).map(([category, score]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
                    {category}
                  </span>
                  <span className={cn('text-sm font-bold', getScoreColor(score))}>
                    {score.toFixed(1)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="bg-[#e99f75] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trends */}
        {analytics.trends.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Trends</h4>
            <div className="space-y-3">
              {analytics.trends.slice(-6).map((trend) => (
                <div key={trend.month} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {new Date(trend.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {trend.responseCount} responses
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className={cn('text-sm font-medium', getScoreColor(trend.averageScore))}>
                        {trend.averageScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Insights & Recommendations
              </h4>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Overall satisfaction: {analytics.averageSatisfaction >= 4 ? 'Excellent' : analytics.averageSatisfaction >= 3 ? 'Good' : 'Needs Improvement'}</li>
                <li>• Response rate: {analytics.completionRate >= 80 ? 'Strong' : analytics.completionRate >= 60 ? 'Moderate' : 'Low'}</li>
                {analytics.categoryAverages.onboarding < 3.5 && (
                  <li>• Focus on improving onboarding processes</li>
                )}
                {analytics.categoryAverages.manager < 3.5 && (
                  <li>• Consider manager training and support programs</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
