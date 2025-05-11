"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { AnimatedProgress } from "@/components/ui/animated-progress"

const statCardVariants = cva("transition-all", {
  variants: {
    variant: {
      default: "bg-card",
      primary: "bg-primary-light dark:bg-primary-light/10 border-primary/20",
      secondary: "bg-secondary-light dark:bg-secondary-light/10 border-secondary/20",
      accent: "bg-accent-light dark:bg-accent-light/10 border-accent/20",
      success: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20",
      warning: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/20",
      danger: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  onClick?: () => void
  showProgress?: boolean
  progressValue?: number
  index?: number
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  variant,
  className,
  onClick,
  showProgress = false,
  progressValue = 0,
  index = 0,
}: StatCardProps) {
  // Convert string value to number if it's a numeric string
  const numericValue = typeof value === "string" ? Number.parseFloat(value.replace(/[^0-9.-]+/g, "")) : value
  const isNumeric = !isNaN(numericValue)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={onClick ? { y: -5, transition: { duration: 0.2 } } : undefined}
    >
      <Card
        className={cn(
          statCardVariants({ variant }),
          "overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
          onClick && "cursor-pointer",
          className,
        )}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon && (
            <div
              className={cn(
                "h-9 w-9 rounded-full p-2 flex items-center justify-center",
                variant === "primary"
                  ? "bg-primary/10 text-primary"
                  : variant === "secondary"
                    ? "bg-secondary/10 text-secondary"
                    : variant === "accent"
                      ? "bg-accent/10 text-accent"
                      : variant === "success"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : variant === "warning"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                          : variant === "danger"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-muted text-muted-foreground",
              )}
            >
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">
            {isNumeric ? (
              <AnimatedNumber
                value={numericValue}
                prefix={typeof value === "string" && value.startsWith("$") ? "$" : ""}
                formatOptions={{
                  maximumFractionDigits: 2,
                  notation: numericValue > 10000 ? "compact" : "standard",
                }}
              />
            ) : (
              value
            )}
          </div>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}

          {showProgress && (
            <div className="mt-2">
              <AnimatedProgress
                value={progressValue}
                className="h-1.5"
                indicatorClassName={cn(
                  variant === "primary"
                    ? "bg-primary"
                    : variant === "secondary"
                      ? "bg-secondary"
                      : variant === "accent"
                        ? "bg-accent"
                        : variant === "success"
                          ? "bg-green-500"
                          : variant === "warning"
                            ? "bg-amber-500"
                            : variant === "danger"
                              ? "bg-red-500"
                              : "bg-primary",
                )}
                delay={index * 0.1 + 0.2}
              />
            </div>
          )}

          {trend && (
            <div className="mt-3 flex items-center text-xs font-medium">
              <div
                className={cn(
                  "flex items-center gap-1 rounded-md px-1.5 py-0.5",
                  trend.isPositive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                )}
              >
                {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(trend.value)}%
              </div>
              <span className="text-muted-foreground ml-2">vs. last period</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
