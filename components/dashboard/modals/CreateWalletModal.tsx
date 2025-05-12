import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Wallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  token: string;
  lastActivity: Date;
  isActive: boolean;
}

interface CreateWalletModalProps {
  onAddWallet: (wallet: Wallet) => void;
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
const CreateWalletModal: React.FC<CreateWalletModalProps> = ({ onAddWallet, onClose }) => {
  const [walletName, setWalletName] = useState("");
  const [walletType, setWalletType] = useState("smart");
  const { toast } = useToast();

  const handleCreateWallet = () => {
    if (!walletName) {
      toast({
        title: "Error",
        description: "Wallet name is required",
        variant: "destructive",
      });
      return;
    }
    const newWallet: Wallet = {
      id: `${Math.random().toString(16).slice(2)}`,
      name: walletName,
      address: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      balance: 0,
      token: "XDC",
      lastActivity: new Date(),
      isActive: true,
    };
    onAddWallet(newWallet);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={cn(THEME.glassmorphism.dialog, "sm:max-w-md")}>
        <DialogHeader>
          <DialogTitle>Create New Wallet</DialogTitle>
          <DialogDescription>Set up a new wallet to manage your assets.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="wallet-name">Wallet Name</Label>
            <Input
              id="wallet-name"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="My Smart Wallet"
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label>Wallet Type</Label>
            <RadioGroup value={walletType} onValueChange={setWalletType}>
              <div className="flex items-start space-x-2 rounded-md border p-3">
                <RadioGroupItem value="smart" id="smart" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="smart" className="font-medium">Smart Wallet</Label>
                  <p className="text-sm text-muted-foreground">
                    AI-powered with advanced security and automation
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 rounded-md border p-3">
                <RadioGroupItem value="standard" id="standard" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="standard" className="font-medium">Standard Wallet</Label>
                  <p className="text-sm text-muted-foreground">
                    Basic wallet with manual transaction control
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 rounded-md border p-3">
                <RadioGroupItem value="multisig" id="multisig" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="multisig" className="font-medium">Multi-Signature Wallet</Label>
                  <p className="text-sm text-muted-foreground">
                    Requires multiple signatures for transactions
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Security Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="recovery" defaultChecked />
                <Label htmlFor="recovery">Enable social recovery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="limits" />
                <Label htmlFor="limits">Set spending limits</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="2fa" defaultChecked />
                <Label htmlFor="2fa">Enable 2FA for transactions</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            className={cn(THEME.colors.primary.light, THEME.colors.primary.hover, "text-white")}
            onClick={handleCreateWallet}
          >
            Create Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWalletModal;