"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useSwitchChain } from "wagmi";
import { isAddress } from "viem";

// Types
interface Subscription {
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

// Main Component
export default function SubscriptionManagement() {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSubscription, setExpandedSubscription] = useState<string | null>(
    null
  );
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
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState("grid");

  // Mock Categories & Frequencies
  const categories = [
    "Entertainment",
    "Productivity",
    "Storage",
    "Shopping",
    "Finance",
    "Health & Fitness",
    "Education",
    "Utilities",
    "Food & Drink",
    "Gaming",
    "News",
    "Social",
    "Travel",
    "Other",
  ];

  const frequencies = [
    "Daily",
    "Weekly",
    "Bi-weekly",
    "Monthly",
    "Quarterly",
    "Yearly",
  ];
  const paymentMethods = [
    "MetaMask",
    "WalletConnect",
    "Coinbase Wallet",
    "Credit Card",
    "Apple Pay",
    "PayPal",
    "Bank Transfer",
  ];

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

  // Generate random colors for subscription cards
  const generateRandomColor = () => {
    const colors = [
      "#3B82F6", // Blue
      "#10B981", // Green
      "#F59E0B", // Yellow
      "#8B5CF6", // Purple
      "#EC4899", // Pink
      "#EF4444", // Red
      "#6366F1", // Indigo
      "#14B8A6", // Teal
      "#F97316", // Orange
      "#8B5CF6", // Violet
    ];
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
      Netflix:
        "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/227_Netflix_logo-512.png",
      Spotify:
        "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Spotify-512.png",
      "Amazon Prime":
        "https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/amazon-prime-512.png",
      "Apple Music":
        "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Apple_Music_logo-512.png",
      "Disney+":
        "https://cdn1.iconfinder.com/data/icons/logos-brands-5/24/disney-plus-512.png",
      "YouTube Premium":
        "https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-512.png",
      "HBO Max":
        "https://cdn2.iconfinder.com/data/icons/social-media-2487/24/hbo-512.png",
      Hulu: "https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_hulu-512.png",
      "Adobe CC":
        "https://cdn0.iconfinder.com/data/icons/logos-brands-5/200/adobe_logo_creative_cloud-512.png",
      "Microsoft 365":
        "https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_office-512.png",
      "Google One":
        "https://cdn3.iconfinder.com/data/icons/logos-brands-3/24/logo_brand_brands_logos_google_drive-512.png",
      Dropbox:
        "https://cdn0.iconfinder.com/data/icons/social-media-2092/100/social-56-512.png",
      Slack: "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Slack_colored_svg-512.png",
      Notion:
        "https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/notion-512.png",
      "Gym Membership":
        "https://cdn2.iconfinder.com/data/icons/sports-fitness-line-vol-1/52/exercise__gym__workout__fitness__dumbbell__weight__muscle-512.png",
      NYT: "https://cdn3.iconfinder.com/data/icons/popular-services-brands/512/new-york-times-512.png",
      Audible:
        "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Audible_logo-512.png",
    };

    return (
      logos[name] ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=${generateRandomColor().substring(1)}&color=fff&size=128`
    );
  };

  // Calculating Stats
  const getSubscriptionStats = () => {
    const totalMonthly = subscriptions
      .filter((sub) => sub.status === "active")
      .reduce((sum, sub) => {
        if (sub.frequency === "Monthly") return sum + sub.numericAmount;
        if (sub.frequency === "Weekly") return sum + sub.numericAmount * 4.33;
        if (sub.frequency === "Bi-weekly")
          return sum + sub.numericAmount * 2.17;
        if (sub.frequency === "Yearly") return sum + sub.numericAmount / 12;
        if (sub.frequency === "Quarterly") return sum + sub.numericAmount / 3;
        if (sub.frequency === "Daily") return sum + sub.numericAmount * 30;
        return sum;
      }, 0);

    const totalYearly = totalMonthly * 12;

    const categoryCounts: { [key: string]: number } = {};
    subscriptions.forEach((sub) => {
      categoryCounts[sub.category] = (categoryCounts[sub.category] || 0) + 1;
    });

    const topCategory =
      Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "None";

    return {
      totalActive: subscriptions.filter((sub) => sub.status === "active").length,
      totalPaused: subscriptions.filter((sub) => sub.status === "paused").length,
      totalExpiring: subscriptions.filter(
        (sub) => sub.status === "expiring"
      ).length,
      totalShared: subscriptions.filter((sub) => sub.status === "shared").length,
      totalMonthly: totalMonthly.toFixed(2),
      totalYearly: totalYearly.toFixed(2),
      topCategory,
      erc7715Count: subscriptions.filter((sub) => sub.erc7715).length,
      categoryCounts,
    };
  };

  // Generate next payment date
  const calculateNextPaymentDate = (frequency: string, baseDate = new Date()) => {
    const date = new Date(baseDate);

    switch (frequency) {
      case "Daily":
        date.setDate(date.getDate() + 1);
        break;
      case "Weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "Bi-weekly":
        date.setDate(date.getDate() + 14);
        break;
      case "Monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "Quarterly":
        date.setMonth(date.getMonth() + 3);
        break;
      case "Yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }

    return date.toISOString().split("T")[0];
  };

  // Load mock data on mount
  useEffect(() => {
    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const mockSubs: Subscription[] = [
      {
        id: "sub_1",
        name: "Netflix",
        amount: "$15.99",
        numericAmount: 15.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Entertainment",
        paymentMethod: "Credit Card",
        status: "active",
        description: "Premium streaming plan",
        erc7715: false,
        logo: getLogoUrl("Netflix"),
        createdAt: new Date(2023, 5, 15).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$159.90",
        totalPayments: 10,
        color: "#E50914",
      },
      {
        id: "sub_2",
        name: "Spotify",
        amount: "$9.99",
        numericAmount: 9.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Entertainment",
        paymentMethod: "PayPal",
        status: "active",
        description: "Music streaming, family plan",
        contractAddress: "0xAbc123def456",
        tokenAddress: "0xToken2Addr",
        recipient: "0xRecipient123",
        erc7715: true,
        isAutoRenewing: true,
        logo: getLogoUrl("Spotify"),
        createdAt: new Date(2023, 0, 10).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$159.84",
        totalPayments: 16,
        color: "#1DB954",
      },
      {
        id: "sub_3",
        name: "Amazon Prime",
        amount: "$14.99",
        numericAmount: 14.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Shopping",
        paymentMethod: "Credit Card",
        status: "active",
        description: "Prime membership with video streaming",
        erc7715: false,
        logo: getLogoUrl("Amazon Prime"),
        createdAt: new Date(2022, 3, 5).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$389.74",
        totalPayments: 26,
        color: "#FF9900",
      },
      {
        id: "sub_4",
        name: "Apple Music",
        amount: "$10.99",
        numericAmount: 10.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Entertainment",
        paymentMethod: "Apple Pay",
        status: "active",
        description: "Music streaming service",
        erc7715: false,
        logo: getLogoUrl("Apple Music"),
        createdAt: new Date(2023, 8, 12).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$87.92",
        totalPayments: 8,
        color: "#FA243C",
      },
      {
        id: "sub_5",
        name: "Disney+",
        amount: "$7.99",
        numericAmount: 7.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Entertainment",
        paymentMethod: "Credit Card",
        status: "paused",
        description: "Streaming service for Disney content",
        erc7715: false,
        logo: getLogoUrl("Disney+"),
        createdAt: new Date(2023, 2, 25).toISOString(),
        lastPayment: new Date(
          now.getFullYear(),
          now.getMonth() - 2,
          25
        ).toISOString(),
        totalSpent: "$95.88",
        totalPayments: 12,
        color: "#0063e5",
      },
      {
        id: "sub_6",
        name: "YouTube Premium",
        amount: "$11.99",
        numericAmount: 11.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate(
          "Monthly",
          new Date(now.getFullYear(), now.getMonth() + 3, 15)
        ),
        category: "Entertainment",
        paymentMethod: "Google Pay",
        status: "paused",
        description: "Ad-free YouTube with background play",
        erc7715: false,
        logo: getLogoUrl("YouTube Premium"),
        createdAt: new Date(2022, 10, 18).toISOString(),
        lastPayment: new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          18
        ).toISOString(),
        totalSpent: "$215.82",
        totalPayments: 18,
        color: "#FF0000",
      },
      {
        id: "sub_7",
        name: "HBO Max",
        amount: "$15.99",
        numericAmount: 15.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate(
          "Monthly",
          new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5)
        ),
        category: "Entertainment",
        paymentMethod: "Credit Card",
        status: "expiring",
        description: "Ad-free HBO Max streaming",
        erc7715: false,
        logo: getLogoUrl("HBO Max"),
        createdAt: new Date(2023, 1, 8).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$239.85",
        totalPayments: 15,
        remainingPayments: 1,
        color: "#5822b4",
      },
      {
        id: "sub_8",
        name: "Adobe Creative Cloud",
        amount: "$52.99",
        numericAmount: 52.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Productivity",
        paymentMethod: "Credit Card",
        status: "active",
        description: "Full Creative Cloud suite",
        erc7715: false,
        logo: getLogoUrl("Adobe CC"),
        createdAt: new Date(2022, 4, 10).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$1,324.75",
        totalPayments: 25,
        color: "#FF0000",
      },
      {
        id: "sub_9",
        name: "Microsoft 365",
        amount: "$6.99",
        numericAmount: 6.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Productivity",
        paymentMethod: "Credit Card",
        status: "active",
        description: "Office suite with cloud storage",
        erc7715: false,
        logo: getLogoUrl("Microsoft 365"),
        createdAt: new Date(2022, 7, 20).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$146.79",
        totalPayments: 21,
        color: "#0078d4",
      },
      {
        id: "sub_10",
        name: "Google One",
        amount: "$1.99",
        numericAmount: 1.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Storage",
        paymentMethod: "Google Pay",
        status: "active",
        description: "100GB cloud storage",
        erc7715: false,
        logo: getLogoUrl("Google One"),
        createdAt: new Date(2022, 9, 5).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$37.81",
        totalPayments: 19,
        color: "#4285F4",
      },
      {
        id: "sub_11",
        name: "Dropbox Plus",
        amount: "$11.99",
        numericAmount: 11.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Storage",
        paymentMethod: "PayPal",
        status: "active",
        description: "2TB cloud storage",
        erc7715: true,
        contractAddress: "0xDropbox123Contract",
        tokenAddress: "0xDropboxTokenAddr",
        recipient: "0xDropboxRecipient",
        isAutoRenewing: true,
        logo: getLogoUrl("Dropbox"),
        createdAt: new Date(2023, 3, 15).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$155.87",
        totalPayments: 13,
        color: "#0061FF",
      },
      {
        id: "sub_12",
        name: "Gym Membership",
        amount: "$29.99",
        numericAmount: 29.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Health & Fitness",
        paymentMethod: "Bank Transfer",
        status: "active",
        description: "24/7 access to all locations",
        erc7715: false,
        logo: getLogoUrl("Gym Membership"),
        createdAt: new Date(2023, 0, 2).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$479.84",
        totalPayments: 16,
        color: "#37B679",
      },
      {
        id: "sub_13",
        name: "NY Times",
        amount: "$4.99",
        numericAmount: 4.99,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "News",
        paymentMethod: "Credit Card",
        status: "shared",
        description: "Digital subscription",
        erc7715: false,
        logo: getLogoUrl("NYT"),
        createdAt: new Date(2023, 6, 10).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$49.90",
        totalPayments: 10,
        sharedWith: ["alex@example.com", "kim@example.com"],
        color: "#000000",
      },
      {
        id: "sub_14",
        name: "Slack",
        amount: "$8.75",
        numericAmount: 8.75,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Productivity",
        paymentMethod: "Credit Card",
        status: "shared",
        description: "Team communication platform",
        erc7715: true,
        contractAddress: "0xSlack456Contract",
        tokenAddress: "0xSlackTokenAddr",
        recipient: "0xSlackRecipient",
        isAutoRenewing: true,
        logo: getLogoUrl("Slack"),
        createdAt: new Date(2023, 2, 1).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$113.75",
        totalPayments: 13,
        sharedWith: ["team@example.com", "dev@example.com", "alex@example.com"],
        color: "#4A154B",
      },
      {
        id: "sub_15",
        name: "Notion",
        amount: "$8.00",
        numericAmount: 8.0,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate("Monthly"),
        category: "Productivity",
        paymentMethod: "Credit Card",
        status: "active",
        description: "Productivity and note-taking workspace",
        erc7715: false,
        logo: getLogoUrl("Notion"),
        createdAt: new Date(2023, 4, 20).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$96.00",
        totalPayments: 12,
        color: "#000000",
      },
      {
        id: "sub_16",
        name: "Audible",
        amount: "$14.95",
        numericAmount: 14.95,
        frequency: "Monthly",
        nextPayment: calculateNextPaymentDate(
          "Monthly",
          new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8)
        ),
        category: "Entertainment",
        paymentMethod: "Credit Card",
        status: "expiring",
        description: "Audiobook subscription with 1 credit/month",
        erc7715: false,
        logo: getLogoUrl("Audible"),
        createdAt: new Date(2023, 1, 15).toISOString(),
        lastPayment: monthAgo.toISOString(),
        totalSpent: "$224.25",
        totalPayments: 15,
        remainingPayments: 2,
        color: "#F6BC25",
      },
    ];

    setSubscriptions(mockSubs);
  }, []);

  const filteredSubscriptions = subscriptions
    .filter((sub) => {
      // Filter by tab
      if (activeTab === "all") return true;
      if (activeTab === "erc7715") return sub.erc7715;
      return sub.status === activeTab;
    })
    .filter((sub) => {
      // Filter by search query
      if (!searchQuery) return true;
      return (
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .filter((sub) => {
      // Filter by selected categories
      if (selectedCategories.length === 0) return true;
      return selectedCategories.includes(sub.category);
    })
    .sort((a, b) => {
      // Sort
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "amount") return a.numericAmount - b.numericAmount;
      if (sortBy === "nextPayment")
        return (
          new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime()
        );
      if (sortBy === "category") return a.category.localeCompare(b.category);
      if (sortBy === "created")
        return (
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
        );
      return 0;
    });

  const getCounts = (status: string): number => {
    if (status === "erc7715") return subscriptions.filter((s) => s.erc7715).length;
    if (status === "all") return subscriptions.length;
    return subscriptions.filter((s) => s.status === status).length;
  };

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
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const openAddModal = () => {
    const today = new Date().toISOString().split("T")[0];
    resetForm();
    setFormState((prev) => ({ ...prev, nextPayment: today }));
    setIsAddModalOpen(true);
  };

  const openEditModal = (sub: Subscription) => {
    setFormState({ ...sub });
    setCurrentSubscription(sub);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (sub: Subscription) => {
    setCurrentSubscription(sub);
    setIsDeleteModalOpen(true);
  };

  const openShareModal = (sub: Subscription) => {
    setCurrentSubscription(sub);
    setIsShareModalOpen(true);
  };

  const openStatsModal = (sub: Subscription) => {
    setCurrentSubscription(sub);
    setIsStatsModalOpen(true);
  };

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
  };

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
      if (!formState.contractAddress || !isAddress(formState.contractAddress)) {
        toast({
          title: "Error",
          description: "Valid contract address is required for ERC-7715.",
        });
        return false;
      }
      if (!formState.tokenAddress || !isAddress(formState.tokenAddress)) {
        toast({
          title: "Error",
          description: "Valid token address is required for ERC-7715.",
        });
        return false;
      }
      if (!formState.recipient || !isAddress(formState.recipient)) {
        toast({
          title: "Error",
          description: "Valid recipient address is required for ERC-7715.",
        });
        return false;
      }
    }
    return true;
  };

  const handleAddSubscription = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Simulate contract interaction
    setTimeout(() => {
      const newSub: Subscription = {
        ...formState,
        id: `sub_${subscriptions.length + 1}`,
        createdAt: new Date().toISOString(),
        lastPayment: new Date().toISOString(),
        totalSpent: formState.amount,
        totalPayments: 1,
        logo: getLogoUrl(formState.name),
        color: formState.color || generateRandomColor(),
      };
      setSubscriptions([...subscriptions, newSub]);
      toast({ title: "Success", description: "Subscription added." });
      setIsAddModalOpen(false);
      resetForm();
      setIsSubmitting(false);
    }, 1500);
  };

  const handleEditSubscription = async () => {
    if (!validateForm() || !currentSubscription) return;
    setIsSubmitting(true);

    // Simulate contract interaction
    setTimeout(() => {
      const updatedSubs = subscriptions.map((sub) =>
        sub.id === currentSubscription.id
          ? { ...formState, logo: getLogoUrl(formState.name) }
          : sub
      );
      setSubscriptions(updatedSubs);
      toast({ title: "Success", description: "Subscription updated." });
      setIsEditModalOpen(false);
      resetForm();
      setCurrentSubscription(null);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleDeleteSubscription = async () => {
    if (!currentSubscription) return;
    setIsSubmitting(true);

    // Simulate contract interaction
    setTimeout(() => {
      setSubscriptions(
        subscriptions.filter((sub) => sub.id !== currentSubscription.id)
      );
      toast({ title: "Success", description: "Subscription deleted." });
      setIsDeleteModalOpen(false);
      setCurrentSubscription(null);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleShareSubscription = async (email: string) => {
    if (!currentSubscription) return;
    setIsSubmitting(true);

    // Simulate sharing
    setTimeout(() => {
      const updatedSubs = subscriptions.map((sub) =>
        sub.id === currentSubscription.id
          ? {
              ...sub,
              sharedWith: [...(sub.sharedWith || []), email],
              status: "shared" as "shared",
            }
          : sub
      );
      setSubscriptions(updatedSubs);
      toast({ title: "Success", description: `Shared with ${email}.` });
      setIsShareModalOpen(false);
      setCurrentSubscription(null);
      setIsSubmitting(false);
    }, 1500);
  };

  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const stats = getSubscriptionStats();

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-8">
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
              onClick={openAddModal}
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
                    ? `Connected: ${address?.substring(0, 6)}...${address?.substring(
                        address.length - 4
                      )}`
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
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search subscriptions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Categories</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {categories.map((category) => (
                          <Badge
                            key={category}
                            variant={
                              selectedCategories.includes(category)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleCategoryFilter(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Sort By</Label>
                      <Select
                        value={sortBy}
                        onValueChange={setSortBy}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="amount">Amount</SelectItem>
                          <SelectItem value="nextPayment">
                            Next Payment
                          </SelectItem>
                          <SelectItem value="category">Category</SelectItem>
                          <SelectItem value="created">Created</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-indigo-50 dark:bg-indigo-950/20">
            <TabsTrigger value="all">All ({getCounts("all")})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({getCounts("active")})
            </TabsTrigger>
            <TabsTrigger value="paused">
              Paused ({getCounts("paused")})
            </TabsTrigger>
            <TabsTrigger value="expiring">
              Expiring ({getCounts("expiring")})
            </TabsTrigger>
            <TabsTrigger value="shared">
              Shared ({getCounts("shared")})
            </TabsTrigger>
            <TabsTrigger value="erc7715">
              ERC-7715 ({getCounts("erc7715")})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Subscriptions Grid */}
        <motion.div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          } gap-6`}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredSubscriptions.map((sub) => {
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
                          <DropdownMenuItem onClick={() => openEditModal(sub)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openShareModal(sub)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openStatsModal(sub)}>
                            <BarChart2 className="mr-2 h-4 w-4" />
                            Stats
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(sub)}
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
                        <span className="text-muted-foreground">
                          Next Payment
                        </span>
                        <span>{formatDate(sub.nextPayment)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status</span>
                        <Badge
                          className={`${statusVariants[sub.status].bg} ${statusVariants[sub.status].text}`}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {sub.status.charAt(0).toUpperCase() +
                            sub.status.slice(1)}
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
                    {expandedSubscription === sub.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-4 space-y-2 text-sm"
                      >
                        <p>
                          <span className="text-muted-foreground">
                            Description:
                          </span>{" "}
                          {sub.description || "N/A"}
                        </p>
                        <p>
                          <span className="text-muted-foreground">
                            Total Spent:
                          </span>{" "}
                          {sub.totalSpent || "N/A"}
                        </p>
                        <p>
                          <span className="text-muted-foreground">
                            Total Payments:
                          </span>{" "}
                          {sub.totalPayments || 0}
                        </p>
                        {sub.remainingPayments && (
                          <p>
                            <span className="text-muted-foreground">
                              Remaining Payments:
                            </span>{" "}
                            {sub.remainingPayments}
                          </p>
                        )}
                        {sub.sharedWith && (
                          <p>
                            <span className="text-muted-foreground">
                              Shared With:
                            </span>{" "}
                            {sub.sharedWith.join(", ")}
                          </p>
                        )}
                        {sub.erc7715 && (
                          <>
                            <p>
                              <span className="text-muted-foreground">
                                Contract:
                              </span>{" "}
                              {sub.contractAddress?.substring(0, 6)}...
                              {sub.contractAddress?.substring(
                                sub.contractAddress.length - 4
                              )}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Token:
                              </span>{" "}
                              {sub.tokenAddress?.substring(0, 6)}...
                              {sub.tokenAddress?.substring(
                                sub.tokenAddress.length - 4
                              )}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Recipient:
                              </span>{" "}
                              {sub.recipient?.substring(0, 6)}...
                              {sub.recipient?.substring(
                                sub.recipient.length - 4
                              )}
                            </p>
                          </>
                        )}
                      </motion.div>
                    )}
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
                      {expandedSubscription === sub.id
                        ? "Show Less"
                        : "Show More"}
                      <ChevronRight
                        className={`ml-2 h-4 w-4 transition-transform ${
                          expandedSubscription === sub.id ? "rotate-90" : ""
                        }`}
                      />
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open("https://example.com", "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Visit Website</TooltipContent>
                    </Tooltip>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Add Subscription Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
              <DialogDescription>
                Enter the details for your new subscription.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formState.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Netflix"
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  value={formState.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="$9.99"
                />
              </div>
              <div>
                <Label>Frequency</Label>
                <Select
                  value={formState.frequency}
                  onValueChange={(value) =>
                    handleInputChange("frequency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Next Payment Date</Label>
                <Input
                  type="date"
                  value={formState.nextPayment}
                  onChange={(e) =>
                    handleInputChange("nextPayment", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={formState.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select
                  value={formState.paymentMethod}
                  onValueChange={(value) =>
                    handleInputChange("paymentMethod", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value as Subscription["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="expiring">Expiring</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={formState.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Optional description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formState.erc7715}
                  onCheckedChange={(checked) =>
                    handleInputChange("erc7715", checked)
                  }
                />
                <Label>Enable ERC-7715 (Smart Subscription)</Label>
              </div>
              {formState.erc7715 && (
                <>
                  <div>
                    <Label>Contract Address</Label>
                    <Input
                      value={formState.contractAddress || ""}
                      onChange={(e) =>
                        handleInputChange("contractAddress", e.target.value)
                      }
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <Label>Token Address</Label>
                    <Input
                      value={formState.tokenAddress || ""}
                      onChange={(e) =>
                        handleInputChange("tokenAddress", e.target.value)
                      }
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <Label>Recipient Address</Label>
                    <Input
                      value={formState.recipient || ""}
                      onChange={(e) =>
                        handleInputChange("recipient", e.target.value)
                      }
                      placeholder="0x..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formState.isAutoRenewing}
                      onCheckedChange={(checked) =>
                        handleInputChange("isAutoRenewing", checked)
                      }
                    />
                    <Label>Auto-Renew</Label>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSubscription}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-500 hover:to-yellow-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Subscription"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Subscription Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subscription</DialogTitle>
              <DialogDescription>
                Update the details for {currentSubscription?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formState.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Netflix"
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  value={formState.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="$9.99"
                />
              </div>
              <div>
                <Label>Frequency</Label>
                <Select
                  value={formState.frequency}
                  onValueChange={(value) =>
                    handleInputChange("frequency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Next Payment Date</Label>
                <Input
                  type="date"
                  value={formState.nextPayment}
                  onChange={(e) =>
                    handleInputChange("nextPayment", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={formState.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select
                  value={formState.paymentMethod}
                  onValueChange={(value) =>
                    handleInputChange("paymentMethod", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value as Subscription["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="expiring">Expiring</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={formState.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Optional description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formState.erc7715}
                  onCheckedChange={(checked) =>
                    handleInputChange("erc7715", checked)
                  }
                />
                <Label>Enable ERC-7715 (Smart Subscription)</Label>
              </div>
              {formState.erc7715 && (
                <>
                  <div>
                    <Label>Contract Address</Label>
                    <Input
                      value={formState.contractAddress || ""}
                      onChange={(e) =>
                        handleInputChange("contractAddress", e.target.value)
                      }
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <Label>Token Address</Label>
                    <Input
                      value={formState.tokenAddress || ""}
                      onChange={(e) =>
                        handleInputChange("tokenAddress", e.target.value)
                      }
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <Label>Recipient Address</Label>
                    <Input
                      value={formState.recipient || ""}
                      onChange={(e) =>
                        handleInputChange("recipient", e.target.value)
                      }
                      placeholder="0x..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formState.isAutoRenewing}
                      onCheckedChange={(checked) =>
                        handleInputChange("isAutoRenewing", checked)
                      }
                    />
                    <Label>Auto-Renew</Label>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubscription}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Subscription"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Subscription Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {currentSubscription?.name}? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteSubscription}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Share Subscription Modal */}
        <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Subscription</DialogTitle>
              <DialogDescription>
                Share {currentSubscription?.name} with others.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  placeholder="Enter email address"
                  onChange={(e) => handleInputChange("sharedWith", e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsShareModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Ensure we're passing a string to handleShareSubscription
                  const emailToShare = 
                    typeof formState.sharedWith === 'string' 
                      ? formState.sharedWith 
                      : "user@example.com";
                  handleShareSubscription(emailToShare);
                }
                }
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  "Share"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stats Modal */}
        <Dialog open={isStatsModalOpen} onOpenChange={setIsStatsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subscription Stats</DialogTitle>
              <DialogDescription>
                Statistics for {currentSubscription?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-bold">
                  {currentSubscription?.totalSpent || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Payments</span>
                <span className="font-bold">
                  {currentSubscription?.totalPayments || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Average Payment
                </span>
                <span className="font-bold">
                  $
                  {currentSubscription?.totalPayments
                    ? (
                        parseFloat(
                          currentSubscription.totalSpent?.replace("$", "") || "0"
                        ) / currentSubscription.totalPayments
                      ).toFixed(2)
                    : "0.00"}
                </span>
              </div>
              {currentSubscription?.remainingPayments && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Remaining Payments
                  </span>
                  <span className="font-bold">
                    {currentSubscription.remainingPayments}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Payment</span>
                <span className="font-bold">
                  {formatDate(currentSubscription?.lastPayment || "")}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsStatsModalOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}