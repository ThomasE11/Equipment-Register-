
'use client';

import { useState, useCallback } from 'react';

interface OptimisticState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
}

interface OptimisticActions<T> {
  add: (item: T) => void;
  update: (id: string, item: Partial<T>) => void;
  remove: (id: string) => void;
  setData: (data: T[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export function useOptimisticUpdates<T extends { id: string }>(
  initialData: T[] = []
): [OptimisticState<T>, OptimisticActions<T>] {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isLoading: false,
    error: null
  });

  const actions: OptimisticActions<T> = {
    add: useCallback((item: T) => {
      setState(prev => ({
        ...prev,
        data: [item, ...prev.data],
        error: null
      }));
    }, []),

    update: useCallback((id: string, updates: Partial<T>) => {
      setState(prev => ({
        ...prev,
        data: prev.data.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ),
        error: null
      }));
    }, []),

    remove: useCallback((id: string) => {
      setState(prev => ({
        ...prev,
        data: prev.data.filter(item => item.id !== id),
        error: null
      }));
    }, []),

    setData: useCallback((data: T[]) => {
      setState(prev => ({ ...prev, data }));
    }, []),

    setLoading: useCallback((isLoading: boolean) => {
      setState(prev => ({ ...prev, isLoading }));
    }, []),

    setError: useCallback((error: string | null) => {
      setState(prev => ({ ...prev, error }));
    }, [])
  };

  return [state, actions];
}
