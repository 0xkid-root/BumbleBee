"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Wallet,
  Sparkles,
  Bell,
  Users,
  ArrowRight,
  ChevronRight,
  Zap,
  Calendar,
  TrendingUp,
  CreditCard,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  RefreshCw,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

// Mock data updated for May 10, 2025
const portfolioData = [
  { date: "Nov", value: 18000, profit: 2200 },
  { date: "Dec", value: 19500, profit: 1500 },
  { date: "Jan", value: 21000, profit: 1500 },
  { date: "Feb", value: 19800, profit: -1200 },
  { date: "Mar", value: 22500, profit: 2700 },
  { date: "Apr", value: 24000, profit: 1500 },
  { date: "May", value: 26850, profit: 2850 },
]

const tokenAllocation = [
  { name: "BTC", value: 40, color: "#F7931A" },
  { name: "ETH", value: 25, color: "#627EEA" },
  { name: "SOL", value: 20, color: "#00FFA3" },
  { name: "Other", value: 15, color: "#8247E5" },
]

const COLORS = ["#F7931A", "#627EEA", "#00FFA3", "#8247E5"]

const recentTransactions = [
  {
    id: 1,
    type: "Swap",
    from: "SOL",
    to: "USDC",
    amount: "10 SOL",
    value: "$1,750.00",
    status: "completed",
    date: "15 min ago",
    icon: <ArrowRight className="h-5 w-5 text-blue-600" />,
  },
  {
    id: 2,
    type: "Subscription",
    service: "Pro Analytics",
    amount: "30 USDC",
    status: "active",
    date: "1 day ago",
    icon: <Calendar className="h-5 w-5 text-purple-600" />,
  },
  {
    id: 3,
    type: "Social Tab",
    group: "Holiday Fund",
    action: "Deposit",
    amount: "150 USDC",
    status: "completed",
    date: "2 days ago",
    icon: <Users className="h-5 w-5 text-amber-600" />,
  },
  {
    id: 4,
    type: "AI Investment",
    action: "Auto-buy",
    token: "ETH",
    amount: "0.2 ETH",
    value: "$800.00",
    status: "completed",
    date: "3 days ago",
    icon: <Sparkles className="h-5 w-5 text-emerald-600" />,
  },
]

const aiInsights = [
  {
    id: 1,
    title: "Portfolio Optimization",
    description: "Increase SOL allocation by 5% to diversify risk.",
    impact: "Potential 2.8% risk reduction",
    status: "new",
  },
  {
    id: 2,
    title: "Gas Fee Savings",
    description: "Batch your 2 subscriptions to reduce transaction costs.",
    impact: "Save ~$10/month",
    status: "new",
  },
  {
    id: 3,
    title: "Staking Opportunity",
    description: "Stake your SOL for 10% APY in a new pool.",
    impact: "Potential $300 annual yield",
    status: "new",
  },
]

// Type Definitions
interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: { isPositive: boolean; value: number }
  variant: "primary" | "secondary" | "accent" | "success"
  showProgress?: boolean
  progressValue?: number
  index: number
}

interface PortfolioData {
  date: string
  value: number
  profit: number
}

interface TokenAllocation {
  name: string
  value: number
  color: string
}

interface Transaction {
  id: number
  type: string
  from?: string
  to?: string
  amount: string
  value?: string
  status: string
  date: string
  icon: React.ReactNode
  service?: string
  group?: string
  action?: string
  token?: string
}

interface AiInsight {
  id: number
  title: string
  description: string
  impact: string
  status: string
}

// Loading Skeleton Component
const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Theme Toggle Component
const ThemeToggle = ({ className }: { className?: string }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const doc = document.documentElement
    if (theme === "dark") {
      doc.classList.add("dark")
    } else {
      doc.classList.remove("dark")
    }
  }, [theme])

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Sun className="h-4 w-4" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle theme"
      />
      <Moon className="h-4 w-4" />
    </div>
  )
}

// StatCard Component
const StatCard = React.memo(
  ({ title, value, description, icon, trend, variant, showProgress, progressValue, index }: StatCardProps) => {
    const container = {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          delay: index * 0.15,
          duration: 0.5,
          type: "spring",
          stiffness: 100,
        },
      },
      hover: {
        scale: 1.02,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transition: { type: "spring", stiffness: 300, damping: 10 },
      },
    }

    const variants = {
      primary:
        "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 dark:border-blue-800",
      secondary:
        "bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200 dark:from-purple-900/30 dark:to-purple-800/20 dark:border-purple-800",
      accent:
        "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-200 dark:from-amber-900/30 dark:to-amber-800/20 dark:border-amber-800",
      success:
        "bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/20 dark:border-emerald-800",
    }

    const iconVariants = {
      primary: "bg-blue-600 text-white dark:bg-blue-500",
      secondary: "bg-purple-600 text-white dark:bg-purple-500",
      accent: "bg-amber-600 text-white dark:bg-amber-500",
      success: "bg-emerald-600 text-white dark:bg-emerald-500",
    }

    return (
      <motion.div variants={container} initial="hidden" animate="show" whileHover="hover" className="h-full">
        <Card
          className={`overflow-hidden border ${variants[variant]} hover:shadow-md transition-all h-full dark:text-gray-200`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <motion.div
                className={`p-2 rounded-full ${iconVariants[variant]}`}
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {icon}
              </motion.div>
              {trend && (
                <Badge variant={trend.isPositive ? "default" : "destructive"} className="text-xs font-medium">
                  {trend.isPositive ? "+" : "-"}
                  {Math.abs(trend.value)}%
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <motion.p
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
            >
              {value}
            </motion.p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            {showProgress && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: index * 0.2 + 0.5, duration: 0.7 }}
              >
                <Progress value={progressValue} className="mt-3 h-1" />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  },
)

// PortfolioChart Component
const PortfolioChart = () => {
  const [animateChart, setAnimateChart] = useState(false)
  const [isReloading, setIsReloading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateChart(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const refreshData = () => {
    setIsReloading(true)
    setAnimateChart(false)
    setTimeout(() => {
      setAnimateChart(true)
      setIsReloading(false)
    }, 1000)
  }

  const container = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: {
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" whileHover="hover" className="md:col-span-2">
      <Card className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold dark:text-gray-100">Portfolio Performance</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={refreshData}
                      disabled={isReloading}
                    >
                      <motion.div
                        animate={isReloading ? { rotate: 360 } : {}}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Tabs defaultValue="1m" className="h-8">
              <TabsList className="grid grid-cols-4 h-full">
                {["1w", "1m", "3m", "1y"].map((period) => (
                  <TabsTrigger key={period} value={period} className="text-xs">
                    {period.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <CardDescription className="dark:text-gray-400">Value over time (USD)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            {isReloading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full rounded-md" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} hide={!animateChart} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} hide={!animateChart} />
                  <RechartsTooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={2}
                    hide={!animateChart}
                  />
                  {animateChart && (
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={2}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 dark:bg-gray-900/50 dark:border-gray-800 py-3">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2 text-xs dark:border-gray-700">
                  YTD
                </Badge>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+28.5%</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2 text-xs dark:border-gray-700">
                  24h
                </Badge>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+1.8%</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              Details <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// TokenAllocation Component
const TokenAllocation = () => {
  const [animateChart, setAnimateChart] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateChart(true)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const container = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: {
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" whileHover="hover">
      <Card className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dark:text-gray-100">Token Allocation</CardTitle>
          <CardDescription className="dark:text-gray-400">Asset distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            {!animateChart ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-40 w-40 rounded-full mx-auto" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {tokenAllocation.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || COLORS[index % COLORS.length]}
                        strokeWidth={activeIndex === index ? 2 : 1}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.7}
                      />
                    ))}
                  </Pie>
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value) => {
                      const item = tokenAllocation.find((i) => i.name === value)
                      return (
                        <span className="text-xs">
                          {value} ({item?.value}%)
                        </span>
                      )
                    }}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value}%`, "Allocation"]}
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 dark:bg-gray-900/50 dark:border-gray-800 py-3">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            Optimize with AI <Zap className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// RecentTransactions Component
const RecentTransactions = () => {
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: {
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
    hover: {
      backgroundColor: "rgba(243, 244, 246, 0.8)",
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" whileHover="hover">
      <Card className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold dark:text-gray-100">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
            </Button>
          </div>
          <CardDescription className="dark:text-gray-400">Latest transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[240px]">
            <div className="divide-y dark:divide-gray-800">
              {recentTransactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  whileHover="hover"
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30">{tx.icon}</div>
                      <div>
                        <p className="font-medium text-sm dark:text-gray-200">{tx.type}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {tx.type === "Swap" && `${tx.from} → ${tx.to} • ${tx.amount}`}
                          {tx.type === "Subscription" && `${tx.service} • ${tx.amount}`}
                          {tx.type === "Social Tab" && `${tx.group} • ${tx.action} ${tx.amount}`}
                          {tx.type === "AI Investment" && `${tx.action} ${tx.token} • ${tx.amount}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={tx.status === "completed" ? "outline" : "secondary"}
                        className="mb-1 text-xs dark:border-gray-700"
                      >
                        {tx.status}
                      </Badge>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 dark:bg-gray-900/50 dark:border-gray-800 py-3">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View History <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// AiInsights Component
const AiInsights = () => {
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    hover: {
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      backgroundColor: "rgba(243, 244, 246, 0.8)",
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" whileHover="hover">
      <Card className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 h-full">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 4,
                }}
              >
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </motion.div>
              <CardTitle className="text-lg font-semibold dark:text-gray-100">AI Insights</CardTitle>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enable notifications for new insights</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription className="dark:text-gray-400">Smart recommendations for your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[240px]">
            <div className="divide-y dark:divide-gray-800">
              {aiInsights.map((insight, i) => (
                <motion.div
                  key={insight.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  whileHover="hover"
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm dark:text-gray-200">{insight.title}</p>
                        {insight.status === "new" && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{insight.description}</p>
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{insight.impact}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      aria-label={`Apply ${insight.title} recommendation`}
                    >
                      Apply <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 dark:bg-gray-900/50 dark:border-gray-800 py-3">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View All Insights <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Main Dashboard Component
export function DashboardClient() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-gray-100">Crypto Dashboard</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="User avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Balance"
              value="$26,850.00"
              description="USD equivalent"
              icon={<Wallet className="h-5 w-5" />}
              trend={{ isPositive: true, value: 12.5 }}
              variant="primary"
              showProgress
              progressValue={75}
              index={0}
            />
            <StatCard
              title="24h Change"
              value="+1.8%"
              description="Portfolio growth"
              icon={<TrendingUp className="h-5 w-5" />}
              variant="success"
              index={1}
            />
            <StatCard
              title="Subscriptions"
              value="2 Active"
              description="Pro Analytics, Yield Farm"
              icon={<CreditCard className="h-5 w-5" />}
              variant="secondary"
              index={2}
            />
            <StatCard
              title="Social Tabs"
              value="3 Groups"
              description="Holiday Fund, others"
              icon={<Users className="h-5 w-5" />}
              variant="accent"
              index={3}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PortfolioChart />
            <TokenAllocation />
            <RecentTransactions />
            <AiInsights />
          </div>
        </div>
      )}
    </div>
  )
}
