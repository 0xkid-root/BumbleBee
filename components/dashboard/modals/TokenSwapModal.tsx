import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface TokenSwapModalProps {
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
const TokenSwapModal: React.FC<TokenSwapModalProps> = ({ onClose }) => {
  const [fromToken, setFromToken] = useState("XDC");
  const [toToken, setToToken] = useState("ETH");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSwap = () => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Swap Successful",
        description: `Swapped ${amount} ${fromToken} to ${(parseFloat(amount) * 0.05).toFixed(4)} ${toToken}`,
      });
      onClose();
    }, 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={cn(THEME.glassmorphism.dialog, "sm:max-w-md")}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-blue-500" />
            Swap Tokens
          </DialogTitle>
          <DialogDescription>Swap between different tokens with the best rates.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="from-token">From</Label>
            <div className="flex items-center space-x-2">
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger id="from-token" className="w-[120px]">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XDC">XDC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="text-lg"
                aria-label="Amount to swap"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <motion.div
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRightLeft className="h-5 w-5 text-blue-500" />
            </motion.div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="to-token">To</Label>
            <div className="flex items-center space-x-2">
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger id="to-token" className="w-[120px]">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XDC">XDC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={amount ? (parseFloat(amount) * 0.05).toFixed(4) : ""}
                disabled
                placeholder="0.0"
                className="text-lg"
                aria-label="Received amount"
              />
            </div>
          </div>
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Rate</span>
              <span>1 {fromToken} = 0.05 {toToken}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-500 dark:text-gray-400">Fee</span>
              <span>0.1%</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            className={cn(THEME.colors.secondary.light, THEME.colors.secondary.hover, "text-white w-full")}
            onClick={handleSwap}
            disabled={isLoading || !amount}
          >
            {isLoading ? (
              <motion.div
                className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              "Swap Tokens"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSwapModal;