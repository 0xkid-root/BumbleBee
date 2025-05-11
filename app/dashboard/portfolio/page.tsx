"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SectionTitle } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolioStore, getAllocation } from "@/lib/store/use-portfolio-store"
import { AllocationChart } from "@/components/portfolio/allocation-chart"
import { PerformanceMetrics } from "@/components/portfolio/performance-metrics"
import { AssetTable } from "@/components/portfolio/asset-table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { Download, Share, RefreshCw, AlertTriangle, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PortfolioPage() {
  const portfolioStore = usePortfolioStore()
  const allocation = getAllocation(portfolioStore.assets)
  const { historicalData, performance, risk, totalValue } = portfolioStore
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsLoading(true)

    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    toast({
      title: "Portfolio data refreshed",
      description: "Your portfolio data has been updated with the latest market information.",
    })
  }

  const handleBuyAsset = (assetId: string) => {
    // Implementation would go here
    toast({
      title: "Buy asset",
      description: `This would open a modal to buy ${assetId.toUpperCase()}`,
    })
  }

  const handleSellAsset = (assetId: string) => {
    // Implementation would go here
    toast({
      title: "Sell asset",
      description: `This would open a modal to sell ${assetId.toUpperCase()}`,
    })
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md">
          <div className="font-medium">{label}</div>
          <div className="text-lg font-bold">${payload[0].value.toLocaleString()}</div>
        </div>
      )
    }

    return null
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SectionTitle
            title="Portfolio"
            subtitle="Track and analyze your investment performance"
            className="text-left mb-0"
            titleClassName="text-3xl"
            subtitleClassName="text-base max-w-none text-left"
          />

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" className="h-9" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Portfolio Value</CardTitle>
                <CardDescription>Your total investment value</CardDescription>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <div className="text-3xl font-bold">${totalValue.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-sm">
                  {performance.daily >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                  )}
                  <span className={performance.daily >= 0 ? "text-green-500" : "text-red-500"}>
                    {performance.daily >= 0 ? "+" : ""}
                    {performance.daily}% today
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Tabs
                defaultValue="monthly"
                value={timeframe}
                onValueChange={(value) => setTimeframe(value as any)}
                className="h-full flex flex-col"
              >
                <TabsList className="self-end mb-4">
                  <TabsTrigger value="daily">1D</TabsTrigger>
                  <TabsTrigger value="weekly">1W</TabsTrigger>
                  <TabsTrigger value="monthly">1M</TabsTrigger>
                  <TabsTrigger value="yearly">1Y</TabsTrigger>
                </TabsList>

                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData[timeframe]} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return timeframe === "daily"
                            ? format(date, "HH:mm")
                            : timeframe === "weekly"
                              ? format(date, "EEE")
                              : timeframe === "monthly"
                                ? format(date, "MMM dd")
                                : format(date, "MMM")
                        }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        tickLine={false}
                        axisLine={false}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Risk Warning Card (conditionally shown) */}
        {risk === "high" && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-destructive/20 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-medium text-destructive mb-1">High Portfolio Risk Detected</h3>
                  <p className="text-sm text-muted-foreground">
                    Your portfolio has a high concentration in volatile assets. Consider diversifying to reduce risk.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AllocationChart allocation={allocation} className="lg:col-span-1" />
          <PerformanceMetrics performance={performance} risk={risk} className="lg:col-span-1" />
          <AssetTable assets={allocation} onBuy={handleBuyAsset} onSell={handleSellAsset} className="lg:col-span-3" />
        </div>
      </div>
    </DashboardLayout>
  )
}
