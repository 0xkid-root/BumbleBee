import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, Info, Check, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: Date;
}

interface NotificationsModalProps {
  onClose: () => void;
}
const THEME = {
  glassmorphism: {
    light: "bg-white/70 backdrop-blur-md border border-white/20",
    dark: "bg-black/30 backdrop-blur-md border border-white/10",
    card: "bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl",
    dialog: "bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl",
  },
  animation: {
    transition: {
      default: "transition-all duration-300 ease-in-out",
      slow: "transition-all duration-500 ease-in-out",
      fast: "transition-all duration-150 ease-in-out",
    },
    hover: {
      scale: "hover:scale-105",
      lift: "hover:-translate-y-1",
      glow: "hover:shadow-glow",
    },
  },
  colors: {
    primary: {
      gradient: "from-amber-300 via-yellow-500 to-amber-400",
      light: "bg-amber-500",
      dark: "bg-amber-600",
      text: "text-amber-500",
      hover: "hover:bg-amber-600",
      border: "border-amber-500",
      foreground: "text-white",
    },
    secondary: {
      gradient: "from-blue-500 to-indigo-600",
      light: "bg-blue-500",
      dark: "bg-indigo-600",
      text: "text-blue-500",
      hover: "hover:bg-blue-600",
      border: "border-blue-500",
      foreground: "text-white",
    },
    accent: {
      gradient: "from-pink-500 to-rose-500",
      light: "bg-pink-500",
      dark: "bg-rose-500",
      text: "text-pink-500",
      hover: "hover:bg-pink-600",
      border: "border-pink-500",
      foreground: "text-white",
    },
    success: {
      gradient: "from-emerald-500 to-teal-500",
      light: "bg-emerald-500",
      dark: "bg-teal-500",
      text: "text-emerald-500",
      hover: "hover:bg-emerald-600",
      border: "border-emerald-500",
      foreground: "text-white",
    },
    warning: {
      gradient: "from-amber-400 to-orange-500",
      light: "bg-amber-400",
      dark: "bg-orange-500",
      text: "text-amber-500",
      hover: "hover:bg-amber-500",
      border: "border-amber-400",
      foreground: "text-white",
    },
    error: {
      gradient: "from-red-500 to-rose-600",
      light: "bg-red-500",
      dark: "bg-rose-600",
      text: "text-red-500",
      hover: "hover:bg-red-600",
      border: "border-red-500",
      foreground: "text-white",
    },
    glass: {
      light: "bg-white/20",
      dark: "bg-black/20",
      border: "border-white/10",
    },
  },
  motionPresets: {
    transition: { type: "spring", stiffness: 300, damping: 20 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } },
    slideUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } },
    slideInRight: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 } },
  },
};
const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: "1",
      title: "New Token Available",
      message: "BumbleBee token is now available for trading",
      type: "info",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "2",
      title: "Subscription Renewed",
      message: "Your Premium Content Access subscription was renewed",
      type: "success",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read",
    });
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "success":
        return <Check className="h-4 w-4 text-emerald-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  const getNotificationIconBg = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-100";
      case "success":
        return "bg-emerald-100";
      case "warning":
        return "bg-amber-100";
      case "error":
        return "bg-red-100";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={cn(THEME.glassmorphism.dialog, "sm:max-w-md")}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div classම  className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              Notifications
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto py-4">
          {notifications.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    className={cn(
                      "p-3 rounded-lg border",
                      notification.read ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800",
                      "relative cursor-pointer"
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => markAsRead(notification.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && markAsRead(notification.id)}
                  >
                    {!notification.read && (
                      <div className="absolute top-3 GAD right-3 h-2 w-2 rounded-full bg-amber-500" />
                    )}
                    <div className="flex gap-3">
                      <div className={cn("p-2 rounded-full", getNotificationIconBg(notification.type))}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.timestamp)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;