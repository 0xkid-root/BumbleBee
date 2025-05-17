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
import { Loader2 } from "lucide-react";
import { Subscription } from "../types";

interface DeleteSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (subscription: Subscription) => void;
  subscription: Subscription | null;
}

export function DeleteSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  subscription,
}: DeleteSubscriptionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!subscription) return;

    setIsSubmitting(true);
    try {
      await onConfirm(subscription);
      handleClose();
    } catch (error) {
      console.error("Error deleting subscription:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!subscription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the subscription for {subscription.name}?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className="mr-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            )}
            Delete Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}