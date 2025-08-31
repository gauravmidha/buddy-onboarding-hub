'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User, Building2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'hr' | 'employee';
  fallback?: React.ReactNode;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) => {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();

  // Don't automatically show login modal - let the navbar handle it
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     setShowLoginModal(true);
  //   }
  // }, [isAuthenticated]);

  // If not authenticated, show access denied
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in using the button in the navigation bar to access this page.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  // If role is required and user doesn't have the right role
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. 
            This page is only available for {requiredRole === 'hr' ? 'HR professionals' : 'employees'}.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Go to Home
            </Button>
            <Button
              onClick={() => router.push(requiredRole === 'hr' ? '/hr-dashboard' : '/employee')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {requiredRole === 'hr' ? (
                <>
                  <Building2 className="w-4 h-4 mr-2" />
                  Go to HR Dashboard
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Go to Employee Portal
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // User is authenticated and has the right role (if required)
  return <>{children}</>;
};
