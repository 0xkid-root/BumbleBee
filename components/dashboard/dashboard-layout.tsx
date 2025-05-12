"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
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
  PieChart,
} from "lucide-react";
import { DashboardSidebar } from "./sidebar";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";

// Theme constants for consistent styling
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
      gradient: "from-amber-500 via-yellow-500 to-amber-400",
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

// Dummy data
const portfolioData = [
  { name: "XDC", value: 45 },
  { name: "ETH", value: 30 },
  { name: "BTC", value: 15 },
  { name: "Others", value: 10 },
];

const recentActivity = [
  { id: 1, type: "Subscription Payment", amount: "-25 XDC", date: "Today", status: "Completed" },
  { id: 2, type: "Group Tab Settlement", amount: "+120 XDC", date: "Yesterday", status: "Completed" },
  { id: 3, type: "Token Swap", amount: "-50 XDC", date: "May 10", status: "Completed" },
];

const smartWalletAlerts = [
  { id: 1, message: "Low gas detected - Added funds automatically", type: "info" },
  { id: 2, message: "Portfolio rebalanced based on market conditions", type: "success" },
];

const subscriptions = [
  { id: 1, name: "Premium Content Access", amount: "25 XDC", frequency: "Monthly", nextPayment: "Jun 12" },
  { id: 2, name: "DeFi Analytics Tool", amount: "50 XDC", frequency: "Monthly", nextPayment: "May 20" },
];

const groupTabs = [
  { id: 1, name: "Team Lunch", participants: 5, outstandingAmount: "120 XDC", status: "Active" },
  { id: 2, name: "Shared Subscription", participants: 3, outstandingAmount: "45 XDC", status: "Pending" },
];

// Card component
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "glass" | "accent";
  icon?: React.ReactNode;
}

function Card({ title = "", children, className = "", variant = "default", icon }: CardProps) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
  }, [controls]);

  const getCardStyle = () => {
    switch (variant) {
      case "gradient":
        return `bg-gradient-to-br ${THEME.colors.primary.gradient} text-white`;
      case "glass":
        return THEME.glassmorphism.card;
      case "accent":
        return `bg-gradient-to-r ${THEME.colors.accent.gradient} text-white`;
      default:
        return "bg-white dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      className={cn(
        `rounded-xl p-5 shadow-md ${THEME.animation.transition.default} ${getCardStyle()}`,
        className
      )}
      role="region"
      aria-label={title}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {icon && (
            <motion.div
              className="mr-3 p-2 bg-white/20 rounded-full"
              whileHover={{ rotate: 15 }}
              transition={THEME.motionPresets.transition}
            >
              {icon}
            </motion.div>
          )}
          <h3 className={cn(
            "text-lg font-medium",
            variant === "default" ? "text-gray-800 dark:text-gray-100" : "text-white"
          )}>{title}</h3>
        </div>
        <motion.div whileHover={{ scale: 1.2, rotate: 5 }} className="opacity-70 hover:opacity-100">
          <Sparkles className="h-4 w-4" />
        </motion.div>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}

// StatBox component
interface StatBoxProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient?: string;
  trend?: { value: number; isPositive: boolean };
  index?: number;
}

const StatBox: React.FC<StatBoxProps> = ({
  title,
  value,
  icon: IconComponent,
  gradient = THEME.colors.primary.gradient,
  trend,
  index = 0,
}) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    });
  }, [controls, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      whileHover={{ scale: 1.05 }}
      className={cn(
        `rounded-xl p-5 shadow-md backdrop-blur-sm ${THEME.animation.transition.default} bg-gradient-to-br ${gradient} text-white`
      )}
      role="region"
      aria-label={title}
    >
      <div className="flex items-center">
        <motion.div
          className="p-3 rounded-full mr-4 bg-white/20"
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={THEME.motionPresets.transition}
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
};

// PortfolioChart component
const PortfolioChart = () => {
  const chartColors = [
    THEME.colors.secondary.gradient,
    THEME.colors.accent.gradient,
    THEME.colors.success.gradient,
    THEME.colors.warning.gradient,
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
              stiffness: 50,
            }}
          >
            <motion.div
              className={`w-full h-full rounded-t-xl bg-gradient-to-t ${chartColors[i % chartColors.length]} relative overflow-hidden`}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ y: ["100%", "-100%"] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2,
                  ease: "linear",
                }}
              />
            </motion.div>
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {item.name}: {item.value}%
            </div>
            <p className="text-xs font-medium text-center mt-2">{item.name}</p>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        {portfolioData.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${chartColors[i % chartColors.length]} mr-1`}></div>
            <span className="text-xs">{item.name} ({item.value}%)</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Modal types
type ModalType =
  | "walletConnect"
  | "tokenSwap"
  | "settings"
  | "notifications"
  | "addSubscription"
  | "createTab"
  | "createWallet"
  | "aiInsights"
  | "transactionDetails";

// Notification type
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
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

// Modal Components - Placeholder components for UI structure
const WalletConnectModal = () => {
  return null;
};

const TokenSwapModal = () => {
  return null;
};

const SettingsModal = () => {
  return null;
};

const NotificationsModal = () => {
  return null;
};

const AddSubscriptionModal = () => {
  return null;
};

const CreateTabModal = () => {
  return null;
};

const AiInsightsModal = () => {
  return null;
};

const TransactionDetailsModal = () => {
  return null;
};

const CreateWalletModal = () => {
  return null;
};

// DashboardLayout component
function DashboardLayout() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // State management
  const [activeDelegation, setActiveDelegation] = useState<"gas" | "rebalance" | null>(null);
  const [timeframe, setTimeframe] = useState("1W");
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [aiInsightType, setAiInsightType] = useState<"portfolio" | "spending" | "savings">("portfolio");
  const [notifications, setNotifications] = useState<Notification[]>([
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
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: "1",
      name: "Smart Wallet #1",
      address: "0x1a2b...3c4d",
      balance: 2450,
      token: "XDC",
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isActive: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Refs for accessibility
  const mainContentRef = useRef<HTMLElement>(null);

  // Effect for progress animation
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  // Focus main content on mount for accessibility
  useEffect(() => {
    mainContentRef.current?.focus();
  }, []);

  // Modal handlers
  const handleOpenModal = useCallback((type: ModalType) => {
    setActiveModal(type);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Transaction handlers
  const handleViewTransactionDetails = useCallback(
    (transaction: any) => {
      setSelectedTransaction(transaction);
      handleOpenModal("transactionDetails");
    },
    [handleOpenModal]
  );

  // AI Insight handlers
  const handleViewAiInsights = useCallback(
    (type: "portfolio" | "spending" | "savings") => {
      setAiInsightType(type);
      handleOpenModal("aiInsights");
    },
    [handleOpenModal]
  );

  const handleMarkAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read",
    });
  }, [toast]);

  const handleAddWallet = useCallback(
    (newWallet: Wallet) => {
      setWallets((prev) => [...prev, newWallet]);
      toast({
        title: "Wallet Added",
        description: `${newWallet.name} has been added successfully`,
      });
      handleCloseModal();
    },
    [toast, handleCloseModal]
  );

  // Memoized values
  const unreadNotificationsCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const totalBalance = useMemo(
    () => wallets.reduce((total, wallet) => total + wallet.balance, 0),
    [wallets]
  );

  // Notification helpers
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

  // Modal components
  const WalletConnectModal = () => (
    <Dialog open={activeModal === "walletConnect"} onOpenChange={handleCloseModal}>
      <DialogContent className={`${THEME.glassmorphism.dialog} sm:max-w-md`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-amber-500" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Connect your wallet to access BumbleBee features.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {["MetaMask", "WalletConnect", "Coinbase Wallet", "Trust Wallet"].map((wallet, i) => (
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
                });
                handleCloseModal();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
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
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
          <Button
            className={`${THEME.colors.primary.light} ${THEME.colors.primary.hover} text-white`}
            onClick={() => {
              toast({
                title: "Wallet Connected",
                description: "Successfully connected to MetaMask",
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

  const TokenSwapModal = () => {
    const [fromToken, setFromToken] = useState("XDC");
    const [toToken, setToToken] = useState("ETH");
    const [amount, setAmount] = useState("");

    return (
      <Dialog open={activeModal === "tokenSwap"} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dialog} sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-blue-500" />
              Swap Tokens
            </DialogTitle>
            <DialogDescription>Swap between different tokens with the best rates.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="from-token">From</Label>
              <div className="flex items-center space-x-2">
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger id="from-token" className="w-[120px]">
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
                  placeholder="0.0"
                  className="text-lg"
                  aria-label="Amount to swap"
                />
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
              <Label htmlFor="to-token">To</Label>
              <div className="flex items-center space-x-2">
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger id="to-token" className="w-[120px]">
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
                  value={amount ? (parseFloat(amount) * 0.05).toFixed(4) : ""}
                  disabled
                  placeholder="0.0"
                  className="text-lg"
                  aria-label="Received amount"
                />
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Rate</span>
                <span>1 {fromToken} = 0.05 {toToken}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-500 dark:text-gray-400">Fee</span>
                <span>0.1%</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className={`w-full ${THEME.colors.secondary.light} ${THEME.colors.secondary.hover} text-white`}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  toast({
                    title: "Swap Successful",
                    description: `Swapped ${amount} ${fromToken} to ${(parseFloat(amount) * 0.05).toFixed(4)} ${toToken}`,
                  });
                  handleCloseModal();
                }, 2000);
              }}
              disabled={isLoading || !amount}
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
  };

  const SettingsModal = () => {
    const [autoGasEnabled, setAutoGasEnabled] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [slippageTolerance, setSlippageTolerance] = useState(1);

    return (
      <Dialog open={activeModal === "settings"} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dialog} sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              Settings
            </DialogTitle>
            <DialogDescription>Customize your dashboard experience.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="general" className="py-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive account alerts</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  aria-label="Toggle notifications"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred theme</p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme" className="w-[140px]">
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
            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-amber-500" />
                    Amber
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-blue-500" />
                    Blue
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-green-500" />
                    Green
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Card Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2">🌈</span>
                    Gradient
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2">🔍</span>
                    Glass
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-gas">Auto Gas Optimization</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Adjust gas fees automatically</p>
                </div>
                <Switch
                  id="auto-gas"
                  checked={autoGasEnabled}
                  onCheckedChange={setAutoGasEnabled}
                  aria-label="Toggle auto gas optimization"
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
                  aria-label="Slippage tolerance"
                />
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={() => {
                toast({
                  title: "Settings Saved",
                  description: "Your settings have been updated",
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

  const NotificationsModal = () => {
    const markAsRead = (id: string) => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    };

    return (
      <Dialog open={activeModal === "notifications"} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dialog} sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-500" />
                Notifications
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
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${notification.read ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800"} relative cursor-pointer`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={() => markAsRead(notification.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && markAsRead(notification.id)}
                    >
                      {!notification.read && (
                        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-amber-500" />
                      )}
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-full ${getNotificationIconBg(notification.type)}`}>
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
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const AddSubscriptionModal = () => {
    const [subscriptionName, setSubscriptionName] = useState("");
    const [subscriptionAmount, setSubscriptionAmount] = useState("");
    const [subscriptionFrequency, setSubscriptionFrequency] = useState("monthly");
    const [token, setToken] = useState("XDC");

    return (
      <Dialog open={activeModal === "addSubscription"} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dialog} sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-500" />
              Add Subscription
            </DialogTitle>
            <DialogDescription>Set up a new recurring payment subscription.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subscription Name</Label>
              <Input
                id="name"
                value={subscriptionName}
                onChange={(e) => setSubscriptionName(e.target.value)}
                placeholder="e.g. Netflix, Spotify"
                aria-required="true"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={subscriptionAmount}
                  onChange={(e) => setSubscriptionAmount(e.target.value)}
                  placeholder="0.00"
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Select value={token} onValueChange={setToken}>
                  <SelectTrigger id="token">
                    <SelectValue placeholder="Select token" />
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
              <Label htmlFor="frequency">Billing Frequency</Label>
              <Select value={subscriptionFrequency} onValueChange={setSubscriptionFrequency}>
                <SelectTrigger id="frequency">
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
              <Label htmlFor="date">First Payment Date</Label>
              <Input id="date" type="date" aria-required="true" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="auto-renew" defaultChecked />
              <Label htmlFor="auto-renew">Auto-renew subscription</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button
              className={`${THEME.colors.accent.light} ${THEME.colors.accent.hover} text-white`}
              onClick={() => {
                if (!subscriptionName || !subscriptionAmount) {
                  toast({
                    title: "Error",
                    description: "Please fill in all required fields",
                    variant: "destructive",
                  });
                  return;
                }
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

  const CreateTabModal = () => {
    const [tabName, setTabName] = useState("");
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [amount, setAmount] = useState("");
    const [token, setToken] = useState("XDC");
    const [splitMethod, setSplitMethod] = useState("equal");

    const friends = [
      { id: "1", name: "Alex Johnson" },
      { id: "2", name: "Maria Garcia" },
      { id: "3", name: "John Smith" },
      { id: "4", name: "Sarah Williams" },
    ];

    const toggleFriend = (id: string) => {
      setSelectedFriends((prev) =>
        prev.includes(id) ? prev.filter((friendId) => friendId !== id) : [...prev, id]
      );
    };

    return (
      <Dialog open={activeModal === "createTab"} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dialog} sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Create Social Payment Tab
            </DialogTitle>
            <DialogDescription>Create a shared payment tab with friends or colleagues.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tabName">Tab Name</Label>
              <Input
                id="tabName"
                value={tabName}
                onChange={(e) => setTabName(e.target.value)}
                placeholder="e.g. Team Lunch, Trip Expenses"
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <Label>Add Friends</Label>
              <div className="space-y-2 max-h-40 overflow-auto">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className={`p-3 rounded-lg border ${selectedFriends.includes(friend.id) ? "border-primary bg-primary/10" : "border-border"} cursor-pointer`}
                    onClick={() => toggleFriend(friend.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && toggleFriend(friend.id)}
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
                        aria-label={`Select ${friend.name}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tabAmount">Initial Amount</Label>
              <div className="flex gap-2">
                <Input
                  id="tabAmount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  aria-required="true"
                />
                <Select value={token} onValueChange={setToken}>
                  <SelectTrigger id="tabToken" className="w-[100px]">
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
              <RadioGroup value={splitMethod} onValueChange={setSplitMethod}>
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
            <div className="flex items-center space-x-2">
              <Checkbox id="notify" />
              <Label htmlFor="notify">Notify participants via email</Label>
           AC</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button
              className={`${THEME.colors.accent.light} ${THEME.colors.accent.hover} text-white`}
              onClick={() => {
                if (!tabName || !amount || selectedFriends.length === 0) {
                  toast({
                    title: "Error",
                    description: "Please fill in all required fields and select at least one friend",
                    variant: "destructive",
                  });
                  return;
                }
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

  const AiInsightsModal = () => (
    <Dialog open={activeModal === "aiInsights"} onOpenChange={handleCloseModal}>
      <DialogContent className={`${THEME.glassmorphism.dialog} max-w-4xl`}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            AI-Powered {aiInsightType.charAt(0).toUpperCase() + aiInsightType.slice(1)} Insights
          </DialogTitle>
          <DialogDescription>Personalized recommendations based on your financial activity.</DialogDescription>
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
                <p className="text-muted-foreground">
                  Your portfolio is overexposed to XDC (45%). Consider increasing ETH allocation to reduce volatility.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Info className="h-4 w-4" /> Learn More
                  </Button>
                  <Button
                    size="sm"
                    className={`gap-1 ${THEME.colors.primary.light} ${THEME.colors.primary.hover} text-white`}
                    onClick={() => {
                      handleCloseModal();
                      handleOpenModal("tokenSwap");
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
                <p className="text-muted-foreground">
                  Allocate 5-10% to DeFi protocols for higher growth potential based on market trends.
                </p>
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
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Increased volatility expected in the next 48 hours. Postpone large transactions.
                  </p>
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
                <p className="text-muted-foreground">
                  Subscription spending increased by 15%. Review recurring payments to save.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className={`gap-1 ${THEME.colors.secondary.light} ${THEME.colors.secondary.hover} text-white`}
                    onClick={() => handleCloseModal()}
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
                      <span>Use social payment tabs for group expenses</span>
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
                <p className="text-muted-foreground">
                  Earn 3.2% APY by moving idle assets to yield-generating protocols (~78 XDC/year).
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className={`gap-1 ${THEME.colors.success.light} ${THEME.colors.success.hover} text-white`}
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
                <p className="text-muted-foreground">
                  Auto-save 5% of incoming funds to reach goals 30% faster.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" /> Configure Auto-Save
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={handleCloseModal}>Close</Button>
          <Button
            className={`${THEME.colors.primary.light} ${THEME.colors.primary.hover} text-white`}
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

  const TransactionDetailsModal = () => {
    if (!selectedTransaction) return null;

    return (
      <Dialog open={activeModal === "transactionDetails"} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dialog} sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Transaction Details</DialogTitle>
            <DialogDescription>Complete information about this transaction.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">{selectedTransaction.type}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <Badge variant={selectedTransaction.amount.startsWith("+") ? "secondary" : "destructive"}>
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
              <Badge variant={selectedTransaction.status === "Completed" ? "outline" : "secondary"}>
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
              className={`gap-2 ${THEME.colors.primary.light} ${THEME.colors.primary.hover} text-white`}
              onClick={handleCloseModal}
            >
              <Check className="h-4 w-4" /> Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const CreateWalletModal = () => {
    const [walletName, setWalletName] = useState("");
    const [walletType, setWalletType] = useState("smart");

    return (
      <Dialog open={activeModal === "createWallet"} onOpenChange={handleCloseModal}>
        <DialogContent className={`${THEME.glassmorphism.dialog} sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Wallet</DialogTitle>
            <DialogDescription>Set up a new wallet to manage your assets.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-name">Wallet Name</Label>
              <Input
                id="wallet-name"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="My Smart Wallet"
                aria-required="true"
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
                      AI-powered with advanced security and automation
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="standard" id="standard" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="standard" className="font-medium">Standard Wallet</Label>
                    <p className="text-sm text-muted-foreground">
                      Basic wallet with manual transaction control
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="multisig" id="multisig" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="multisig" className="font-medium">Multi-Signature Wallet</Label>
                    <p className="text-sm text-muted-foreground">
                      Requires multiple signatures for transactions
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
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button
              className={`${THEME.colors.primary.light} ${THEME.colors.primary.hover} text-white`}
              onClick={() => {
                if (!walletName) {
                  toast({
                    title: "Error",
                    description: "Wallet name is required",
                    variant: "destructive",
                  });
                  return;
                }
                const newWallet: Wallet = {
                  id: `${wallets.length + 1}`,
                  name: walletName || `Smart Wallet #${wallets.length + 1}`,
                  address: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
                  balance: 0,
                  token: "XDC",
                  lastActivity: new Date(),
                  isActive: true,
                };
                handleAddWallet(newWallet);
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
      <WalletConnectModal />
      <TokenSwapModal />
      <SettingsModal />
      <NotificationsModal />
      <AddSubscriptionModal />
      <CreateTabModal />
      <AiInsightsModal />
      <TransactionDetailsModal />
      <CreateWalletModal />

      <Sidebar defaultCollapsed={false}>
        <DashboardSidebar />
        <SidebarInset>
          <motion.main
            ref={mainContentRef}
            className="flex-1 p-4 md:p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            tabIndex={-1}
            aria-label="Dashboard content"
          >
            {/* Background decorative orbs */}
            <div className="fixed inset-0 overflow-hidden -z-10 opacity-20 pointer-events-none">
              <div className="absolute top-0 -left-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
              <div className="absolute top-0 -right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute -bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <motion.h1
                    className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Welcome to Bumblebee
                  </motion.h1>
                  <motion.p
                    className="text-gray-500 dark:text-gray-400 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Your AI-powered social finance dashboard
                    <Badge variant="secondary">Beta</Badge>
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
                          onClick={() => handleOpenModal("notifications")}
                          aria-label={`Notifications, ${unreadNotificationsCount} unread`}
                        >
                          <Bell className="h-5 w-5" />
                          {unreadNotificationsCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">
                              {unreadNotificationsCount}
                            </span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Notifications</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal("settings")}
                          aria-label="Open settings"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Settings</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative"
                          onClick={() => handleOpenModal("createWallet")}
                        >
                          <PiggyBank className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Create Wallet</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${THEME.glassmorphism.card} flex items-center gap-2`}
                    onClick={() => handleOpenModal("walletConnect")}
                    aria-label="Connect wallet"
                  >
                    <Wallet className="h-4 w-4 text-amber-500" />
                    Connect
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatBox
                  title="Portfolio Value"
                  value={`${totalBalance.toLocaleString()} XDC`}
                  icon={PiggyBank}
                  gradient={THEME.colors.primary.gradient}
                  trend={{ value: 5.2, isPositive: true }}
                  index={0}
                />
                <StatBox
                  title="Active Subscriptions"
                  value={`${subscriptions.length}`}
                  icon={ListChecks}
                  gradient={THEME.colors.secondary.gradient}
                  index={1}
                />
                <StatBox
                  title="Group Tabs"
                  value={`${groupTabs.length} Active`}
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
                          {totalBalance.toLocaleString()} XDC
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
                      <Tabs defaultValue={timeframe} className="w-auto">
                        <TabsList className={THEME.glassmorphism.card}>
                          {["1D", "1W", "1M", "1Y"].map((t) => (
                            <TabsTrigger
                              key={t}
                              value={t}
                              onClick={() => setTimeframe(t)}
                              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                              aria-label={`View portfolio for ${t}`}
                            >
                              {t}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </div>
                    <PortfolioChart />
                    <div className="mt-4 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="group"
                        onClick={() => handleOpenModal("tokenSwap")}
                        aria-label="Swap tokens"
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
                        aria-label="View portfolio details"
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
                    icon={<Zap className="h-5 w-5 text-white" />}
                  >
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-white/80">Active Wallet</p>
                          <h4 className="text-xl font-bold">{wallets[0]?.name}</h4>
                          <p className="text-sm text-white/60">{wallets[0]?.address}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/20 text-white hover:bg-white/30"
                          onClick={() => handleOpenModal("createWallet")}
                          aria-label="Create new wallet"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          New Wallet
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/80">Auto-Gas Optimization</span>
                          <Switch
                            checked={activeDelegation === "gas"}
                            onCheckedChange={(checked) =>
                              setActiveDelegation(checked ? "gas" : null)
                            }
                            aria-label="Toggle auto-gas optimization"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/80">Auto-Rebalancing</span>
                          <Switch
                            checked={activeDelegation === "rebalance"}
                            onCheckedChange={(checked) =>
                              setActiveDelegation(checked ? "rebalance" : null)
                            }
                            aria-label="Toggle auto-rebalancing"
                          />
                        </div>
                      </div>
                      <AnimatePresence>
                        {smartWalletAlerts.map((alert) => (
                          <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="rounded-lg p-3 bg-white/20"
                          >
                            <Alert variant={alert.type as any}>
                              <AlertDescription className="text-white">
                                {alert.message}
                              </AlertDescription>
                            </Alert>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <Button
                        className={`w-full ${THEME.colors.success.light} ${THEME.colors.success.hover} text-white`}
                        onClick={() => handleViewAiInsights("portfolio")}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        View AI Insights
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card
                    title="Recent Activity"
                    variant="glass"
                    icon={<Activity className="h-5 w-5 text-purple-500" />}
                  >
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 cursor-pointer"
                            onClick={() => handleViewTransactionDetails(activity)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleViewTransactionDetails(activity)
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <Activity className="h-4 w-4 text-purple-500" />
                              </div>
                              <div>
                                <p className="font-medium">{activity.type}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {activity.date}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={cn(
                                  "font-medium",
                                  activity.amount.startsWith("+")
                                    ? "text-green-500"
                                    : "text-red-500"
                                )}
                              >
                                {activity.amount}
                              </p>
                              <Badge variant="outline">{activity.status}</Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        aria-label="View all transactions"
                      >
                        View All Transactions
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {/* Subscriptions */}
                  <Card
                    title="Subscriptions"
                    variant="glass"
                    icon={<CreditCard className="h-5 w-5 text-pink-500" />}
                  >
                    <CardContent>
                      <div className="space-y-4">
                        {subscriptions.map((sub, index) => (
                          <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/30">
                                <CreditCard className="h-4 w-4 text-pink-500" />
                              </div>
                              <div>
                                <p className="font-medium">{sub.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Next: {sub.nextPayment}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{sub.amount}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {sub.frequency}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => handleOpenModal("addSubscription")}
                        aria-label="Add new subscription"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subscription
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Group Tabs */}
                  <Card
                    title="Group Tabs"
                    variant="glass"
                    icon={<Users className="h-5 w-5 text-teal-500" />}
                  >
                    <CardContent>
                      <div className="space-y-4">
                        {groupTabs.map((tab, index) => (
                          <motion.div
                            key={tab.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30">
                                <Users className="h-4 w-4 text-teal-500" />
                              </div>
                              <div>
                                <p className="font-medium">{tab.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {tab.participants} Participants
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{tab.outstandingAmount}</p>
                              <Badge variant={tab.status === "Active" ? "default" : "secondary"}>
                                {tab.status}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => handleOpenModal("createTab")}
                        aria-label="Create new group tab"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Tab
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card
                    title="Quick Actions"
                    variant="glass"
                    icon={<Zap className="h-5 w-5 text-amber-500" />}
                  >
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => handleOpenModal("tokenSwap")}
                          aria-label="Swap tokens"
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                          Swap
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => handleViewAiInsights("portfolio")}
                          aria-label="View AI insights"
                        >
                          <Sparkles className="h-4 w-4" />
                          AI Insights
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => handleOpenModal("createWallet")}
                          aria-label="Create wallet"
                        >
                          <Wallet className="h-4 w-4" />
                          New Wallet
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => handleOpenModal("addSubscription")}
                          aria-label="Add subscription"
                        >
                          <CreditCard className="h-4 w-4" />
                          Subscription
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Footer */}
              <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                <p>
                  Powered by <span className="font-medium">Bumblebee</span> • © 2025 All rights reserved
                </p>
                <div className="flex justify-center gap-4 mt-2">
                  <a href="#" className="hover:text-amber-500">
                    Terms
                  </a>
                  <a href="#" className="hover:text-amber-500">
                    Privacy
                  </a>
                  <a href="#" className="hover:text-amber-500">
                    Support
                  </a>
                </div>
              </footer>
            </div>
          </motion.main>
        </SidebarInset>
      </Sidebar>
    </>
  );
}

export default DashboardLayout;