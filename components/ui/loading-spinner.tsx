
'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ className, size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex items-center gap-2">
        <Loader2 className={cn('animate-spin text-hct-blue', sizeClasses[size])} />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    </div>
  );
}

// Inline spinner for buttons
export function InlineSpinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
  );
}

// Page loading spinner
export function PageLoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-hct-blue mx-auto mb-4" />
        <p className="text-lg font-medium text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

// Button loading state
export function ButtonLoadingState({ isLoading, children, loadingText }: {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <InlineSpinner />
        {loadingText || 'Loading...'}
      </div>
    );
  }
  return <>{children}</>;
}
