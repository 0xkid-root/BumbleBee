"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

interface AnimatedButtonProps extends ButtonProps {
  bounce?: boolean
  pulse?: boolean
  delay?: number
}

export function AnimatedButton({
  children,
  className,
  bounce = false,
  pulse = false,
  delay = 0,
  ...props
}: AnimatedButtonProps) {
  return (
    <Button {...props} className={cn(className, "overflow-hidden")} asChild>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: delay * 0.1 }}
        whileHover={bounce ? { scale: 1.05 } : undefined}
        whileTap={{ scale: 0.95 }}
      >
        {pulse && (
          <motion.span
            className="absolute inset-0 bg-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        )}
        {children}
      </motion.button>
    </Button>
  )
}
