'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Clock, CheckCircle2, Circle, AlertTriangle, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getGuides, startGuide, useCopilotAnalytics } from '@/lib/hrCopilot';
import { GuidePlaybook, GuideStep } from '@/lib/hrCopilot';

interface GuideTabProps {
  employeeCount: number;
  atRiskCount: number;
}

export const GuideTab = ({ employeeCount, atRiskCount }: GuideTabProps) => {
  const [guides, setGuides] = useState<GuidePlaybook[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      setLoading(true);
      const data = await getGuides();
      setGuides(data);
    } catch (error) {
      console.error('Failed to load guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGuide = async (guideId: string) => {
    try {
      const result = await startGuide(guideId);
      if (result.success) {
        useCopilotAnalytics('guide_started', { guideId });
        // Show success toast
        console.log('Guide started:', result.message);
      }
    } catch (error) {
      console.error('Failed to start guide:', error);
    }
  };

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: GuideStep['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'doing':
        return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'blocked':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: GuideStep['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'doing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'blocked':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Stats */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {employeeCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Employees
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">
              {atRiskCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              At Risk
            </div>
          </div>
        </div>
      </div>

      {/* Guides List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {guides.map((guide) => (
            <Card key={guide.id} className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {guide.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {guide.steps.map((step) => (
                  <div key={step.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => toggleStepExpansion(step.id)}
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(step.status)}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {step.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{step.estimatedTime}</span>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getStatusColor(step.status)}`}
                            >
                              {step.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {step.status === 'todo' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartGuide(step.id);
                            }}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Start
                          </Button>
                        )}
                        {expandedSteps.has(step.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedSteps.has(step.id) && (
                      <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 mb-3">
                          {step.description}
                        </p>
                        {step.subSteps && step.subSteps.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                              Steps:
                            </h5>
                            <ul className="space-y-1">
                              {step.subSteps.map((subStep, index) => (
                                <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="text-orange-500 mt-0.5">•</span>
                                  <span>{subStep}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {guides.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Circle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Guides Available
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Check back later for HR process guides and checklists.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
