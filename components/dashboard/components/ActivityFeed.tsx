"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import { 
  FileIcon, 
  ShieldIcon, 
  CreditCardIcon, 
  ServerIcon 
} from "lucide-react"

// Enhanced Activity Interface
export interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
    email?: string
  }
  action: string
  target: string
  timestamp: string
  category: 'transaction' | 'security' | 'account' | 'system'
  details?: string
}

interface ActivityFeedProps {
  activities: Activity[]
  className?: string
  showTabs?: boolean
  maxActivities?: number
}

// Icons for different categories
const CategoryIcons = {
  transaction: CreditCardIcon,
  security: ShieldIcon,
  account: FileIcon,
  system: ServerIcon
}

export function ActivityFeed({ 
  activities, 
  className, 
  showTabs = true, 
  maxActivities = 10 
}: ActivityFeedProps): React.ReactElement {
  const getCategoryColor = (category: Activity['category']): string => {
    switch (category) {
      case 'transaction':
        return 'bg-blue-500/20 text-blue-600 border-blue-400/20'
      case 'security':
        return 'bg-red-500/20 text-red-600 border-red-400/20'
      case 'account':
        return 'bg-green-500/20 text-green-600 border-green-400/20'
      case 'system':
        return 'bg-purple-500/20 text-purple-600 border-purple-400/20'
      default:
        return ''
    }
  }

  const filterActivitiesByCategory = (category: Activity['category']): Activity[] => {
    return activities.filter(activity => activity.category === category)
  }

  const renderActivityContent = (activity: Activity): React.ReactElement => {
    const CategoryIcon = CategoryIcons[activity.category]

    return (
      <motion.div
        key={activity.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="relative flex gap-4 p-4 hover:bg-muted/50 transition-colors"
      >
        {/* Timeline dot */}
        <div className="absolute left-8 top-7 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar className="h-8 w-8 mt-1">
                {activity.user.avatar ? (
                  <AvatarImage 
                    src={activity.user.avatar} 
                    alt={activity.user.name} 
                  />
                ) : (
                  <AvatarFallback className="bg-muted text-foreground">
                    {activity.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              {activity.user.email && <p>{activity.user.email}</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>
              {' '}{activity.action}{' '}
              <span className="font-medium">{activity.target}</span>
            </p>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs font-medium py-1 px-2 flex items-center gap-1",
                getCategoryColor(activity.category)
              )}
            >
              <CategoryIcon className="w-3 h-3" />
              {activity.category}
            </Badge>
          </div>
          {activity.details && (
            <p className="text-xs text-muted-foreground italic">
              {activity.details}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {activity.timestamp}
          </p>
        </div>
      </motion.div>
    )
  }

  const renderActivityFeed = (filteredActivities: Activity[]): React.ReactElement => (
    <div className="space-y-1">
      <AnimatePresence>
        {filteredActivities.slice(0, maxActivities).map((activity) => (
          renderActivityContent(activity)
        ))}
      </AnimatePresence>

      {filteredActivities.length === 0 && (
        <div className="flex items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No recent activity
          </p>
        </div>
      )}
    </div>
  )

  const renderContent = (): React.ReactElement => {
    if (!showTabs) {
      return renderActivityFeed(activities)
    }

    return (
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="transaction">Transactions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {renderActivityFeed(activities)}
        </TabsContent>
        <TabsContent value="transaction">
          {renderActivityFeed(filterActivitiesByCategory('transaction'))}
        </TabsContent>
        <TabsContent value="security">
          {renderActivityFeed(filterActivitiesByCategory('security'))}
        </TabsContent>
        <TabsContent value="account">
          {renderActivityFeed(filterActivitiesByCategory('account'))}
        </TabsContent>
        <TabsContent value="system">
          {renderActivityFeed(filterActivitiesByCategory('system'))}
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  )
}