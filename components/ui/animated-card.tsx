"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  clickEffect?: boolean
  onClick?: () => void
  delay?: number
}

export function AnimatedCard({
  children,
  className,
  hoverEffect = true,
  clickEffect = false,
  onClick,
  delay = 0,
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1, ease: "easeOut" }}
      whileHover={
        hoverEffect
          ? {
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.2 },
            }
          : undefined
      }
      whileTap={clickEffect ? { scale: 0.98 } : undefined}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
        isHovered && hoverEffect && "border-primary/50",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
