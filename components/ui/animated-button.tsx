
'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { InlineSpinner } from '@/components/ui/loading-spinner';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    className, 
    isLoading, 
    isSuccess, 
    isError, 
    loadingText, 
    successText, 
    errorText,
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const isDisabled = disabled || isLoading || isSuccess;
    
    const buttonVariants = {
      idle: { scale: 1 },
      hover: { scale: 1.02 },
      tap: { scale: 0.98 },
      loading: { scale: 1 },
      success: { scale: 1.05 },
      error: { scale: 1 }
    };

    const getButtonContent = () => {
      if (isLoading) {
        return (
          <div className="flex items-center gap-2">
            <InlineSpinner />
            {loadingText || 'Loading...'}
          </div>
        );
      }
      
      if (isSuccess) {
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {successText || 'Success!'}
          </div>
        );
      }
      
      if (isError) {
        return (
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            {errorText || 'Error'}
          </div>
        );
      }
      
      return children;
    };

    const getButtonState = () => {
      if (isLoading) return 'loading';
      if (isSuccess) return 'success';
      if (isError) return 'error';
      return 'idle';
    };

    return (
      <motion.div
        variants={buttonVariants}
        initial="idle"
        animate={getButtonState()}
        whileHover={!isDisabled ? "hover" : "idle"}
        whileTap={!isDisabled ? "tap" : "idle"}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Button
          ref={ref}
          className={cn(
            'transition-all duration-200',
            isSuccess && 'bg-green-600 hover:bg-green-700 border-green-600',
            isError && 'bg-red-600 hover:bg-red-700 border-red-600',
            className
          )}
          disabled={isDisabled}
          onClick={onClick}
          {...props}
        >
          {getButtonContent()}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
