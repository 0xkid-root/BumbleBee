"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { SectionTitle } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ContactList } from "@/components/social/contact-list";
import { PaymentForm } from "@/components/social/payment-form";
import { GroupsList } from "@/components/social/groups-list";
import { ActivityFeed } from "@/components/social/activity-feed";
import { useSocialPaymentsStore } from "@/lib/store/use-social-payments-store";
import { useToast } from "@/hooks/use-toast";
import { useAI } from "./use-ai";
import {
  Users, UserPlus, RefreshCw, Search, MoreVertical, PlusCircle,
  TrendingUp, AlertTriangle, Wallet, Zap, Brain, X,
  DollarSign, UserCheck, Sparkles, Lightbulb
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } }
};

const cardVariants = {
  hover: { scale: 1.03, boxShadow: "0 12px 32px rgba(0,0,0,0.12)", transition: { duration: 0.3, ease: "easeOut" } }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.7, 1, 0.7],
  transition: { duration: 2, ease: "easeInOut", repeat: Infinity }
};

const gradients = [
  "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
  "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
  "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
  "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)"
];

// Confetti component
const Confetti = ({ isActive }: { isActive: boolean }) => {
  const [confettiItems, setConfettiItems] = useState<any[]>([]);
  useEffect(() => {
    if (isActive) {
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        size: 5 + Math.random() * 10,
        color: ['#FCD34D', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981'][Math.floor(Math.random() * 5)],
        rotation: Math.random() * 360,
        duration: 1 + Math.random() * 2
      }));
      setConfettiItems(items);
      const timeout = setTimeout(() => setConfettiItems([]), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isActive]);
  return (
    <AnimatePresence>
      {confettiItems.map(item => (
        <motion.div
          key={item.id}
          initial={{ x: item.x, y: item.y, rotate: item.rotation, opacity: 1 }}
          animate={{ y: window.innerHeight + 100, rotate: item.rotation + 360, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: item.duration, ease: "easeInOut" }}
          style={{
            position: "fixed",
            width: item.size,
            height: item.size,
            borderRadius: "50%",
            backgroundColor: item.color,
            zIndex: 100
          }}
        />
      ))}
    </AnimatePresence>
  );
};

// Notification indicator
const NotificationIndicator = () => (
  <motion.div animate={pulseAnimation} className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
);

// Floating action button
const FloatingActionButton = ({ onClick }: { onClick: () => void }) => (
  <motion.div className="fixed bottom-6 right-6 z-50" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
    <Button onClick={onClick} className="h-14 w-14 rounded-full shadow-lg" style={{ background: gradients[0] }}>
      <PlusCircle className="h-6 w-6" />
    </Button>
  </motion.div>
);

// Glassmorphism card
const GlassCard = ({ children, gradient, className = "" }: { children: React.ReactNode, gradient?: string, className?: string }) => (
  <Card className={`shadow-xl rounded-xl overflow-hidden bg-white/90 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 ${className}`}>
    {gradient && <div className="absolute inset-0 opacity-10" style={{ background: gradient }} />}
    <div className="relative z-10">{children}</div>
  </Card>
);

export default function SocialClient() {
  const { contacts, groups, activities, addContact, addGroup, createActivity } = useSocialPaymentsStore();
  const [activeTab, setActiveTab] = useState("contacts");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isAISettingsModalOpen, setIsAISettingsModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isVerificationBannerVisible, setIsVerificationBannerVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  const { getRecommendation, analyzeSentiment } = useAI();
  const controls = useAnimation();

  // Form states
  const [newContactForm, setNewContactForm] = useState({
    name: "",
    email: "",
    walletAddress: "",
    avatar: ""
  });

  const [newGroupForm, setNewGroupForm] = useState({
    name: "",
    description: "",
    members: [] as string[]
  });

  const [subscriptionForm, setSubscriptionForm] = useState({
    recipient: "",
    amount: "",
    token: "ETH",
    frequency: "monthly",
    startDate: "",
    endDate: ""
  });

  // AI suggestion effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (aiAssistEnabled && Math.random() > 0.7) {
        const suggestions = [
          "Based on your past transactions, you might want to create a group with Alex and Jamie for your weekend trips.",
          "I noticed you pay Sarah regularly. Would you like to set up a recurring payment?",
          "Your transaction with David is pending for 3 days. Need help resolving it?",
          "You've been sending similar amounts to multiple people. Would you like to create a group payment?"
        ];
        setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
      } else {
        setAiSuggestion(null);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [activities, aiAssistEnabled]);

  // Handlers
  const handleRefresh = async () => {
    setIsLoading(true);
    await controls.start({ rotate: 360, transition: { duration: 1, ease: "easeInOut" } });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: "Social data refreshed",
      description: "Your contacts and activities have been updated."
    });
  };

  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId);
    setIsPaymentModalOpen(true);
  };

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
    setIsPaymentModalOpen(true);
  };

  const handleAddContact = () => {
    if (!newContactForm.name || !newContactForm.walletAddress) {
      toast({ title: "Error", description: "Name and wallet address are required.", variant: "destructive" });
      return;
    }
    addContact({
      name: newContactForm.name,
      username: newContactForm.name.toLowerCase().replace(/\s+/g, '.'),
      email: newContactForm.email,
      walletAddress: newContactForm.walletAddress,
      avatar: newContactForm.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newContactForm.name}`,
      lastTransaction: null
    });
    toast({
      title: "Contact added successfully",
      description: `${newContactForm.name} has been added to your contacts.`
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setNewContactForm({ name: "", email: "", walletAddress: "", avatar: "" });
    setIsAddContactModalOpen(false);
  };

  const handleCreateGroup = () => {
    if (!newGroupForm.name || newGroupForm.members.length === 0) {
      toast({ title: "Error", description: "Group name and at least one member are required.", variant: "destructive" });
      return;
    }
    addGroup({
      name: newGroupForm.name,
      description: newGroupForm.description,
      members: newGroupForm.members.map(id => {
        const contact = contacts.find(c => c.id === id);
        return contact ? { id: contact.id, name: contact.name, avatar: contact.avatar } : null;
      }).filter((member): member is { id: string; name: string; avatar: string } => member !== null),
      balance: 0,
      currency: "USD"
    });
    toast({
      title: "Group created successfully",
      description: `${newGroupForm.name} has been created with ${newGroupForm.members.length} members.`
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setNewGroupForm({ name: "", description: "", members: [] });
    setIsCreateGroupModalOpen(false);
  };

  const handleCreateSubscription = () => {
    if (!subscriptionForm.recipient || !subscriptionForm.amount || !subscriptionForm.startDate) {
      toast({ title: "Error", description: "Recipient, amount, and start date are required.", variant: "destructive" });
      return;
    }
    createActivity({
      type: "recurring",
      title: `Subscription to ${subscriptionForm.recipient}`,
      description: `${subscriptionForm.frequency} payment of ${subscriptionForm.amount} ${subscriptionForm.token}`,
      amount: parseFloat(subscriptionForm.amount),
      currency: subscriptionForm.token,
      status: "active",
      timestamp: new Date().toISOString(),
      participants: [subscriptionForm.recipient],
      isRecurring: true,
      frequency: subscriptionForm.frequency
    });
    toast({
      title: "Subscription created successfully",
      description: `You've set up a ${subscriptionForm.frequency} payment to ${subscriptionForm.recipient}.`
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setSubscriptionForm({ recipient: "", amount: "", token: "ETH", frequency: "monthly", startDate: "", endDate: "" });
    setIsSubscriptionModalOpen(false);
  };

  const dismissAiSuggestion = () => setAiSuggestion(null);

  const actOnAiSuggestion = () => {
    if (aiSuggestion?.includes("create a group")) {
      setIsCreateGroupModalOpen(true);
    } else if (aiSuggestion?.includes("recurring payment")) {
      setIsSubscriptionModalOpen(true);
    } else if (aiSuggestion?.includes("pending")) {
      toast({
        title: "Navigating to pending transaction",
        description: "This would take you to the pending transaction details."
      });
    }
    dismissAiSuggestion();
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Confetti isActive={showConfetti} />
      <FloatingActionButton onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)} />
      <AnimatePresence>
        {isQuickActionsOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 space-y-2 flex flex-col items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {[
              { icon: <UserPlus className="h-5 w-5" />, label: "Add Contact", action: () => setIsAddContactModalOpen(true) },
              { icon: <Users className="h-5 w-5" />, label: "Create Group", action: () => setIsCreateGroupModalOpen(true) },
              { icon: <DollarSign className="h-5 w-5" />, label: "New Subscription", action: () => setIsSubscriptionModalOpen(true) }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-md">{item.label}</div>
                <Button
                  size="sm"
                  className="h-10 w-10 rounded-full shadow-md"
                  style={{ background: gradients[index % gradients.length] }}
                  onClick={() => { item.action(); setIsQuickActionsOpen(false); }}
                >
                  {item.icon}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex-1 space-y-6 p-8 pt-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Verification Banner */}
        <AnimatePresence>
          {isVerificationBannerVisible && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg shadow-md">
                <div className="flex items-start">
                  <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }} className="mt-1">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </motion.div>
                  <div className="ml-3">
                    <AlertTitle className="text-amber-800 font-semibold">Verify your wallet for enhanced features</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Connect your wallet to enable AI-powered features and subscription management.
                    </AlertDescription>
                    <div className="flex gap-2 mt-3">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="sm"
                          className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white border-none shadow-md"
                          onClick={() => setIsVerificationBannerVisible(false)}
                        >
                          <Wallet className="h-4 w-4 mr-2" /> Connect Wallet
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" variant="ghost" className="text-amber-700 hover:bg-amber-100 rounded-lg" onClick={() => setIsVerificationBannerVisible(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Suggestion */}
        <AnimatePresence>
          {aiSuggestion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.4 }}
              className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 pl-14 shadow-md"
            >
              <motion.div
                className="absolute left-4 top-4 p-1 bg-blue-100 rounded-full"
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1], backgroundColor: ["#dbeafe", "#bfdbfe", "#dbeafe"] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Brain className="h-5 w-5 text-blue-500" />
              </motion.div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-blue-800">AI Assistant Suggestion</h4>
                  <p className="text-blue-700 mt-1">{aiSuggestion}</p>
                </div>
                <div className="flex space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      className="h-8 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none shadow-md"
                      onClick={actOnAiSuggestion}
                    >
                      <Lightbulb className="h-3 w-3 mr-1" /> Take Action
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" variant="ghost" className="h-8 text-blue-700 hover:bg-blue-100 rounded-lg" onClick={dismissAiSuggestion}>
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" variants={itemVariants}>
          <div className="relative">
            <SectionTitle
              title="Social Payments"
              subtitle="Split expenses and manage shared finances with friends"
              className="text-left mb-0"
              titleClassName="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
              subtitleClassName="text-base max-w-none text-left"
            />
            <motion.div
              className="absolute -top-6 -right-6 w-12 h-12 opacity-20"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, repeatType: "reverse" } }}
            >
              <Sparkles className="w-full h-full text-indigo-600" />
            </motion.div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-indigo-100 dark:border-gray-700 shadow-sm"
                  >
                    <div className="mr-2 relative">
                      <Zap className="h-4 w-4 text-indigo-500" />
                      <motion.div className="absolute inset-0" animate={{ opacity: [0.5, 0, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <Zap className="h-4 w-4 text-indigo-300" />
                      </motion.div>
                    </div>
                    AI Tools
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-lg shadow-lg border border-indigo-100 dark:border-gray-700">
                <DropdownMenuItem onClick={() => setActiveTool("splitSuggestions")} className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                  <Users className="h-4 w-4 mr-2 text-indigo-500" /> Smart Split Suggestions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTool("expenseAnalytics")} className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" /> Expense Analytics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAISettingsModalOpen(true)} className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                  <Brain className="h-4 w-4 mr-2 text-purple-500" /> AI Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="h-9 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-emerald-100 dark:border-gray-700 shadow-sm"
                onClick={() => setIsSubscriptionModalOpen(true)}
              >
                <DollarSign className="h-4 w-4 mr-2 text-emerald-500" /> New Subscription
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="h-9 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm"
                onClick={() => setIsAddContactModalOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2 text-blue-500" /> Add Contact
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="h-9 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-none shadow-md"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <motion.div animate={controls}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                </motion.div>
                Refresh
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVariants}>
          {/* Contacts and Groups */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <motion.div whileHover={cardVariants.hover}>
              <GlassCard gradient={gradients[0]} className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <CardTitle className="flex items-center">
                        {activeTab === "contacts" ? <UserCheck className="h-5 w-5 mr-2 text-indigo-500" /> : <Users className="h-5 w-5 mr-2 text-indigo-500" />}
                        <span>{activeTab === "contacts" ? "Contacts" : "Groups"}</span>
                      </CardTitle>
                      <TabsList className="rounded-lg bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm p-1">
                        <Tabs defaultValue="contacts">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="contacts">Contacts</TabsTrigger>
                            <TabsTrigger value="groups">Groups</TabsTrigger>
                          </TabsList>
                          <TabsContent value="contacts" className="mt-4 space-y-4">
                            <ContactList contacts={filteredContacts} onSelect={handleContactSelect} />
                          </TabsContent>
                          <TabsContent value="groups" className="mt-4">
                            <GroupsList groups={filteredGroups} onSelect={handleGroupSelect} />
                          </TabsContent>
                        </Tabs>
                      </TabsList>
                    </motion.div>
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mt-4"
                    />
                  </Tabs>
                </CardHeader>
                <CardContent className="flex-1">
                </CardContent>
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div variants={itemVariants}>
            <motion.div whileHover={cardVariants.hover}>
              <GlassCard gradient={gradients[1]} className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" /> Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <ActivityFeed activities={activities} />
                </CardContent>
              </GlassCard>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Modals */}
        <Dialog open={isAddContactModalOpen} onOpenChange={setIsAddContactModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>Enter details for the new contact.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={newContactForm.name} onChange={(e) => setNewContactForm({ ...newContactForm, name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={newContactForm.email} onChange={(e) => setNewContactForm({ ...newContactForm, email: e.target.value })} />
              </div>
              <div>
                <Label>Wallet Address</Label>
                <Input value={newContactForm.walletAddress} onChange={(e) => setNewContactForm({ ...newContactForm, walletAddress: e.target.value })} />
              </div>
              <div>
                <Label>Avatar URL (optional)</Label>
                <Input value={newContactForm.avatar} onChange={(e) => setNewContactForm({ ...newContactForm, avatar: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddContactModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddContact}>Add Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateGroupModalOpen} onOpenChange={setIsCreateGroupModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>Create a group for shared expenses.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={newGroupForm.name} onChange={(e) => setNewGroupForm({ ...newGroupForm, name: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={newGroupForm.description} onChange={(e) => setNewGroupForm({ ...newGroupForm, description: e.target.value })} />
              </div>
              <div>
                <Label>Members</Label>
                <Select onValueChange={(value) => setNewGroupForm({ ...newGroupForm, members: [...newGroupForm.members, value] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select members" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map(contact => (
                      <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 flex flex-wrap gap-2">
                  {newGroupForm.members.map(id => {
                    const contact = contacts.find(c => c.id === id);
                    return contact ? (
                      <Badge key={id} className="flex items-center gap-1">
                        {contact.name}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setNewGroupForm({
                          ...newGroupForm,
                          members: newGroupForm.members.filter(m => m !== id)
                        })} />
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateGroupModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subscription</DialogTitle>
              <DialogDescription>Set up a recurring payment.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Recipient</Label>
                <Select onValueChange={(value) => setSubscriptionForm({ ...subscriptionForm, recipient: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map(contact => (
                      <SelectItem key={contact.id} value={contact.name}>{contact.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={subscriptionForm.amount}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Token</Label>
                <Select value={subscriptionForm.token} onValueChange={(value) => setSubscriptionForm({ ...subscriptionForm, token: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETH">ETH디어</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="DAI">DAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Frequency</Label>
                <Select value={subscriptionForm.frequency} onValueChange={(value) => setSubscriptionForm({ ...subscriptionForm, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={subscriptionForm.startDate}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date (optional)</Label>
                <Input
                  type="date"
                  value={subscriptionForm.endDate}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, endDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSubscriptionModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateSubscription}>Create Subscription</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAISettingsModalOpen} onOpenChange={setIsAISettingsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI Settings</DialogTitle>
              <DialogDescription>Configure AI-powered features.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable AI Assistant</Label>
                <Switch checked={aiAssistEnabled} onCheckedChange={setAiAssistEnabled} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAISettingsModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAISettingsModalOpen(false)}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Payment</DialogTitle>
              <DialogDescription>Send a payment to a contact or group.</DialogDescription>
            </DialogHeader>
            <PaymentForm
              contactId={selectedContact}
              group={selectedGroup ? groups.find(g => g.id === selectedGroup) : undefined}
              onSubmit={() => {
                toast({ title: "Payment sent", description: "Your payment has been processed." });
                setIsPaymentModalOpen(false);
                setSelectedContact(null);
                setSelectedGroup(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </motion.div>
    </>
  );
}