"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Calendar, Clock, ThumbsUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { useAiInsightsStore } from "@/lib/store/use-ai-insights-store"

type NewsInsightsProps = {
  news: ReturnType<typeof useAiInsightsStore>["news"]
}

export function NewsInsights({ news }: NewsInsightsProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Crypto News & Analysis</CardTitle>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="regulation">Regulation</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0 space-y-4">
          {/* Featured News */}
          <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 h-[200px] relative">
                <img
                  src={news.featured.image || "/placeholder.svg"}
                  alt={news.featured.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-6">
                <Badge className="mb-2">{news.featured.category}</Badge>
                <h3 className="text-xl font-bold mb-2">{news.featured.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{news.featured.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={news.featured.source.logo || "/placeholder.svg"}
                        alt={news.featured.source.name}
                      />
                      <AvatarFallback>{news.featured.source.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{news.featured.source.name}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(news.featured.date), { addSuffix: true })}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Read More
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* News List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.recent.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className="mb-1 text-xs">
                        {item.category}
                      </Badge>
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.source.name}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="market" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">Market News</h3>
                <p className="text-sm text-muted-foreground">Filter by market news to see the latest market updates</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technology" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">Technology News</h3>
                <p className="text-sm text-muted-foreground">
                  Filter by technology news to see the latest tech updates
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulation" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <ThumbsUp className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">Regulation News</h3>
                <p className="text-sm text-muted-foreground">
                  Filter by regulation news to see the latest regulatory updates
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
