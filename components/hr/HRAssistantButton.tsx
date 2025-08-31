import React from 'react';
import { MessageCircle } from 'lucide-react';

interface HRAssistantButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const HRAssistantButton: React.FC<HRAssistantButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 hover:scale-110"
      aria-label="Open HR Assistant"
      title="Open HR Assistant"
    >
      <MessageCircle className="w-6 h-6 mx-auto" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
    </button>
  );
};

export default HRAssistantButton;
