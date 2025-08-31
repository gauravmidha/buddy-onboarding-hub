'use client';

import { Bot, BookOpen, MessageCircle, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AIAssistantSidebarProps {
  className?: string;
}

export const AIAssistantSidebar: React.FC<AIAssistantSidebarProps> = ({ className = "" }) => {
  const assistantOptions = [
    {
      icon: HelpCircle,
      title: "Guidance",
      description: "Get step-by-step help with your tasks",
      action: "Get Help"
    },
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Access company policies and resources",
      action: "View Docs"
    },
    {
      icon: MessageCircle,
      title: "Contact HR",
      description: "Reach out to HR for additional support",
      action: "Contact HR"
    }
  ];

  return (
    <Card className={`border border-gray-200 dark:border-gray-700 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-gray-900 dark:text-white text-lg">
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-3">
            <Bot className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {assistantOptions.map((option, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <option.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {option.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {option.description}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-3 border-gray-300 dark:border-gray-600 hover:bg-[#e99f75] hover:border-[#e99f75] hover:text-white transition-colors duration-200"
                >
                  {option.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
