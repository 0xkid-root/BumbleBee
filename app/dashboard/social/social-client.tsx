"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther } from "viem";
import abi from "@/contracts/SocialPaymentsTab.json"; // Replace with correct path

// Contract Address - Update this after deployment
const CONTRACT_ADDRESS = "0xYourContractAddressHere" as const;

// Mock Data
const mockTabs = [
  { id: "0", name: "Vacation Fund" },
  { id: "1", name: "Team Lunch" },
];

const mockExpenses = [
  { tabId: "0", amount: "0.5 ETH", description: "Flight tickets" },
  { tabId: "1", amount: "0.2 ETH", description: "Sushi dinner" },
];

const mockStreams = [
  { tabId: "0", recipient: "0xAbc...def", amountPerSecond: "0.0001 ETH" },
];

export default function SocialClient() {
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
  const [isPaymentRequestModalOpen, setIsPaymentRequestModalOpen] = useState(false);
  const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  // Read contract data
  const { data: tabCountData, isLoading: isReadingTabs } = useReadContract({
    abi: abi as any,
    address: CONTRACT_ADDRESS,
    functionName: "tabCount",
    args: [],
  });

  const { writeContractAsync: createTab } = useWriteContract();
  const { writeContractAsync: addMember } = useWriteContract();
  const { writeContractAsync: addExpense } = useWriteContract();
  const { writeContractAsync: createPaymentRequest } = useWriteContract();
  const { writeContractAsync: releaseStream } = useWriteContract();

  // Handle Create Tab
  const handleCreateTab = async () => {
    if (!tabName.trim()) {
      toast({ title: "Validation", description: "Tab name is required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await createTab({
        abi: abi as any,
        address: CONTRACT_ADDRESS,
        functionName: "createTab",
        args: [tabName],
      });
      toast({ title: "Success", description: `Tab "${tabName}" created.` });
      setTabName("");
      setIsCreateTabModalOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create tab.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Member
  const handleAddMember = async () => {
    if (!selectedTabId || !memberAddress) {
      toast({ title: "Validation", description: "Select a tab and enter a wallet address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await addMember({
        abi: abi as any,
        address: CONTRACT_ADDRESS,
        functionName: "addMember",
        args: [selectedTabId, memberAddress],
      });
      toast({ title: "Success", description: `${memberAddress} added to tab.` });
      setMemberAddress("");
      setIsAddMemberModalOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add member.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Expense
  const handleAddExpense = async () => {
    if (!selectedTabId || !expenseAmount || !expenseDescription) {
      toast({ title: "Validation", description: "Fill in all fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await addExpense({
        abi: abi as any,
        address: CONTRACT_ADDRESS,
        functionName: "addExpense",
        args: [selectedTabId, parseEther(expenseAmount), expenseDescription],
      });
      toast({ title: "Success", description: `Expense of ${expenseAmount} ETH added.` });
      setExpenseAmount("");
      setExpenseDescription("");
      setIsAddExpenseModalOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add expense.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handle Payment Request
  const handleCreatePaymentRequest = async () => {
    if (!selectedTabId || !paymentRequestRecipient || !paymentRequestAmount) {
      toast({ title: "Validation", description: "Fill in all fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await createPaymentRequest({
        abi: abi as any,
        address: CONTRACT_ADDRESS,
        functionName: "createPaymentRequest",
        args: [selectedTabId, paymentRequestRecipient, parseEther(paymentRequestAmount)],
      });
      toast({ title: "Success", description: `Payment request sent to ${paymentRequestRecipient}.` });
      setPaymentRequestRecipient("");
      setPaymentRequestAmount("");
      setIsPaymentRequestModalOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to send request.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handle Stream Setup
  const handleReleaseStream = async () => {
    if (!selectedTabId || !streamRecipient || !streamAmount || !streamDuration) {
      toast({ title: "Validation", description: "Fill in all stream fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await releaseStream({
        abi: abi as any,
        address: CONTRACT_ADDRESS,
        functionName: "releaseStream",
        args: [selectedTabId],
      });
      toast({ title: "Success", description: `Recurring payment released.` });
      setIsStreamModalOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to release stream.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Social Payments
          </h1>
          <p className="text-muted-foreground">Manage shared expenses on-chain</p>
        </div>
        <Button onClick={() => setIsCreateTabModalOpen(true)}>Create Tab</Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tabs">Tabs</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="streams">Streams</TabsTrigger>
        </TabsList>

        {/* Tabs Panel */}
        <TabsContent value="tabs">
          <Card>
            <CardHeader>
              <CardTitle>My Tabs</CardTitle>
            </CardHeader>
            <CardContent>
              {isReadingTabs ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : mockTabs.length > 0 ? (
                <ul className="space-y-2">
                  {mockTabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setSelectedTabId(tab.id)}
                        className={`w-full p-3 border rounded-lg ${
                          selectedTabId === tab.id
                            ? "bg-blue-50 dark:bg-gray-800"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {tab.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">No tabs found.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddMemberModalOpen(true)}
                disabled={!selectedTabId}
              >
                Add Member
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Expenses Panel */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Add Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Select Tab</Label>
                  <Select onValueChange={setSelectedTabId} value={selectedTabId || ""}>
                    <SelectTrigger>
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
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleAddExpense}
                disabled={!selectedTabId || !expenseAmount || !expenseDescription}
              >
                {loading ? "Processing..." : "Add Expense"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Streams Panel */}
        <TabsContent value="streams">
          <Card>
            <CardHeader>
              <CardTitle>Recurring Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Select Tab</Label>
                  <Select onValueChange={setSelectedTabId} value={selectedTabId || ""}>
                    <SelectTrigger>
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
                  />
                </div>
                <div>
                  <Label>Amount per Second (ETH)</Label>
                  <Input
                    type="number"
                    value={streamAmount}
                    onChange={(e) => setStreamAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={streamDuration}
                    onChange={(e) => setStreamDuration(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleReleaseStream}
                disabled={!selectedTabId || !streamRecipient || loading}
              >
                {loading ? "Processing..." : "Setup Stream"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {/* Create Tab Modal */}
      <Dialog open={isCreateTabModalOpen} onOpenChange={setIsCreateTabModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tab</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Tab Name</Label>
              <Input
                value={tabName}
                onChange={(e) => setTabName(e.target.value)}
                placeholder="E.g., Vacation Fund"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateTabModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTab}>{loading ? "Creating..." : "Create Tab"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Modal */}
      <Dialog open={isAddMemberModalOpen} onOpenChange={setIsAddMemberModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Wallet Address</Label>
              <Input
                value={memberAddress}
                onChange={(e) => setMemberAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddMemberModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddMember}>{loading ? "Adding..." : "Add Member"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Expense Modal */}
      <Dialog open={isAddExpenseModalOpen} onOpenChange={setIsAddExpenseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Tab ID</Label>
              <Input
                value={selectedTabId || ""}
                disabled
                readOnly
              />
            </div>
            <div>
              <Label>Amount (ETH)</Label>
              <Input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddExpenseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>{loading ? "Adding..." : "Add Expense"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Request Modal */}
      <Dialog open={isPaymentRequestModalOpen} onOpenChange={setIsPaymentRequestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Recipient</Label>
              <Input
                value={paymentRequestRecipient}
                onChange={(e) => setPaymentRequestRecipient(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <div>
              <Label>Amount (ETH)</Label>
              <Input
                type="number"
                value={paymentRequestAmount}
                onChange={(e) => setPaymentRequestAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentRequestModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreatePaymentRequest}>
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recurring Stream Modal */}
      <Dialog open={isStreamModalOpen} onOpenChange={setIsStreamModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup Recurring Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Tab ID</Label>
              <Input
                value={selectedTabId || ""}
                disabled
                readOnly
              />
            </div>
            <div>
              <Label>Recipient</Label>
              <Input
                value={streamRecipient}
                onChange={(e) => setStreamRecipient(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <div>
              <Label>Amount (ETH)</Label>
              <Input
                type="number"
                value={streamAmount}
                onChange={(e) => setStreamAmount(e.target.value)}
              />
            </div>
            <div>
              <Label>Duration (seconds)</Label>
              <Input
                type="number"
                value={streamDuration}
                onChange={(e) => setStreamDuration(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStreamModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleReleaseStream}>
              {loading ? "Setting up..." : "Setup Stream"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Dialog Wrapper (if not defined globally)
function Dialog({ children, open, onOpenChange }: React.PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ) : null;
}

function DialogContent({ children }: React.PropsWithChildren<{}>) {
  return <>{children}</>;
}

function DialogHeader({ children }: React.PropsWithChildren<{}>) {
  return <div className="mb-4">{children}</div>;
}

function DialogTitle({ children }: React.PropsWithChildren<{}>) {
  return <h2 className="text-xl font-semibold mb-2">{children}</h2>;
}

function DialogDescription({ children }: React.PropsWithChildren<{}>) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function DialogFooter({ children }: React.PropsWithChildren<{}>) {
  return <div className="mt-6 flex justify-end gap-2">{children}</div>;
}