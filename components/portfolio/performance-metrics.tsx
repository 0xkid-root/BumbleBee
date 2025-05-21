"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PortfolioPerformance, PortfolioRisk } from "@/lib/store/use-portfolio-store"
import { ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

type PerformanceMetricsProps = {
  performance: PortfolioPerformance
  risk: PortfolioRisk
  className?: string
}

export function PerformanceMetrics({ performance, risk, className }: PerformanceMetricsProps) {
  const getRiskColor = (risk: PortfolioRisk) => {
    switch (risk) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-amber-500"
      case "high":
        return "text-red-500"
      default:
        return ""
    }
  }

  const getRiskIcon = (risk: PortfolioRisk) => {
    switch (risk) {
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Your portfolio performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(performance).map(([period, value]) => (
              <div key={period} className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground capitalize">
                  {period === "allTime" ? "All Time" : period}
                </div>
                <div className="flex items-center mt-1">
                  {value >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={cn("text-lg font-medium", value >= 0 ? "text-green-500" : "text-red-500")}>
                    {value >= 0 ? "+" : ""}
                    {value}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Risk Level</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                        <Info className="h-3 w-3" />
                        <span className="sr-only">Risk level information</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        Risk level is calculated based on asset volatility, portfolio concentration, and market
                        conditions.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-1">
                {getRiskIcon(risk)}
                <span className={cn("font-medium capitalize", getRiskColor(risk))}>{risk}</span>
              </div>
            </div>

            <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  risk === "low"
                    ? "bg-green-500 w-1/3"
                    : risk === "medium"
                      ? "bg-amber-500 w-2/3"
                      : "bg-red-500 w-full",
                )}
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Your portfolio has {performance.monthly >= 0 ? "gained" : "lost"} {Math.abs(performance.monthly)}% in the
              last month.
              {performance.monthly >= 5
                ? " Great job!"
                : performance.monthly >= 0
                  ? " Steady progress."
                  : performance.monthly >= -5
                    ? " Markets have been challenging."
                    : " Consider rebalancing your portfolio."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
