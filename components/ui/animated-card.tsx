
'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverScale?: number;
  tapScale?: number;
  delay?: number;
  duration?: number;
  animateOnMount?: boolean;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    children, 
    className, 
    hoverScale = 1.02,
    tapScale = 0.98,
    delay = 0,
    duration = 0.2,
    animateOnMount = true,
    ...props 
  }, ref) => {
    const cardVariants = {
      hidden: { 
        opacity: 0, 
        y: 20, 
        scale: 0.95 
      },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration,
          delay,
          ease: "easeOut"
        }
      },
      hover: { 
        scale: hoverScale,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: {
          duration: 0.2
        }
      },
      tap: { 
        scale: tapScale,
        transition: {
          duration: 0.1
        }
      }
    };

    return (
      <motion.div
        variants={cardVariants}
        initial={animateOnMount ? "hidden" : "visible"}
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        ref={ref}
      >
        <Card
          className={cn(
            'transition-all duration-200 cursor-pointer',
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';
