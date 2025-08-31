import { useCallback, useEffect, useRef, useState } from 'react';

interface BuddyContextType {
  taskId?: string;
  taskTitle?: string;
  step?: number;
  totalSteps?: number;
  progressPct?: number;
  status?: 'todo'|'doing'|'done';
}

export type BuddyMessage = {
  id: string;
  role: 'assistant'|'user'|'system';
  text: string;
  ts: number;
  step?: number;
};

export type BuddyState = {
  messages: BuddyMessage[];
  addMessage: (m: Omit<BuddyMessage, 'id'|'ts'>) => void;
  setStep: (n: number) => void;
};

// Global state to share between components - ensure it's only created once
const globalState = {
  open: false,
  width: 520,
  mode: 'guided' as 'guided'|'chat',
  context: {} as BuddyContextType,
  messages: [] as BuddyMessage[],
  listeners: new Set<() => void>(),
};

function notifyListeners() {
  globalState.listeners.forEach(listener => listener());
}

// Snap widths for double-click
const SNAP_WIDTHS = [420, 520, 640] as const;

function getClosestSnap(width: number): number {
  return SNAP_WIDTHS.reduce((prev, curr) =>
    Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
  );
}

export function useBuddy() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate(prev => prev + 1);
    globalState.listeners.add(listener);
    return () => {
      globalState.listeners.delete(listener);
    };
  }, []);

  const openBuddy = useCallback((ctx?: Partial<BuddyContextType>) => {
    console.log('useBuddy: openBuddy called with context:', ctx);
    if (ctx) {
      globalState.context = { ...globalState.context, ...ctx };
    }
    globalState.open = true;
    console.log('useBuddy: Panel opened, globalState:', { open: globalState.open, context: globalState.context });
    notifyListeners();
  }, []);

  const closeBuddy = useCallback(() => {
    globalState.open = false;
    notifyListeners();
  }, []);

  const setBuddyWidth = useCallback((w: number) => {
    const clamped = Math.min(Math.max(w, 360), 760);
    globalState.width = clamped;
    if (typeof window !== 'undefined') {
      localStorage.setItem('buddy:w', String(clamped));
    }
    notifyListeners();
  }, []);

  const snapWidth = useCallback((currentWidth: number) => {
    const snapped = getClosestSnap(currentWidth);
    globalState.width = snapped;
    if (typeof window !== 'undefined') {
      localStorage.setItem('buddy:w', String(snapped));
    }
    notifyListeners();
  }, []);

  const setMode = useCallback((mode: 'guided'|'chat') => {
    globalState.mode = mode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('buddy:mode', mode);
    }
    notifyListeners();
  }, []);

  const setStep = useCallback((step: number) => {
    globalState.context.step = step;
    const stepTitle = `Step ${step}`; // This would come from task data in real implementation
    const systemMessage: Omit<BuddyMessage, 'id'|'ts'> = {
      role: 'system',
      text: `Starting ${stepTitle}`,
      step,
    };
    addMessage(systemMessage);
    notifyListeners();
  }, []);

  const addMessage = useCallback((message: Omit<BuddyMessage, 'id'|'ts'>) => {
    console.log('useBuddy: Adding message', message);
    const newMessage: BuddyMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      ts: Date.now(),
    };

    globalState.messages = [...globalState.messages, newMessage].slice(-50); // Keep last 50
    console.log('useBuddy: Messages after add', globalState.messages);

    // Persist messages
    if (typeof window !== 'undefined' && globalState.context.taskId) {
      localStorage.setItem(
        `buddy:messages:${globalState.context.taskId}`,
        JSON.stringify(globalState.messages)
      );
    }

    notifyListeners();
  }, []);

  // Initialize data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWidth = Number(localStorage.getItem('buddy:w')) || 520;
      const savedMode = localStorage.getItem('buddy:mode') || 'guided';

      globalState.width = Math.min(Math.max(savedWidth, 360), 760);
      globalState.mode = savedMode as 'guided'|'chat';

      notifyListeners();
    }
  }, []);

  // Load messages when task changes
  useEffect(() => {
    if (typeof window !== 'undefined' && globalState.context.taskId) {
      const savedMessages = localStorage.getItem(`buddy:messages:${globalState.context.taskId}`);
      if (savedMessages) {
        try {
          globalState.messages = JSON.parse(savedMessages).slice(-50);
        } catch (e) {
          globalState.messages = [];
        }
      } else {
        globalState.messages = [];
      }
      notifyListeners();
    }
  }, [globalState.context.taskId]);

  return {
    open: globalState.open,
    width: globalState.width,
    mode: globalState.mode,
    context: globalState.context,
    messages: globalState.messages,
    openBuddy,
    closeBuddy,
    setBuddyWidth,
    snapWidth,
    setMode,
    setStep,
    addMessage,
  };
}
