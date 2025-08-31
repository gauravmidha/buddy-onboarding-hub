'use client';

import { useState, useEffect } from 'react';

interface ProgressHeroProps {
  completed: number;
  total: number;
}

export const ProgressHero = ({ completed, total }: ProgressHeroProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(percentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  const circumference = 2 * Math.PI * 60; // radius = 60
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className="relative grid place-items-center rounded-2xl bg-white dark:bg-gray-800 shadow-sm p-8 border border-gray-200 dark:border-gray-700">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e99f75]/5 via-orange-50/30 to-orange-100/20 dark:from-orange-900/10 dark:via-orange-800/20 dark:to-orange-900/10 rounded-2xl"></div>

      <div className="relative z-10 text-center">
        {/* Progress Ring */}
        <div className="relative inline-block mb-6">
          <svg
            className="w-32 h-32 transform -rotate-90"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress ring */}
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e99f75" />
                <stop offset="100%" stopColor="#f4a261" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {animatedProgress}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Complete
            </div>
          </div>
        </div>

        {/* Progress label */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Onboarding Progress
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {completed} of {total} tasks completed
          </p>
        </div>

        {/* Slim progress track */}
        <div className="w-full max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#e99f75] to-orange-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${animatedProgress}%` }}
            ></div>
            {/* Milestones */}
            <div className="absolute top-0 left-1/4 w-0.5 h-full bg-white/50"></div>
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/50"></div>
            <div className="absolute top-0 left-3/4 w-0.5 h-full bg-white/50"></div>
          </div>
        </div>

        {/* Motivational message */}
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 rounded-xl border border-orange-200/50 dark:border-orange-800/50">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {percentage >= 75
              ? "🚀 Almost there! You're crushing it!"
              : percentage >= 50
              ? "💪 Halfway done! Keep up the great work!"
              : percentage >= 25
              ? "🎯 Good start! You're making excellent progress!"
              : "🌟 Ready to begin? Let's get you onboarded!"}
          </p>
        </div>
      </div>
    </div>
  );
};
