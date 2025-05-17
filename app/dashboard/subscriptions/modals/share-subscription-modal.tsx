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
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";
import { Subscription } from "../types";

interface ShareSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (subscription: Subscription, emails: string[]) => void;
  subscription: Subscription | null;
}

export function ShareSubscriptionModal({
  isOpen,
  onClose,
  onShare,
  subscription,
}: ShareSubscriptionModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [sharedEmails, setSharedEmails] = useState<string[]>([]);

  const handleAddEmail = () => {
    if (!email) return;

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (sharedEmails.includes(email)) {
      toast({
        title: "Duplicate email",
        description: "This email has already been added",
        variant: "destructive",
      });
      return;
    }

    setSharedEmails([...sharedEmails, email]);
    setEmail("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setSharedEmails(sharedEmails.filter((e) => e !== emailToRemove));
  };

  const handleShare = async () => {
    if (!subscription) return;

    if (sharedEmails.length === 0) {
      toast({
        title: "No emails added",
        description: "Please add at least one email to share with",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onShare(subscription, sharedEmails);
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setSharedEmails([]);
    onClose();
  };

  if (!subscription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Subscription</DialogTitle>
          <DialogDescription>
            Share your {subscription.name} subscription with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddEmail();
                  }
                }}
              />
              <Button type="button" onClick={handleAddEmail}>
                Add
              </Button>
            </div>
          </div>

          {sharedEmails.length > 0 && (
            <div className="space-y-2">
              <Label>Shared With</Label>
              <div className="space-y-2">
                {sharedEmails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <span className="text-sm">{email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEmail(email)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={isSubmitting}>
            {isSubmitting && (
              <span className="mr-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            )}
            Share Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}