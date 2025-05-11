"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionTitle } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ContactList } from "@/components/social/contact-list"
import { PaymentForm } from "@/components/social/payment-form"
import { GroupsList } from "@/components/social/groups-list"
import { ActivityFeed } from "@/components/social/activity-feed"
import { useSocialPaymentsStore } from "@/lib/store/use-social-payments-store"
import { useToast } from "@/hooks/use-toast"
import useAI from "./use-ai"
import { 
  Users, UserPlus, RefreshCw, Search, MoreVertical, PlusCircle, 
  TrendingUp, AlertTriangle, Check, Wallet, Zap, Brain, X, Filter, 
  DollarSign, UserCheck, UserX
} from "lucide-react"

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

const cardVariants = {
  hover: { 
    scale: 1.02,
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  }
}

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

export default function SocialClient() {
  const { contacts, groups, activities, addContact, addGroup, createActivity } = useSocialPaymentsStore()
  const [activeTab, setActiveTab] = useState("contacts")
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false)
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)
  const [isAISettingsModalOpen, setIsAISettingsModalOpen] = useState(false)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [isVerficationBannerVisible, setIsVerificationBannerVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const { toast } = useToast()
  const { getRecommendation, analyzeSentiment } = useAI()

  // Form states
  const [newContactForm, setNewContactForm] = useState({
    name: "",
    email: "",
    walletAddress: "",
    avatar: "",
  })

  const [newGroupForm, setNewGroupForm] = useState({
    name: "",
    description: "",
    members: [] as string[],
  })

  const [subscriptionForm, setSubscriptionForm] = useState({
    recipient: "",
    amount: "",
    token: "ETH",
    frequency: "monthly",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (aiAssistEnabled && Math.random() > 0.7) {
        const suggestions = [
          "Based on your past transactions, you might want to create a group with Alex and Jamie for your weekend trips.",
          "I noticed you pay Sarah regularly. Would you like to set up a recurring payment?",
          "Your transaction with David is pending for 3 days. Need help resolving it?",
          "You've been sending similar amounts to multiple people. Would you like to create a group payment?"
        ]
        setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
      } else {
        setAiSuggestion(null)
      }
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [activities, aiAssistEnabled])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast({
      title: "Social data refreshed",
      description: "Your contacts and activities have been updated.",
    })
  }

  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId)
    setIsPaymentModalOpen(true)
  }

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId)
    setIsPaymentModalOpen(true)
  }

  const handleAddContact = () => {
    addContact({
      name: newContactForm.name,
      username: newContactForm.name.toLowerCase().replace(/\s+/g, '.'),
      email: newContactForm.email,
      walletAddress: newContactForm.walletAddress,
      avatar: newContactForm.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newContactForm.name}`,
      lastTransaction: null
    })

    toast({
      title: "Contact added",
      description: `${newContactForm.name} has been added to your contacts.`,
    })

    setNewContactForm({
      name: "",
      email: "",
      walletAddress: "",
      avatar: "",
    })
    setIsAddContactModalOpen(false)
  }

  const handleCreateGroup = () => {
    addGroup({
      name: newGroupForm.name,
      description: newGroupForm.description,
      members: newGroupForm.members.map(id => {
        const contact = contacts.find(c => c.id === id);
        return contact ? {
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar
        } : null;
      }).filter(Boolean) as { id: string; name: string; avatar: string }[],
      balance: 0,
      currency: "USD"
    })

    toast({
      title: "Group created",
      description: `${newGroupForm.name} has been created with ${newGroupForm.members.length} members.`,
    })

    setNewGroupForm({
      name: "",
      description: "",
      members: [],
    })
    setIsCreateGroupModalOpen(false)
  }

  const handleCreateSubscription = () => {
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
      frequency: subscriptionForm.frequency,
    })

    toast({
      title: "Subscription created",
      description: `You've set up a ${subscriptionForm.frequency} payment to ${subscriptionForm.recipient}.`,
    })

    setSubscriptionForm({
      recipient: "",
      amount: "",
      token: "ETH",
      frequency: "monthly",
      startDate: "",
      endDate: "",
    })
    setIsSubscriptionModalOpen(false)
  }

  const dismissAiSuggestion = () => {
    setAiSuggestion(null)
  }

  const actOnAiSuggestion = () => {
    if (aiSuggestion?.includes("create a group")) {
      setIsCreateGroupModalOpen(true)
    } else if (aiSuggestion?.includes("recurring payment")) {
      setIsSubscriptionModalOpen(true)
    } else if (aiSuggestion?.includes("pending")) {
      toast({
        title: "Navigating to pending transaction",
        description: "This would take you to the pending transaction details.",
      })
    }
    
    dismissAiSuggestion()
  }

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div 
      className="flex-1 space-y-6 p-8 pt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Verification Banner */}
      <AnimatePresence>
        {isVerficationBannerVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="bg-amber-50 border-amber-300 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-800">Verify your wallet for enhanced features</AlertTitle>
              <AlertDescription className="text-amber-700">
                Connect your wallet to enable AI-powered features and subscription management.
              </AlertDescription>
              <div className="flex gap-2 mt-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white border-amber-300 text-amber-700 hover:bg-amber-50 rounded-lg"
                    onClick={() => setIsVerificationBannerVisible(false)}
                  >
                    Connect Wallet
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-amber-700 hover:bg-amber-100 rounded-lg"
                    onClick={() => setIsVerificationBannerVisible(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Suggestion */}
      <AnimatePresence>
        {aiSuggestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative bg-blue-50 border border-blue-200 rounded-lg p-4 pl-12"
          >
            <motion.div 
              className="absolute left-4 top-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
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
                    variant="outline" 
                    className="h-8 bg-white border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg"
                    onClick={actOnAiSuggestion}
                  >
                    Take Action
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 text-blue-700 hover:bg-blue-100 rounded-lg"
                    onClick={dismissAiSuggestion}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        variants={itemVariants}
      >
        <SectionTitle
          title="Social Payments"
          subtitle="Split expenses and manage shared finances with friends"
          className="text-left mb-0"
          titleClassName="text-3xl"
          subtitleClassName="text-base max-w-none text-left"
        />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="h-9 rounded-lg">
                  <Zap className="h-4 w-4 mr-2" />
                  AI Tools
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-lg">
              <DropdownMenuItem onClick={() => setActiveTool("splitSuggestions")}>
                <Users className="h-4 w-4 mr-2" />
                <span>Smart Split Suggestions</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool("expenseAnalytics")}>
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Expense Analytics</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsAISettingsModalOpen(true)}>
                <Brain className="h-4 w-4 mr-2" />
                <span>AI Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 rounded-lg" 
              onClick={() => setIsSubscriptionModalOpen(true)}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              New Subscription
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 rounded-lg" 
              onClick={() => setIsAddContactModalOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="sm" 
              className="h-9 rounded-lg" 
              onClick={handleRefresh} 
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {/* Contacts and Groups */}
        <motion.div variants={itemVariants} whileHover={cardVariants.hover}>
          <Card className="md:col-span-1 shadow-lg rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <Tabs defaultValue="contacts" value={activeTab} onValueChange={setActiveTab}>
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardTitle>Contacts</CardTitle>
                  <TabsList className="rounded-lg">
                    <TabsTrigger value="contacts">Contacts</TabsTrigger>
                    <TabsTrigger value="groups">Groups</TabsTrigger>
                  </TabsList>
                </motion.div>
                <CardDescription>
                  {activeTab === "contacts" ? "Your contacts for quick payments" : "Your payment groups and splits"}
                </CardDescription>
              </Tabs>
            </CardHeader>
            <div className="px-6 pb-3">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
              >
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={activeTab === "contacts" ? "Search contacts..." : "Search groups..."}
                  className="pl-8 rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>
            </div>
            <CardContent>
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="contacts" className="mt-0">
                  <ContactList 
                    contacts={filteredContacts} 
                    onContactSelect={handleContactSelect} 
                  />
                  {filteredContacts.length === 0 && (
                    <motion.div
                      className="text-center py-8 text-gray-500"
                      variants={fadeInVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {searchQuery ? "No contacts found" : "You don't have any contacts yet"}
                    </motion.div>
                  )}
                </TabsContent>
                <TabsContent value="groups" className="mt-0">
                  <GroupsList 
                    groups={filteredGroups} 
                    onGroupSelect={handleGroupSelect}
                  />
                  {filteredGroups.length === 0 && (
                    <motion.div
                      className="text-center py-8 text-gray-500"
                      variants={fadeInVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {searchQuery ? "No groups found" : "You don't have any groups yet"}
                    </motion.div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t pt-4">
              {activeTab === "contacts" ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-lg" 
                    onClick={() => setIsAddContactModalOpen(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Contact
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-lg" 
                    onClick={() => setIsCreateGroupModalOpen(true)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Create New Group
                  </Button>
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={itemVariants} whileHover={cardVariants.hover}>
          <Card className="md:col-span-2 shadow-lg rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardTitle>Recent Activity</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Filter className="h-4 w-4" />
                        <span className="sr-only">Filter</span>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-lg">
                    <DropdownMenuItem>All Activities</DropdownMenuItem>
                    <DropdownMenuItem>Payments</DropdownMenuItem>
                    <DropdownMenuItem>Requests</DropdownMenuItem>
                    <DropdownMenuItem>Subscriptions</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              <CardDescription>Your recent social payments and requests</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={activities} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Send Payment</DialogTitle>
            <DialogDescription>
              Send a payment to {selectedContact ? contacts.find(c => c.id === selectedContact)?.name : "selected group"}.
            </DialogDescription>
          </DialogHeader>
          <PaymentForm 
            onSubmit={() => setIsPaymentModalOpen(false)}
            recipient={selectedContact ? contacts.find(c => c.id === selectedContact) : undefined}
            group={selectedGroup ? groups.find(g => g.id === selectedGroup) : undefined}
          />
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)} className="rounded-lg">
                Cancel
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact Modal */}
      <Dialog open={isAddContactModalOpen} onOpenChange={setIsAddContactModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Add a contact to send payments or create shared expenses.
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            className="grid gap-4 py-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { id: "name", label: "Name", placeholder: "John Doe", value: newContactForm.name },
              { id: "email", label: "Email", placeholder: "john@example.com", value: newContactForm.email },
              { id: "wallet", label: "Wallet Address", placeholder: "0x...", value: newContactForm.walletAddress }
            ].map((field) => (
              <motion.div 
                key={field.id} 
                className="grid grid-cols-4 items-center gap-4"
                variants={itemVariants}
              >
                <Label htmlFor={field.id} className="text-right font-medium">{field.label}</Label>
                <Input
                  id={field.id}
                  placeholder={field.placeholder}
                  className="col-span-3 rounded-lg"
                  value={field.value}
                  onChange={(e) => setNewContactForm({...newContactForm, [field.id]: e.target.value})}
                />
              </motion.div>
            ))}
          </motion.div>
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={() => setIsAddContactModalOpen(false)} className="rounded-lg">
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleAddContact} className="rounded-lg">Add Contact</Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Group Modal */}
      <Dialog open={isCreateGroupModalOpen} onOpenChange={setIsCreateGroupModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Create a group to manage shared expenses with multiple people.
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            className="grid gap-4 py-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="group-name" className="text-right font-medium">Group Name</Label>
              <Input
                id="group-name"
                placeholder="Weekend Trip"
                className="col-span-3 rounded-lg"
                value={newGroupForm.name}
                onChange={(e) => setNewGroupForm({...newGroupForm, name: e.target.value})}
              />
            </motion.div>
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="description" className="text-right font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Group for our weekend getaway expenses"
                className="col-span-3 rounded-lg"
                value={newGroupForm.description}
                onChange={(e) => setNewGroupForm({...newGroupForm, description: e.target.value})}
              />
            </motion.div>
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label className="text-right font-medium">Members</Label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) => {
                    if (!newGroupForm.members.includes(value)) {
                      setNewGroupForm({
                        ...newGroupForm, 
                        members: [...newGroupForm.members, value]
                      })
                    }
                  }}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Add member" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <motion.div 
                  className="mt-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {newGroupForm.members.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {newGroupForm.members.map((memberId) => {
                        const contact = contacts.find(c => c.id === memberId)
                        return contact ? (
                          <motion.div key={memberId} variants={itemVariants}>
                            <Badge variant="secondary" className="flex items-center gap-1 rounded-lg">
                              {contact.name}
                              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={() => setNewGroupForm({
                                    ...newGroupForm,
                                    members: newGroupForm.members.filter(id => id !== memberId)
                                  })}
                                />
                              </motion.div>
                            </Badge>
                          </motion.div>
                        ) : null
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No members added yet</div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={() => setIsCreateGroupModalOpen(false)} className="rounded-lg">
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleCreateGroup} className="rounded-lg">Create Group</Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Settings Modal */}
      <Dialog open={isAISettingsModalOpen} onOpenChange={setIsAISettingsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>AI Assistant Settings</DialogTitle>
            <DialogDescription>
              Configure how the AI assistant helps with your finances.
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            className="grid gap-6 py-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="flex items-center justify-between" variants={itemVariants}>
              <div>
                <Label htmlFor="ai-enabled" className="font-medium">Enable AI Assistant</Label>
                <p className="text-sm text-gray-500">Get personalized suggestions and insights</p>
              </div>
              <Switch 
                id="ai-enabled" 
                checked={aiAssistEnabled} 
                onCheckedChange={setAiAssistEnabled} 
              />
            </motion.div>
            
            <motion.div className="space-y-4" variants={itemVariants}>
              <Label>Suggestion Frequency</Label>
              <Slider 
                defaultValue={[50]} 
                max={100} 
                step={25}
                disabled={!aiAssistEnabled}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </motion.div>
            
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label>Suggestions Types</Label>
              <div className="space-y-2">
                {[
                  { id: "split", label: "Bill Splitting" },
                  { id: "recurring", label: "Recurring Payments" },
                  { id: "investments", label: "Investment Opportunities" },
                  { id: "savings", label: "Savings Opportunities" }
                ].map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="flex items-center space-x-2"
                    variants={itemVariants}
                  >
                    <Switch id={item.id} defaultChecked={true} disabled={!aiAssistEnabled} />
                    <Label htmlFor={item.id}>{item.label}</Label>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={() => setIsAISettingsModalOpen(false)} className="rounded-lg">
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setIsAISettingsModalOpen(false)} className="rounded-lg">Save Settings</Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subscription Modal (ERC-7715) */}
      <Dialog open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Setup Recurring Payment</DialogTitle>
            <DialogDescription>
              Create an automated subscription payment using ERC-7715.
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            className="grid gap-4 py-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="recipient" className="text-right font-medium">Recipient</Label>
              <Select
                onValueChange={(value) => setSubscriptionForm({...subscriptionForm, recipient: value})}
                value={subscriptionForm.recipient}
              >
                <SelectTrigger className="col-span-3 rounded-lg">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="amount" className="text-right font-medium">Amount</Label>
              <div className="col-span-3 flex">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="rounded-r-none"
                  value={subscriptionForm.amount}
                  onChange={(e) => setSubscriptionForm({...subscriptionForm, amount: e.target.value})}
                />
                <Select
                  value={subscriptionForm.token}
                  onValueChange={(value) => setSubscriptionForm({...subscriptionForm, token: value})}
                >
                  <SelectTrigger className="w-[120px] rounded-l-none border-l-0 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="XDC">XDC</SelectItem>
                    <SelectItem value="DAI">DAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
            
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="frequency" className="text-right font-medium">Frequency</Label>
              <Select
                value={subscriptionForm.frequency}
                onValueChange={(value) => setSubscriptionForm({...subscriptionForm, frequency: value})}
              >
                <SelectTrigger className="col-span-3 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="start-date" className="text-right font-medium">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                className="col-span-3 rounded-lg"
                value={subscriptionForm.startDate}
                onChange={(e) => setSubscriptionForm({...subscriptionForm, startDate: e.target.value})}
              />
            </motion.div>
            
            <motion.div className="grid grid-cols-4 items-center gap-4" variants={itemVariants}>
              <Label htmlFor="end-date" className="text-right font-medium">End Date</Label>
              <Input
                id="end-date"
                type="date"
                className="col-span-3 rounded-lg"
                value={subscriptionForm.endDate}
                onChange={(e) => setSubscriptionForm({...subscriptionForm, endDate: e.target.value})}
              />
            </motion.div>
          </motion.div>
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={() => setIsSubscriptionModalOpen(false)} className="rounded-lg">
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleCreateSubscription} className="rounded-lg">Create Subscription</Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}