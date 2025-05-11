"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import { format } from "date-fns"
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedNumber } from "@/components/ui/animated-number"

// Sample data
const generateData = (days: number, trend: "up" | "down" | "volatile") => {
  const data = []
  let value = 10000

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))

    let change
    if (trend === "up") {
      change = Math.random() * 500 - 100 // Mostly up
    } else if (trend === "down") {
      change = Math.random() * 500 - 400 // Mostly down
    } else {
      change = Math.random() * 800 - 400 // Volatile
    }

    value += change
    value = Math.max(value, 5000) // Ensure we don't go too low

    data.push({
      date: format(date, "MMM dd"),
      value: Math.round(value),
    })
  }

  return data
}

const weekData = generateData(7, "up")
const monthData = generateData(30, "volatile")
const yearData = generateData(365, "up")

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-md">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div className="text-base font-bold">${payload[0].value?.toLocaleString()}</div>
      </div>
    )
  }

  return null
}

export function PortfolioChart() {
  const [period, setPeriod] = useState("week")

  const data = period === "week" ? weekData : period === "month" ? monthData : yearData

  // Calculate change
  const startValue = data[0].value
  const endValue = data[data.length - 1].value
  const change = ((endValue - startValue) / startValue) * 100
  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="col-span-3 lg:col-span-2"
    >
      <Card className="shadow-sm hover:shadow-md transition-all duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">Portfolio Value</CardTitle>
            <CardDescription>Your asset performance over time</CardDescription>
          </div>
          <Tabs defaultValue="week" value={period} onValueChange={setPeriod} className="h-9">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger
                value="week"
                className="text-xs px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Week
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="text-xs px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Month
              </TabsTrigger>
              <TabsTrigger
                value="year"
                className="text-xs px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                <AnimatedNumber
                  value={endValue}
                  prefix="$"
                  duration={1.2}
                  formatOptions={{ maximumFractionDigits: 0 }}
                />
              </div>
              <div className="flex items-center text-sm mt-1">
                <span
                  className={`mr-1 flex items-center ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"} font-medium`}
                >
                  {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
                  <AnimatedNumber
                    value={Math.abs(change)}
                    suffix="%"
                    duration={1}
                    delay={0.7}
                    formatOptions={{ maximumFractionDigits: 2 }}
                  />
                </span>
                <span className="text-muted-foreground">vs. previous {period}</span>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 rounded-full">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="sr-only">More information</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">
                        This percentage shows the change in your portfolio value compared to the beginning of the
                        selected time period.
                      </p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Export
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Details
              </Button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={period}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    stroke="hsl(var(--muted-foreground))"
                    domain={["dataMin - 1000", "dataMax + 1000"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
