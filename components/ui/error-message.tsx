
'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onHome?: () => void;
  className?: string;
  variant?: 'card' | 'inline' | 'page';
}

export function ErrorMessage({
  title = 'Something went wrong',
  message = 'An error occurred while loading the data.',
  onRetry,
  onHome,
  className,
  variant = 'card'
}: ErrorMessageProps) {
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 text-destructive', className)}>
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">{message}</span>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6">{message}</p>
          <div className="flex justify-center gap-3">
            {onRetry && (
              <Button onClick={onRetry} variant="default">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            {onHome && (
              <Button onClick={onHome} variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('border-destructive/50', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{message}</p>
        <div className="flex gap-2">
          {onRetry && (
            <Button onClick={onRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
          {onHome && (
            <Button onClick={onHome} variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Simplified error boundary component
export function ErrorBoundary({ 
  error, 
  reset, 
  className 
}: { 
  error: Error; 
  reset: () => void; 
  className?: string; 
}) {
  return (
    <ErrorMessage
      title="Application Error"
      message={error.message || 'An unexpected error occurred'}
      onRetry={reset}
      variant="page"
      className={className}
    />
  );
}
