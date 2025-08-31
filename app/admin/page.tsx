'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { IntegrationSettings } from '@/components/IntegrationSettings';
import { Card } from '@/components/Card';
import {
  Settings,
  Database,
  MessageSquare,
  Users,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('integrations');

  const tabs = [
    { id: 'integrations', label: 'Integrations', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <ProtectedRoute requiredRole="hr">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                System configuration and integration management
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center hover:shadow-lg transition-shadow duration-200">
              <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Integrations</div>
            </Card>

            <Card className="p-4 text-center hover:shadow-lg transition-shadow duration-200">
              <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Feedback Surveys</div>
            </Card>

            <Card className="p-4 text-center hover:shadow-lg transition-shadow duration-200">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </Card>

            <Card className="p-4 text-center hover:shadow-lg transition-shadow duration-200">
              <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">System Health</div>
            </Card>
          </div>

          {/* Tab Navigation */}
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
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
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
          {activeTab === 'integrations' && (
            <IntegrationSettings onIntegrationChange={() => {
              // Handle integration changes
              console.log('Integrations updated');
            }} />
          )}

          {activeTab === 'users' && (
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  User Management
                </h2>
              </div>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  User Management Coming Soon
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Advanced user management features will be available in the next update.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Role Management</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Assign and modify user roles</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bulk Operations</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Import/export user data</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Audit Logs</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Track user activity</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  System Analytics
                </h2>
              </div>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Advanced Analytics Coming Soon
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Comprehensive system analytics and reporting features will be available soon.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Performance Metrics</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">System performance and uptime</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Usage Reports</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">User engagement and adoption</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Custom Dashboards</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Create custom analytics views</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Security Settings
                </h2>
              </div>
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Advanced Security Features
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Enterprise-grade security features and compliance management.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Encryption</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">End-to-end data encryption</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Audit Trails</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Comprehensive activity logging</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Compliance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">GDPR and SOC2 compliance</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
