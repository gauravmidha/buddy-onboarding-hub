'use client';

import { useState } from 'react';
import { Bot, MessageCircle, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const tips = [
    "💡 Need help with your tasks? Click here to chat with me!",
    "🚀 Complete your onboarding tasks to unlock achievements!",
    "📋 Your next task is ready. Let's get started!",
    "🎯 You're making great progress! Keep it up!",
  ];

  const [currentTip, setCurrentTip] = useState(0);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
  };

  // Cycle through tips every 8 seconds
  setTimeout(() => {
    if (showTooltip && !isOpen) {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }
  }, 8000);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Tooltip */}
          {showTooltip && !isOpen && (
            <div className="absolute bottom-16 right-0 mb-2 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg max-w-xs animate-fade-in">
              <div className="flex items-start space-x-2">
                <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{tips[currentTip]}</p>
              </div>
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
            </div>
          )}

          {/* Main Button */}
          <button
            onClick={handleClick}
            className={cn(
              "w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center",
              isOpen && "rotate-45"
            )}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <div className="relative">
                <Bot className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 max-w-[80%]">
                <div className="flex items-start space-x-2">
                  <Bot className="w-4 h-4 mt-1 text-gray-500 flex-shrink-0" />
                  <div className="text-sm">
                    Hi there! 👋 I'm your AI onboarding assistant. How can I help you today?
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">Ask Question</span>
                  </div>
                </button>
                <button className="p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300">Get Tips</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
