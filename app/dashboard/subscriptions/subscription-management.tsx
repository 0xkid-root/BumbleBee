"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  X, 
  Edit, 
  Trash2, 
  CreditCard, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Filter,
  ArrowUpDown,
  Search,
  Share2,
  Wallet,
  Tag,
  UserPlus,
  MoreHorizontal,
  ExternalLink,
  Info,
  Loader2,
  Copy,
  Check
} from "lucide-react"

// Wallet integration
import { useWalletStore } from "@/lib/store/use-wallet-store"
import { useAccount, useContractRead, useContractWrite } from "wagmi"
import { parseEther, formatEther } from "viem"
import { ConnectWalletCard } from "@/components/wallet/connect-wallet-card"
import { ConnectWalletModal } from "@/components/wallet/connect-wallet-modal"

// Toast notifications
import { useToast } from "@/hooks/use-toast"

// Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Define subscription types
interface Subscription {
  id: string
  name: string
  amount: string
  numericAmount: number
  frequency: string
  nextPayment: string
  category: string
  paymentMethod: string
  status: "active" | "paused" | "expiring" | "shared"
  startDate: string
  description?: string
  logo?: string
  color?: string
  contractAddress?: string
  sharedWith?: User[]
  ownerAddress?: string
  lastPayment?: string
  erc7715?: boolean
}

interface User {
  id: string
  name: string
  address: string
  avatar?: string
}

interface FormState {
  name: string
  amount: string
  frequency: string
  nextPayment: string
  category: string
  paymentMethod: string
  status: "active" | "paused" | "expiring" | "shared"
  description: string
  contractAddress: string
  erc7715: boolean
}

// Sample user data
const currentUser: User = {
  id: "1",
  name: "Alex Smith",
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  avatar: "/avatars/alex.jpg"
}

// Sample subscription data
const initialSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    amount: "$15.99",
    numericAmount: 15.99,
    frequency: "Monthly",
    nextPayment: "May 15, 2025",
    category: "Entertainment",
    paymentMethod: "Visa •••• 4242",
    status: "active",
    startDate: "2023-01-15",
    description: "Standard HD streaming plan",
    color: "#E50914",
    lastPayment: "April 15, 2025",
    erc7715: false
  },
  {
    id: "2",
    name: "Spotify Premium",
    amount: "$9.99",
    numericAmount: 9.99,
    frequency: "Monthly",
    nextPayment: "May 21, 2025",
    category: "Entertainment",
    paymentMethod: "MetaMask",
    status: "active",
    startDate: "2022-11-21",
    description: "Individual music streaming plan",
    color: "#1DB954",
    contractAddress: "0xF4e5b2BD033A4EfC50A72Ba38Fed6B05108eF3f1",
    lastPayment: "April 21, 2025",
    erc7715: true
  },
  {
    id: "3",
    name: "Adobe Creative Cloud",
    amount: "$54.99",
    numericAmount: 54.99,
    frequency: "Monthly",
    nextPayment: "May 18, 2025",
    category: "Productivity",
    paymentMethod: "XDC Wallet",
    status: "active",
    startDate: "2022-08-18",
    description: "Full creative suite access",
    color: "#FF0000",
    contractAddress: "0x8942eB09e6Cc1c4A9B34D52aF534b1d6A1ACDc1f",
    lastPayment: "April 18, 2025",
    erc7715: true
  },
  {
    id: "4",
    name: "iCloud Storage",
    amount: "$2.99",
    numericAmount: 2.99,
    frequency: "Monthly",
    nextPayment: "May 25, 2025",
    category: "Storage",
    paymentMethod: "Apple Pay",
    status: "expiring",
    startDate: "2022-05-25",
    description: "200GB storage plan, expires in 2 days",
    color: "#A2AAAD",
    lastPayment: "April 25, 2025",
    erc7715: false
  },
  {
    id: "5",
    name: "Amazon Prime",
    amount: "$139.00",
    numericAmount: 139.00,
    frequency: "Yearly",
    nextPayment: "Jan 12, 2026",
    category: "Shopping",
    paymentMethod: "Amex •••• 7890",
    status: "active",
    startDate: "2023-01-12",
    description: "Prime membership including shipping and streaming",
    color: "#FF9900",
    lastPayment: "January 12, 2025",
    erc7715: false
  },
  {
    id: "6",
    name: "Bumblebee Pro",
    amount: "$25.00",
    numericAmount: 25.00,
    frequency: "Monthly",
    nextPayment: "May 30, 2025",
    category: "Finance",
    paymentMethod: "MetaMask",
    status: "active",
    startDate: "2024-01-30",
    description: "Advanced portfolio management and AI features",
    color: "#F0BC41",
    contractAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    lastPayment: "April 30, 2025",
    erc7715: true
  },
  {
    id: "7",
    name: "Family Disney+",
    amount: "$7.99",
    numericAmount: 7.99,
    frequency: "Monthly",
    nextPayment: "May 14, 2025",
    category: "Entertainment",
    paymentMethod: "XDC Wallet",
    status: "shared",
    startDate: "2023-05-14",
    description: "Family plan shared with 4 members",
    color: "#113CCF",
    contractAddress: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    sharedWith: [
      { id: "2", name: "Jamie Lee", address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", avatar: "/avatars/jamie.jpg" },
      { id: "3", name: "Chris Wong", address: "0x3546BcD3c84621e976D8185a91A922aE77ECEc30", avatar: "/avatars/chris.jpg" },
      { id: "4", name: "Pat Johnson", address: "0x4546BcD3c84621e976D8185a91A922aE77ECEc30", avatar: "/avatars/pat.jpg" }
    ],
    ownerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    lastPayment: "April 14, 2025",
    erc7715: true
  }
]

// Predefined data for dropdowns
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
  "Other"
]

const frequencies = [
  "Daily",
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "Quarterly",
  "Yearly"
]

const paymentMethods = [
  "MetaMask",
  "XDC Wallet",
  "Visa •••• 4242",
  "Mastercard •••• 5555",
  "Amex •••• 7890",
  "Apple Pay",
  "Google Pay"
]

// Status badge variant map for styling
const statusVariants = {
  active: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-400", icon: CheckCircle },
  paused: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-400", icon: Clock },
  expiring: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-400", icon: AlertCircle },
  shared: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-400", icon: Share2 }
}

export function SubscriptionManagement() {
  // State management
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("nextPayment")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isInfoTooltipVisible, setIsInfoTooltipVisible] = useState(false)
  
  // Form state
  const [formState, setFormState] = useState<FormState>({
    name: "",
    amount: "",
    frequency: "Monthly",
    nextPayment: "",
    category: "Entertainment",
    paymentMethod: "MetaMask",
    status: "active",
    description: "",
    contractAddress: "",
    erc7715: false
  })
  
  // Handle form input changes
  const handleFormChange = (field: keyof FormState, value: string | boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Filter and sort subscriptions
  const filteredSubscriptions = subscriptions
    .filter(sub => {
      if (filter === "all") return true
      if (filter === "erc7715") return sub.erc7715
      if (filter === "shared") return sub.status === "shared"
      return sub.status === filter
    })
    .filter(sub => {
      if (!searchQuery) return true
      return sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             sub.category.toLowerCase().includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "amount":
          return a.numericAmount - b.numericAmount
        case "nextPayment":
          return new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime()
        default:
          return 0
      }
    })
  
  // Calculate monthly spending
  const monthlySpending = subscriptions
    .filter(sub => sub.status === "active" || sub.status === "shared")
    .reduce((total, sub) => {
      if (sub.frequency === "Monthly") return total + sub.numericAmount
      if (sub.frequency === "Yearly") return total + (sub.numericAmount / 12)
      if (sub.frequency === "Quarterly") return total + (sub.numericAmount / 3)
      if (sub.frequency === "Weekly") return total + (sub.numericAmount * 4.33)
      if (sub.frequency === "Bi-weekly") return total + (sub.numericAmount * 2.17)
      if (sub.frequency === "Daily") return total + (sub.numericAmount * 30)
      return total
    }, 0)
  
  // Handle subscription actions
  const handleAddSubscription = () => {
    const newSubscription: Subscription = {
      id: `${subscriptions.length + 1}`,
      name: formState.name,
      amount: formState.amount.startsWith("$") ? formState.amount : `$${formState.amount}`,
      numericAmount: parseFloat(formState.amount.replace(/[^0-9.]/g, '')),
      frequency: formState.frequency,
      nextPayment: formState.nextPayment,
      category: formState.category,
      paymentMethod: formState.paymentMethod,
      status: formState.status,
      startDate: new Date().toISOString().split('T')[0],
      description: formState.description,
      erc7715: formState.erc7715
    }
    
    if (formState.erc7715 && formState.contractAddress) {
      newSubscription.contractAddress = formState.contractAddress
    }
    
    setSubscriptions([...subscriptions, newSubscription])
    setIsAddModalOpen(false)
    resetForm()
  }
  
  const handleEditSubscription = () => {
    if (!selectedSubscription) return
    
    const updatedSubscriptions = subscriptions.map(sub => {
      if (sub.id === selectedSubscription.id) {
        return {
          ...sub,
          name: formState.name,
          amount: formState.amount.startsWith("$") ? formState.amount : `$${formState.amount}`,
          numericAmount: parseFloat(formState.amount.replace(/[^0-9.]/g, '')),
          frequency: formState.frequency,
          nextPayment: formState.nextPayment,
          category: formState.category,
          paymentMethod: formState.paymentMethod,
          status: formState.status,
          description: formState.description,
          contractAddress: formState.erc7715 ? formState.contractAddress : undefined,
          erc7715: formState.erc7715
        }
      }
      return sub
    })
    
    setSubscriptions(updatedSubscriptions)
    setIsEditModalOpen(false)
    setSelectedSubscription(null)
  }
  
  const handleDeleteSubscription = () => {
    if (!selectedSubscription) return
    
    const updatedSubscriptions = subscriptions.filter(
      sub => sub.id !== selectedSubscription.id
    )
    
    setSubscriptions(updatedSubscriptions)
    setIsDeleteModalOpen(false)
    setSelectedSubscription(null)
  }
  
  const openEditModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setFormState({
      name: subscription.name,
      amount: subscription.amount,
      frequency: subscription.frequency,
      nextPayment: subscription.nextPayment,
      category: subscription.category,
      paymentMethod: subscription.paymentMethod,
      status: subscription.status,
      description: subscription.description || "",
      contractAddress: subscription.contractAddress || "",
      erc7715: subscription.erc7715 || false
    })
    setIsEditModalOpen(true)
  }
  
  const openDeleteModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setIsDeleteModalOpen(true)
  }
  
  const openShareModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setIsShareModalOpen(true)
  }
  
  const openInfoModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setIsInfoModalOpen(true)
  }
  
  const resetForm = () => {
    setFormState({
      name: "",
      amount: "",
      frequency: "Monthly",
      nextPayment: "",
      category: "Entertainment",
      paymentMethod: "MetaMask",
      status: "active",
      description: "",
      contractAddress: "",
      erc7715: false
    })
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  }
  
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const cardVariants = {
    hover: { 
      scale: 1.02,
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  }
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  return (
    <motion.div 
      className="space-y-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with summary info */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Monthly Spending",
            value: formatCurrency(monthlySpending),
            icon: CreditCard,
            bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30"
          },
          {
            title: "Active Subscriptions",
            value: subscriptions.filter(s => s.status === "active" || s.status === "shared").length,
            icon: CheckCircle,
            bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30"
          },
          {
            title: "ERC-7715 Subscriptions",
            value: subscriptions.filter(s => s.erc7715).length,
            icon: Wallet,
            bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30",
            tooltip: true
          }
        ].map((item, index) => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            whileHover={cardVariants.hover}
            className={`rounded-xl p-6 flex items-center justify-between ${item.bg} shadow-lg`}
          >
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.title}</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{item.value}</p>
                {item.tooltip && (
                  <motion.div 
                    className="relative"
                    onMouseEnter={() => setIsInfoTooltipVisible(true)}
                    onMouseLeave={() => setIsInfoTooltipVisible(false)}
                  >
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                    <AnimatePresence>
                      {isInfoTooltipVisible && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -10 }}
                          className="absolute bottom-6 right-0 z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl"
                        >
                          ERC-7715 enables secure, transparent on-chain recurring payments with automated scheduling.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/20 dark:bg-black/20 flex items-center justify-center">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Main card */}
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <CardTitle className="text-2xl font-bold">Subscription Management</CardTitle>
              <CardDescription>Track and manage your recurring payments effortlessly</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.div 
                className="relative w-full sm:w-64"
                whileHover={{ scale: 1.02 }}
              >
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search subscriptions..." 
                  className="pl-10 w-full rounded-full border-gray-200 dark:border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" className="gap-1 rounded-full">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-lg">
                  <DropdownMenuItem onClick={() => setFilter("all")}>All Subscriptions</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("paused")}>Paused</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("expiring")}>Expiring Soon</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("shared")}>Shared</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilter("erc7715")}>ERC-7715 Subscriptions</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" className="gap-1 rounded-full">
                      <ArrowUpDown className="h-4 w-4" />
                      <span>Sort</span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-lg">
                  <DropdownMenuItem onClick={() => setSortBy("name")}>Sort by Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("amount")}>Sort by Amount</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("nextPayment")}>Sort by Next Payment</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent>
          {filteredSubscriptions.length > 0 ? (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredSubscriptions.map((sub) => {
                const StatusIcon = statusVariants[sub.status].icon
                
                return (
                  <motion.div
                    key={sub.id}
                    variants={itemVariants}
                    whileHover={cardVariants.hover}
                    className="p-5 border rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm relative overflow-hidden"
                  >
                    <motion.div 
                      className="absolute top-0 left-0 w-1.5 h-full"
                      style={{ backgroundColor: sub.color || "#CBD5E1" }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: sub.color || "#CBD5E1" }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {sub.logo ? (
                            <img src={sub.logo} alt={sub.name} className="h-12 w-12 rounded-lg object-cover" />
                          ) : (
                            sub.name.substring(0, 2).toUpperCase()
                          )}
                        </motion.div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{sub.name}</h4>
                            {sub.erc7715 && (
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                ERC-7715
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{sub.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {sub.category}
                            </Badge>
                            <Badge 
                              className={`text-xs flex items-center gap-1 ${statusVariants[sub.status].bg} ${statusVariants[sub.status].text}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <span className="font-semibold text-lg">{sub.amount}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{sub.frequency}</p>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-lg">
                            <DropdownMenuItem onClick={() => openEditModal(sub)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openInfoModal(sub)}>
                              <Info className="h-4 w-4 mr-2" />
                              Details
                            </DropdownMenuItem>
                            {sub.erc7715 && (
                              <DropdownMenuItem onClick={() => openShareModal(sub)}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                            )}
                            {sub.contractAddress && (
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View on Explorer
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => openDeleteModal(sub)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="flex flex-wrap justify-between text-xs text-gray-500 dark:text-gray-400 mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Next: {sub.nextPayment}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          <span>{sub.paymentMethod}</span>
                        </div>
                      </div>
                      
                      {sub.status === "shared" && sub.sharedWith && (
                        <div className="flex items-center gap-2">
                          <span>Shared with:</span>
                          <div className="flex -space-x-2">
                            {sub.sharedWith.slice(0, 3).map((user, i) => (
                              <motion.img
                                key={user.id}
                                src={user.avatar || "/avatars/default.jpg"}
                                alt={user.name}
                                className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800"
                                style={{ zIndex: sub.sharedWith!.length - i }}
                                whileHover={{ scale: 1.2 }}
                              />
                            ))}
                            {sub.sharedWith.length > 3 && (
                              <motion.div 
                                className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-gray-800"
                                whileHover={{ scale: 1.2 }}
                              >
                                +{sub.sharedWith.length - 3}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-gray-500 dark:text-gray-400 text-lg">No subscriptions found.</p>
            </motion.div>
          )}
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6"
          >
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto rounded-full bg-gradient-to-r from-primary to-primary/80">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subscription
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-xl">
                <DialogHeader>
                  <DialogTitle>Add New Subscription</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new subscription. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <motion.div 
                  className="grid gap-4 py-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    { label: "Name", id: "name", type: "text", value: formState.name },
                    { label: "Amount", id: "amount", type: "text", value: formState.amount, placeholder: "$0.00" },
                    { label: "Next Payment", id: "nextPayment", type: "date", value: formState.nextPayment },
                    { label: "Description", id: "description", type: "text", value: formState.description }
                  ].map((field) => (
                    <motion.div 
                      key={field.id} 
                      className="grid grid-cols-4 items-center gap-4"
                      variants={itemVariants}
                    >
                      <Label htmlFor={field.id} className="text-right font-medium">{field.label}</Label>
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => handleFormChange(field.id as keyof FormState, e.target.value)}
                        className="col-span-3 rounded-lg"
                      />
                    </motion.div>
                  ))}
                  
                  <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
                    <Label htmlFor="frequency" className="text-right font-medium">Frequency</Label>
                    <Select
                      value={formState.frequency}
                      onValueChange={(value) => handleFormChange('frequency', value)}
                    >
                      <SelectTrigger className="col-span-3 rounded-lg">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        {frequencies.map((freq) => (
                          <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                  
                  <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
                    <Label htmlFor="category" className="text-right font-medium">Category</Label>
                    <Select
                      value={formState.category}
                      onValueChange={(value) => handleFormChange('category', value)}
                    >
                      <SelectTrigger className="col-span-3 rounded-lg">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                  
                  <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
                    <Label htmlFor="paymentMethod" className="text-right font-medium">Payment Method</Label>
                    <Select
                      value={formState.paymentMethod}
                      onValueChange={(value) => handleFormChange('paymentMethod', value)}
                    >
                      <SelectTrigger className="col-span-3 rounded-lg">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                  
                  <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
                    <Label htmlFor="erc7715" className="text-right font-medium">ERC-7715</Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="erc7715"
                        checked={formState.erc7715}
                        onCheckedChange={(checked) => handleFormChange('erc7715', checked)}
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Enable on-chain recurring payments
                      </span>
                    </div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {formState.erc7715 && (
                      <motion.div 
                        className="grid grid-cols-4 items-center gap-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Label htmlFor="contractAddress" className="text-right font-medium">Contract Address</Label>
                        <Input
                          id="contractAddress"
                          value={formState.contractAddress}
                          onChange={(e) => handleFormChange('contractAddress', e.target.value)}
                          className="col-span-3 rounded-lg"
                          placeholder="0x..."
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <DialogFooter>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="rounded-lg">
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={handleAddSubscription} 
                      disabled={!formState.name || !formState.amount}
                      className="rounded-lg bg-gradient-to-r from-primary to-primary/80"
                    >
                      Save
                    </Button>
                  </motion.div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Make changes to your subscription. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            className="grid gap-4 py-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: "Name", id: "name", type: "text", value: formState.name },
              { label: "Amount", id: "amount", type: "text", value: formState.amount, placeholder: "$0.00" },
              { label: "Next Payment", id: "nextPayment", type: "date", value: formState.nextPayment },
              { label: "Description", id: "description", type: "text", value: formState.description }
            ].map((field) => (
              <motion.div 
                key={field.id} 
                className="grid grid-cols-4 items-center gap-4"
                variants={itemVariants}
              >
                <Label htmlFor={field.id} className="text-right font-medium">{field.label}</Label>
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => handleFormChange(field.id as keyof FormState, e.target.value)}
                  className="col-span-3 rounded-lg"
                />
              </motion.div>
            ))}
            
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="frequency" className="text-right font-medium">Frequency</Label>
              <Select
                value={formState.frequency}
                onValueChange={(value) => handleFormChange('frequency', value)}
              >
                <SelectTrigger className="col-span-3 rounded-lg">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {frequencies.map((freq) => (
                    <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="category" className="text-right font-medium">Category</Label>
              <Select
                value={formState.category}
                onValueChange={(value) => handleFormChange('category', value)}
              >
                <SelectTrigger className="col-span-3 rounded-lg">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="paymentMethod" className="text-right font-medium">Payment Method</Label>
              <Select
                value={formState.paymentMethod}
                onValueChange={(value) => handleFormChange('paymentMethod', value)}
              >
                <SelectTrigger className="col-span-3 rounded-lg">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="status" className="text-right font-medium">Status</Label>
              <Select
                value={formState.status}
                onValueChange={(value) => handleFormChange('status', value as "active" | "paused" | "expiring" | "shared")}
              >
                <SelectTrigger className="col-span-3 rounded-lg">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="expiring">Expiring</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="erc7715" className="text-right font-medium">ERC-7715</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="erc7715"
                  checked={formState.erc7715}
                  onCheckedChange={(checked) => handleFormChange('erc7715', checked)}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Enable on-chain recurring payments
                </span>
              </div>
            </motion.div>
            
            <AnimatePresence>
              {formState.erc7715 && (
                <motion.div 
                  className="grid grid-cols-4 items-center gap-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="contractAddress" className="text-right font-medium">Contract Address</Label>
                  <Input
                    id="contractAddress"
                    value={formState.contractAddress}
                    onChange={(e) => handleFormChange('contractAddress', e.target.value)}
                    className="col-span-3 rounded-lg"
                    placeholder="0x..."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="rounded-lg">
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleEditSubscription} 
                disabled={!formState.name || !formState.amount}
                className="rounded-lg bg-gradient-to-r from-primary to-primary/80"
              >
                Save
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Delete Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedSubscription?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="rounded-lg">
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="destructive" onClick={handleDeleteSubscription} className="rounded-lg">
                Delete
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Share {selectedSubscription?.name}</DialogTitle>
            <DialogDescription>
              Invite others to share this subscription or manage existing members.
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            className="space-y-4 py-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="flex gap-2" variants={itemVariants}>
              <Input placeholder="Enter wallet address or ENS" className="flex-1 rounded-lg" />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="rounded-lg">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </motion.div>
            </motion.div>
            {selectedSubscription?.sharedWith && (
              <motion.div className="space-y-2" variants={itemVariants}>
                <h4 className="text-sm font-medium">Current Members</h4>
                {selectedSubscription.sharedWith.map((user) => (
                  <motion.div 
                    key={user.id} 
                    className="flex items-center justify-between p-3 border rounded-lg bg-white/50 dark:bg-gray-800/50"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.img
                        src={user.avatar || "/avatars/default.jpg"}
                        alt={user.name}
                        className="h-9 w-9 rounded-full"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-48">
                          {user.address}
                        </p>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={() => setIsShareModalOpen(false)} className="rounded-lg">
                Close
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-xl">
          <DialogHeader>
            <DialogTitle>{selectedSubscription?.name} Details</DialogTitle>
            <DialogDescription>
              Detailed information about your subscription.
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            className="space-y-4 py-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                <p className="font-medium">{selectedSubscription?.amount} / {selectedSubscription?.frequency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                <p className="font-medium">{selectedSubscription?.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Next Payment</p>
                <p className="font-medium">{selectedSubscription?.nextPayment}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                <p className="font-medium">{selectedSubscription?.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className="font-medium capitalize">{selectedSubscription?.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                <p className="font-medium">{selectedSubscription?.startDate}</p>
              </div>
              {selectedSubscription?.lastPayment && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Payment</p>
                  <p className="font-medium">{selectedSubscription.lastPayment}</p>
                </div>
              )}
              {selectedSubscription?.erc7715 && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ERC-7715</p>
                  <p className="font-medium">Enabled</p>
                </div>
              )}
              {selectedSubscription?.contractAddress && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contract Address</p>
                  <p className="font-medium truncate">{selectedSubscription.contractAddress}</p>
                </div>
              )}
            </motion.div>
            {selectedSubscription?.description && (
              <motion.div variants={itemVariants}>
                <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                <p className="font-medium">{selectedSubscription.description}</p>
              </motion.div>
            )}
            {selectedSubscription?.sharedWith && (
              <motion.div variants={itemVariants}>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shared With</p>
                <div className="space-y-3 mt-2">
                  {selectedSubscription.sharedWith.map((user) => (
                    <motion.div 
                      key={user.id} 
                      className="flex items-center gap-3"
                      whileHover={{ scale: 1.02 }}
                    >
                      <img
                        src={user.avatar || "/avatars/default.jpg"}
                        alt={user.name}
                        className="h-7 w-7 rounded-full"
                      />
                      <p className="font-medium">{user.name}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={() => setIsInfoModalOpen(false)} className="rounded-lg">
                Close
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}