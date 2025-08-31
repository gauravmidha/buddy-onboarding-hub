'use client';

import { useState } from 'react';
import { X, User, Building2, Eye, EyeOff } from 'lucide-react';
import { Card } from './Card';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: 'hr' | 'employee', userData: any) => void;
}

export const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [selectedRole, setSelectedRole] = useState<'hr' | 'employee'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo credentials matching dataStore users
    const demoUsers = {
      'hr@acme.com': { id: 'HR-001', name: 'Sarah Johnson', role: 'hr', email: 'hr@acme.com' },
      'emily.chen@acme.com': { id: 'E-1027', name: 'Emily Chen', role: 'employee', email: 'emily.chen@acme.com' },
      'marcus.johnson@acme.com': { id: 'E-1028', name: 'Marcus Johnson', role: 'employee', email: 'marcus.johnson@acme.com' },
      'aria.nakamura@acme.com': { id: 'E-1029', name: 'Aria Nakamura', role: 'employee', email: 'aria.nakamura@acme.com' }
    };

    if (password === 'demo123' && demoUsers[email as keyof typeof demoUsers]) {
      const userData = demoUsers[email as keyof typeof demoUsers];
      if (userData.role === selectedRole) {
        onLogin(selectedRole, {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        });
      } else {
        setError('Selected role does not match the user account');
      }
    } else {
      setError('Invalid credentials. Use demo123 as password');
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-md">
        <Card className="relative p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to access your portal
            </p>
          </div>

          {/* OAuth Options */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="#0078D4" viewBox="0 0 24 24">
                  <path d="M1 5.25A4.25 4.25 0 0 1 5.25 1h13.5A4.25 4.25 0 0 1 23 5.25v13.5A4.25 4.25 0 0 1 18.75 23H5.25A4.25 4.25 0 0 1 1 18.75V5.25z"/>
                  <path d="M7.75 10.5a2.75 2.75 0 1 1 5.5 0 2.75 2.75 0 0 1-5.5 0zM12 13.5c-2.49 0-4.5 2.01-4.5 4.5v1.25h9V18c0-2.49-2.01-4.5-4.5-4.5z"/>
                </svg>
                Microsoft
              </button>
            </div>
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or continue with email</span>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('employee')}
                className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === 'employee'
                    ? 'border-[#e99f75] bg-orange-50 dark:bg-orange-900/20 text-[#e99f75] dark:text-[#e99f75] shadow-lg'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <User className="w-8 h-8 mx-auto mb-3" />
                <div className="text-center">
                  <span className="text-lg font-semibold block mb-1">New Employee</span>
                  <span className="text-sm opacity-75">Track tasks, chat with AI assistant</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('hr')}
                className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === 'hr'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 shadow-lg'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Building2 className="w-8 h-8 mx-auto mb-3" />
                <div className="text-center">
                  <span className="text-lg font-semibold block mb-1">HR Manager</span>
                  <span className="text-sm opacity-75">Manage onboarding, view analytics</span>
                </div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e99f75] focus:border-transparent transition-colors duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e99f75] focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Demo Credentials Info */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {/* Toggle tooltip */}}
                className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <path d="M12 17h.01"/>
                </svg>
                Demo accounts available
              </button>
              <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-10">
                <div className="font-medium mb-2">Demo Credentials:</div>
                <div className="space-y-1">
                  <div><strong>HR:</strong> hr@acme.com</div>
                  <div><strong>Employees:</strong></div>
                  <div className="ml-2">• emily.chen@acme.com</div>
                  <div className="ml-2">• marcus.johnson@acme.com</div>
                  <div className="ml-2">• aria.nakamura@acme.com</div>
                  <div className="mt-2 pt-2 border-t border-gray-600"><strong>Password:</strong> demo123</div>
                </div>
                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#e99f75] to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};
