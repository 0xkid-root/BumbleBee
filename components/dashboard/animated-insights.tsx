"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  Gem, 
  Shield, 
  Plus,
  X,
  ChevronRight,
  Clock
} from "lucide-react"
import { useState, useEffect } from "react"

interface InsightItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: string
  category: "insights" | "opportunities" | "risks"
  impact: "high" | "medium" | "low"
  timeToRead?: string
}

interface AnimatedInsightsProps {
  className?: string
  delay?: number
}

export function AnimatedInsights({ className, delay = 0 }: AnimatedInsightsProps) {
  const [activeTab, setActiveTab] = useState<string>("insights")
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)
  const [savedInsights, setSavedInsights] = useState<string[]>([])
  const [newInsightIndicator, setNewInsightIndicator] = useState<boolean>(true)
  
  // More comprehensive insights data with categories
  const allInsights: InsightItem[] = [
    // Insights
    {
      id: "1",
      title: "Portfolio Diversification",
      description: "Your portfolio is heavily concentrated in Ethereum. Consider diversifying to reduce risk exposure during market volatility periods. Based on your risk profile, we recommend allocating at least 30% to other assets.",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      action: "View Recommendations",
      category: "insights",
      impact: "high",
      timeToRead: "2 min"
    },
    {
      id: "2",
      title: "Market Opportunity",
      description: "DeFi yields are currently high on Arbitrum. Consider moving some assets to capture higher returns while maintaining similar risk levels. Current APY averages of 8.2% represent a 3.1% increase from your current positions.",
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
      action: "Explore Options",
      category: "insights",
      impact: "medium",
      timeToRead: "3 min"
    },
    {
      id: "3",
      title: "Gas Optimization",
      description: "You could save up to $12 in gas fees by batching your next 3 transactions. Our analysis shows your regular transaction patterns could be optimized by using batching tools.",
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      action: "Learn More",
      category: "insights",
      impact: "low",
      timeToRead: "1 min"
    },
    
    // Opportunities
    {
      id: "4",
      title: "Staking Rewards",
      description: "Your idle ETH could earn 4.2% APR through liquid staking solutions while maintaining liquidity. This represents approximately $340 in additional annual returns based on your holdings.",
      icon: <Gem className="h-5 w-5 text-blue-500" />,
      action: "Start Staking",
      category: "opportunities",
      impact: "medium",
      timeToRead: "4 min"
    },
    {
      id: "5",
      title: "NFT Collection Undervalued",
      description: "One of your NFT collections has a floor price 20% below its 30-day average. Consider holding or even acquiring more while the collection is undervalued.",
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
      action: "View Collection",
      category: "opportunities",
      impact: "low",
      timeToRead: "2 min"
    },
    
    // Risks
    {
      id: "6",
      title: "Smart Contract Risk",
      description: "Your funds in the XYZ protocol are not covered by any insurance. Consider purchasing coverage from Nexus Mutual or similar protocols to protect your position.",
      icon: <Shield className="h-5 w-5 text-red-500" />,
      action: "Get Coverage",
      category: "risks",
      impact: "high",
      timeToRead: "5 min"
    },
    {
      id: "7",
      title: "Liquidation Risk",
      description: "Your collateralized position on Aave is within 10% of liquidation threshold. Consider adding more collateral or repaying part of your loan to increase your safety margin.",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      action: "Adjust Position",
      category: "risks",
      impact: "high",
      timeToRead: "2 min"
    },
  ]
  
  // Effect to dismiss new insight indicator after delay
  useEffect(() => {
    if (newInsightIndicator) {
      const timer = setTimeout(() => {
        setNewInsightIndicator(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [newInsightIndicator])
  
  // Filter insights based on active tab
  const filteredInsights = allInsights.filter(insight => insight.category === activeTab)
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }
  
  const glowVariants = {
    initial: { opacity: 0.6 },
    animate: { 
      opacity: [0.6, 1, 0.6], 
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
  
  const toggleSaveInsight = (id: string) => {
    setSavedInsights(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <Card className="overflow-hidden relative">
        {newInsightIndicator && (
          <motion.div 
            className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Sparkles className="h-3 w-3" />
            </motion.span>
            <span>New insights!</span>
          </motion.div>
        )}
        
        <CardHeader>
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                variants={glowVariants}
                initial="initial"
                animate="animate"
              >
                <Sparkles className="h-5 w-5 text-primary" />
              </motion.div>
            </motion.div>
            <CardTitle>AI Insights</CardTitle>
          </div>
          <CardDescription>Personalized recommendations based on your activity</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="mb-2">
              <TabsTrigger value="insights" className="relative">
                Insights
                {activeTab !== "insights" && newInsightIndicator && (
                  <motion.span 
                    className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="space-y-4"
            >
              {filteredInsights.map((insight) => (
                <motion.div
                  key={insight.id}
                  variants={itemVariants}
                  whileHover={{ scale: expandedInsight === insight.id ? 1 : 1.02 }}
                  className={`rounded-lg border p-4 transition-colors ${
                    expandedInsight === insight.id 
                      ? "bg-muted/50 border-primary/30" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="mt-0.5"
                      whileHover={{ scale: 1.2, rotate: 15 }}
                    >
                      {insight.icon}
                    </motion.div>
                    
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{insight.title}</h4>
                          <motion.span 
                            className={`text-xs px-1.5 py-0.5 rounded-full ${
                              insight.impact === "high" 
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                                : insight.impact === "medium"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: delay + 0.3 }}
                          >
                            {insight.impact} impact
                          </motion.span>
                        </div>
                        
                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleSaveInsight(insight.id)}
                            className={`p-1 rounded-full ${
                              savedInsights.includes(insight.id)
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                            }`}
                          >
                            {savedInsights.includes(insight.id) ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setExpandedInsight(
                              expandedInsight === insight.id ? null : insight.id
                            )}
                            className="p-1 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5"
                          >
                            <motion.div
                              animate={{ 
                                rotate: expandedInsight === insight.id ? 90 : 0 
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </motion.div>
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{insight.timeToRead}</span>
                      </div>
                      
                      <AnimatePresence>
                        {expandedInsight === insight.id ? (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ 
                              opacity: 1, 
                              height: "auto",
                              transition: { duration: 0.3 }
                            }}
                            exit={{ 
                              opacity: 0, 
                              height: 0,
                              transition: { duration: 0.2 }
                            }}
                            className="text-sm text-muted-foreground pt-2"
                          >
                            {insight.description}
                          </motion.p>
                        ) : (
                          <motion.p 
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-muted-foreground line-clamp-2"
                          >
                            {insight.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: delay + 0.2 }
                        }}
                      >
                        <motion.button
                          whileHover={{ 
                            scale: 1.02, 
                            x: 5,
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-2 text-sm font-medium text-primary hover:underline flex items-center gap-1 group"
                        >
                          {insight.action}
                          <motion.div
                            initial={{ x: 0 }}
                            animate={{ x: [0, 3, 0] }}
                            transition={{ 
                              repeat: Infinity, 
                              repeatDelay: 1.5,
                              duration: 1
                            }}
                          >
                            <ArrowRight className="h-3 w-3 inline opacity-70 group-hover:opacity-100" />
                          </motion.div>
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredInsights.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center text-muted-foreground"
                >
                  No {activeTab} to display at this time.
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          
          <motion.div 
            className="mt-4 pt-4 border-t flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: delay + 0.4 }
            }}
          >
            <div className="text-xs text-muted-foreground">
              Last updated 5 minutes ago
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "var(--primary)" }}
              whileTap={{ scale: 0.97 }}
              className="px-3 py-1.5 text-xs rounded-md border border-primary text-primary hover:text-primary-foreground transition-all duration-200 flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              <span>Refresh Insights</span>
            </motion.button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}