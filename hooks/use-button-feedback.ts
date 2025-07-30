
'use client';

import { useState, useCallback } from 'react';

interface ButtonFeedbackState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface ButtonFeedbackActions {
  startLoading: () => void;
  setSuccess: () => void;
  setError: () => void;
  reset: () => void;
  execute: <T>(
    asyncFn: () => Promise<T>, 
    options?: {
      successDuration?: number;
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
    }
  ) => Promise<T | null>;
}

export function useButtonFeedback(): [ButtonFeedbackState, ButtonFeedbackActions] {
  const [state, setState] = useState<ButtonFeedbackState>({
    isLoading: false,
    isSuccess: false,
    isError: false
  });

  const actions: ButtonFeedbackActions = {
    startLoading: useCallback(() => {
      setState({ isLoading: true, isSuccess: false, isError: false });
    }, []),

    setSuccess: useCallback(() => {
      setState({ isLoading: false, isSuccess: true, isError: false });
    }, []),

    setError: useCallback(() => {
      setState({ isLoading: false, isSuccess: false, isError: true });
    }, []),

    reset: useCallback(() => {
      setState({ isLoading: false, isSuccess: false, isError: false });
    }, []),

    execute: useCallback(async <T>(
      asyncFn: () => Promise<T>,
      options: {
        successDuration?: number;
        onSuccess?: (result: T) => void;
        onError?: (error: Error) => void;
      } = {}
    ): Promise<T | null> => {
      const { successDuration = 2000, onSuccess, onError } = options;
      
      try {
        setState({ isLoading: true, isSuccess: false, isError: false });
        
        const result = await asyncFn();
        
        setState({ isLoading: false, isSuccess: true, isError: false });
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        // Reset success state after duration
        setTimeout(() => {
          setState(prev => ({ ...prev, isSuccess: false }));
        }, successDuration);
        
        return result;
      } catch (error) {
        setState({ isLoading: false, isSuccess: false, isError: true });
        
        if (onError) {
          onError(error as Error);
        }
        
        // Reset error state after duration
        setTimeout(() => {
          setState(prev => ({ ...prev, isError: false }));
        }, 3000);
        
        return null;
      }
    }, [])
  };

  return [state, actions];
}
