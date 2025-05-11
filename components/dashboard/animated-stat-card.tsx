"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react"

interface AnimatedStatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  className?: string
  delay?: number
}

export function AnimatedStatCard({ title, value, change, trend, className, delay = 0 }: AnimatedStatCardProps) {
  const trendIcon = {
    up: <ArrowUpIcon className="h-4 w-4 text-emerald-500" />,
    down: <ArrowDownIcon className="h-4 w-4 text-rose-500" />,
    neutral: <MinusIcon className="h-4 w-4 text-muted-foreground" />,
  }

  const trendColor = {
    up: "text-emerald-500",
    down: "text-rose-500",
    neutral: "text-muted-foreground",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="text-2xl font-bold"
          >
            {value}
          </motion.div>
          <div className="mt-2 flex items-center text-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.4 }}
            >
              {trendIcon[trend]}
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.4 }}
              className={cn("ml-1", trendColor[trend])}
            >
              {change}
            </motion.span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
