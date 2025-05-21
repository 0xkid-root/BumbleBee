import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Users, User2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface CreateTabModalProps {
  isOpen: boolean;
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
const CreateTabModal: React.FC<CreateTabModalProps> = ({ onClose }) => {
  const [tabName, setTabName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("XDC");
  const [splitMethod, setSplitMethod] = useState("equal");
  const { toast } = useToast();

  const friends = [
    { id: "1", name: "Alex Johnson" },
    { id: "2", name: "Maria Garcia" },
    { id: "3", name: "John Smith" },
    { id: "4", name: "Sarah Williams" },
  ];

  const toggleFriend = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((friendId) => friendId !== id) : [...prev, id]
    );
  };

  const handleCreateTab = () => {
    if (!tabName || !amount || selectedFriends.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select at least one friend",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Tab Created",
      description: `${tabName} tab has been created with ${selectedFriends.length} friends`,
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={cn(THEME.glassmorphism.dialog, "sm:max-w-md")}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Create Social Payment Tab
          </DialogTitle>
          <DialogDescription>Create a shared payment tab with friends or colleagues.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tabName">Tab Name</Label>
            <Input
              id="tabName"
              value={tabName}
              onChange={(e) => setTabName(e.target.value)}
              placeholder="e.g. Team Lunch, Trip Expenses"
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label>Add Friends</Label>
            <div className="space-y-2 max-h-40 overflow-auto">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    selectedFriends.includes(friend.id) ? "border-primary bg-primary/10" : "border-border",
                    "cursor-pointer"
                  )}
                  onClick={() => toggleFriend(friend.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFriend(friend.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User2 className="h-4 w-4" />
                      </div>
                      <span>{friend.name}</span>
                    </div>
                    <Checkbox
                      checked={selectedFriends.includes(friend.id)}
                      onCheckedChange={() => toggleFriend(friend.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${friend.name}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tabAmount">Initial Amount</Label>
            <div className="flex gap-2">
              <Input
                id="tabAmount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                aria-required="true"
              />
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger id="tabToken" className="w-[100px]">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XDC">XDC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Split Method</Label>
            <RadioGroup value={splitMethod} onValueChange={setSplitMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="equal" id="equal" />
                <Label htmlFor="equal">Equal Split</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Percentage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom Amounts</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="notify" />
            <Label htmlFor="notify">Notify participants via email</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            className={cn(THEME.colors.accent.light, THEME.colors.accent.hover, "text-white")}
            onClick={handleCreateTab}
          >
            Create Tab
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTabModal;