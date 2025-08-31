'use client';

import { useToast as useShadcnToast } from '@/hooks/use-toast';

export const useAppToast = () => {
  const { toast } = useShadcnToast();

  const showToast = (
    title: string,
    description?: string,
    variant?: 'default' | 'destructive'
  ) => {
    toast({
      title,
      description,
      variant,
    });
  };

  const showSuccess = (title: string, description?: string) => {
    showToast(title, description);
  };

  const showError = (title: string, description?: string) => {
    showToast(title, description, 'destructive');
  };

  return {
    showToast,
    showSuccess,
    showError,
  };
};
