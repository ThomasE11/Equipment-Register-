
'use client';

import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
  variant?: 'card' | 'inline' | 'toast';
  autoClose?: boolean;
  duration?: number;
}

export function SuccessMessage({
  message,
  onClose,
  className,
  variant = 'card',
  autoClose = false,
  duration = 3000
}: SuccessMessageProps) {
  // Auto close functionality
  if (autoClose && onClose) {
    setTimeout(onClose, duration);
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 text-green-600', className)}>
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  if (variant === 'toast') {
    return (
      <div className={cn(
        'flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200 text-green-800',
        'dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
        className
      )}>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">{message}</span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-green-600 hover:text-green-700 h-auto p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn('border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800 dark:text-green-200">{message}</span>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-green-600 hover:text-green-700 h-auto p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
