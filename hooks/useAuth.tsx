'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  manager?: string;
  start_date?: string;
}

interface AuthContextType {
  user: User | null;
  userRole: 'hr' | 'employee' | null;
  isAuthenticated: boolean;
  login: (role: 'hr' | 'employee', userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'hr' | 'employee' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    console.log('AuthProvider: Checking for saved session...');
    const savedUser = localStorage.getItem('acme_user');
    const savedRole = localStorage.getItem('acme_role');
    
    console.log('AuthProvider: Saved data:', { savedUser, savedRole });
    
    if (savedUser && savedRole) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('AuthProvider: Restoring session:', { userData, savedRole });
        setUser(userData);
        setUserRole(savedRole as 'hr' | 'employee');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('acme_user');
        localStorage.removeItem('acme_role');
      }
    } else {
      console.log('AuthProvider: No saved session found');
    }
  }, []);

  const login = (role: 'hr' | 'employee', userData: User) => {
    setUser(userData);
    setUserRole(role);
    setIsAuthenticated(true);
    
    // Save to localStorage for persistence
    localStorage.setItem('acme_user', JSON.stringify(userData));
    localStorage.setItem('acme_role', role);
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('acme_user');
    localStorage.removeItem('acme_role');
  };

  const value = {
    user,
    userRole,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
