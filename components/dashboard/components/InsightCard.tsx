"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedList } from "@/components/ui/animated-list"
import { useState } from "react"

type Insight = {
  id: string
  type: "opportunity" | "alert" | "tip"
  title: string
  description: string
  action?: string
  priority: "high" | "medium" | "low"
}

const insights: Insight[] = [
  {
    id: "ins1",
    type: "opportunity",
    title: "ETH staking opportunity",
    description: "Current ETH staking APY is 7.2%, which is 2.1% higher than the 30-day average.",
    action: "Stake ETH",
    priority: "high",
  },
  {
    id: "ins2",
    type: "alert",
    title: "Portfolio concentration risk",
    description: "70% of your portfolio is in a single asset (ETH). Consider diversifying.",
    action: "Rebalance",
    priority: "medium",
  },
  {
    id: "ins3",
    type: "tip",
    title: "Gas optimization",
    description: "Schedule your transactions for Sunday evenings to save up to 35% on gas fees.",
    action: "Learn more",
    priority: "low",
  },
]

export function AiInsights() {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)

  const getInsightIcon = (type: Insight["type"], priority: Insight["priority"]) => {
    const priorityColorMap = {
      high: type === "alert" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400",
      medium: type === "alert" ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400",
      low: "text-purple-600 dark:text-purple-400",
    }

    const colorClass = priorityColorMap[priority]

    switch (type) {
      case "opportunity":
        return <TrendingUp className={cn("h-5 w-5", colorClass)} />
      case "alert":
        return <AlertTriangle className={cn("h-5 w-5", colorClass)} />
      case "tip":
        return <Lightbulb className={cn("h-5 w-5", colorClass)} />
    }
  }

  const getPriorityBadge = (priority: Insight["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30 font-medium"
          >
            High Priority
          </Badge>
        )
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30 font-medium"
          >
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 font-medium"
          >
            Low
          </Badge>
        )
    }
  }

  const getBackgroundClass = (type: Insight["type"], priority: Insight["priority"]) => {
    if (type === "alert") {
      return priority === "high"
        ? "bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-900/20"
        : priority === "medium"
          ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/20"
          : "bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20"
    }

    if (type === "opportunity") {
      return "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20"
    }

    return "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20"
  }

  const insightVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.02,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: { 
      scale: 0.98,
      transition: { 
        duration: 0.1,
        ease: "easeInOut"
      }
    }
  }

  const insightItems = insights.map((insight) => (
    <motion.div
      key={insight.id}
      variants={insightVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
      className={cn(
        "rounded-lg border p-3 hover:border-primary/20 transition-all duration-300 cursor-pointer",
        getBackgroundClass(insight.type, insight.priority),
        selectedInsight === insight.id && "ring-2 ring-primary/30"
      )}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className={cn(
            "mt-1 h-9 w-9 rounded-full flex items-center justify-center",
            insight.type === "alert"
              ? "bg-red-100 dark:bg-red-900/20"
              : insight.type === "opportunity"
                ? "bg-green-100 dark:bg-green-900/20"
                : "bg-blue-100 dark:bg-blue-900/20",
          )}
        >
          {getInsightIcon(insight.type, insight.priority)}
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium">{insight.title}</h4>
            {getPriorityBadge(insight.priority)}
          </div>
          <p className="text-sm text-muted-foreground">{insight.description}</p>
          <AnimatePresence>
            {selectedInsight === insight.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 overflow-hidden"
              >
                {insight.action && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 flex items-center justify-center"
                  >
                    {insight.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {insight.action && (
            <Button variant="link" className="mt-2 h-auto p-0 text-primary font-medium" size="sm">
              {insight.action}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  ))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
      className="col-span-3 lg:col-span-1"
    >
      <Card 
        className="shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.6,
            type: "spring",
            stiffness: 120,
            damping: 12
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      transition: { 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatDelay: 2
                      }
                    }}
                  >
                    <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  </motion.div>
                  AI Insights
                </CardTitle>
                <CardDescription>Personalized recommendations</CardDescription>
              </div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs gap-1"
                >
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </motion.div>
            </div>
          </CardHeader>
        </motion.div>
        <CardContent>
          <div className="space-y-3">
            <AnimatedList 
              items={insightItems} 
              staggerDelay={0.15} 
              animationType="fadeSlide" 
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
