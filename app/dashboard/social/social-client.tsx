"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlusCircle,
  Users,
  CreditCard,
  Clock,
  RefreshCw,
  ChevronRight,
  UserPlus,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Contract Address - Update this after deployment
const CONTRACT_ADDRESS = "0xYourContractAddressHere";

// Mock Data
const mockTabs = [
  {
    id: "0",
    name: "Bali Vacation",
    memberCount: 4,
    totalExpenses: "1.85 ETH",
    created: "May 10, 2025",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "1",
    name: "Team Offsites",
    memberCount: 6,
    totalExpenses: "0.72 ETH",
    created: "May 12, 2025",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "2",
    name: "Apartment Expenses",
    memberCount: 3,
    totalExpenses: "0.32 ETH",
    created: "May 15, 2025",
    color: "from-amber-500 to-orange-500",
  },
];

const mockExpenses = [
  {
    id: "0",
    tabId: "0",
    amount: "0.5 ETH",
    description: "Flight tickets",
    date: "May 11, 2025",
    paidBy: "0x7F52...9E1d",
    status: "settled",
  },
  {
    id: "1",
    tabId: "0",
    amount: "0.35 ETH",
    description: "Hotel reservation",
    date: "May 12, 2025",
    paidBy: "0x3A12...76B2",
    status: "pending",
  },
  {
    id: "2",
    tabId: "1",
    amount: "0.2 ETH",
    description: "Team lunch at Nobu",
    date: "May 13, 2025",
    paidBy: "0x9C67...12E8",
    status: "settled",
  },
  {
    id: "3",
    tabId: "1",
    amount: "0.12 ETH",
    description: "Rooftop bar drinks",
    date: "May 14, 2025",
    paidBy: "0x7F52...9E1d",
    status: "pending",
  },
];

const mockStreams = [
  {
    id: "0",
    tabId: "0",
    recipient: "0xAbc...def",
    amountPerSecond: "0.0001 ETH",
    totalAmount: "0.5 ETH",
    duration: "5000",
    startDate: "May 12, 2025",
    status: "active",
  },
  {
    id: "1",
    tabId: "2",
    recipient: "0xF87...92A",
    amountPerSecond: "0.00005 ETH",
    totalAmount: "0.3 ETH",
    duration: "6000",
    startDate: "May 16, 2025",
    status: "pending",
  },
];

const mockMembers = [
  { tabId: "0", address: "0x7F52...9E1d", joined: "May 10, 2025" },
  { tabId: "0", address: "0x3A12...76B2", joined: "May 10, 2025" },
  { tabId: "0", address: "0x9C67...12E8", joined: "May 11, 2025" },
  { tabId: "0", address: "0xF87...92A", joined: "May 12, 2025" },
  { tabId: "1", address: "0x7F52...9E1d", joined: "May 12, 2025" },
  { tabId: "1", address: "0x4D21...58C3", joined: "May 12, 2025" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

// Main Component
export default function SocialPayments() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("tabs");
  const [tabName, setTabName] = useState("");
  const [memberAddress, setMemberAddress] = useState("");
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [paymentRequestRecipient, setPaymentRequestRecipient] = useState("");
  const [paymentRequestAmount, setPaymentRequestAmount] = useState("");
  const [streamRecipient, setStreamRecipient] = useState("");
  const [streamAmount, setStreamAmount] = useState("");
  const [streamDuration, setStreamDuration] = useState("");

  const [isCreateTabModalOpen, setIsCreateTabModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isPaymentRequestModalOpen, setIsPaymentRequestModalOpen] =
    useState(false);
  const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter functions for tab-specific data
  const getTabExpenses = (tabId: string) => {
    return mockExpenses.filter((expense) => expense.tabId === tabId);
  };

  const getTabStreams = (tabId: string) => {
    return mockStreams.filter((stream) => stream.tabId === tabId);
  };

  const getTabMembers = (tabId: string) => {
    return mockMembers.filter((member) => member.tabId === tabId);
  };

  // Handle Create Tab
  const handleCreateTab = async () => {
    if (!tabName.trim()) {
      toast({
        title: "Validation",
        description: "Tab name is required.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    // Simulate contract interaction
    setTimeout(() => {
      toast({
        title: "Success",
        description: `Tab "${tabName}" created.`,
      });
      setTabName("");
      setIsCreateTabModalOpen(false);
      setLoading(false);
    }, 1500);
  };

  // Handle Add Member
  const handleAddMember = async () => {
    if (!selectedTabId || !memberAddress) {
      toast({
        title: "Validation",
        description: "Select a tab and enter a wallet address.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    // Simulate contract interaction
    setTimeout(() => {
      toast({
        title: "Success",
        description: `${memberAddress} added to tab.`,
      });
      setMemberAddress("");
      setIsAddMemberModalOpen(false);
      setLoading(false);
    }, 1500);
  };

  // Handle Add Expense
  const handleAddExpense = async () => {
    if (!selectedTabId || !expenseAmount || !expenseDescription) {
      toast({
        title: "Validation",
        description: "Fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    // Simulate contract interaction
    setTimeout(() => {
      toast({
        title: "Success",
        description: `Expense of ${expenseAmount} ETH added.`,
      });
      setExpenseAmount("");
      setExpenseDescription("");
      setIsAddExpenseModalOpen(false);
      setLoading(false);
    }, 1500);
  };

  // Handle Payment Request
  const handleCreatePaymentRequest = async () => {
    if (!selectedTabId || !paymentRequestRecipient || !paymentRequestAmount) {
      toast({
        title: "Validation",
        description: "Fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    // Simulate contract interaction
    setTimeout(() => {
      toast({
        title: "Success",
        description: `Payment request sent to ${paymentRequestRecipient}.`,
      });
      setPaymentRequestRecipient("");
      setPaymentRequestAmount("");
      setIsPaymentRequestModalOpen(false);
      setLoading(false);
    }, 1500);
  };

  // Handle Stream Setup
  const handleReleaseStream = async () => {
    if (
      !selectedTabId ||
      !streamRecipient ||
      !streamAmount ||
      !streamDuration
    ) {
      toast({
        title: "Validation",
        description: "Fill in all stream fields.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    // Simulate contract interaction
    setTimeout(() => {
      toast({
        title: "Success",
        description: `Recurring payment setup for ${streamRecipient}.`,
      });
      setStreamRecipient("");
      setStreamAmount("");
      setStreamDuration("");
      setIsStreamModalOpen(false);
      setLoading(false);
    }, 1500);
  };

  const renderSelectedTabDetails = () => {
    if (!selectedTabId) return null;

    const tab = mockTabs.find((tab) => tab.id === selectedTabId);
    if (!tab) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4"
      >
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{tab.name} Details</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMembersModalOpen(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              {tab.memberCount} Members
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="font-medium">{tab.totalExpenses}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created On</p>
              <p className="font-medium">{tab.created}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Animated Header */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Social Payments
          </h1>
          <p className="text-muted-foreground">
            Manage shared expenses on-chain with friends
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsCreateTabModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Tab
          </Button>
        </motion.div>
      </motion.div>

      {/* Connection Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg p-4 flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm font-medium">
              Connected:{" "}
              {address
                ? address.substring(0, 6) + "..." + address.substring(address.length - 4)
                : "Not Connected"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Contract:{" "}
            {CONTRACT_ADDRESS.substring(0, 6) +
              "..." +
              CONTRACT_ADDRESS.substring(CONTRACT_ADDRESS.length - 4)}
          </span>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-indigo-50 dark:bg-indigo-950/20">
            <TabsTrigger
              value="tabs"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              <Users className="mr-2 h-4 w-4" />
              Tabs
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger
              value="streams"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Streams
            </TabsTrigger>
          </TabsList>

          {/* Tabs Panel */}
          <TabsContent value="tabs">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  My Tabs
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isDataLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <motion.ul
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                  >
                    {mockTabs.map((tab) => (
                      <motion.li key={tab.id} variants={itemVariants}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            onClick={() => setSelectedTabId(tab.id)}
                            className={`w-full p-4 border rounded-lg transition-all duration-200 ${
                              selectedTabId === tab.id
                                ? "border-indigo-300 shadow-md bg-white dark:bg-gray-800 dark:border-indigo-800"
                                : "hover:border-gray-300 bg-white dark:bg-gray-900"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div
                                  className={`h-10 w-10 rounded-full bg-gradient-to-br ${tab.color} flex items-center justify-center text-white font-bold`}
                                >
                                  {tab.name.charAt(0)}
                                </div>
                                <div className="ml-3 text-left">
                                  <h3 className="font-medium">{tab.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {tab.memberCount} members · {tab.totalExpenses}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </button>
                        </motion.div>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}

                {renderSelectedTabDetails()}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsAddMemberModalOpen(true)}
                  disabled={!selectedTabId}
                  className="border-indigo-200 dark:border-indigo-800/30"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsPaymentRequestModalOpen(true)}
                  disabled={!selectedTabId}
                  className="border-indigo-200 dark:border-indigo-800/30"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Request Payment
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Expenses Panel */}
          <TabsContent value="expenses">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Add New Expense
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Select Tab</Label>
                      <Select
                        onValueChange={setSelectedTabId}
                        value={selectedTabId || ""}
                      >
                        <SelectTrigger className="border-indigo-200 dark:border-indigo-800/30">
                          <SelectValue placeholder="Select a tab" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTabs.map((tab) => (
                            <SelectItem key={tab.id} value={tab.id}>
                              {tab.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amount (ETH)</Label>
                      <Input
                        type="number"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        placeholder="0.00"
                        className="border-indigo-200 dark:border-indigo-800/30"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={expenseDescription}
                        onChange={(e) => setExpenseDescription(e.target.value)}
                        className="border-indigo-200 dark:border-indigo-800/30"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleAddExpense}
                    disabled={
                      !selectedTabId ||
                      !expenseAmount ||
                      !expenseDescription ||
                      loading
                    }
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Expense
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Recent Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 max-h-96 overflow-y-auto">
                  {isDataLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i: number) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : selectedTabId ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {getTabExpenses(selectedTabId).length > 0 ? (
                        getTabExpenses(selectedTabId).map((expense) => (
                          <motion.div
                            key={expense.id}
                            variants={itemVariants}
                            className="p-3 border rounded-lg bg-white dark:bg-gray-900"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">
                                  {expense.description}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Paid by: {expense.paidBy}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-indigo-600 dark:text-indigo-400">
                                  {expense.amount}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {expense.date}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center">
                              <div
                                className={`text-xs px-2 py-1 rounded-full ${
                                  expense.status === "settled"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                }`}
                              >
                                {expense.status === "settled"
                                  ? "Settled"
                                  : "Pending"}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No expenses found for this tab.
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Select a tab to view expenses.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Streams Panel */}
          <TabsContent value="streams">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <RefreshCw className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Setup Recurring Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Select Tab</Label>
                      <Select
                        onValueChange={setSelectedTabId}
                        value={selectedTabId || ""}
                      >
                        <SelectTrigger className="border-indigo-200 dark:border-indigo-800/30">
                          <SelectValue placeholder="Select a tab" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTabs.map((tab) => (
                            <SelectItem key={tab.id} value={tab.id}>
                              {tab.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Recipient</Label>
                      <Input
                        value={streamRecipient}
                        onChange={(e) => setStreamRecipient(e.target.value)}
                        placeholder="0x..."
                        className="border-indigo-200 dark:border-indigo-800/30"
                      />
                    </div>
                    <div>
                      <Label>Amount per Second (ETH)</Label>
                      <Input
                        type="number"
                        value={streamAmount}
                        onChange={(e) => setStreamAmount(e.target.value)}
                        className="border-indigo-200 dark:border-indigo-800/30"
                      />
                    </div>
                    <div>
                      <Label>Duration (seconds)</Label>
                      <Input
                        type="number"
                        value={streamDuration}
                        onChange={(e) => setStreamDuration(e.target.value)}
                        className="border-indigo-200 dark:border-indigo-800/30"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleReleaseStream}
                    disabled={
                      !selectedTabId ||
                      !streamRecipient ||
                      !streamAmount ||
                      !streamDuration ||
                      loading
                    }
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Setup Recurring Payment
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <RefreshCw className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Active Streams
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {isDataLoading ? (
                    <div className="space-y-4">
                      {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : selectedTabId ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-6"
                    >
                      {getTabStreams(selectedTabId).length > 0 ? (
                        getTabStreams(selectedTabId).map((stream) => (
                          <motion.div
                            key={stream.id}
                            variants={itemVariants}
                            className="p-4 border rounded-lg bg-white dark:bg-gray-900"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">
                                  To: {stream.recipient}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {stream.amountPerSecond}/sec
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-indigo-600 dark:text-indigo-400">
                                  {stream.totalAmount}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Started: {stream.startDate}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div
                                className={`text-xs px-2 py-1 rounded-full ${
                                  stream.status === "active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                }`}
                              >
                                {stream.status === "active"
                                  ? "Active"
                                  : "Pending"}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Duration: {stream.duration} seconds
                              </p>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No streams found for this tab.
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Select a tab to view streams.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Create Tab Modal */}
      <AnimatePresence>
        {isCreateTabModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Create New Tab</h2>
              <div className="space-y-4">
                <div>
                  <Label>Tab Name</Label>
                  <Input
                    value={tabName}
                    onChange={(e) => setTabName(e.target.value)}
                    placeholder="e.g., Vacation Fund"
                    className="border-indigo-200 dark:border-indigo-800/30"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateTabModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTab}
                  disabled={loading || !tabName.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Tab"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {isAddMemberModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Add Member</h2>
              <div className="space-y-4">
                <div>
                  <Label>Select Tab</Label>
                  <Select
                    onValueChange={setSelectedTabId}
                    value={selectedTabId || ""}
                  >
                    <SelectTrigger className="border-indigo-200 dark:border-indigo-800/30">
                      <SelectValue placeholder="Select a tab" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTabs.map((tab) => (
                        <SelectItem key={tab.id} value={tab.id}>
                          {tab.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Member Address</Label>
                  <Input
                    value={memberAddress}
                    onChange={(e) => setMemberAddress(e.target.value)}
                    placeholder="0x..."
                    className="border-indigo-200 dark:border-indigo-800/30"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddMemberModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMember}
                  disabled={loading || !selectedTabId || !memberAddress}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Member"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isAddExpenseModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
              <div className="space-y-4">
                <div>
                  <Label>Select Tab</Label>
                  <Select
                    onValueChange={setSelectedTabId}
                    value={selectedTabId || ""}
                  >
                    <SelectTrigger className="border-indigo-200 dark:border-indigo-800/30">
                      <SelectValue placeholder="Select a tab" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTabs.map((tab) => (
                        <SelectItem key={tab.id} value={tab.id}>
                          {tab.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Amount (ETH)</Label>
                  <Input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    className="border-indigo-200 dark:border-indigo-800/30"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    className="border-indigo-200 dark:border-indigo-800/30"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddExpense}
                  disabled={
                    loading ||
                    !selectedTabId ||
                    !expenseAmount ||
                    !expenseDescription
                  }
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Expense"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Request Modal */}
      <AnimatePresence>
        {isPaymentRequestModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Request Payment</h2>
              <div className="space-y-4">
                <div>
                  <Label>Select Tab</Label>
                  <Select
                    onValueChange={setSelectedTabId}
                    value={selectedTabId || ""}
                  >
                    <SelectTrigger className="border-indigo-200 dark:border-indigo-800/30">
                      <SelectValue placeholder="Select a tab" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTabs.map((tab) => (
                        <SelectItem key={tab.id} value={tab.id}>
                          {tab.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Recipient Address</Label>
                  <Input
                    value={paymentRequestRecipient}
                    onChange={(e) => setPaymentRequestRecipient(e.target.value)}
                    placeholder="0x..."
                    className="border-indigo-200 dark:border-indigo-800/30"
                  />
                </div>
                <div>
                  <Label>Amount (ETH)</Label>
                  <Input
                    type="number"
                    value={paymentRequestAmount}
                    onChange={(e) => setPaymentRequestAmount(e.target.value)}
                    placeholder="0.00"
                    className="border-indigo-200 dark:border-indigo-800/30"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPaymentRequestModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePaymentRequest}
                  disabled={
                    loading ||
                    !selectedTabId ||
                    !paymentRequestRecipient ||
                    !paymentRequestAmount
                  }
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    "Request Payment"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stream Modal */}
      <AnimatePresence>
        {isStreamModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">
                Setup Recurring Payment
              </h2>
              <div className="space-y-4">
                <div>
                  <Label>Select Tab</Label>
                  <Select
                    onValueChange={setSelectedTabId}
                    value={selectedTabId || ""}
                  >
                    <SelectTrigger className="border-indigo-200 dark:border-indigo-800/30">
                      <SelectValue placeholder="Select a tab" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTabs.map((tab) => (
                        <SelectItem key={tab.id} value={tab.id}>
                          {tab.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Recipient Address</Label>
                  <Input
                    value={streamRecipient}
                    onChange={(e) => setStreamRecipient(e.target.value)}
                    placeholder="0x..."
                    className="border-indigo-200 dark:border-indigo-800/30"
                  />
                </div>
                <div>
                  <Label>Amount per Second (ETH)</Label>
                  <Input
                    type="number"
                    value={streamAmount}
                    onChange={(e) => setStreamAmount(e.target.value)}
                    placeholder="0.0001"
                    className="border-indigo-200 dark:border-indigo-800/30"
                  />
                </div>
                <div>
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={streamDuration}
                    onChange={(e) => setStreamDuration(e.target.value)}
                    placeholder="3600"
                    className="border-indigo-200 dark:border-indigo-800/30"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsStreamModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReleaseStream}
                  disabled={
                    loading ||
                    !selectedTabId ||
                    !streamRecipient ||
                    !streamAmount ||
                    !streamDuration
                  }
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting Up...
                    </>
                  ) : (
                    "Setup Stream"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members Modal */}
      <AnimatePresence>
        {isMembersModalOpen && selectedTabId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Tab Members</h2>
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3 max-h-64 overflow-y-auto"
              >
                {getTabMembers(selectedTabId).map((member, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{member.address}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined: {member.joined}
                        </p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsMembersModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}