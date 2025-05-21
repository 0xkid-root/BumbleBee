"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, TrendingUp, TrendingDown, AlertTriangle, Check } from "lucide-react"
import type { useAiInsightsStore } from "@/lib/store/use-ai-insights-store"
import { useToast } from "@/hooks/use-toast"

type PortfolioRecommendationsProps = {
  recommendations: ReturnType<typeof useAiInsightsStore>["recommendations"]
}

export function PortfolioRecommendations({ recommendations }: PortfolioRecommendationsProps) {
  const { toast } = useToast()

  const handleAction = (action: string, asset: string) => {
    toast({
      title: `${action} ${asset}`,
      description: `This would open a modal to ${action.toLowerCase()} ${asset}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Rebalancing Recommendation */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Portfolio Rebalancing</CardTitle>
              <CardDescription>AI-recommended portfolio adjustments</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Recommended
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Current Allocation</div>
                <div className="text-2xl font-bold">
                  <div className="flex items-baseline gap-1">
                    <span>65%</span>
                    <span className="text-sm text-muted-foreground">Risk</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Recommended</div>
                <div className="text-2xl font-bold">
                  <div className="flex items-baseline gap-1">
                    <span>45%</span>
                    <span className="text-sm text-muted-foreground">Risk</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Potential Gain</div>
                <div className="text-2xl font-bold text-green-600">+12%</div>
              </div>
            </div>

            <div className="space-y-3">
              {recommendations.rebalancing.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        item.action === "Buy" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.action === "Buy" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{item.asset}</div>
                      <div className="text-xs text-muted-foreground">{item.reason}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={item.action === "Buy" ? "default" : "outline"}
                    onClick={() => handleAction(item.action, item.asset)}
                  >
                    {item.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button className="w-full">Apply Recommendations</Button>
        </CardFooter>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Analysis of your portfolio risk factors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Overall Risk Score</div>
                <div className="text-sm font-medium">{recommendations.riskScore}/100</div>
              </div>
              <Progress value={recommendations.riskScore} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low Risk</span>
                <span>Moderate</span>
                <span>High Risk</span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {recommendations.riskFactors.map((factor, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      factor.severity === "high"
                        ? "bg-red-100 text-red-600"
                        : factor.severity === "medium"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    {factor.severity === "high" ? (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    ) : factor.severity === "medium" ? (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{factor.name}</div>
                    <div className="text-xs text-muted-foreground">{factor.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunity Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Opportunities</CardTitle>
          <CardDescription>AI-detected market opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.opportunities.map((opportunity, index) => (
              <div key={index} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium mb-1">{opportunity.title}</div>
                    <div className="text-sm text-muted-foreground mb-3">{opportunity.description}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {opportunity.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          opportunity.confidence === "High"
                            ? "bg-green-100 text-green-600 border-green-200"
                            : opportunity.confidence === "Medium"
                              ? "bg-amber-100 text-amber-600 border-amber-200"
                              : "bg-blue-100 text-blue-600 border-blue-200"
                        }`}
                      >
                        {opportunity.confidence} Confidence
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="flex-shrink-0">
                    <ArrowRight className="h-4 w-4" />
                    <span className="sr-only">View opportunity</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
