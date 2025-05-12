import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: number;
  type: string;
  amount: string;
  date: string;
  status: string;
}

interface TransactionDetailsModalProps {
  transaction?: Transaction;
  onClose: () => void;
}
const THEME = {
  glassmorphism: {
    light: "bg-white/70 backdrop-blur-md border border-white/20",
    dark: "bg-black/30 backdrop-blur-md border border-white/10",
    card: "bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl",
    dialog: "bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl",
  },
  animation: {
    transition: {
      default: "transition-all duration-300 ease-in-out",
      slow: "transition-all duration-500 ease-in-out",
      fast: "transition-all duration-150 ease-in-out",
    },
    hover: {
      scale: "hover:scale-105",
      lift: "hover:-translate-y-1",
      glow: "hover:shadow-glow",
    },
  },
  colors: {
    primary: {
      gradient: "from-amber-300 via-yellow-500 to-amber-400",
      light: "bg-amber-500",
      dark: "bg-amber-600",
      text: "text-amber-500",
      hover: "hover:bg-amber-600",
      border: "border-amber-500",
      foreground: "text-white",
    },
    secondary: {
      gradient: "from-blue-500 to-indigo-600",
      light: "bg-blue-500",
      dark: "bg-indigo-600",
      text: "text-blue-500",
      hover: "hover:bg-blue-600",
      border: "border-blue-500",
      foreground: "text-white",
    },
    accent: {
      gradient: "from-pink-500 to-rose-500",
      light: "bg-pink-500",
      dark: "bg-rose-500",
      text: "text-pink-500",
      hover: "hover:bg-pink-600",
      border: "border-pink-500",
      foreground: "text-white",
    },
    success: {
      gradient: "from-emerald-500 to-teal-500",
      light: "bg-emerald-500",
      dark: "bg-teal-500",
      text: "text-emerald-500",
      hover: "hover:bg-emerald-600",
      border: "border-emerald-500",
      foreground: "text-white",
    },
    warning: {
      gradient: "from-amber-400 to-orange-500",
      light: "bg-amber-400",
      dark: "bg-orange-500",
      text: "text-amber-500",
      hover: "hover:bg-amber-500",
      border: "border-amber-400",
      foreground: "text-white",
    },
    error: {
      gradient: "from-red-500 to-rose-600",
      light: "bg-red-500",
      dark: "bg-rose-600",
      text: "text-red-500",
      hover: "hover:bg-red-600",
      border: "border-red-500",
      foreground: "text-white",
    },
    glass: {
      light: "bg-white/20",
      dark: "bg-black/20",
      border: "border-white/10",
    },
  },
  motionPresets: {
    transition: { type: "spring", stiffness: 300, damping: 20 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } },
    slideUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } },
    slideInRight: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 } },
  },
};
const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={cn(THEME.glassmorphism.dialog, "sm:max-w-md")}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Transaction Details</DialogTitle>
          <DialogDescription>Complete information about this transaction.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium">{transaction.type}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Amount</span>
            <Badge variant={transaction.amount.startsWith("+") ? "secondary" : "destructive"}>
              {transaction.amount}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Date</span>
            <span>{transaction.date}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={transaction.status === "Completed" ? "outline" : "secondary"}>
              {transaction.status}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="text-xs text-muted-foreground">0x3a2b...8c9d</span>
          </div>
          <div className="rounded-lg bg-muted p-4 mt-4">
            <h4 className="font-medium mb-2">Transaction Metadata</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Gas Fee</span>
                <span>0.002 XDC</span>
              </div>
              <div className="flex justify-between">
                <span>Network</span>
                <span>XDC Mainnet</span>
              </div>
              <div className="flex justify-between">
                <span>Confirmation Blocks</span>
                <span>38</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="gap-2" onClick={onClose}>
            <Activity className="h-4 w-4" /> View on Explorer
          </Button>
          <Button
            className={cn(THEME.colors.primary.light, THEME.colors.primary.hover, "text-white gap-2")}
            onClick={onClose}
          >
            <Check className="h-4 w-4" /> Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsModal;