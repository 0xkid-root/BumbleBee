"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
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
}

export default function SubscriptionManagement() {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const chainId = useAccount().chainId;
  const { switchChainAsync } = useSwitchChain();

  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

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
    "Other",
  ];

  const frequencies = ["Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Yearly"];
  const paymentMethods = ["MetaMask", "WalletConnect", "Coinbase Wallet"];

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

  // Load mock data on mount
  useEffect(() => {
    const now = new Date();
    const mockSubs: Subscription[] = [
      {
        id: "sub_1",
        name: "Netflix",
        amount: "$15.99",
        numericAmount: 15.99,
        frequency: "Monthly",
        nextPayment: new Date(now.getFullYear(), now.getMonth() + 1, 5).toISOString(),
        category: "Entertainment",
        paymentMethod: "Credit Card",
        status: "active",
        description: "Streaming service",
        erc7715: false,
      },
      {
        id: "sub_2",
        name: "Spotify",
        amount: "$9.99",
        numericAmount: 9.99,
        frequency: "Monthly",
        nextPayment: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
        category: "Entertainment",
        paymentMethod: "Apple Pay",
        status: "active",
        description: "Music streaming",
        contractAddress: "0xAbc...def",
        tokenAddress: "0xToken2Addr",
        recipient: "0xRecipient123",
        erc7715: true,
        isAutoRenewing: true,
        color: "#FFA000",
      },
    ];
    setSubscriptions(mockSubs);
  }, []);

  const filteredSubscriptions = subscriptions
    .filter((sub) => {
      if (activeTab === "all") return true;
      if (activeTab === "erc7715") return sub.erc7715;
      return sub.status === activeTab;
    })
    .filter((sub) =>
      !searchQuery ||
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "amount") return a.numericAmount - b.numericAmount;
      if (sortBy === "nextPayment")
        return new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime();
      if (sortBy === "category") return a.category.localeCompare(b.category);
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
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const openAddModal = () => {
    resetForm();
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

  const resetForm = () => {
    setFormState({
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
  };

  const validateForm = (): boolean => {
    if (!formState.name.trim()) {
      toast({ title: "Error", description: "Name is required." });
      return false;
    }
    if (formState.erc7715 && !isConnected) {
      toast({ title: "Error", description: "Wallet must be connected for ERC-7715." });
      return false;
    }
    if (formState.erc7715 && !isAddress(formState.contractAddress || "")) {
      toast({ title: "Error", description: "Invalid contract address." });
      return false;
    }
    if (formState.erc7715 && !isAddress(formState.recipient || "")) {
      toast({ title: "Error", description: "Invalid recipient address." });
      return false;
    }
    return true;
  };

  const handleAddSubscription = () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const newSub: Subscription = {
        id: `sub_${Date.now()}`,
        name: formState.name,
        amount: `$${parseFloat(formState.amount.replace(/[^0-9.]/g, "")).toFixed(2)}`,
        numericAmount: parseFloat(formState.amount.replace(/[^0-9.]/g, "")),
        frequency: formState.frequency,
        nextPayment: formState.nextPayment,
        category: formState.category,
        paymentMethod: formState.paymentMethod,
        status: formState.status,
        description: formState.description,
        contractAddress: formState.contractAddress,
        erc7715: formState.erc7715,
        tokenAddress: formState.tokenAddress,
        recipient: formState.recipient,
        isAutoRenewing: formState.isAutoRenewing,
        color: formState.color,
      };

      setSubscriptions([...subscriptions, newSub]);
      toast({ title: "Success", description: `${newSub.name} added.` });
      setIsAddModalOpen(false);
      resetForm();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubscription = () => {
    if (!currentSubscription || !validateForm()) return;

    const updatedSub: Subscription = {
      ...currentSubscription,
      name: formState.name,
      amount: `$${parseFloat(formState.amount.replace(/[^0-9.]/g, "")).toFixed(2)}`,
      numericAmount: parseFloat(formState.amount.replace(/[^0-9.]/g, "")),
      frequency: formState.frequency,
      nextPayment: formState.nextPayment,
      category: formState.category,
      paymentMethod: formState.paymentMethod,
      status: formState.status,
      description: formState.description,
      contractAddress: formState.contractAddress,
      erc7715: formState.erc7715,
      tokenAddress: formState.tokenAddress,
      recipient: formState.recipient,
      isAutoRenewing: formState.isAutoRenewing,
      color: formState.color,
    };

    setSubscriptions(
      subscriptions.map((sub) => (sub.id === currentSubscription.id ? updatedSub : sub))
    );
    toast({ title: "Updated", description: `${updatedSub.name} has been updated.` });
    setIsEditModalOpen(false);
    setCurrentSubscription(null);
  };

  const handleDeleteSubscription = () => {
    if (!currentSubscription) return;

    setSubscriptions(subscriptions.filter((sub) => sub.id !== currentSubscription?.id));
    toast({ title: "Deleted", description: `${currentSubscription.name} removed.` });
    setIsDeleteModalOpen(false);
    setCurrentSubscription(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscription Manager</h1>
          <p className="text-muted-foreground">Track and manage recurring payments.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" /> Add Subscription
        </Button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({getCounts("all")})</TabsTrigger>
            <TabsTrigger value="active">Active ({getCounts("active")})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({getCounts("paused")})</TabsTrigger>
            <TabsTrigger value="erc7715">ERC-7715 ({getCounts("erc7715")})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="nextPayment">Next Payment</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subscription List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredSubscriptions.map((sub) => (
          <motion.div key={sub.id} layout>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{sub.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(sub)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => window.open(`https://etherscan.io/address/ ${sub.contractAddress}`, "_blank")}
                        disabled={!sub.erc7715 || !sub.contractAddress}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" /> View on Etherscan
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => openDeleteModal(sub)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className={`${statusVariants[sub.status].bg} ${statusVariants[sub.status].text}`}
                  >
                    {React.createElement(statusVariants[sub.status].icon, {
                      className: "h-4 w-4 mr-1",
                    })}
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </Badge>
                  {sub.erc7715 && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Sparkles className="mr-1 h-3 w-3" />
                      ERC-7715
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{sub.amount}</p>
                <p className="text-sm text-muted-foreground">{sub.frequency}</p>
                <p className="text-sm mt-1">Next Payment: {sub.nextPayment}</p>
                <p className="text-sm">Category: {sub.category}</p>
              </CardContent>
              <CardFooter className="bg-muted/20 py-2 px-4 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Created: {new Date().toLocaleDateString()}
                </span>
                {sub.erc7715 && <Zap className="h-4 w-4 text-yellow-500" />}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Subscription</DialogTitle>
            <DialogDescription>Enter subscription details to add it.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={formState.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount</Label>
              <Input
                id="amount"
                value={formState.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="$0.00"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">Frequency</Label>
              <Select
                value={formState.frequency}
                onValueChange={(value) => handleInputChange("frequency", value)}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nextPayment" className="text-right">Next Payment</Label>
              <Input
                id="nextPayment"
                type="date"
                value={formState.nextPayment}
                onChange={(e) => handleInputChange("nextPayment", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select
                value={formState.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentMethod" className="text-right">Payment Method</Label>
              <Select
                value={formState.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select method" />
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input
                id="description"
                value={formState.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">ERC-7715</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="erc7715"
                  checked={formState.erc7715}
                  onCheckedChange={(checked) => handleInputChange("erc7715", checked)}
                />
                <Label htmlFor="erc7715">Enable ERC-7715 Standard</Label>
              </div>
            </div>
            {formState.erc7715 && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contractAddress" className="text-right">
                    Contract Address
                  </Label>
                  <Input
                    id="contractAddress"
                    value={formState.contractAddress}
                    onChange={(e) => handleInputChange("contractAddress", e.target.value)}
                    placeholder="0x..."
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tokenAddress" className="text-right">Token Address</Label>
                  <Input
                    id="tokenAddress"
                    value={formState.tokenAddress}
                    onChange={(e) => handleInputChange("tokenAddress", e.target.value)}
                    placeholder="0x..."
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipient" className="text-right">Recipient</Label>
                  <Input
                    id="recipient"
                    value={formState.recipient}
                    onChange={(e) => handleInputChange("recipient", e.target.value)}
                    placeholder="0x..."
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Auto-Renew</Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      checked={formState.isAutoRenewing}
                      onCheckedChange={(checked) =>
                        handleInputChange("isAutoRenewing", checked)
                      }
                    />
                    <Label>Enable auto-renewal</Label>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddSubscription}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Add Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>Update the subscription details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={formState.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount</Label>
              <Input
                id="amount"
                value={formState.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="$0.00"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">Frequency</Label>
              <Select
                value={formState.frequency}
                onValueChange={(value) => handleInputChange("frequency", value)}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nextPayment" className="text-right">Next Payment</Label>
              <Input
                id="nextPayment"
                type="date"
                value={formState.nextPayment}
                onChange={(e) => handleInputChange("nextPayment", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select
                value={formState.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input
                id="description"
                value={formState.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdateSubscription}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{currentSubscription?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubscription}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}