'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Circle,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock3,
  FileText,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { dataStore } from '@/lib/dataStore';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  manager: string;
  start_date: string;
  department: string;
  status: 'on-track' | 'at-risk' | 'completed';
  progress: number;
  last_updated: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  category: string;
  estimated_time: string;
  employee_id: string;
  updated_at: string;
}

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeDetailModal = ({ employee, isOpen, onClose }: EmployeeDetailModalProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && employee) {
      fetchEmployeeTasks();
    }
  }, [isOpen, employee]);

  const fetchEmployeeTasks = async () => {
    if (!employee) return;
    
    setLoading(true);
    try {
      const data = await api.getEmployeeTasks(employee.id);
      setTasks(data as Task[]);
    } catch (error) {
      console.error('Failed to fetch employee tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'doing':
        return <Clock3 className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'on-track': 'bg-green-100 text-green-800',
      'at-risk': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={cn(
        'px-3 py-1 text-sm font-medium',
        styles[status as keyof typeof styles]
      )}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const getTaskStatusBadge = (status: string) => {
    const styles = {
      'done': 'bg-green-100 text-green-800',
      'doing': 'bg-yellow-100 text-yellow-800',
      'todo': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={cn(
        'px-2 py-1 text-xs font-medium',
        styles[status as keyof typeof styles]
      )}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'admin':
        return <FileText className="w-4 h-4" />;
      case 'communication':
        return <MessageCircle className="w-4 h-4" />;
      case 'security':
        return <CheckCircle className="w-4 h-4" />;
      case 'hr':
        return <User className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'at-risk':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!employee) return null;

  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'doing').length;
  const pendingTasks = tasks.filter(task => task.status === 'todo').length;
  const totalTasks = tasks.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
              <p className="text-sm text-gray-600">{employee.role}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Overview */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Department</h3>
                <p className="text-gray-600">{employee.department}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Start Date</h3>
                <p className="text-gray-600">{new Date(employee.start_date).toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Manager</h3>
                <p className="text-gray-600">{employee.manager}</p>
              </div>
            </div>
          </Card>

          {/* Progress Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Onboarding Progress</h3>
              <div className="flex items-center space-x-2">
                {getStatusIcon(employee.status)}
                {getStatusBadge(employee.status)}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-medium text-gray-900">{employee.progress}%</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="bg-[#e99f75] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${employee.progress}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                  <div className="text-sm text-green-700">Completed</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{inProgressTasks}</div>
                  <div className="text-sm text-yellow-700">In Progress</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{pendingTasks}</div>
                  <div className="text-sm text-gray-700">Pending</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Task Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Breakdown</h3>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-200",
                      task.status === 'done' 
                        ? "bg-green-50 border-green-200" 
                        : task.status === 'doing'
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getTaskStatusIcon(task.status)}
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          {getTaskStatusBadge(task.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            {getCategoryIcon(task.category)}
                            <span>{task.category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{task.estimated_time}</span>
                          </div>
                          {task.updated_at && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Updated: {new Date(task.updated_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={() => {
                fetchEmployeeTasks();
              }}
              disabled={loading}
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
