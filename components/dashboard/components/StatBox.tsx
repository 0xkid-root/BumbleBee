"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LucideIcon, TrendingUp, TrendingDown, Info } from "lucide-react"

interface StatBoxProps {
  title: string
  value: string
  icon: LucideIcon
  gradient: string
  trend: {
    value: number
    isPositive: boolean
  }
  details?: string
  index: number
}

export function StatBox({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  trend, 
  details = "No additional details available.", 
  index 
}: StatBoxProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 20, 
        delay: index * 0.1 
      }}
      className={`relative p-6 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg backdrop-blur-lg border border-white/10 overflow-hidden group`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      {/* Glassmorphism effect elements */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm z-0" />
      <div className="absolute -inset-x-full top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10 group-hover:animate-shimmer" />
      
      {/* Background glow effect */}
      <motion.div 
        className="absolute -inset-1/2 bg-white/5 rounded-full blur-3xl z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        transition={{ duration: 0.5 }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.h3 
            className="text-lg font-medium opacity-90"
            layout
          >
            {title}
          </motion.h3>
          <motion.div 
            className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        </div>
        
        <div className="space-y-3">
          <motion.p 
            className="text-2xl font-bold"
            layout
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.p>
          
          <div className="flex items-center space-x-2">
            <motion.div
              className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                trend.isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
              layout
              whileHover={{ scale: 1.05 }}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-300" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-300" />
              )}
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-300' : 'text-red-300'}`}>
                {trend.value}%
              </span>
            </motion.div>
            <span className="text-sm opacity-75">vs last period</span>
          </div>
        </div>
        
        {/* Info button */}
        <motion.button
          className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowDetails(!showDetails)}
          aria-label="Show details"
        >
          <Info className="h-4 w-4" />
        </motion.button>
        
        {/* Details panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-3 bg-black/20 backdrop-blur-lg rounded-lg border border-white/10"
            >
              <p className="text-sm text-white/80">{details}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}