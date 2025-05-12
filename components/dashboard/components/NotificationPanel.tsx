"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BellIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon, InfoIcon } from "lucide-react"

export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timestamp: string
  read?: boolean
}

interface NotificationPanelProps {
  notifications: Notification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  className?: string
}

export function NotificationPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  className
}: NotificationPanelProps): React.ReactElement {
  const getNotificationIcon = (type: Notification['type']): React.ReactElement => {
    const iconClasses = "h-6 w-6 drop-shadow-md"
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClasses} text-green-500`} />
      case 'error':
        return <XCircleIcon className={`${iconClasses} text-red-500`} />
      case 'warning':
        return <AlertCircleIcon className={`${iconClasses} text-yellow-500`} />
      case 'info':
        return <InfoIcon className={`${iconClasses} text-blue-500`} />
    }
  }

  const getNotificationColor = (type: Notification['type']): string => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Card 
      className={cn(
        "overflow-hidden shadow-xl border-opacity-50 dark:bg-gray-800/60 backdrop-blur-sm",
        className
      )}
    >
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BellIcon className="h-6 w-6 text-primary/70 animate-pulse" />
            <CardTitle className="text-xl font-bold text-primary/90">
              Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Badge 
                  variant="secondary" 
                  className="bg-primary/20 text-primary font-bold px-2 py-1 rounded-full"
                >
                  {unreadCount}
                </Badge>
              </motion.div>
            )}
          </div>
          {onMarkAllAsRead && unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs hover:bg-primary/10 hover:text-primary transition-all"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <AnimatePresence initial={false}>
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    type: "tween"
                  }}
                  className={cn(
                    "flex items-start space-x-4 p-4 hover:bg-muted/30 transition-all duration-300 ease-in-out group",
                    !notification.read && "bg-primary/5 border-l-4 border-primary/50",
                    getNotificationColor(notification.type)
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {getNotificationIcon(notification.type)}
                    </motion.div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity">
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && onMarkAsRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <BellIcon className="h-12 w-12 text-muted-foreground/30 mb-4 animate-bounce" />
              <p className="text-md text-muted-foreground">
                No new notifications
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}