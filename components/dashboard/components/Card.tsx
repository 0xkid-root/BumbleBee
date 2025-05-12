"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

// Card component props interface
export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'accent';
  icon?: React.ReactNode;
}

// Card component with improved design, accessibility and consistent styling
export function Card({ title = "", children, className = "", variant = 'default', icon }: CardProps) {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, type: "spring" }
    });
  }, [controls]);

  // Enhanced card styling with consistent design language and improved visual hierarchy
  const getCardStyle = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border border-blue-400/20 shadow-lg shadow-blue-500/10';
      case 'glass':
        return 'bg-white/15 backdrop-blur-lg border border-white/20 shadow-xl dark:bg-gray-900/30 dark:border-white/10 shadow-lg shadow-purple-500/5';
      case 'accent':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border border-amber-400/20 shadow-lg shadow-orange-500/10';
      default:
        return 'bg-white border border-gray-100 shadow-md shadow-gray-200/50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:shadow-gray-900/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      whileHover={{ 
        scale: 1.01, 
        boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.1)', 
        transition: { duration: 0.2 } 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        `rounded-xl p-6 relative overflow-hidden ${getCardStyle()}`,
        className
      )}
      role="region"
      aria-labelledby={title ? `card-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined}
    >
      {/* Subtle animated background pattern for visual interest */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 blur-3xl"></div>
      </div>
      
      {(title || icon) && (
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            {icon && (
              <motion.div 
                className={cn(
                  "p-2.5 rounded-full flex items-center justify-center",
                  variant === 'default' ? 'bg-blue-50 dark:bg-gray-700' : 'bg-white/20'
                )}
                whileHover={{ rotate: 5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className={cn(
                  "h-5 w-5",
                  variant === 'default' ? 'text-blue-500 dark:text-blue-400' : 'text-white'
                )}>
                  {icon}
                </div>
              </motion.div>
            )}
            {title && (
              <h3 
                id={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
                className={cn(
                  "text-lg font-semibold tracking-tight",
                  variant === 'default' ? 'text-gray-800 dark:text-gray-100' : 'text-white'
                )}
              >
                {title}
              </h3>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={cn(
              "opacity-70 hover:opacity-100 cursor-pointer",
              variant === 'default' ? 'text-blue-500 dark:text-blue-400' : 'text-white'
            )}
            aria-label="Card options"
            role="button"
            tabIndex={0}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
        </div>
      )}
      <div className="space-y-4 relative z-10">
        {children}
      </div>
      
      {/* Subtle hover effect overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}