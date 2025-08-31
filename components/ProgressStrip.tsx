

interface ProgressStripProps {
  completed: number;
  total: number;
}

export const ProgressStrip: React.FC<ProgressStripProps> = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const circumference = 2 * Math.PI * 60; // radius = 60
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getMilestoneColor = (milestone: number) => {
    return percentage >= milestone ? 'bg-[#e99f75]' : 'bg-gray-200 dark:bg-gray-700';
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Onboarding Progress
        </h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{completed}/{total} tasks</div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="relative flex justify-center mb-6">
        <div className="relative">
          {/* Background circle */}
          <svg width="140" height="140" className="transform -rotate-90">
            <circle
              cx="70"
              cy="70"
              r="60"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="70"
              cy="70"
              r="60"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="text-[#e99f75] transition-all duration-1000 ease-out"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{percentage}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Complete</div>
          </div>
        </div>
      </div>

      {/* Milestone indicators */}
      <div className="flex justify-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getMilestoneColor(25)}`}></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">25%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getMilestoneColor(50)}`}></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">50%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getMilestoneColor(75)}`}></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">75%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getMilestoneColor(100)}`}></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">100%</span>
        </div>
      </div>

      {/* Progress bar below */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div
          className="bg-[#e99f75] h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="text-center">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {percentage >= 100 ? 'Onboarding Complete!' :
           percentage >= 75 ? 'Almost there!' :
           percentage >= 50 ? 'Halfway to completion' :
           'Getting started'}
        </div>
      </div>
    </div>
  );
};
