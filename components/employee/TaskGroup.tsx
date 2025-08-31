'use client';

import { ReactNode } from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';
import { CATEGORY_COLORS } from '@/lib/colors';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface TaskGroupProps {
  title: string;
  icon: ReactNode;
  color: keyof typeof CATEGORY_COLORS;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export const TaskGroup = ({ title, icon, color, tasks, onTaskClick }: TaskGroupProps) => {
  const colorValue = CATEGORY_COLORS[color];

  // Check if any task is overdue
  const hasOverdueTasks = tasks.some(task =>
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
  );

  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="relative rounded-2xl border bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Left border with category color */}
      <div
        className="absolute inset-y-0 left-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: colorValue }}
      ></div>

      {/* Header */}
      <div className="relative pl-6 pr-4 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: `${colorValue}20`,
                border: `1px solid ${colorValue}40`
              }}
            >
              <div style={{ color: colorValue }}>
                {icon}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {completedTasks} of {totalTasks} tasks
              </p>
            </div>
          </div>

          {/* Progress indicator and overdue warning */}
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {progressPercentage}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Complete
              </div>
            </div>

            {hasOverdueTasks && (
              <div className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-2 py-1 border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-3 h-3" />
                <span>Overdue</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: colorValue
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {tasks.map((task) => {
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
          const isCompleted = task.status === 'done';

          return (
            <div
              key={task.id}
              onClick={() => onTaskClick?.(task)}
              className={cn(
                "relative px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-150",
                isOverdue && "bg-red-50/50 dark:bg-red-900/10"
              )}
            >
              <div className="flex items-start space-x-3">
                {/* Status icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={cn(
                      "text-sm font-medium text-gray-900 dark:text-white truncate",
                      isCompleted && "line-through text-gray-500 dark:text-gray-400"
                    )}>
                      {task.title}
                    </h4>

                    {/* Overdue indicator */}
                    {isOverdue && !isCompleted && (
                      <div className="flex items-center text-red-500 ml-2">
                        <Clock className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {task.description && (
                    <p className={cn(
                      "text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2",
                      isCompleted && "line-through"
                    )}>
                      {task.description}
                    </p>
                  )}

                  {/* Due date and category */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      {task.dueDate && (
                        <span className={cn(
                          "flex items-center space-x-1",
                          isOverdue && !isCompleted && "text-red-500"
                        )}>
                          <Clock className="w-3 h-3" />
                          <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>

                    <span className="text-xs px-2 py-1 rounded-full" style={{
                      backgroundColor: `${colorValue}20`,
                      color: colorValue,
                      border: `1px solid ${colorValue}40`
                    }}>
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No tasks in this category
          </p>
        </div>
      )}
    </div>
  );
};
