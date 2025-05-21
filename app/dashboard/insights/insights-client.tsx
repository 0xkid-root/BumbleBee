"use client"

import { useState } from "react"
import { SectionTitle } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketInsights } from "@/components/insights/market-insights"
import { PortfolioRecommendations } from "@/components/insights/portfolio-recommendations"
import { TrendingAssets } from "@/components/insights/trending-assets"
import { NewsInsights } from "@/components/insights/news-insights"
import { useAiInsightsStore } from "@/lib/store/use-ai-insights-store"
import { RefreshCw, MessageSquare, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function InsightsClient() {
  const { insights, recommendations, trendingAssets, news } = useAiInsightsStore()
  const [activeTab, setActiveTab] = useState("market")
  const [isLoading, setIsLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Insights refreshed",
      description: "Your AI insights have been updated with the latest data.",
    })
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionTitle
          title="AI Insights"
          subtitle="Get personalized recommendations and market analysis"
          className="text-left mb-0"
          titleClassName="text-3xl"
          subtitleClassName="text-base max-w-none text-left"
        />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={() => setIsChatOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
          <Button size="sm" className="h-9" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Featured Insight */}
      <Card className="overflow-hidden border-primary/20">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">Featured Insight</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{insights.featured.title}</h2>
            <p className="text-muted-foreground mb-4">{insights.featured.description}</p>
            <div className="space-y-3">
              {insights.featured.points.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <p className="text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/3 bg-muted/50 flex items-center justify-center p-6">
            <div className="w-full h-full max-h-[200px] relative">
              <img
                src={insights.featured.image || "/placeholder.svg"}
                alt="Featured insight visualization"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs for different insight types */}
      <Tabs defaultValue="market" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="mt-0">
          <MarketInsights insights={insights} />
        </TabsContent>

        <TabsContent value="portfolio" className="mt-0">
          <PortfolioRecommendations recommendations={recommendations} />
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          <TrendingAssets assets={trendingAssets} />
        </TabsContent>

        <TabsContent value="news" className="mt-0">
          <NewsInsights news={news} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
