"use client";
import { useState, useEffect } from "react";
import { formatEther, Address } from "viem";
import {
  Plus,
  Edit,
  Trash2,
  Wallet,
  DollarSign,
  Users,
  Zap,
  MoreHorizontal,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Calendar,
  CreditCard,
  PieChart,
  TrendingUp,
  Filter,
  ChevronRight,
  ArrowUpRight,
  BarChart2,
  Clock,
  Search,
  Tag,
  RefreshCw,
  Settings,
  Bell,
  Download,
  UserPlus,
  Loader2,
  Info,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";
import { isAddress } from "viem";
import { erc7710WalletActions } from "@metamask/delegation-toolkit/experimental";
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { sepolia as chain } from "viem/chains";
import { createSessionAccount } from "@/lib/config";
import { calculateStreamParams } from "@/lib/streaming";
export interface StreamConfig {
  expiry: number;
  amountPerSecond: string;
  maxAmount: string;
  startTime: number;
}

export interface Subscription {
  id: string;
  name: string;
  amount: string;
  numericAmount: number;
  frequency: string;
  nextPayment: string;
  category: string;
  paymentMethod: string;
  status: "active" | "paused" | "expiring" | "shared";
  description?: string;
  contractAddress?: string;
  erc7715?: boolean;
  tokenAddress?: string;
  recipient?: string;
  isAutoRenewing?: boolean;
  color?: string;
  createdAt?: string;
  logo?: string;
  lastPayment?: string;
  totalSpent?: string;
  totalPayments?: number;
  remainingPayments?: number;
  sharedWith?: string[];
  permissionsContext?: any;
  delegationManager?: string;
  streamConfig?: StreamConfig;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
};

// Status variants
const statusVariants = {
  active: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-400",
    icon: CheckCircle,
  },
  paused: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-800 dark:text-amber-400",
    icon: AlertCircle,
  },
  expiring: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-400",
    icon: AlertCircle,
  },
  shared: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-800 dark:text-blue-400",
    icon: Sparkles,
  },
};

// Educational Content Component
interface ERC7715EducationProps {
  onClose: () => void;
}

const ERC7715Education = ({ onClose }: ERC7715EducationProps) => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="mb-6"
    >
      <Card className="bg-indigo-50 dark:bg-indigo-950/30 border-l-4 border-indigo-500">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg text-indigo-800 dark:text-indigo-200">
                  Understanding Smart Subscriptions (ERC-7715)
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    1. First, you grant spending permissions to your smart account
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2. Your smart account automatically pays subscriptions from your wallet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    3. No need to manually approve each payment
                  </p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function useStreamProgress(subscription: Subscription | null) {
  const [progress, setProgress] = useState<{
    streamed: bigint;
    remaining: bigint;
    percentComplete: number;
  } | null>(null);

  useEffect(() => {
    if (!subscription?.streamConfig) return;

    const updateProgress = () => {
      const now = Math.floor(Date.now() / 1000);
      const config = subscription.streamConfig!;
      
      const duration = config.expiry - config.startTime;
      const elapsed = now - config.startTime;
      
      const amountPerSecond = BigInt(config.amountPerSecond);
      const streamed = amountPerSecond * BigInt(elapsed);
      const maxAmount = BigInt(config.maxAmount);
      
      setProgress({
        streamed,
        remaining: maxAmount - streamed,
        percentComplete: (elapsed / duration) * 100
      });
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [subscription]);

  return progress;
}

export default function SubscriptionManagement() {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  
  // State
  const [showERC7715Info, setShowERC7715Info] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSubscription, setExpandedSubscription] = useState<string | null>(null);
  
  // Form state
  const [formState, setFormState] = useState<Subscription>({
    id: "",
    name: "",
    amount: "",
    numericAmount: 0,
    frequency: "Monthly",
    nextPayment: "",
    category: "Entertainment",
    paymentMethod: "MetaMask",
    status: "active",
    description: "",
    contractAddress: "",
    erc7715: false,
    tokenAddress: "",
    recipient: "",
    isAutoRenewing: false,
    color: "#6366F1",
  });
  
  const [erc7715Loading, setErc7715Loading] = useState(false);
  const [erc7715Error, setErc7715Error] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState("grid");
  
  // Constants
  const SECONDS_IN_MONTH = 30 * 24 * 60 * 60;
  const categories = ["Entertainment", "Productivity", "Storage", "Shopping", "Finance", "Health & Fitness", "Education", "Utilities", "Food & Drink", "Gaming", "News", "Social", "Travel", "Other"];
  const frequencies = ["Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Yearly"];
  const paymentMethods = ["MetaMask", "WalletConnect", "Coinbase Wallet", "Credit Card", "Apple Pay", "PayPal", "Bank Transfer"];
  
  // Generate random colors
  const generateRandomColor = () => {
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#EF4444", "#6366F1", "#14B8A6", "#F97316", "#8B5CF6"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Generate subscription logos
  const getLogoUrl = (name: string) => {
    const logos: { [key: string]: string } = {
      Netflix: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/227_Netflix_logo-512.png ",
      Spotify: "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Spotify-512.png ",
      "Amazon Prime": "https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/amazon-prime-512.png ",
      "Apple Music": "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Apple_Music_logo-512.png ",
      "Disney+": "https://cdn1.iconfinder.com/data/icons/logos-brands-5/24/disney-plus-512.png ",
      "YouTube Premium": "https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-512.png ",
      "HBO Max": "https://cdn2.iconfinder.com/data/icons/social-media-2487/24/hbo-512.png ",
      Hulu: "https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_hulu-512.png ",
      "Adobe CC": "https://cdn0.iconfinder.com/data/icons/logos-brands-5/200/adobe_logo_creative_cloud-512.png ",
      "Microsoft 365": "https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_office-512.png ",
      "Google One": "https://cdn3.iconfinder.com/data/icons/logos-brands-3/24/logo_brand_brands_logos_google_drive-512.png ",
      Dropbox: "https://cdn0.iconfinder.com/data/icons/social-media-2092/100/social-56-512.png ",
      Slack: "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Slack_colored_svg-512.png ",
      Notion: "https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/notion-512.png ",
      "Gym Membership": "https://cdn2.iconfinder.com/data/icons/sports-fitness-line-vol-1/52/exercise__gym__workout__fitness__dumbbell__weight__muscle-512.png ",
      NYT: "https://cdn3.iconfinder.com/data/icons/popular-services-brands/512/new-york-times-512.png ",
      Audible: "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Audible_logo-512.png ",
    };
    
    return (
      logos[name] ||
      `https://ui-avatars.com/api/?name= ${encodeURIComponent(name)}&background=${generateRandomColor().substring(1)}&color=fff&size=128`
    );
  };
  
  // Calculate subscription stats
  const getSubscriptionStats = () => {
    const totalMonthly = subscriptions
      .filter((sub) => sub.status === "active")
      .reduce((sum, sub) => sum + sub.numericAmount, 0);
    
    const totalYearly = totalMonthly * 12;
    
    const categoryCounts: { [key: string]: number } = {};
    subscriptions.forEach((sub) => {
      categoryCounts[sub.category] = (categoryCounts[sub.category] || 0) + 1;
    });
    
    const topCategory =
      Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
    
    return {
      totalActive: subscriptions.filter((sub) => sub.status === "active").length,
      totalPaused: subscriptions.filter((sub) => sub.status === "paused").length,
      totalExpiring: subscriptions.filter((sub) => sub.status === "expiring").length,
      totalShared: subscriptions.filter((sub) => sub.status === "shared").length,
      totalMonthly: totalMonthly.toFixed(2),
      totalYearly: totalYearly.toFixed(2),
      topCategory,
      erc7715Count: subscriptions.filter((s) => s.erc7715).length,
      categoryCounts,
    };
  };
  
  // Load initial subscriptions from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSubscriptions = localStorage.getItem("subscriptions");
      if (savedSubscriptions) {
        setSubscriptions(JSON.parse(savedSubscriptions));
      } else {
        setSubscriptions([]);
        localStorage.setItem("subscriptions", JSON.stringify([]));
      }
    }
  }, []);
  
  // Save subscriptions to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
    }
  }, [subscriptions]);
  
  // Handle form input changes
  const handleInputChange = (
    field: keyof Subscription,
    value: string | boolean | number
  ) => {
    if (field === "amount") {
      if (typeof value !== "string") return;
      setFormState((prev) => {
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
        return {
          ...prev,
          amount: value,
          numericAmount: isNaN(numericValue) ? 0 : numericValue,
        };
      });
    } else {
      setFormState({
        ...formState,
        [field]: value,
      });
    }
  };
  
  // Reset form
  const resetForm = () => {
    const today = new Date().toISOString().split("T")[0];
    setFormState({
      id: "",
      name: "",
      amount: "",
      numericAmount: 0,
      frequency: "Monthly",
      nextPayment: today,
      category: "Entertainment",
      paymentMethod: "MetaMask",
      status: "active",
      description: "",
      contractAddress: "",
      erc7715: false,
      tokenAddress: "",
      recipient: "",
      isAutoRenewing: false,
      color: "#6366F1",
    });
    setErc7715Error(null);
    setErc7715Loading(false);
  };
  
  // Validate form
  const validateForm = (): boolean => {
    if (!formState.name.trim()) {
      toast({ title: "Error", description: "Name is required." });
      return false;
    }
    if (!formState.amount || formState.numericAmount <= 0) {
      toast({ title: "Error", description: "Valid amount is required." });
      return false;
    }
    if (!formState.nextPayment) {
      toast({ title: "Error", description: "Next payment date is required." });
      return false;
    }
    
    if (formState.erc7715) {
      if (!formState.contractAddress) {
        toast({
          title: "Error",
          description: "Smart account creation failed. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      if (!formState.tokenAddress) {
        toast({
          title: "Error",
          description: "Token address is required.",
          variant: "destructive",
        });
        return false;
      }
      if (!formState.recipient) {
        toast({
          title: "Error",
          description: "Recipient address is required.",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };
  
  // Calculate stream rate for ERC-7715
  const calculateStreamRate = () => {
    if (formState.numericAmount <= 0) {
      throw new Error("Amount must be greater than zero");
    }
    const amountInWei = BigInt(Math.floor(formState.numericAmount * 1e18));
    return (amountInWei / BigInt(SECONDS_IN_MONTH)).toString();
  };
  
  // Replace the MetaMask session account creation with this updated version
  const createSmartAccount = async () => {
    if (!walletClient || !address) {
      toast({
        title: "Error",
        description: "Wallet connection required",
        variant: "destructive",
      });
      throw new Error("Wallet connection required");
    }

    try {
      setErc7715Error(null);
      setErc7715Loading(true);

      // Create session account
      const sessionAccount = await createSessionAccount({
        address: address as Address,
        type: 'json-rpc'
      });

      // Calculate stream parameters
      const streamParams = calculateStreamParams({
        address: sessionAccount.address,
        amount: formState.numericAmount,
        duration: SECONDS_IN_MONTH,
        chainId: chain.id,
        description: `Payment for ${formState.name} subscription`
    });

      // Grant streaming permissions
      const grantedPermissions = await walletClient.getPermissions();

      // Update form state with stream config
      setFormState(prev => ({
        ...prev,
        contractAddress: sessionAccount.address,
        tokenAddress: "0x0000000000000000000000000000000000000000", // ETH
        recipient: address,
        streamConfig: {
          expiry: streamParams.expiry,
          amountPerSecond: streamParams.permission.data.amountPerSecond.toString(),
          maxAmount: streamParams.permission.data.maxAmount.toString(),
          startTime: streamParams.permission.data.startTime
        }
    }));

    return {
      contractAddress: sessionAccount.address,
      tokenAddress: "0x0000000000000000000000000000000000000000",
      recipient: address,
      permissions: grantedPermissions,
    };

  } catch (error) {
    console.error("Smart Account Error:", error);
    setErc7715Error("Failed to create smart account");
    setFormState(prev => ({
      ...prev,
      contractAddress: "",
      tokenAddress: "",
      recipient: ""
    }));
    return null;
  } finally {
    setErc7715Loading(false);
  }
};
  
  // Toggle ERC-7715
  const toggleERC7715 = async (checked: boolean) => {
    if (!isConnected && checked) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first to enable smart subscriptions.",
        variant: "destructive",
      });
      return;
    }
    
    if (checked) {
      const result = await createSmartAccount();
      if (result) {
        setFormState(prev => ({
          ...prev,
          erc7715: true,
          ...result
        }));
      }
    } else {
      setFormState(prev => ({
        ...prev,
        erc7715: false,
        contractAddress: "",
        tokenAddress: "",
        recipient: "",
      }));
    }
  };
  
  // Add subscription
  const handleAddSubscription = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      // If using ERC-7715 but missing account details, try to create again
      if (formState.erc7715 && (!formState.contractAddress || !formState.tokenAddress || !formState.recipient)) {
        const result = await createSmartAccount();
        if (!result) {
          return;
        }
        setFormState(prev => ({ ...prev, ...result }));
      }
      
      const newSub: Subscription = {
        ...formState,
        id: `sub_${uuidv4()}`,
        createdAt: new Date().toISOString(),
        lastPayment: new Date().toISOString(),
        totalSpent: formState.amount,
        totalPayments: 1,
        logo: getLogoUrl(formState.name),
        color: formState.color || generateRandomColor(),
      };
      
      setSubscriptions([...subscriptions, newSub]);
      toast({ title: "Success", description: "Subscription added successfully." });
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Add Subscription Error:", error);
      toast({
        title: "Error",
        description: "Failed to add subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Create subscription stats
  const stats = getSubscriptionStats();
  
  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-8">
        {/* Educational Content */}
        <AnimatePresence>
          {showERC7715Info && (
            <ERC7715Education onClose={() => setShowERC7715Info(false)} />
          )}
        </AnimatePresence>
        
        {/* Header */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Subscription Management
            </h1>
            <p className="text-muted-foreground">
              Track and manage your recurring payments
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-500 hover:to-yellow-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Subscription
            </Button>
          </div>
        </motion.div>
        
        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`h-2 w-2 rounded-full mr-2 ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm font-medium">
                  {isConnected
                    ? `Connected: ${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`
                    : "Not Connected"}
                </span>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Monthly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-indigo-600 mr-2" />
                <span className="text-2xl font-bold">${stats.totalMonthly}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Zap className="h-6 w-6 text-indigo-600 mr-2" />
                <span className="text-2xl font-bold">{stats.totalActive}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Top Category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Tag className="h-6 w-6 text-indigo-600 mr-2" />
                <span className="text-2xl font-bold">{stats.topCategory}</span>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-indigo-50 dark:bg-indigo-950/20">
            <TabsTrigger value="all">All ({subscriptions.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.totalActive})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({stats.totalPaused})</TabsTrigger>
            <TabsTrigger value="expiring">Expiring ({stats.totalExpiring})</TabsTrigger>
            <TabsTrigger value="shared">Shared ({stats.totalShared})</TabsTrigger>
            <TabsTrigger value="erc7715">ERC-7715 ({stats.erc7715Count})</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Subscriptions Grid */}
        <motion.div
          className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {subscriptions.length === 0 ? (
            <motion.div variants={itemVariants} className="col-span-full">
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground mb-4">No subscriptions found</p>
                  <Button
                    onClick={() => {
                      resetForm();
                      setIsAddModalOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Subscription
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            subscriptions.map((sub) => {
              const StatusIcon = statusVariants[sub.status].icon;
              return (
                <motion.div key={sub.id} variants={itemVariants}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="relative">
                      <div className="flex items-center space-x-3">
                        <img
                          src={sub.logo}
                          alt={`${sub.name} logo`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-lg">{sub.name}</CardTitle>
                          <CardDescription>{sub.category}</CardDescription>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => {
                              setCurrentSubscription(sub);
                              setFormState({...sub});
                              setIsEditModalOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setCurrentSubscription(sub);
                              setIsShareModalOpen(true);
                            }}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setCurrentSubscription(sub);
                              setIsStatsModalOpen(true);
                            }}>
                              <BarChart2 className="mr-2 h-4 w-4" />
                              Stats
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentSubscription(sub);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-bold">{sub.amount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Frequency</span>
                          <span>{sub.frequency}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Next Payment</span>
                          <span>{formatDate(sub.nextPayment)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Status</span>
                          <Badge
                            className={`${statusVariants[sub.status].bg} ${statusVariants[sub.status].text}`}
                          >
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </Badge>
                        </div>
                        {sub.erc7715 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">ERC-7715</span>
                            <Badge variant="outline">
                              <Zap className="mr-1 h-3 w-3" />
                              Smart Subscription
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setExpandedSubscription(
                            expandedSubscription === sub.id ? null : sub.id
                          )
                        }
                      >
                        {expandedSubscription === sub.id ? "Show Less" : "Show More"}
                        <ChevronRight
                          className={`ml-2 h-4 w-4 transition-transform ${
                            expandedSubscription === sub.id ? "rotate-90" : ""
                          }`}
                        />
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => window.open("https://example.com ", "_blank")}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Visit Website</TooltipContent>
                      </Tooltip>
                    </CardFooter>
                  </Card>
                  {sub.erc7715 && sub.streamConfig && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Stream Configuration</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rate</span>
                          <span>{formatEther(BigInt(sub.streamConfig.amountPerSecond))} ETH/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expiry</span>
                          <span>{new Date(sub.streamConfig.expiry * 1000).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Amount</span>
                          <span>{formatEther(BigInt(sub.streamConfig.maxAmount))} ETH</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
        
        {/* Add Subscription Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
              <DialogDescription>
                Enter your subscription details below
              </DialogDescription>
            </DialogHeader>
            
            {erc7715Error && (
              <Card className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                    <p className="text-sm text-red-500">{erc7715Error}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid gap-4 py-4">
              {/* Name and Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium">Name</Label>
                  <Input
                    value={formState.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Netflix"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">Amount</Label>
                  <Input
                    value={formState.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    placeholder="$9.99"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              
              {/* Frequency and Next Payment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium">Frequency</Label>
                  <Select
                    value={formState.frequency}
                    onValueChange={(value) => handleInputChange("frequency", value)}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq} value={freq} className="text-sm">
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Next Payment</Label>
                  <Input
                    type="date"
                    value={formState.nextPayment}
                    onChange={(e) => handleInputChange("nextPayment", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              
              {/* Category and Payment Method */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium">Category</Label>
                  <Select
                    value={formState.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-sm">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Payment Method</Label>
                  <Select
                    value={formState.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method} className="text-sm">
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Status and Description */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium">Status</Label>
                  <Select
                    value={formState.status}
                    onValueChange={(value) => handleInputChange("status", value as Subscription["status"])}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active" className="text-sm">Active</SelectItem>
                      <SelectItem value="paused" className="text-sm">Paused</SelectItem>
                      <SelectItem value="expiring" className="text-sm">Expiring</SelectItem>
                      <SelectItem value="shared" className="text-sm">Shared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Description</Label>
                  <Input
                    value={formState.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Optional description"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              
              {/* ERC-7715 Toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <Switch
                  checked={formState.erc7715}
                  onCheckedChange={toggleERC7715}
                  disabled={erc7715Loading || !isConnected}
                />
                <Label className="text-xs font-medium">
                  Enable ERC-7715 (Smart Subscription)
                </Label>
                {erc7715Loading && (
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                )}
              </div>
              
              {/* Smart Account Details (only shown when ERC-7715 is enabled) */}
              {formState.erc7715 && (
                <div className="space-y-3 border rounded-md p-3 bg-slate-50 dark:bg-slate-900">
                  <div className="text-xs text-muted-foreground">Smart Account Details</div>
                  
                  {formState.contractAddress ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium">Contract</Label>
                          <Input
                            value={formState.contractAddress}
                            readOnly
                            className="h-8 text-xs bg-slate-100 dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Token</Label>
                          <Input
                            value={formState.tokenAddress}
                            readOnly
                            className="h-8 text-xs bg-slate-100 dark:bg-slate-800"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium">Recipient</Label>
                          <Input
                            value={formState.recipient}
                            readOnly
                            className="h-8 text-xs bg-slate-100 dark:bg-slate-800"
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-4">
                          <Switch
                            checked={formState.isAutoRenewing || false}
                            onCheckedChange={(checked) => handleInputChange("isAutoRenewing", checked)}
                            className="scale-90"
                          />
                          <Label className="text-xs font-medium">Auto-Renew</Label>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-500">
                      <CardContent className="p-3 text-center">
                        <AlertCircle className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          Connect your wallet to create a smart account
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSubscription}
                disabled={isSubmitting || (formState.erc7715 && !formState.contractAddress)}
                className="h-8 text-xs bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-500 hover:to-yellow-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Subscription"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}