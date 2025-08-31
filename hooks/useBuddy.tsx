import { useCallback, useEffect, useRef, useState } from 'react';

interface BuddyContextType {
  taskId?: string;
  taskTitle?: string;
  step?: number;
  totalSteps?: number;
  progressPct?: number;
  status?: 'todo'|'doing'|'done';
}

// Global state to share between components
let globalState = {
  open: false,
  width: 520,
  mode: 'guided' as 'guided'|'chat',
  context: {} as BuddyContextType,
  listeners: new Set<() => void>(),
};

function notifyListeners() {
  globalState.listeners.forEach(listener => listener());
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
    if (ctx) {
      globalState.context = { ...globalState.context, ...ctx };
    }
    globalState.open = true;
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

  const setMode = useCallback((mode: 'guided'|'chat') => {
    globalState.mode = mode;
    notifyListeners();
  }, []);

  // Initialize width from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = Number(localStorage.getItem('buddy:w')) || 520;
      globalState.width = Math.min(Math.max(saved, 360), 760);
      notifyListeners();
    }
  }, []);

  return {
    open: globalState.open,
    width: globalState.width,
    mode: globalState.mode,
    context: globalState.context,
    openBuddy,
    closeBuddy,
    setBuddyWidth,
    setMode,
  };
}
