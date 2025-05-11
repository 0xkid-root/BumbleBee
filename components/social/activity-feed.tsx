"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ArrowUpRight, ArrowDownLeft, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { useSocialPaymentsStore } from "@/lib/store/use-social-payments-store"

type ActivityFeedProps = {
  activities: ReturnType<typeof useSocialPaymentsStore>["activities"]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <h3 className="font-medium mb-1">No activity yet</h3>
        <p className="text-sm text-muted-foreground">Your social payment activity will appear here</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <Avatar>
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
              <AvatarFallback>{activity.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium flex items-center gap-1.5">
                    <span>{activity.user.name}</span>
                    {activity.type === "payment" ? (
                      <span className="text-muted-foreground">paid you</span>
                    ) : activity.type === "request" ? (
                      <span className="text-muted-foreground">requested</span>
                    ) : activity.type === "group" ? (
                      <span className="text-muted-foreground">added you to group</span>
                    ) : (
                      <span className="text-muted-foreground">split a bill with you</span>
                    )}

                    {activity.type === "group" ? (
                      <span className="font-medium">{activity.groupName}</span>
                    ) : (
                      <span className="font-medium">${activity.amount}</span>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground mt-1">{activity.note}</div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </div>

                    {activity.status && (
                      <Badge
                        variant={
                          activity.status === "completed"
                            ? "default"
                            : activity.status === "pending"
                              ? "outline"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activity.type === "request" && activity.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Decline</span>
                      </Button>
                      <Button size="sm" className="h-8 w-8 p-0">
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Accept</span>
                      </Button>
                    </>
                  )}

                  {activity.type === "payment" && (
                    <div
                      className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-full",
                        "bg-green-100 text-green-600",
                      )}
                    >
                      <ArrowDownLeft className="h-4 w-4" />
                    </div>
                  )}

                  {activity.type === "split" && activity.status === "pending" && (
                    <div
                      className={cn("flex items-center justify-center h-8 w-8 rounded-full", "bg-red-100 text-red-600")}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
