import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, TrendingUp, Activity, PiggyBank, BadgeDollarSign, AlertCircle, Sparkles, ArrowRightLeft, Info, Check, PlusCircle, Settings2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface AiInsightsModalProps {
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
const AiInsightsModal: React.FC<AiInsightsModalProps> = ({ onClose }) => {
  const [aiInsightType, setAiInsightType] = useState<"portfolio" | "spending" | "savings">("portfolio");
  const { toast } = useToast();

  const handleApplyRecommendations = () => {
    toast({
      title: "Insights Applied",
      description: "Your AI recommendations have been saved",
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={cn(THEME.glassmorphism.dialog, "max-w-4xl")}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            AI-Powered {aiInsightType.charAt(0).toUpperCase() + aiInsightType.slice(1)} Insights
          </DialogTitle>
          <DialogDescription>Personalized recommendations based on your financial activity.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={aiInsightType} onValueChange={(value) => setAiInsightType(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio" className="space-y-4 py-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-blue-100">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Portfolio Rebalancing Opportunity</h3>
                <p className="text-muted-foreground">
                  Your portfolio is overexposed to XDC (45%). Consider increasing ETH allocation to reduce volatility.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Info className="h-4 w-4" /> Learn More
                  </Button>
                  <Button
                    size="sm"
                    className={cn(THEME.colors.primary.light, THEME.colors.primary.hover, "text-white gap-1")}
                    onClick={onClose} // Simplified for demo; in production, trigger token swap modal
                  >
                    <ArrowRightLeft className="h-4 w-4" /> Rebalance Now
                  </Button>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Growth Opportunity</h3>
                <p className="text-muted-foreground">
                  Allocate 5-10% to DeFi protocols for higher growth potential based on market trends.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Info className="h-4 w-4" /> Learn More
                  </Button>
                </div>
              </div>
            </div>
            <Separator />
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-300">Market Volatility Alert</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Increased volatility expected in the next 48 hours. Postpone large transactions.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="spending" className="space-y-4 py-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-pink-100">
                <Activity className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Spending Pattern Analysis</h3>
                <p className="text-muted-foreground">
                  Subscription spending increased by 15%. Review recurring payments to save.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className={cn(THEME.colors.secondary.light, THEME.colors.secondary.hover, "text-white gap-1")}
                    onClick={onClose}
                  >
                    <Check className="h-4 w-4" /> Review Subscriptions
                  </Button>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={THEME.glassmorphism.card}>
                <CardHeader>
                  <CardTitle className="text-base">Top Spending Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Subscriptions</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span>Entertainment</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span>Services</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              <Card className={THEME.glassmorphism.card}>
                <CardHeader>
                  <CardTitle className="text-base">Spending Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span>Consolidate streaming subscriptions to save ~15 XDC/month</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span>Set up auto-conversion to stablecoins for recurring payments</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span>Use social payment tabs for group expenses</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="savings" className="space-y-4 py-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-blue-100">
                <PiggyBank className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Savings Optimization</h3>
                <p className="text-muted-foreground">
                  Earn 3.2% APY by moving idle assets to yield-generating protocols (~78 XDC/year).
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className={cn(THEME.colors.success.light, THEME.colors.success.hover, "text-white gap-1")}
                  >
                    <Sparkles className="h-4 w-4" /> Optimize Savings
                  </Button>
                </div>
              </div>
            </div>
            <Separator />
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">Savings Goals Progress</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Emergency Fund</span>
                    <span className="text-sm">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Vacation Fund</span>
                    <span className="text-sm">40% Complete</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  <PlusCircle className="h-4 w-4 mr-2" /> Add New Savings Goal
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-emerald-100">
                <BadgeDollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Auto-Save Recommendation</h3>
                <p className="text-muted-foreground">
                  Auto-save 5% of incoming funds to reach goals 30% faster.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">
                    <Settings2 className="h-4 w-4 mr-2" /> Configure Auto-Save
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button
            className={cn(THEME.colors.primary.light, THEME.colors.primary.hover, "text-white")}
            onClick={handleApplyRecommendations}
          >
            Apply Recommendations
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiInsightsModal;