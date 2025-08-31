import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({ value, max = 100, className, showLabel = true }: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColorClass = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}% Complete
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-300 ease-out',
            getColorClass(percentage)
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};