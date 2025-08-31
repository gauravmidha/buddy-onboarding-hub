'use client';

import { useState, useEffect } from 'react';
import { X, Minimize2, Bot } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuideTab } from './GuideTab';
import { ChatTab } from './ChatTab';
import { ActionsTab } from './ActionsTab';
import '@/styles/hr-copilot.css';

interface HRDrawerProps {
  open: boolean;
  onClose: () => void;
  context?: {
    employeeCount?: number;
    atRiskCount?: number;
    selectedEmployee?: any;
    filters?: any;
  };
}

export const HRDrawer = ({ open, onClose, context }: HRDrawerProps) => {
  const [activeTab, setActiveTab] = useState('guide');
  const [isMinimized, setIsMinimized] = useState(false);

  // Load last active tab from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('hr-copilot-active-tab');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  // Save active tab to localStorage
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hr-copilot-active-tab', value);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className={`w-[440px] max-w-[90vw] sm:max-w-[440px] lg:max-w-[480px] p-0 ${
          isMinimized ? 'h-[60px]' : 'h-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Buddy — HR Assistant
                  </SheetTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    HR Copilot
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={isMinimized ? "Maximize" : "Minimize"}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close HR Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </SheetHeader>

          {/* Content */}
          {!isMinimized && (
            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
                {/* Tab Navigation */}
                <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="guide" className="text-sm">
                      Guide
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="text-sm">
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="actions" className="text-sm">
                      Actions
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  <TabsContent value="guide" className="h-full m-0">
                    <GuideTab
                      employeeCount={context?.employeeCount || 0}
                      atRiskCount={context?.atRiskCount || 0}
                    />
                  </TabsContent>

                  <TabsContent value="chat" className="h-full m-0">
                    <ChatTab context={context} />
                  </TabsContent>

                  <TabsContent value="actions" className="h-full m-0">
                    <ActionsTab context={context} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}

          {/* Minimized State */}
          {isMinimized && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  HR Assistant minimized
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
