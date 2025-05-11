"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge, type BadgeProps } from "@/components/ui/badge"

interface AnimatedBadgeProps extends BadgeProps {
  pulse?: boolean
  bounce?: boolean
  delay?: number
}

export function AnimatedBadge({
  children,
  className,
  pulse = false,
  bounce = false,
  delay = 0,
  ...props
}: AnimatedBadgeProps) {
  return (
    <Badge {...props} className={cn(className, pulse && "relative", bounce && "animate-bounce")}>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: delay * 0.1 }}
      >
        {children}
      </motion.span>

      {pulse && (
        <motion.span
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: delay * 0.1 }}
          style={{
            backgroundColor: "currentColor",
            zIndex: -1,
          }}
        />
      )}
    </Badge>
  )
}
