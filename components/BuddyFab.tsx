import { useBuddy } from '@/hooks/useBuddyHook';
import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function BuddyFab() {
  const { open, openBuddy } = useBuddy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || open) return null;

  return (
    <button
      aria-label="Open AI Assistant"
      onClick={() => {
        console.log('BuddyFab: Button clicked, calling openBuddy');
        openBuddy();
      }}
      className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg bg-primary text-primary-foreground p-4 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 hover:scale-110"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
