'use client';

import { useState, useEffect } from 'react';
import { TaskChecklist } from '@/components/TaskChecklist';
import { FeedbackSurvey } from '@/components/FeedbackSurvey';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/Card';
import { ProgressStrip } from '@/components/ProgressStrip';
import { AssistantFab } from '@/components/AssistantFab';
import { Sparkles, UserCheck, Clock, CheckCircle, TrendingUp, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { FeedbackSurvey as FeedbackSurveyType } from '@/types';
import { useTasksStore } from '@/store/useTasks';

export default function EmployeePage() {
  const { user } = useAuth();
  const { tasks, fetchTasks } = useTasksStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [feedbackSurveys, setFeedbackSurveys] = useState<FeedbackSurveyType[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<FeedbackSurveyType | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [loading, setLoading] = useState(true);

  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;

  useEffect(() => {
    if (user) {
      loadFeedbackSurveys();
      fetchTasks(user.id);
    }
  }, [user, fetchTasks]);

  const loadFeedbackSurveys = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const surveys = await api.getEmployeeFeedbackSurveys(user.id);
      setFeedbackSurveys(surveys as FeedbackSurveyType[]);

      // Check for new surveys automatically
      await api.checkAndTriggerFeedbackSurveys();
      const updatedSurveys = await api.getEmployeeFeedbackSurveys(user.id);
      setFeedbackSurveys(updatedSurveys as FeedbackSurveyType[]);
    } catch (error) {
      console.error('Failed to load feedback surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeSurvey = (survey: FeedbackSurveyType) => {
    setSelectedSurvey(survey);
    setShowSurvey(true);
  };

  const handleSurveySubmit = () => {
    setShowSurvey(false);
    setSelectedSurvey(null);
    loadFeedbackSurveys(); // Refresh surveys
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e99f75] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'tasks', label: 'Onboarding Tasks', icon: CheckCircle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'progress', label: 'Progress', icon: Clock },
  ];

  return (
    <ProtectedRoute requiredRole="employee">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#e99f75] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Let's continue your onboarding journey
              </p>

              {/* Progress Snapshot */}
              <div className="bg-gradient-to-r from-green-50 to-orange-50 dark:from-green-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Onboarding Progress</span>
                  <span className="text-sm font-bold text-green-700 dark:text-green-300">3/8 tasks completed</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-green-500 to-[#e99f75] h-2 rounded-full" style={{ width: '37.5%' }}></div>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300">
                  🎯 Next up: Benefits Enrollment • ⏱️ 20 mins remaining
                </p>
              </div>
            </div>
          </div>

          {/* AI-Powered Onboarding Info Card */}
          <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#e99f75] to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  AI-Powered Onboarding Assistant
                </h3>
                <p className="text-orange-800 dark:text-orange-200 mb-3">
                  Need help with any task? Click on any task below to open our intelligent chatbot that will guide you through the process step-by-step.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                    💬 Interactive Chat
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200">
                    🤖 AI Guidance
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    ⚡ Quick Actions
                  </span>
                </div>
                </div>
              </div>
            </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-[#e99f75] text-[#e99f75] dark:text-[#e99f75]'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Progress Strip */}
              <ProgressStrip completed={completedTasks} total={totalTasks} />

              {/* Achievements Section */}
              <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="mr-2">🏆</span>
                  Your Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="text-2xl mb-2">🔥</div>
                    <div className="text-xl font-bold text-orange-600 dark:text-orange-400">7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Day Streak</div>
                    <div className="text-xs text-orange-500 mt-1">Keep it up!</div>
                  </div>

                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="text-xl font-bold text-[#e99f75] dark:text-[#e99f75]">{completedTasks}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Tasks Completed</div>
                    <div className="text-xs text-orange-500 mt-1">This Week</div>
                  </div>

                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">On Track</div>
                    <div className="text-xs text-green-500 mt-1">Great progress!</div>
                  </div>
                </div>
              </Card>

              {/* AI Assistant Card */}
              <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#e99f75] to-orange-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Ready to help with your onboarding</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded-full text-sm">
                    Interactive Chat
                  </span>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded-full text-sm">
                    AI Guidance
                  </span>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded-full text-sm">
                    Quick Actions
                  </span>
                </div>
              </Card>


            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Onboarding Tasks</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete these tasks to finish your onboarding process. Click on any task to get started.
                </p>
              </div>
              <TaskChecklist employeeId={user.id} />
            </div>
          )}

          {activeTab === 'feedback' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Feedback Surveys</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Your feedback helps us improve the onboarding experience. Complete any pending surveys below.
                </p>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e99f75] mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading surveys...</p>
                </div>
              ) : feedbackSurveys.length === 0 ? (
                <Card className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Surveys Yet</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Feedback surveys will appear here automatically on your Day 30 and Day 90 milestones.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {feedbackSurveys.map((survey) => (
                    <Card key={survey.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            survey.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/20'
                              : survey.status === 'sent'
                              ? 'bg-orange-100 dark:bg-orange-900/20'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            {survey.status === 'completed' ? (
                              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            ) : survey.status === 'sent' ? (
                              <Clock className="w-6 h-6 text-[#e99f75] dark:text-[#e99f75]" />
                            ) : (
                              <MessageSquare className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {survey.type === 'day-30' ? 'Day 30 Check-in' :
                               survey.type === 'day-90' ? 'Day 90 Check-in' : 'Feedback Survey'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {survey.status === 'completed'
                                ? `Completed on ${new Date(survey.completed_date || '').toLocaleDateString()}`
                                : survey.status === 'sent'
                                ? 'Ready to take - Your feedback is valuable!'
                                : 'Survey will be available soon'}
            </p>
          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {survey.status === 'completed' && survey.overall_score && (
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {survey.overall_score.toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                            </div>
                          )}
                          {survey.status === 'sent' && (
                            <button
                              onClick={() => handleTakeSurvey(survey)}
                                                                   className="px-4 py-2 bg-[#e99f75] hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                            >
                              Take Survey
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Onboarding Completion</span>
                      <span>37.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-[#e99f75] to-orange-600 h-3 rounded-full transition-all duration-500" style={{ width: '37.5%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-800 dark:text-green-200">Completed</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">3</p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <span className="font-medium text-yellow-800 dark:text-yellow-200">In Progress</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">2</p>
                    </div>
                  </div>
                </div>
              </Card>
        </div>
      )}
    </div>

      {/* Feedback Survey Modal */}
      <FeedbackSurvey
        survey={selectedSurvey}
        isOpen={showSurvey}
        onClose={() => setShowSurvey(false)}
        onSubmit={handleSurveySubmit}
      />
    </div>

      {/* Assistant FAB */}
      <AssistantFab taskContext={tasks.length > 0 ? tasks.find(t => t.status === 'todo')?.title : undefined} />
    </ProtectedRoute>
  );
}