"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import {
  Activity,
  ArrowUpRight,
  Gift,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  PiggyBank,
  PlayCircle,
  Plus,
  Settings,
  User2,
  Users,
  Wallet,
  ArrowRightLeft,
  BookOpen,
  BadgeDollarSign,
  Sparkles,
  Bell,
  ChevronRight,
  BarChart,
  Zap,
  CreditCard,
  X,
  Check,
  HelpCircle,
  Info,
  AlertCircle,
  Coins,
  TrendingUp,
  PieChart
} from "lucide-react"
import { DashboardSidebar } from "./sidebar"
import { Sidebar, SidebarInset } from "@/components/ui/sidebar"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {  CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"

// Theme constants for consistent colors - matching landing page palette
const THEME = {
  glassmorphism: {
    light: "bg-white/70 backdrop-blur-md border border-white/20",
    dark: "bg-black/30 backdrop-blur-md border border-white/10",
    card: "bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl",
    dialog: "bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl"
  },
  animation: {
    transition: {
      default: "transition-all duration-300 ease-in-out",
      slow: "transition-all duration-500 ease-in-out",
      fast: "transition-all duration-150 ease-in-out"
    },
    hover: {
      scale: "hover:scale-105",
      lift: "hover:-translate-y-1",
      glow: "hover:shadow-glow"
    }
  },
  colors: {
    primary: {
      gradient: "from-amber-500 via-yellow-500 to-amber-400", // Match hero section gradient
      light: "bg-amber-500",
      dark: "bg-amber-600",
      text: "text-amber-500",
      hover: "hover:bg-amber-600",
      border: "border-amber-500",
      foreground: "text-white"
    },
    secondary: {
      gradient: "from-blue-500 to-indigo-600",
      light: "bg-blue-500",
      dark: "bg-indigo-600",
      text: "text-blue-500",
      hover: "hover:bg-blue-600",
      border: "border-blue-500",
      foreground: "text-white"
    },
    accent: {
      gradient: "from-pink-500 to-rose-500", // Updated to match landing page
      light: "bg-pink-500",
      dark: "bg-rose-500",
      text: "text-pink-500",
      hover: "hover:bg-pink-600",
      border: "border-pink-500",
      foreground: "text-white"
    },
    success: {
      gradient: "from-emerald-500 to-teal-500", // Updated to match landing page
      light: "bg-emerald-500",
      dark: "bg-teal-500",
      text: "text-emerald-500",
      hover: "hover:bg-emerald-600",
      border: "border-emerald-500",
      foreground: "text-white"
    },
    warning: {
      gradient: "from-amber-400 to-orange-500",
      light: "bg-amber-400",
      dark: "bg-orange-500",
      text: "text-amber-500",
      hover: "hover:bg-amber-500",
      border: "border-amber-400",
      foreground: "text-white"
    },
    error: {
      gradient: "from-red-500 to-rose-600",
      light: "bg-red-500",
      dark: "bg-rose-600",
      text: "text-red-500",
      hover: "hover:bg-red-600",
      border: "border-red-500",
      foreground: "text-white"
    },
    glass: {
      light: "bg-white/20",
      dark: "bg-black/20",
      border: "border-white/10",
    }
  },
  motionPresets: {
    transition: { type: "spring", stiffness: 300, damping: 20 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } },
    slideUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } },
    slideInRight: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 } }
  }
}

// Dummy data for visualization
const portfolioData = [
  { name: "XDC", value: 45 },
  { name: "ETH", value: 30 },
  { name: "BTC", value: 15 },
  { name: "Others", value: 10 },
]

const recentActivity = [
  { id: 1, type: "Subscription Payment", amount: "-25 XDC", date: "Today", status: "Completed" },
  { id: 2, type: "Group Tab Settlement", amount: "+120 XDC", date: "Yesterday", status: "Completed" },
  { id: 3, type: "Token Swap", amount: "-50 XDC", date: "May 10", status: "Completed" },
]

const smartWalletAlerts = [
  { id: 1, message: "Low gas detected - Added funds automatically", type: "info" },
  { id: 2, message: "Portfolio rebalanced based on market conditions", type: "success" },
]

const subscriptions = [
  { id: 1, name: "Premium Content Access", amount: "25 XDC", frequency: "Monthly", nextPayment: "Jun 12" },
  { id: 2, name: "DeFi Analytics Tool", amount: "50 XDC", frequency: "Monthly", nextPayment: "May 20" },
]

const groupTabs = [
  { id: 1, name: "Team Lunch", participants: 5, outstandingAmount: "120 XDC", status: "Active" },
  { id: 2, name: "Shared Subscription", participants: 3, outstandingAmount: "45 XDC", status: "Pending" },
]

// Card component props interface
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'accent';
  icon?: React.ReactNode;
}

// Card component with glassmorphism and gradient effects
function Card({ title = "", children, className = "", variant = 'default', icon }: CardProps) {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    });
  }, [controls]);

  const getCardStyle = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-blue-500 to-purple-600 text-white';
      case 'glass':
        return 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl';
      case 'accent':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      default:
        return 'bg-white dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn(
        `rounded-xl p-5 shadow-md ${getCardStyle()}`,
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {icon && (
            <motion.div 
              className="mr-3 p-2 bg-white/20 rounded-full"
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {icon}
            </motion.div>
          )}
          <h3 className={cn(
            "text-lg font-medium",
            variant === 'default' ? 'text-gray-800 dark:text-gray-100' : 'text-white'
          )}>{title}</h3>
        </div>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 5 }}
          className="opacity-70 hover:opacity-100"
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
      </div>
      <div>
        {children}
      </div>
    </motion.div>
  );
}

// StatBox component props interface
interface StatBoxProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  gradient?: string;
  trend?: { value: number; isPositive: boolean };
  index?: number;
}

// StatBox component with animated icons and gradients
const StatBox: React.FC<StatBoxProps> = ({ 
  title, 
  value, 
  icon: IconComponent, 
  color = "bg-blue-500",
  gradient = "from-blue-500 to-indigo-600",
  trend,
  index = 0
}) => {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 }
    });
  }, [controls, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)' 
      }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn(
        "rounded-xl p-5 shadow-md backdrop-blur-sm",
        gradient ? `bg-gradient-to-br ${gradient} text-white` : "bg-white dark:bg-gray-800"
      )}
    >
      <div className="flex items-center">
        <motion.div 
          className="p-3 rounded-full mr-4 bg-white/20"
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <IconComponent className="h-6 w-6 text-white" />
        </motion.div>
        <div>
          <p className="text-sm text-white/80">{title}</p>
          <div className="flex items-center">
            <motion.p 
              className="text-xl font-bold text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
            >
              {value}
            </motion.p>
            {trend && (
              <Badge 
                variant={trend.isPositive ? "default" : "destructive"} 
                className="ml-2 text-xs font-medium"
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 w-full h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-white/60 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "70%" }}
          transition={{ delay: index * 0.1 + 0.5, duration: 0.7 }}
        />
      </div>
    </motion.div>
  );
}

// PortfolioChart component with enhanced animations and gradients
const PortfolioChart = () => {
  const chartColors = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-600',
    'from-amber-400 to-orange-500'
  ];

  return (
    <div className="mt-4 mb-6">
      <div className="flex h-40 items-end rounded-xl p-4 bg-gray-50/30 backdrop-blur-sm border border-white/20 shadow-inner">
        {portfolioData.map((item, i) => (
          <motion.div
            key={i}
            className="flex-1 mx-1 relative group"
            initial={{ height: 0 }}
            animate={{ height: `${item.value}%` }}
            transition={{ 
              delay: i * 0.15, 
              duration: 0.7,
              type: "spring",
              stiffness: 50 
            }}
          >
            <motion.div 
              className={`w-full h-full rounded-t-xl bg-gradient-to-t ${chartColors[i % chartColors.length]} relative overflow-hidden`}
              whileHover={{ scale: 1.05 }}
            >
              {/* Shimmering effect */}
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{
                  y: ["100%", "-100%"],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2,
                  ease: "linear",
                }}
              />
            </motion.div>
            
            {/* Tooltip on hover */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {item.name}: {item.value}%
            </div>
            
            <p className="text-xs font-medium text-center mt-2">{item.name}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-4">
        {portfolioData.map((item, i) => (
          <motion.div 
            key={i}
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + (i * 0.1) }}
          >
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${chartColors[i % chartColors.length]} mr-1`}></div>
            <span className="text-xs">{item.name} ({item.value}%)</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Modal types
type ModalType = 'walletConnect' | 'tokenSwap' | 'settings' | 'notifications' | 'addSubscription' | 'createTab' | 'createWallet' | 'aiInsights' | 'transactionDetails' | null;

// Notification type
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
}

// Wallet type
interface Wallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  token: string;
  lastActivity: Date;
  isActive: boolean;
}

// DashboardLayout props interface
interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Additional theme configuration has been merged into the existing THEME object above

// Helper functions for notifications
const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'success':
      return <Check className="h-4 w-4 text-emerald-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'error':
      return <X className="h-4 w-4 text-red-500" />;
  }
};

const getNotificationIconBg = (type: Notification['type']) => {
  switch (type) {
    case 'info':
      return 'bg-blue-100';
    case 'success':
      return 'bg-emerald-100';
    case 'warning':
      return 'bg-amber-100';
    case 'error':
      return 'bg-red-100';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// DashboardLayout component
function DashboardLayout({ children }: DashboardLayoutProps) {
  // Theme hooks
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // State management
  const [activeDelegation, setActiveDelegation] = useState<"gas" | "rebalance" | null>(null);
  const [timeframe, setTimeframe] = useState("1W");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [aiInsightType, setAiInsightType] = useState<'portfolio' | 'spending' | 'savings'>('portfolio');


  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Token Available',
      message: 'BumbleBee token is now available for trading',
      type: 'info',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: '2',
      title: 'Subscription Renewed',
      message: 'Your Premium Content Access subscription was renewed',
      type: 'success',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    }
  ]);
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: '1',
      name: 'Smart Wallet #1',
      address: '0x1a2b...3c4d',
      balance: 2450,
      token: 'XDC',
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isActive: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Effect for progress animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(66);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Modal handlers
  const handleOpenModal = useCallback((type: ModalType) => {
    setActiveModal(type);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);
  
  // Transaction handlers
  const handleViewTransactionDetails = useCallback((transaction: any) => {
    setSelectedTransaction(transaction);
    handleOpenModal('transactionDetails');
  }, [handleOpenModal]);
  
  // AI Insight handlers
  const handleViewAiInsights = useCallback((type: 'portfolio' | 'spending' | 'savings') => {
    setAiInsightType(type);
    handleOpenModal('aiInsights');
  }, [handleOpenModal]);
  
  const handleMarkAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notification => ({
      ...notification,
      read: true
    })));
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read"
    });
  }, [toast]);
  
  const handleAddWallet = useCallback((newWallet: Wallet) => {
    setWallets(prev => [...prev, newWallet]);
    toast({
      title: "Wallet Added",
      description: `${newWallet.name} has been added successfully`,
      variant: "default"
    });
    handleCloseModal();
  }, [toast, handleCloseModal]);
  
  // Memoized values
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);
  
  const totalBalance = useMemo(() => {
    return wallets.reduce((total, wallet) => total + wallet.balance, 0);
  }, [wallets]);

  // Modal components
  const WalletConnectModal = () => (
    <Dialog open={activeModal === 'walletConnect'} onOpenChange={() => activeModal === 'walletConnect' && handleCloseModal()}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-800/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-amber-500" />
            <span>Connect Wallet</span>
          </DialogTitle>
          <DialogDescription>
            Connect your wallet to access all features of the BumbleBee platform.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            {['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Trust Wallet'].map((wallet, i) => (
              <motion.div 
                key={wallet}
                className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer"
                whileHover={{ scale: 1.02, x: 5 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                onClick={() => {
                  toast({
                    title: "Wallet Connected",
                    description: `Successfully connected to ${wallet}`,
                    variant: "default"
                  });
                  handleCloseModal();
                }}
              >
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                  <Wallet className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{wallet}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Connect using {wallet}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </motion.div>
            ))}
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
          <Button 
            className={`${THEME.colors.primary.light} hover:${THEME.colors.primary.hover} text-white`}
            onClick={() => {
              toast({
                title: "Wallet Connected",
                description: "Successfully connected to MetaMask",
                variant: "default"
              });
              handleCloseModal();
            }}
          >
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const TokenSwapModal = () => (
    <Dialog open={activeModal === 'tokenSwap'} onOpenChange={() => activeModal === 'tokenSwap' && handleCloseModal()}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-800/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-blue-500" />
            <span>Swap Tokens</span>
          </DialogTitle>
          <DialogDescription>
            Swap between different tokens with the best rates.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>From</Label>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Input type="number" placeholder="0.0" className="text-lg" />
              </div>
              <Button variant="outline" className="flex items-center gap-2 min-w-[120px]">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">XDC</span>
                </div>
                <span>XDC</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <motion.div 
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRightLeft className="h-5 w-5 text-blue-500" />
            </motion.div>
          </div>
          
          <div className="space-y-2">
            <Label>To</Label>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Input type="number" placeholder="0.0" className="text-lg" disabled />
              </div>
              <Button variant="outline" className="flex items-center gap-2 min-w-[120px]">
                <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-amber-600">ETH</span>
                </div>
                <span>ETH</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Rate</span>
              <span>1 XDC = 0.00025 ETH</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-500 dark:text-gray-400">Fee</span>
              <span>0.5%</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            className={`w-full ${THEME.colors.secondary.light} hover:${THEME.colors.secondary.hover} text-white`}
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                toast({
                  title: "Swap Successful",
                  description: "Successfully swapped 100 XDC to 0.025 ETH",
                  variant: "default"
                });
                handleCloseModal();
              }, 2000);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <motion.div 
                  className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Swapping...
              </>
            ) : (
              "Swap Tokens"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const SettingsModal = () => (
    <Dialog open={activeModal === 'settings'} onOpenChange={() => activeModal === 'settings' && handleCloseModal()}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-800/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span>Settings</span>
          </DialogTitle>
          <DialogDescription>
            Customize your dashboard experience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Dark Mode</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
            </div>
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
            />
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Notification Settings</h4>
            <div className="space-y-2">
              {['Email Notifications', 'Push Notifications', 'Transaction Alerts'].map((setting) => (
                <div key={setting} className="flex items-center justify-between">
                  <span>{setting}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Gas Price Threshold</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Set the maximum gas price for automatic transactions</p>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
          <Button 
            onClick={() => {
              toast({
                title: "Settings Saved",
                description: "Your settings have been updated",
                variant: "default"
              });
              handleCloseModal();
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const NotificationsModal = () => (
    <Dialog open={activeModal === 'notifications'} onOpenChange={() => activeModal === 'notifications' && handleCloseModal()}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-800/50">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              <span>Notifications</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllNotificationsAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto py-4">
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <motion.div 
                  key={notification.id}
                  className={`p-3 rounded-lg border ${notification.read ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'} relative`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {!notification.read && (
                    <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-amber-500" />
                  )}
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-full ${notification.type === 'info' ? 'bg-blue-100 text-blue-500' : 'bg-green-100 text-green-500'}`}>
                      {notification.type === 'info' ? <Info className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const AddSubscriptionModal = () => (
    <Dialog open={activeModal === 'addSubscription'} onOpenChange={() => activeModal === 'addSubscription' && handleCloseModal()}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-800/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-500" />
            <span>Add Subscription</span>
          </DialogTitle>
          <DialogDescription>
            Set up a new recurring payment subscription.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subscription Name</Label>
            <Input id="name" placeholder="e.g. Netflix, Spotify" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Token</Label>
              <select className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3">
                <option>XDC</option>
                <option>ETH</option>
                <option>USDT</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">Billing Frequency</Label>
            <select className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">First Payment Date</Label>
            <Input id="date" type="date" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
          <Button 
            className={`${THEME.colors.accent.light} hover:${THEME.colors.accent.hover} text-white`}
            onClick={() => {
              toast({
                title: "Subscription Added",
                description: "Your new subscription has been set up",
                variant: "default"
              });
              handleCloseModal();
            }}
          >
            Add Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const CreateTabModal = () => (
    <Dialog open={activeModal === 'createTab'} onOpenChange={() => activeModal === 'createTab' && handleCloseModal()}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-800/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span>Create Social Payment Tab</span>
          </DialogTitle>
          <DialogDescription>
            Create a shared payment tab with friends or colleagues.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tabName">Tab Name</Label>
            <Input id="tabName" placeholder="e.g. Team Lunch, Trip Expenses" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="participants">Participants (comma separated)</Label>
            <Input id="participants" placeholder="Enter email addresses" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tabAmount">Initial Amount</Label>
              <Input id="tabAmount" type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tabToken">Token</Label>
              <select className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3">
                <option>XDC</option>
                <option>ETH</option>
                <option>USDT</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="splitMethod">Split Method</Label>
            <select className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3">
              <option>Equal Split</option>
              <option>Percentage Split</option>
              <option>Custom Amounts</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="notify" />
            <label htmlFor="notify" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Notify participants via email
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
          <Button 
            className={`${THEME.colors.accent.light} hover:${THEME.colors.accent.hover} text-white`}
            onClick={() => {
              toast({
                title: "Tab Created",
                description: "Your social payment tab has been created",
                variant: "default"
              });
              handleCloseModal();
            }}
          >
            Create Tab
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Render modal components
  const renderWalletConnectModal = () => {
    return (
      <Dialog open={activeModal === 'walletConnect'} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dark} max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Connect Your Wallet</DialogTitle>
            <DialogDescription>
              Choose a wallet provider to connect with Bumblebee Finance
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-between p-4 transition-all hover:scale-105"
              onClick={() => {
                toast({
                  title: "Wallet Connected",
                  description: "Successfully connected to MetaMask",
                });
                handleCloseModal();
              }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <div className="h-6 w-6 text-orange-500">
                    <Wallet className="h-5 w-5" />
                  </div>
                </div>
                <span>MetaMask</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-between p-4 transition-all hover:scale-105"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <div className="h-6 w-6 text-blue-500">
                    <Wallet className="h-5 w-5" />
                  </div>
                </div>
                <span>WalletConnect</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-between p-4 transition-all hover:scale-105"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <div className="h-6 w-6 text-blue-500">
                    <CreditCard className="h-5 w-5" />
                  </div>
                </div>
                <span>Coinbase</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-between p-4 transition-all hover:scale-105"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <div className="h-6 w-6 text-gray-500">
                    <Wallet className="h-5 w-5" />
                  </div>
                </div>
                <span>Trust Wallet</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderTokenSwapModal = () => {
    const [fromToken, setFromToken] = useState('XDC');
    const [toToken, setToToken] = useState('ETH');
    const [amount, setAmount] = useState('0.0');
    
    return (
      <Dialog open={activeModal === 'tokenSwap'} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dark} max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Swap Tokens</DialogTitle>
            <DialogDescription>
              Exchange tokens at the best rates
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>From</Label>
              <div className="flex items-center gap-2">
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XDC">XDC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="flex-1" 
                  placeholder="0.0" 
                />
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={() => {
                  setFromToken(toToken);
                  setToToken(fromToken);
                }}
              >
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>To</Label>
              <div className="flex items-center gap-2">
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XDC">XDC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input 
                  type="number" 
                  value={parseFloat(amount || '0') * 0.05} 
                  readOnly 
                  className="flex-1" 
                  placeholder="0.0" 
                />
              </div>
            </div>
            
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="flex justify-between">
                <span>Rate</span>
                <span>1 {fromToken} = 0.05 {toToken}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Fee</span>
                <span>0.1%</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button 
              className={`bg-gradient-to-r ${THEME.colors.primary.gradient} text-white`}
              onClick={() => {
                toast({
                  title: "Swap Successful",
                  description: `Swapped ${amount} ${fromToken} to ${parseFloat(amount || '0') * 0.05} ${toToken}`,
                });
                handleCloseModal();
              }}
            >
              Swap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderSettingsModal = () => {
    const [autoGasEnabled, setAutoGasEnabled] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [slippageTolerance, setSlippageTolerance] = useState(1);
    
    return (
      <Dialog open={activeModal === 'settings'} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dark} max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
            <DialogDescription>
              Customize your dashboard experience
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts about your account</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notificationsEnabled} 
                  onCheckedChange={setNotificationsEnabled} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred theme</p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-amber-500" />
                    <span>Amber</span>
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-blue-500" />
                    <span>Blue</span>
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-green-500" />
                    <span>Green</span>
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Card Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2">🌈</span>
                    <span>Gradient</span>
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2">🔍</span>
                    <span>Glass</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-gas">Auto Gas Optimization</Label>
                  <p className="text-sm text-muted-foreground">Automatically adjust gas fees for transactions</p>
                </div>
                <Switch 
                  id="auto-gas" 
                  checked={autoGasEnabled} 
                  onCheckedChange={setAutoGasEnabled} 
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slippage">Slippage Tolerance: {slippageTolerance}%</Label>
                </div>
                <Slider 
                  id="slippage" 
                  min={0.1} 
                  max={5} 
                  step={0.1} 
                  value={[slippageTolerance]} 
                  onValueChange={(value) => setSlippageTolerance(value[0])} 
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button 
              className={`bg-gradient-to-r ${THEME.colors.primary.gradient} text-white`}
              onClick={() => {
                toast({
                  title: "Settings Saved",
                  description: "Your preferences have been updated",
                });
                handleCloseModal();
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderNotificationsModal = () => {
    const markAllAsRead = () => {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      toast({
        title: "Notifications Cleared",
        description: "All notifications marked as read",
      });
    };
    
    const markAsRead = (id: string) => {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    };
    
    return (
      <Dialog open={activeModal === 'notifications'} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dark} max-w-md`}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">Notifications</DialogTitle>
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            </div>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto space-y-3 py-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg ${notification.read ? 'bg-muted/50' : THEME.glassmorphism.card} transition-all duration-300`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getNotificationIconBg(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderAddSubscriptionModal = () => {
    const [subscriptionName, setSubscriptionName] = useState('');
    const [subscriptionAmount, setSubscriptionAmount] = useState('');
    const [subscriptionFrequency, setSubscriptionFrequency] = useState('monthly');
    
    return (
      <Dialog open={activeModal === 'addSubscription'} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dark} max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Subscription</DialogTitle>
            <DialogDescription>
              Set up a recurring payment for services
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subscription Name</Label>
              <Input 
                id="name" 
                value={subscriptionName} 
                onChange={(e) => setSubscriptionName(e.target.value)} 
                placeholder="Netflix" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center gap-2">
                <Select defaultValue="XDC">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XDC">XDC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input 
                  id="amount" 
                  type="number" 
                  value={subscriptionAmount} 
                  onChange={(e) => setSubscriptionAmount(e.target.value)} 
                  className="flex-1" 
                  placeholder="0.00" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={subscriptionFrequency} onValueChange={setSubscriptionFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="auto-renew" />
              <Label htmlFor="auto-renew">Auto-renew subscription</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button 
              className={`bg-gradient-to-r ${THEME.colors.primary.gradient} text-white`}
              onClick={() => {
                toast({
                  title: "Subscription Added",
                  description: `${subscriptionName} subscription has been set up`,
                });
                handleCloseModal();
              }}
            >
              Add Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderCreateTabModal = () => {
    const [tabName, setTabName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    
    const friends = [
      { id: '1', name: 'Alex Johnson' },
      { id: '2', name: 'Maria Garcia' },
      { id: '3', name: 'John Smith' },
      { id: '4', name: 'Sarah Williams' },
    ];
    
    const toggleFriend = (id: string) => {
      setSelectedFriends(prev => 
        prev.includes(id) 
          ? prev.filter(friendId => friendId !== id)
          : [...prev, id]
      );
    };
    
    return (
      <Dialog open={activeModal === 'createTab'} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dark} max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create Social Payment Tab</DialogTitle>
            <DialogDescription>
              Split expenses with friends easily
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tab-name">Tab Name</Label>
              <Input 
                id="tab-name" 
                value={tabName} 
                onChange={(e) => setTabName(e.target.value)} 
                placeholder="Dinner at Luigi's" 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Add Friends</Label>
              <div className="space-y-2">
                {friends.map(friend => (
                  <div 
                    key={friend.id} 
                    className={`p-3 rounded-lg border ${selectedFriends.includes(friend.id) ? 'border-primary bg-primary/10' : 'border-border'} cursor-pointer transition-all duration-150`}
                    onClick={() => toggleFriend(friend.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <User2 className="h-4 w-4" />
                        </div>
                        <span>{friend.name}</span>
                      </div>
                      <Checkbox 
                        checked={selectedFriends.includes(friend.id)} 
                        onCheckedChange={() => toggleFriend(friend.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Initial Expense</Label>
              <div className="flex gap-2">
                <Input type="number" placeholder="0.00" className="flex-1" />
                <Select defaultValue="XDC">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XDC">XDC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Split Method</Label>
              <RadioGroup defaultValue="equal">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="equal" id="equal" />
                  <Label htmlFor="equal">Equal Split</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage">Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom Amounts</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button 
              className={`bg-gradient-to-r ${THEME.colors.primary.gradient} text-white`}
              onClick={() => {
                toast({
                  title: "Tab Created",
                  description: `${tabName} tab has been created with ${selectedFriends.length} friends`,
                });
                handleCloseModal();
              }}
            >
              Create Tab
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Render AI Insights Modal
  const renderAiInsightsModal = () => {
    return (
      <Dialog open={activeModal === 'aiInsights'} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dark} max-w-4xl`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              AI-Powered {aiInsightType === 'portfolio' ? 'Portfolio' : aiInsightType === 'spending' ? 'Spending' : 'Savings'} Insights
            </DialogTitle>
            <DialogDescription>
              Personalized recommendations based on your financial activity
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue={aiInsightType} onValueChange={(value) => setAiInsightType(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="spending">Spending</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="portfolio" className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full p-3 bg-blue-100">
                  <PieChart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Portfolio Rebalancing Opportunity</h3>
                  <p className="text-muted-foreground">Your portfolio is currently overexposed to XDC (45%). Consider diversifying by increasing your ETH allocation to reduce volatility.</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Info className="h-4 w-4" /> Learn More
                    </Button>
                    <Button 
                      size="sm" 
                      className={`gap-1 bg-gradient-to-r ${THEME.colors.primary.gradient} text-white`}
                      onClick={() => {
                        handleCloseModal();
                        handleOpenModal('tokenSwap');
                      }}
                    >
                      <ArrowRightLeft className="h-4 w-4" /> Rebalance Now
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <div className="rounded-full p-3 bg-emerald-100">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Growth Opportunity</h3>
                  <p className="text-muted-foreground">Based on market trends and your risk profile, consider allocating 5-10% of your portfolio to emerging DeFi protocols for higher growth potential.</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Info className="h-4 w-4" /> Learn More
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-300">Market Volatility Alert</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400">Increased market volatility expected in the next 48 hours. Consider postponing large transactions until market conditions stabilize.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="spending" className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full p-3 bg-pink-100">
                  <Activity className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Spending Pattern Analysis</h3>
                  <p className="text-muted-foreground">Your subscription spending has increased by 15% in the last month. Consider reviewing your recurring payments to identify opportunities for savings.</p>
                  <div className="mt-3 flex gap-2">
                    <Button
                     
                      size="sm" 
                      className={`gap-1 bg-gradient-to-r ${THEME.colors.secondary.gradient} text-white`}
                      onClick={() => {
                        handleCloseModal();
                        // Navigate to subscriptions page
                      }}
                    >
                      <ListChecks className="h-4 w-4" /> Review Subscriptions
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className={THEME.glassmorphism.card}>
                  <CardHeader>
                    <CardTitle className="text-base">Top Spending Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Subscriptions</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span>Entertainment</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span>Services</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={THEME.glassmorphism.card}>
                  <CardHeader>
                    <CardTitle className="text-base">Spending Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>Consolidate streaming subscriptions to save ~15 XDC/month</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>Set up auto-conversion to stablecoins for recurring payments</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>Use social payment tabs for group expenses to track shared costs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="savings" className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full p-3 bg-blue-100">
                  <PiggyBank className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Savings Optimization</h3>
                  <p className="text-muted-foreground">You could earn an additional 3.2% APY by moving your idle assets to yield-generating protocols. This could result in approximately 78 XDC additional earnings per year.</p>
                  <div className="mt-3 flex gap-2">
                    <Button 
                      size="sm" 
                      className={`gap-1 bg-gradient-to-r ${THEME.colors.success.gradient} text-white`}
                    >
                      <Sparkles className="h-4 w-4" /> Optimize Savings
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium mb-2">Savings Goals Progress</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span>Emergency Fund</span>
                      <span className="text-sm">75% Complete</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span>Vacation Fund</span>
                      <span className="text-sm">40% Complete</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add New Savings Goal
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="rounded-full p-3 bg-emerald-100">
                  <BadgeDollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Auto-Save Recommendation</h3>
                  <p className="text-muted-foreground">Enable auto-saving to automatically allocate 5% of incoming funds to your savings goals. This could help you reach your goals 30% faster.</p>
                  <div className="mt-3 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                    >
                      <Settings className="h-4 w-4 mr-2" /> Configure Auto-Save
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseModal}>Close</Button>
            <Button 
              className={`bg-gradient-to-r ${THEME.colors.primary.gradient} text-white`}
              onClick={() => {
                toast({
                  title: "Insights Applied",
                  description: "Your AI recommendations have been saved",
                });
                handleCloseModal();
              }}
            >
              Apply Recommendations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Render Transaction Details Modal
  const renderTransactionDetailsModal = () => {
    if (!selectedTransaction) return null;
    
    return (
      <Dialog open={activeModal === 'transactionDetails'} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dark} max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this transaction
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">{selectedTransaction.type}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <Badge variant={selectedTransaction.amount.startsWith('+') ? 'secondary' : 'destructive'}>
                {selectedTransaction.amount}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date</span>
              <span>{selectedTransaction.date}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={selectedTransaction.status === 'Completed' ? 'outline' : 'secondary'}>
                {selectedTransaction.status}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="text-xs text-muted-foreground">0x3a2b...8c9d</span>
            </div>
            
            <div className="rounded-lg bg-muted p-4 mt-4">
              <h4 className="font-medium mb-2">Transaction Metadata</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Gas Fee</span>
                  <span>0.002 XDC</span>
                </div>
                <div className="flex justify-between">
                  <span>Network</span>
                  <span>XDC Mainnet</span>
                </div>
                <div className="flex justify-between">
                  <span>Confirmation Blocks</span>
                  <span>38</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" className="gap-2" onClick={handleCloseModal}>
              <Activity className="h-4 w-4" /> View on Explorer
            </Button>
            <Button 
              className={`gap-2 bg-gradient-to-r ${THEME.colors.primary.gradient} text-white`}
              onClick={handleCloseModal}
            >
              <Check className="h-4 w-4" /> Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Render Create Wallet Modal
  const renderCreateWalletModal = () => {
    const [walletName, setWalletName] = useState('');
    const [walletType, setWalletType] = useState('smart');
    
    return (
      <Dialog open={activeModal === 'createWallet'} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dark} max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Wallet</DialogTitle>
            <DialogDescription>
              Set up a new wallet to manage your assets
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-name">Wallet Name</Label>
              <Input 
                id="wallet-name" 
                value={walletName} 
                onChange={(e) => setWalletName(e.target.value)} 
                placeholder="My Smart Wallet" 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Wallet Type</Label>
              <RadioGroup value={walletType} onValueChange={setWalletType}>
                <div className="flex items-start space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="smart" id="smart" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="smart" className="font-medium">Smart Wallet</Label>
                    <p className="text-sm text-muted-foreground">
                      AI-powered wallet with advanced security features and automated management
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="standard" id="standard" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="standard" className="font-medium">Standard Wallet</Label>
                    <p className="text-sm text-muted-foreground">
                      Basic wallet with manual control over all transactions
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="multisig" id="multisig" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="multisig" className="font-medium">Multi-Signature Wallet</Label>
                    <p className="text-sm text-muted-foreground">
                      Requires multiple signatures to authorize transactions
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Security Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="recovery" defaultChecked />
                  <Label htmlFor="recovery">Enable social recovery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="limits" />
                  <Label htmlFor="limits">Set spending limits</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="2fa" defaultChecked />
                  <Label htmlFor="2fa">Enable 2FA for transactions</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button 
              className={`bg-gradient-to-r ${THEME.colors.primary.gradient} text-white`}
              onClick={() => {
                const newWallet = {
                  id: `${wallets.length + 1}`,
                  name: walletName || `Smart Wallet #${wallets.length + 1}`,
                  address: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
                  balance: 0,
                  token: 'XDC',
                  lastActivity: new Date(),
                  isActive: true
                };
                
                handleAddWallet(newWallet);
                toast({
                  title: "Wallet Created",
                  description: `${newWallet.name} has been created successfully`,
                });
                handleCloseModal();
              }}
            >
              Create Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      {/* Modals */}
      {renderWalletConnectModal()}
      {renderTokenSwapModal()}
      {renderSettingsModal()}
      {renderNotificationsModal()}
      {renderAddSubscriptionModal()}
      {renderCreateTabModal()}
      {renderAiInsightsModal()}
      {renderTransactionDetailsModal()}
      {renderCreateWalletModal()}
      
      <Sidebar defaultCollapsed={false}>
        <DashboardSidebar />
        <SidebarInset>
        <motion.div
          className="flex-1 p-4 md:p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background gradient orbs for visual effect */}
          <div className="fixed inset-0 overflow-hidden -z-10 opacity-30 pointer-events-none">
            <div className="absolute top-0 -left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10">
            {/* Header with notifications and settings */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <motion.h1 
                  className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Welcome to Bumblebee
                </motion.h1>
                <motion.p 
                  className="text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Your AI-powered social finance dashboard
                </motion.p>
              </div>
              
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="relative" 
                        onClick={() => handleOpenModal('notifications')}
                      >
                        <Bell className="h-5 w-5" />
                        {unreadNotificationsCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">
                            {unreadNotificationsCount}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notifications</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenModal('settings')}
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2 bg-white/10 backdrop-blur-sm border-white/20 flex items-center gap-2"
                  onClick={() => handleOpenModal('walletConnect')}
                >
                  <Wallet className="h-4 w-4 text-amber-500" />
                  <span>Connect</span>
                </Button>
              </div>
            </div>
            </div>
            

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatBox
                title="Portfolio Value"
                value={`${totalBalance} XDC`}
                icon={PiggyBank}
                gradient={THEME.colors.primary.gradient}
                trend={{ value: 5.2, isPositive: true }}
                index={0}
              />
              <StatBox
                title="Active Subscriptions"
                value="2"
                icon={ListChecks}
                gradient={THEME.colors.secondary.gradient}
                index={1}
              />
              <StatBox
                title="Group Tabs"
                value="2 Active"
                icon={Users}
                gradient={THEME.colors.success.gradient}
                index={2}
              />
              <StatBox
                title="AI Suggestions"
                value="3 New"
                icon={MessageSquare}
                gradient={THEME.colors.accent.gradient}
                trend={{ value: 2, isPositive: true }}
                index={3}
              />
            </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Portfolio Overview */}
              <Card 
                title="Portfolio Overview" 
                variant="glass" 
                icon={<PiggyBank className="h-5 w-5 text-blue-500" />}
              >
                <div className="flex justify-between mb-4">
                  <div>
                    <motion.h4 
                      className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      2,450 XDC
                    </motion.h4>
                    <span className="text-green-500 text-sm font-medium flex items-center">
                      <motion.div
                        initial={{ rotate: -45 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ArrowUpRight className="h-3 w-3 mr-1 inline" />
                      </motion.div>
                      +5.2% (24h)
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Tabs defaultValue={timeframe} className="w-auto">
                      <TabsList className="bg-white/20 backdrop-blur-sm">
                        {["1D", "1W", "1M", "1Y"].map((t) => (
                          <TabsTrigger 
                            key={t} 
                            value={t}
                            onClick={() => setTimeframe(t)}
                            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                          >
                            {t}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                <PortfolioChart />
                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group"
                  >
                    <motion.div 
                      className="mr-1"
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRightLeft className="h-4 w-4 text-blue-500 group-hover:text-blue-600" />
                    </motion.div>
                    <span className="text-blue-500 group-hover:text-blue-600">Swap Tokens</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group"
                  >
                    <span className="text-blue-500 group-hover:text-blue-600">View Details</span>
                    <motion.div 
                      className="ml-1"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
                    >
                      <ArrowUpRight className="h-4 w-4 text-blue-500 group-hover:text-blue-600" />
                    </motion.div>
                  </Button>
                </div>
              </Card>

              {/* AI Smart Wallet */}
              <Card 
                title="AI Smart Wallet" 
                variant="gradient" 
                icon={<Wallet className="h-5 w-5 text-white" />}
                className="relative overflow-hidden"
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>
                
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-3"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Wallet className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-white">Smart Wallet #1</h4>
                    <p className="text-sm text-white/80">Last action: 2 hours ago</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {smartWalletAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Alert className="py-2 bg-white/20 backdrop-blur-sm border-white/20 text-white">
                        <AlertTitle className="text-sm font-medium">
                          {alert.type === "info" ? "Information" : "Success"}
                        </AlertTitle>
                        <AlertDescription className="text-sm text-white/80">
                          {alert.message}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  ))}
                </div>

                {/* Delegation Card */}
                <div className="mb-4 p-4 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 shadow-inner">
                  <div className="flex items-center mb-2">
                    <motion.div 
                      className="mr-2 p-2 bg-white/20 rounded-full"
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BadgeDollarSign className="h-5 w-5 text-white" />
                    </motion.div>
                    <h4 className="font-medium text-white text-lg">Delegation Settings</h4>
                  </div>
                  <p className="text-sm text-white/80 mb-4">Delegate specific actions to your AI agent</p>
                  <div className="space-y-3">
                    <motion.div
                      className={`p-3 rounded-lg cursor-pointer backdrop-blur-sm ${activeDelegation === 'gas' ? 'bg-blue-500/30 border border-blue-300/30' : 'bg-white/10 border border-white/10'}`}
                      onClick={() => setActiveDelegation(activeDelegation === 'gas' ? null : 'gas')}
                      whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300,
                        delay: 0.1, 
                        duration: 0.5 
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="mr-2 p-1.5 rounded-full bg-white/20">
                            <Activity className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium text-sm text-white">Auto Gas Management</span>
                        </div>
                        <Badge variant={activeDelegation === 'gas' ? 'default' : 'outline'} className={activeDelegation === 'gas' ? 'bg-green-500 hover:bg-green-600 text-white' : 'text-white/70 border-white/20'}>
                          {activeDelegation === 'gas' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </motion.div>
                    <motion.div
                      className={`p-3 rounded-lg cursor-pointer backdrop-blur-sm ${activeDelegation === 'rebalance' ? 'bg-blue-500/30 border border-blue-300/30' : 'bg-white/10 border border-white/10'}`}
                      onClick={() => setActiveDelegation(activeDelegation === 'rebalance' ? null : 'rebalance')}
                      whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300,
                        delay: 0.2, 
                        duration: 0.5 
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="mr-2 p-1.5 rounded-full bg-white/20">
                            <ArrowRightLeft className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium text-sm text-white">Portfolio Rebalancing</span>
                        </div>
                        <Badge variant={activeDelegation === 'rebalance' ? 'default' : 'outline'} className={activeDelegation === 'rebalance' ? 'bg-green-500 hover:bg-green-600 text-white' : 'text-white/70 border-white/20'}>
                          {activeDelegation === 'rebalance' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </motion.div>
                  </div>
                </div>
                <Button 
                  className="w-full mt-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/20 shadow-lg group relative overflow-hidden"
                  variant="outline"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
                  />
                  <motion.div
                    className="flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    <span className="font-medium">Manage Smart Wallet</span>
                  </motion.div>
                </Button>
              </Card>

              {/* Recent Activity */}
              <Card 
                title="Recent Activity" 
                variant="glass"
                icon={<Activity className="h-5 w-5 text-blue-500" />}
              >
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <motion.div 
                            className="bg-blue-100/20 backdrop-blur-sm rounded-full p-2 mr-3"
                            whileHover={{ rotate: 15 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Activity className="h-4 w-4 text-blue-500" />
                          </motion.div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-100">{activity.type}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <motion.p 
                            className={activity.amount.startsWith('+') ? 'text-green-500 font-medium' : 'text-gray-700 dark:text-gray-300 font-medium'}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            {activity.amount}
                          </motion.p>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200/20">
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  className="mt-4 w-full text-blue-500 hover:text-blue-600 hover:bg-blue-50/10 group"
                >
                  <span>View All Activity</span>
                  <motion.div 
                    className="ml-1"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
                  >
                    <ArrowUpRight className="h-4 w-4 inline" />
                  </motion.div>
                </Button>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Subscriptions */}
              <Card title="Subscription Management">
                <div className="space-y-3 mb-4">
                  {subscriptions.map((sub) => (
                    <motion.div
                      key={sub.id}
                      className="p-3 border rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{sub.name}</h4>
                        <span className="text-gray-500 text-sm">{sub.amount}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{sub.frequency}</span>
                        <span>Next: {sub.nextPayment}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  className="w-full py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg flex items-center justify-center text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add New Subscription
                </motion.button>
              </Card>

              {/* Social Payment Tabs */}
              <Card title="Social Payment Tabs">
                <div className="space-y-3 mb-4">
                  {groupTabs.map((tab) => (
                    <motion.div
                      key={tab.id}
                      className="p-3 border rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{tab.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          tab.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tab.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{tab.participants} participants</span>
                        <span className="font-medium">{tab.outstandingAmount}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  className="w-full py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg flex items-center justify-center text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Create New Tab
                </motion.button>
              </Card>

              {/* Learning Resources */}
              <Card title="Blockchain Education">
                <div className="space-y-3">
                  <motion.div
                    className="flex items-center p-3 bg-blue-50 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <PlayCircle className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <h4 className="font-medium">DeFi Fundamentals</h4>
                      <p className="text-sm text-gray-500">Beginner-friendly introduction</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center p-3 bg-purple-50 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <BookOpen className="h-8 w-8 text-purple-500 mr-3" />
                    <div>
                      <h4 className="font-medium">ERC-7715 Explained</h4>
                      <p className="text-sm text-gray-500">Learn about subscription standards</p>
                    </div>
                  </motion.div>
                </div>
                <motion.div
                  className="mt-4 flex items-center justify-center text-sm font-medium text-blue-500"
                  whileHover={{ scale: 1.05 }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask the AI Assistant
                </motion.div>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  className="bg-blue-500 text-white p-3 rounded-lg flex flex-col items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRightLeft className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium">Swap Tokens</span>
                </motion.button>
                <motion.button
                  className="bg-purple-500 text-white p-3 rounded-lg flex flex-col items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium">Create Tab</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </SidebarInset>
    </Sidebar>
    </>
  );
}

export default DashboardLayout;