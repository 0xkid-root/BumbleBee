"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {Loader2} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { isAddress } from "viem";
import { Subscription } from "../types";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
  categories: string[];
  frequencies: string[];
  paymentMethods: string[];
}

export function AddSubscriptionModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  frequencies,
  paymentMethods,
}: AddSubscriptionModalProps) {
  const { toast } = useToast();
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

  const handleSubmit = async () => {
    if (!formState.name || !formState.amount) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formState.contractAddress && !isAddress(formState.contractAddress)) {
      toast({
        title: "Invalid contract address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const numericAmount = parseFloat(formState.amount.replace(/[^0-9.]/g, ""));
      const newSubscription = {
        ...formState,
        id: `sub_${Date.now()}`,
        numericAmount,
        nextPayment: calculateNextPaymentDate(formState.frequency),
      };
      onSubmit(newSubscription);
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
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
    onClose();
  };

  const calculateNextPaymentDate = (frequency: string) => {
    const date = new Date();
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Enter the details of your new subscription
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              value={formState.amount}
              onChange={(e) =>
                setFormState({ ...formState, amount: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={formState.frequency}
              onValueChange={(value) =>
                setFormState({ ...formState, frequency: value })
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

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formState.category}
              onValueChange={(value) =>
                setFormState({ ...formState, category: value })
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

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={formState.paymentMethod}
              onValueChange={(value) =>
                setFormState({ ...formState, paymentMethod: value })
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

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="erc7715"
              checked={formState.erc7715}
              onCheckedChange={(checked) =>
                setFormState({ ...formState, erc7715: checked })
              }
            />
            <Label htmlFor="erc7715">ERC-7715 Subscription</Label>
          </div>

          {formState.erc7715 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="contractAddress">Contract Address</Label>
                <Input
                  id="contractAddress"
                  value={formState.contractAddress}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      contractAddress: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenAddress">Token Address</Label>
                <Input
                  id="tokenAddress"
                  value={formState.tokenAddress}
                  onChange={(e) =>
                    setFormState({ ...formState, tokenAddress: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  value={formState.recipient}
                  onChange={(e) =>
                    setFormState({ ...formState, recipient: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoRenew"
                  checked={formState.isAutoRenewing}
                  onCheckedChange={(checked) =>
                    setFormState({ ...formState, isAutoRenewing: checked })
                  }
                />
                <Label htmlFor="autoRenew">Auto-renewing</Label>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && (
              <span className="mr-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            )}
            Add Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}