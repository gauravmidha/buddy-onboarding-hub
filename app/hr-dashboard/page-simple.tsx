'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function HRDashboardPage() {
  return (
    <ProtectedRoute requiredRole="hr">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            HR Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Monitor employee onboarding progress and manage the entire process
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Dashboard content coming soon...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
