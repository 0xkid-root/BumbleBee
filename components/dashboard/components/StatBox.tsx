"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

// StatBox component props interface
export interface StatBoxProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  gradient?: string;
  trend?: { value: number; isPositive: boolean };
  index?: number;
}

// StatBox component with improved design, accessibility and consistent styling
export const StatBox: React.FC<StatBoxProps> = ({ 
  title, 
  value, 
  icon: IconComponent, 
  color = "bg-blue-500",
  gradient = "from-blue-500 to-indigo-600",
  trend,
  index = 0
}) => {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: index * 0.1, type: "spring" }
    });
  }, [controls, index]);

  // Generate a unique ID for accessibility
  const statId = `stat-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -10px rgba(0, 0, 0, 0.1)' 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-xl p-6 shadow-lg backdrop-blur-sm border relative overflow-hidden",
        gradient ? 
          `bg-gradient-to-br ${gradient} text-white border-white/10` : 
          "bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700"
      )}
      role="region"
      aria-labelledby={statId}
    >
      {/* Decorative background elements */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center relative z-10">
        <motion.div 
          className="p-3.5 rounded-full mr-4 bg-white/20 flex items-center justify-center shadow-inner border border-white/10"
          whileHover={{ rotate: 10, scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          aria-hidden="true"
        >
          <IconComponent className="h-6 w-6 text-white drop-shadow-sm" />
        </motion.div>
        <div>
          <p 
            id={statId}
            className="text-sm font-medium text-white/90 mb-0.5 tracking-wide"
          >
            {title}
          </p>
          <div className="flex items-center">
            <motion.p 
              className="text-2xl font-bold text-white tracking-tight drop-shadow-sm"
              initial={{ opacity: 0, scale: 0.8, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.5, type: "spring" }}
            >
              {value}
            </motion.p>
            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 + 0.5, duration: 0.4 }}
              >
                <Badge 
                  variant={trend.isPositive ? "default" : "destructive"} 
                  className={cn(
                    "ml-2.5 text-xs font-medium py-1 px-2 shadow-sm",
                    trend.isPositive ? "bg-green-500/20 text-green-100 hover:bg-green-500/30 border border-green-400/20" : 
                                      "bg-red-500/20 text-red-100 hover:bg-red-500/30 border border-red-400/20"
                  )}
                >
                  <span className="flex items-center">
                    {trend.isPositive ? 
                      <ArrowUpRight className="h-3 w-3 mr-0.5" /> : 
                      <ArrowUpRight className="h-3 w-3 mr-0.5 rotate-180" />}
                    {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                  </span>
                </Badge>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-5 w-full h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "70%" }}
          transition={{ delay: index * 0.1 + 0.5, duration: 0.7, ease: "easeOut" }}
          role="progressbar"
          aria-valuenow={70}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      
      {/* Subtle hover effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};