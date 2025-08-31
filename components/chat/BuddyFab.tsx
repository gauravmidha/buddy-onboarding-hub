'use client';

import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BuddyFabProps {
  onClick: () => void;
  isOpen: boolean;
}

export const BuddyFab = ({ onClick, isOpen }: BuddyFabProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isOpen) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-[#e99f75] to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white rounded-full shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-2 focus:ring-[#e99f75]/50 focus:ring-offset-2 transition-all duration-300 hover:scale-110 group"
      aria-label="Open Buddy Chat Assistant"
      title="Chat with Buddy"
    >
      <MessageCircle className="w-6 h-6 mx-auto group-hover:animate-pulse" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
    </button>
  );
};
