'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

import { CheckCircle2, Circle, Clock, MessageCircle, Filter, Grid, List, Target, Shield, Briefcase, Users, FileText, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { Task } from '@/types';
import { TaskStatus } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useDataRefresh } from '@/hooks/useDataRefresh';
import { useAppToast } from './Toast';
import { useBuddy } from '@/hooks/useBuddyHook';

interface TaskChecklistProps {
  employeeId: string;
  onStepClick?: (step: number) => void;
}

export const TaskChecklist = ({ employeeId, onStepClick }: TaskChecklistProps) => {
  const { triggerRefresh } = useDataRefresh();
  const { showSuccess, showError } = useAppToast();
  const buddy = useBuddy();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTasks();
  }, [employeeId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployeeTasks(employeeId);
      setTasks(data as Task[]);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleQuickComplete = async (taskId: string) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));

    // Optimistically update the UI
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: 'done' as 'todo' | 'doing' | 'done' } : task
    ));

    try {
      await api.updateTaskStatus({ employee_id: employeeId, task_id: taskId, status: 'done' });
      triggerRefresh();
      showSuccess('Task Completed!', '🎉 Task completed successfully!');
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Revert on error
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, status: 'todo' as 'todo' | 'doing' | 'done' } : task
      ));
      showError('Task Update Failed', 'Failed to complete task. Please try again.');
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    
    // Optimistically update the UI
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus as 'todo' | 'doing' | 'done' } : task
    ));

    try {
      await api.updateTaskStatus({
        employee_id: employeeId,
        task_id: taskId,
        status: newStatus as TaskStatus
      });
      // Trigger refresh to update HR dashboard
      triggerRefresh();
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Revert on error
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: currentStatus as 'todo' | 'doing' | 'done' } : task
      ));
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    // Open Buddy panel with task context
    buddy.openBuddy({
      taskId: task.id,
      taskTitle: task.title,
      step: 1, // Default to first step
      totalSteps: 4, // This could be calculated based on task type
      progressPct: task.status === 'done' ? 100 : task.status === 'doing' ? 50 : 0,
      status: task.status as 'todo' | 'doing' | 'done'
    });
  };

  const handleStepClick = (step: number) => {
    buddy.setStep(step);
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    const currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) return;

    setUpdatingTasks(prev => new Set(prev).add(taskId));
    
    // Optimistically update the UI
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus as 'todo' | 'doing' | 'done' } : task
    ));

    // Update the selected task in the modal
    setSelectedTask(prev => prev ? { ...prev, status: newStatus as 'todo' | 'doing' | 'done' } : null);

    try {
      await api.updateTaskStatus({
        employee_id: employeeId,
        task_id: taskId,
        status: newStatus as TaskStatus
      });
      // Trigger refresh to update HR dashboard
      triggerRefresh();
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Revert on error
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: currentTask.status } : task
      ));
      setSelectedTask(prev => prev ? { ...prev, status: currentTask.status } : null);
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status: string, isUpdating: boolean) => {
    if (isUpdating) {
      return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'doing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      doing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };

    return (
      <span className={cn(
        'px-2 py-1 text-xs font-medium rounded-full',
        styles[status as keyof typeof styles]
      )}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Admin': FileText,
      'HR': Users,
      'Security': Shield,
      'Communication': MessageCircle,
      'Benefits': Briefcase,
      'IT': Target,
      'default': Circle
    };

    const IconComponent = icons[category as keyof typeof icons] || icons.default;
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Admin': 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      'HR': 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-200',
      'Security': 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
      'Communication': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      'Benefits': 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200',
      'IT': 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-200',
      'default': 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
    };

    return colors[category as keyof typeof colors] || colors.default;
  };

  // Filter and group tasks
  const filteredTasks = tasks.filter(task => {
    const categoryMatch = filterCategory === 'all' || task.category === filterCategory;
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const category = task.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  const categories = ['Admin', 'HR', 'Security', 'Communication', 'Benefits', 'IT'];
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'doing').length,
    pending: tasks.filter(t => t.status === 'todo').length
  };

  if (loading) {
    return (
      <Card title="Your Onboarding Tasks">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{taskStats.total}</div>
            <div className="text-xs text-blue-600 dark:text-blue-300">Total Tasks</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{taskStats.completed}</div>
            <div className="text-xs text-green-600 dark:text-green-300">Completed</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{taskStats.inProgress}</div>
            <div className="text-xs text-yellow-600 dark:text-yellow-300">In Progress</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{taskStats.pending}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Pending</div>
          </div>
        </div>
      </Card>

      {/* Filters and Controls */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#e99f75] focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#e99f75] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="todo">Pending</option>
                <option value="doing">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-lg transition-colors duration-200',
                viewMode === 'list' ? 'bg-orange-100 text-[#e99f75] dark:bg-orange-900 dark:text-[#e99f75]' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
              aria-label="Switch to list view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-lg transition-colors duration-200',
                viewMode === 'grid' ? 'bg-orange-100 text-[#e99f75] dark:bg-orange-900 dark:text-[#e99f75]' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
              aria-label="Switch to grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Task Categories */}
      <div className="space-y-6">
        {categories.map(category => {
          const categoryTasks = groupedTasks[category];
          if (!categoryTasks || categoryTasks.length === 0) return null;

          const completedCount = categoryTasks.filter(t => t.status === 'done').length;
          const progress = (completedCount / categoryTasks.length) * 100;

          return (
            <Card key={category} className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => toggleCategory(category)}>
                    {collapsedCategories.has(category) ? (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', getCategoryColor(category))}>
                      {getCategoryIcon(category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {completedCount}/{categoryTasks.length} tasks • {Math.round(progress)}% complete
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="bg-[#e99f75] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Task List */}
                {!collapsedCategories.has(category) && (
                  <div className="space-y-3">
                    {categoryTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskToggle(task.id, task.status);
                              }}
                              disabled={updatingTasks.has(task.id)}
                              className="mt-1 hover:scale-110 transition-transform duration-200"
                              aria-label={`Toggle status for task "${task.title}"`}
                            >
                              {getStatusIcon(task.status, updatingTasks.has(task.id))}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className={cn(
                                  'text-sm font-medium',
                                  task.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'
                                )}>
                                  {task.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  {getStatusBadge(task.status)}
                                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                                    {task.estimated_time}
                                  </span>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {task.status !== 'done' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickComplete(task.id);
                                }}
                                disabled={updatingTasks.has(task.id)}
                                className="px-3 py-1.5 bg-[#e99f75] hover:bg-orange-600 text-white text-xs font-medium rounded-md transition-colors duration-200 disabled:opacity-50"
                                aria-label={`Mark task "${task.title}" as complete`}
                              >
                                Mark Complete
                              </button>
                            )}
                            <button
                              onClick={() => handleTaskClick(task)}
                              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      

    </div>
  );
};