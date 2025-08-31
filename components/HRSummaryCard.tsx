'use client';

import { useState, useEffect } from 'react';
import { Card } from './Card';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Building2,
  Clock
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

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

export const HRSummaryCard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployeeData();
      setEmployees(data as Employee[]);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const totalEmployees = employees.length;
  const onTrackCount = employees.filter(emp => emp.status === 'on-track').length;
  const atRiskCount = employees.filter(emp => emp.status === 'at-risk').length;
  const completedCount = employees.filter(emp => emp.status === 'completed').length;
  
  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  const avgProgress = employees.length > 0 
    ? Math.round(employees.reduce((sum, emp) => sum + emp.progress, 0) / employees.length)
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-600 bg-green-100';
      case 'at-risk':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Onboarding Overview</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Real-time summary of employee onboarding progress across all departments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees */}
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg glow-light dark:glow-dark hover:scale-105 transition-transform duration-200">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalEmployees}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Total Employees</div>
        </div>

        {/* On Track */}
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg glow-light dark:glow-dark hover:scale-105 transition-transform duration-200">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{onTrackCount}</div>
          <div className="text-sm text-green-700 dark:text-green-300">On Track</div>
        </div>

        {/* At Risk */}
        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg glow-light dark:glow-dark hover:scale-105 transition-transform duration-200 cursor-pointer">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{atRiskCount}</div>
          <div className="text-sm text-red-700 dark:text-red-300">⚠️ Need Support</div>
          {atRiskCount > 0 && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
              Click to review
            </div>
          )}
        </div>

        {/* Completed */}
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg glow-light dark:glow-dark hover:scale-105 transition-transform duration-200">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedCount}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Completed</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg glow-light dark:glow-dark hover:scale-105 transition-transform duration-200">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{avgProgress}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Average Progress</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg glow-light dark:glow-dark hover:scale-105 transition-transform duration-200">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{departments.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Departments</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg glow-light dark:glow-dark hover:scale-105 transition-transform duration-200">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {Math.round((onTrackCount / totalEmployees) * 100)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Success Rate</div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Department Breakdown</h4>
        <div className="space-y-2">
          {departments.map(dept => {
            const deptEmployees = employees.filter(emp => emp.department === dept);
            const deptProgress = deptEmployees.length > 0
              ? Math.round(deptEmployees.reduce((sum, emp) => sum + emp.progress, 0) / deptEmployees.length)
              : 0;
            
            return (
              <div key={dept} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">({deptEmployees.length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{deptProgress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
