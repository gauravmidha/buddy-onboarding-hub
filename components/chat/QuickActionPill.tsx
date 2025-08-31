'use client';

import { cn } from '@/lib/utils';

interface QuickActionPillProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export const QuickActionPill = ({ label, onClick, className }: QuickActionPillProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 bg-gradient-to-r from-[#e99f75]/10 to-orange-500/10 hover:from-[#e99f75]/20 hover:to-orange-500/20 text-[#e99f75] hover:text-orange-600 border border-[#e99f75]/30 hover:border-[#e99f75]/50 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#e99f75]/50",
        className
      )}
      aria-label={`Quick action: ${label}`}
    >
      {label}
    </button>
  );
};
