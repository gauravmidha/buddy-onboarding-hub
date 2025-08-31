'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, User, LogOut, LogIn, Moon, Sun, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { LoginModal } from './LoginModal';
import { useState } from 'react';

export const Navbar = () => {
  const pathname = usePathname();
  const { user, userRole, isAuthenticated, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    ...(isAuthenticated && userRole === 'employee' ? [{ href: '/employee', label: 'Employee Portal', icon: User }] : []),
    ...(isAuthenticated && userRole === 'hr' ? [
      { href: '/hr-dashboard', label: 'HR Dashboard', icon: Users },
      { href: '/admin', label: 'Admin', icon: Settings }
    ] : []),
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            {/* New Buddy Logo - Friendly Robot Head */}
            <div className="w-10 h-10 flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm"
              >
                {/* Robot Head Base */}
                <rect
                  x="8"
                  y="12"
                  width="24"
                  height="20"
                  rx="8"
                  fill="url(#robotGradient)"
                  stroke="url(#robotBorder)"
                  strokeWidth="2"
                />

                {/* Eyes */}
                <circle cx="16" cy="18" r="3" fill="white" opacity="0.9" />
                <circle cx="24" cy="18" r="3" fill="white" opacity="0.9" />
                <circle cx="16" cy="18" r="1.5" fill="#e99f75" />
                <circle cx="24" cy="18" r="1.5" fill="#e99f75" />

                {/* Mouth/Smile */}
                <path
                  d="M 14 24 Q 20 28 26 24"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Antenna */}
                <line x1="20" y1="12" x2="20" y2="8" stroke="#e99f75" strokeWidth="2" />
                <circle cx="20" cy="6" r="2" fill="#e99f75" />

                {/* Circuit Pattern on Head */}
                <path d="M 12 16 L 14 16 L 14 18" stroke="white" strokeWidth="1" opacity="0.6" />
                <path d="M 26 16 L 28 16 L 28 18" stroke="white" strokeWidth="1" opacity="0.6" />

                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e99f75" />
                    <stop offset="100%" stopColor="#f4a261" />
                  </linearGradient>
                  <linearGradient id="robotBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#e99f75] to-orange-600 bg-clip-text text-transparent">
                Buddy Onboarding Hub
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                powered by Zenafide
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-[#e99f75] dark:text-[#e99f75] bg-orange-50 dark:bg-orange-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#e99f75] dark:hover:text-[#e99f75] hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side - Theme Toggle and Auth */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#e99f75] hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={(role, userData) => { 
          login(role, userData); 
          setShowLoginModal(false); 
        }} 
      />
    </nav>
  );
};