'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface AssistantFabProps {
  taskContext?: string;
}

export const AssistantFab: React.FC<AssistantFabProps> = ({ taskContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    // Mock send message - integrate with actual assistant logic
    console.log('Sending message:', message, 'Context:', taskContext);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="w-80 mb-4 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">AI Assistant</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {taskContext && (
            <p className="text-sm text-gray-600 mb-4">
              Context: {taskContext}
            </p>
          )}
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 shadow-lg bg-orange-600 hover:bg-orange-700"
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};
