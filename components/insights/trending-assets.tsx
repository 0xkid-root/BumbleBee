"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowUpRight, TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import type { useAiInsightsStore } from "@/lib/store/use-ai-insights-store"
import { useToast } from "@/hooks/use-toast"

type TrendingAssetsProps = {
  assets: ReturnType<typeof useAiInsightsStore>["trendingAssets"]
}

export function TrendingAssets({ assets }: TrendingAssetsProps) {
  const { toast } = useToast()

  const handleBuy = (asset: string) => {
    toast({
      title: `Buy ${asset}`,
      description: `This would open a modal to buy ${asset}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assets.top3.map((asset, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={asset.icon || "/placeholder.svg"} alt={asset.name} />
                    <AvatarFallback>{asset.symbol.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{asset.name}</CardTitle>
                    <CardDescription className="text-xs">{asset.symbol}</CardDescription>
                  </div>
                </div>
                <Badge variant={asset.change >= 0 ? "default" : "destructive"} className="text-xs">
                  {asset.change >= 0 ? "+" : ""}
                  {asset.change}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[100px] mt-2 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={asset.priceHistory}>
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={asset.change >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                      labelFormatter={() => ""}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">${asset.price.toFixed(2)}</div>
                <Button size="sm" onClick={() => handleBuy(asset.symbol)}>
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Buy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Trending Assets</CardTitle>
          <CardDescription>Assets with significant movement in the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {assets.all.map((asset, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={asset.icon || "/placeholder.svg"} alt={asset.name} />
                    <AvatarFallback>{asset.symbol.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">${asset.price.toFixed(2)}</div>
                    <div
                      className={`text-xs flex items-center gap-1 ${
                        asset.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {asset.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {asset.change >= 0 ? "+" : ""}
                      {asset.change}%
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View {asset.symbol}</span>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBuy(asset.symbol)}>
                      Buy
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
