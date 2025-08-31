'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { Download, Filter, Eye, Calendar, Search } from 'lucide-react';
import { Employee } from '@/types';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useDataRefresh } from '@/hooks/useDataRefresh';
import { EmployeeDetailModal } from './EmployeeDetailModal';

export const EmployeeTable = () => {
  const { refreshKey } = useDataRefresh();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [refreshKey]);

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

  const getLastCompletedTaskDate = (employeeId: string) => {
    try {
      const dataStore = require('@/lib/dataStore').dataStore;
      const tasks = dataStore.getEmployeeTasks(employeeId);
      const completedTasks = tasks.filter((task: any) => task.status === 'done');
      if (completedTasks.length > 0) {
        const latestTask = completedTasks.sort((a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0];
        return new Date(latestTask.updated_at).toLocaleDateString();
      }
      return 'No tasks completed';
    } catch (error) {
      return 'N/A';
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const statusMatch = statusFilter === 'all' || emp.status === statusFilter;
      const departmentMatch = departmentFilter === 'all' || emp.department === departmentFilter;
      const searchMatch = searchTerm === '' ||
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Date range filter
      let dateMatch = true;
      if (dateRangeFilter !== 'all') {
        const empDate = new Date(emp.start_date);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - empDate.getTime()) / (1000 * 3600 * 24));

        switch (dateRangeFilter) {
          case 'last-7-days':
            dateMatch = daysDiff <= 7;
            break;
          case 'last-30-days':
            dateMatch = daysDiff <= 30;
            break;
          case 'last-90-days':
            dateMatch = daysDiff <= 90;
            break;
          default:
            dateMatch = true;
        }
      }

      return statusMatch && departmentMatch && searchMatch && dateMatch;
    });
  }, [employees, statusFilter, departmentFilter, searchTerm, dateRangeFilter]);

  const departments = useMemo(() => {
    return Array.from(new Set(employees.map(emp => emp.department)));
  }, [employees]);

  const exportToCSV = () => {
    const headers = ['Name', 'Role', 'Manager', 'Department', 'Progress', 'Status', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => [
        emp.name,
        emp.role,
        emp.manager,
        emp.department,
        `${emp.progress}%`,
        emp.status,
        emp.last_updated
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee-onboarding-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'on-track': 'bg-green-100 text-green-800',
      'at-risk': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={cn(
        'px-2 py-1 text-xs font-medium rounded-full',
        styles[status as keyof typeof styles]
      )}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  if (loading) {
    return (
      <Card title="Employee Progress">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Employee Progress</h3>
          <p className="text-sm text-gray-600">
            {filteredEmployees.length} employees • Click on any employee row to view detailed task breakdown
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e99f75] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e99f75] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="on-track">On Track</option>
              <option value="at-risk">At Risk</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e99f75] focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e99f75] focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role & Manager
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Task Completed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr 
                key={employee.id} 
                className="hover:bg-orange-50 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                onClick={() => {
                  setSelectedEmployee(employee);
                  setShowDetailModal(true);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.department}</div>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-[#e99f75] transition-colors duration-200" />
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{employee.role}</div>
                    <div className="text-sm text-gray-500">Manager: {employee.manager}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-32">
                    <ProgressBar value={employee.progress} showLabel={false} />
                    <span className="text-xs text-gray-600 mt-1">{employee.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(employee.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    {getLastCompletedTaskDate(employee.id)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(employee.last_updated).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedEmployee(null);
        }}
      />
    </Card>
  );
};