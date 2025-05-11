"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react"

interface AnimatedChartProps {
  className?: string
  delay?: number
}

// Sample data for different time periods
const timeRangeData = {
  "1w": [
    { name: "Mon", value: 6500 },
    { name: "Tue", value: 6800 },
    { name: "Wed", value: 6300 },
    { name: "Thu", value: 6700 },
    { name: "Fri", value: 7100 },
    { name: "Sat", value: 7300 },
    { name: "Sun", value: 7500 },
  ],
  "1m": [
    { name: "Week 1", value: 5000 },
    { name: "Week 2", value: 5500 },
    { name: "Week 3", value: 6000 },
    { name: "Week 4", value: 7500 },
  ],
  "3m": [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 5500 },
    { name: "Mar", value: 7500 },
  ],
  "1y": [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
    { name: "Jul", value: 3490 },
    { name: "Aug", value: 4000 },
    { name: "Sep", value: 5000 },
    { name: "Oct", value: 6000 },
    { name: "Nov", value: 7000 },
    { name: "Dec", value: 9000 },
  ],
  "all": [
    { name: "2020", value: 2000 },
    { name: "2021", value: 3500 },
    { name: "2022", value: 4200 },
    { name: "2023", value: 5800 },
    { name: "2024", value: 9000 },
  ]
}

export function AnimatedChart({ className, delay = 0 }: AnimatedChartProps) {
  const [selectedRange, setSelectedRange] = useState("1y")
  const [chartData, setChartData] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  
  // Calculate change percentage
  const calculateChange = () => {
    const data = timeRangeData[selectedRange as keyof typeof timeRangeData]
    if (data.length < 2) return 0
    
    const firstValue = data[0].value
    const lastValue = data[data.length - 1].value
    return ((lastValue - firstValue) / firstValue) * 100
  }
  
  const changePercentage = calculateChange()
  const isPositive = changePercentage >= 0
  
  useEffect(() => {
    // Animate the chart data when tab changes
    setChartData([])
    
    const timer = setTimeout(() => {
      setChartData(timeRangeData[selectedRange as keyof typeof timeRangeData])
    }, 300)
    
    return () => clearTimeout(timer)
  }, [selectedRange])
  
  // Initial animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartData(timeRangeData[selectedRange as keyof typeof timeRangeData])
    }, delay * 1000)
    
    return () => clearTimeout(timer)
  }, [delay])
  
  const refreshData = () => {
    setIsRefreshing(true)
    setChartData([])
    
    setTimeout(() => {
      setChartData(timeRangeData[selectedRange as keyof typeof timeRangeData])
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <motion.div layout>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Your portfolio value over time</CardDescription>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.div 
                className="flex items-center space-x-2 p-2 rounded-md bg-opacity-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ 
                  backgroundColor: isPositive ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)",
                  color: isPositive ? "rgb(0, 180, 0)" : "rgb(220, 0, 0)"
                }}
              >
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="font-medium">
                  {isPositive ? "+" : ""}{changePercentage.toFixed(2)}%
                </span>
              </motion.div>
              
              <motion.button
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshData}
                disabled={isRefreshing}
              >
                <motion.div
                  animate={isRefreshing ? { rotate: 360 } : {}}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RefreshCw size={16} />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRange} onValueChange={setSelectedRange} className="mb-4">
            <TabsList>
              <TabsTrigger value="1w">1W</TabsTrigger>
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="3m">3M</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedRange}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="h-72"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  onMouseMove={(e) => {
                    if (e.activeTooltipIndex !== undefined) {
                      setHoveredPoint(e.activeTooltipIndex)
                    }
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                    }}
                    cursor={{ stroke: "var(--primary)", strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={(props) => {
                      const { cx, cy, index } = props
                      return (
                        <motion.circle
                          cx={cx}
                          cy={cy}
                          r={hoveredPoint === index ? 6 : 4}
                          fill="var(--background)"
                          stroke="var(--primary)"
                          strokeWidth={hoveredPoint === index ? 3 : 2}
                          initial={false}
                          animate={{ 
                            r: hoveredPoint === index ? 6 : 4,
                            strokeWidth: hoveredPoint === index ? 3 : 2
                          }}
                        />
                      )
                    }}
                    activeDot={(props: { cx?: number; cy?: number; [key: string]: any }) => {
                      const { cx = 0, cy = 0 } = props
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={6} fill="var(--primary)" />
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={12} 
                            fill="var(--primary)" 
                            fillOpacity={0.2} 
                          />
                        </g>
                      )
                    }}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    fill="url(#colorValue)"
                    fillOpacity={0.2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
          
          <motion.div 
            className="mt-4 grid grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              whileHover={{ y: -4 }}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">Current Value</p>
              <p className="text-lg font-bold">
                {chartData.length > 0 ? 
                  `$${chartData[chartData.length - 1]?.value?.toLocaleString()}` : 
                  "—"
                }
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              whileHover={{ y: -4 }}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
              <p className="text-lg font-bold">
                {chartData.length > 0 ? 
                  `$${(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length).toLocaleString(undefined, {maximumFractionDigits: 0})}` : 
                  "—"
                }
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              whileHover={{ y: -4 }}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">Change</p>
              <p className={`text-lg font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? "+" : ""}{changePercentage.toFixed(2)}%
              </p>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}