'use client';

import { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, Circle, Clock, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  isUpdating: boolean;
}

export const TaskModal = ({ task, isOpen, onClose, onStatusChange, isUpdating }: TaskModalProps) => {
  if (!task) return null;

  const getStatusIcon = (status: string) => {
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
      done: 'bg-green-100 text-green-800',
      doing: 'bg-yellow-100 text-yellow-800',
      todo: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={cn(
        'px-3 py-1 text-sm font-medium rounded-full',
        styles[status as keyof typeof styles]
      )}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(task.id, newStatus);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {getStatusIcon(task.status)}
            <span>{task.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Category: {task.category}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Estimated Time: {task.estimated_time}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Current Status:</span>
              {getStatusBadge(task.status)}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Update Status:</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusChange('todo')}
                  disabled={isUpdating || task.status === 'todo'}
                  className={cn(
                    'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    task.status === 'todo'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  )}
                >
                  To-Do
                </button>
                <button
                  onClick={() => handleStatusChange('doing')}
                  disabled={isUpdating || task.status === 'doing'}
                  className={cn(
                    'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    task.status === 'doing'
                      ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                      : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                  )}
                >
                  Doing
                </button>
                <button
                  onClick={() => handleStatusChange('done')}
                  disabled={isUpdating || task.status === 'done'}
                  className={cn(
                    'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    task.status === 'done'
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  )}
                >
                  Done
                </button>
              </div>
            </div>
          </div>

          {isUpdating && (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Clock className="w-4 h-4 animate-spin" />
              <span className="text-sm">Updating status...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};