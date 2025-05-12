"use client";

import React, { Suspense, lazy, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar, SidebarProvider } from "./sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import {
  Zap,
  CreditCard,
  Users,
  Activity,
  Sparkles,
  Plus,
  ArrowRightLeft,
  PiggyBank,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Lazy load modal components
const WalletConnectModal = lazy(() => import("./modals/WalletConnectModal"));
const TokenSwapModal = lazy(() => import("./modals/TokenSwapModal"));
const SettingsModal = lazy(() => import("./modals/SettingsModal"));
const NotificationsModal = lazy(() => import("./modals/NotificationsModal"));
const AddSubscriptionModal = lazy(() => import("./modals/AddSubscriptionModal"));
const CreateTabModal = lazy(() => import("./modals/CreateTabModal"));
const AiInsightsModal = lazy(() => import("./modals/AIInsightsModal"));
const TransactionDetailsModal = lazy(() => import("./modals/TransactionsModal"));
const CreateWalletModal = lazy(() => import("./modals/CreateWalletModal"));

// Types
interface Wallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  token: string;
  lastActivity: Date;
  isActive: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: Date;
}

type ModalType =
  | "walletConnect"
  | "tokenSwap"
  | "settings"
  | "notifications"
  | "addSubscription"
  | "createTab"
  | "createWallet"
  | "aiInsights"
  | "transactionDetails";

// Theme configuration
const THEME = {
  glassmorphism: {
    card: "bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl",
    dialog: "bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl",
  },
  colors: {
    primary: {
      gradient: "from-amber-300 via-yellow-500 to-amber-400",
      light: "bg-amber-500",
      hover: "hover:bg-amber-600",
    },
    secondary: {
      gradient: "from-blue-500 to-indigo-600",
      light: "bg-blue-500",
      hover: "hover:bg-blue-600",
    },
    success: {
      gradient: "from-emerald-500 to-teal-500",
      light: "bg-emerald-500",
      hover: "hover:bg-emerald-600",
    },
    accent: {
      gradient: "from-pink-500 to-rose-500",
      light: "bg-pink-500",
      hover: "hover:bg-pink-600",
    },
  },
};

// Dummy data (move to a separate file or API in production)
const initialWallets: Wallet[] = [
  {
    id: "1",
    name: "Smart Wallet #1",
    address: "0x1a2b...3c4d",
    balance: 2450,
    token: "XDC",
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isActive: true,
  },
];

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Token Available",
    message: "BumbleBee token is now available for trading",
    type: "info",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
];

// Card Component
interface CardProps {
  title: string;
  children: React.ReactNode;
  variant?: "gradient" | "glass";
  icon: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, variant = "glass", icon, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className={cn(
      "rounded-xl p-5 shadow-md transition-all duration-300",
      variant === "gradient" ? `bg-gradient-to-br ${THEME.colors.primary.gradient} text-white` : THEME.glassmorphism.card,
      className
    )}
    role="region"
    aria-label={title}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <motion.div className="mr-3 p-2 bg-white/20 rounded-full" whileHover={{ rotate: 15 }}>
          {icon}
        </motion.div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
    </div>
    {children}
  </motion.div>
);

// StatBox Component
interface StatBoxProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient?: string;
  index: number;
}

const StatBox: React.FC<StatBoxProps> = ({ title, value, icon: Icon, gradient = THEME.colors.primary.gradient, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    className={cn(
      `rounded-xl p-5 shadow-md backdrop-blur-sm transition-all duration-300 bg-gradient-to-br ${gradient} text-white`
    )}
    role="region"
    aria-label={title}
  >
    <div className="flex items-center">
      <motion.div className="p-3 rounded-full mr-4 bg-white/20" whileHover={{ rotate: 15, scale: 1.1 }}>
        <Icon className="h-6 w-6 text-white" />
      </motion.div>
      <div>
        <p className="text-sm text-white/80">{title}</p>
        <motion.p
          className="text-xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
        >
          {value}
        </motion.p>
      </div>
    </div>
  </motion.div>
);

// DashboardLayout Component
const DashboardLayout: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();

  // State
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>(initialWallets);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const mainContentRef = useRef<HTMLElement>(null);

  // Handlers
  const handleOpenModal = useCallback((type: ModalType) => setActiveModal(type), []);
  const handleCloseModal = useCallback(() => setActiveModal(null), []);

  const handleAddWallet = useCallback(
    (newWallet: Wallet) => {
      setWallets((prev) => [...prev, newWallet]);
      toast({
        title: "Wallet Added",
        description: `${newWallet.name} has been added successfully`,
      });
      handleCloseModal();
    },
    [toast, handleCloseModal]
  );

  // Memoized values
  const totalBalance = useMemo(
    () => wallets.reduce((total, wallet) => total + wallet.balance, 0),
    [wallets]
  );

  // Focus main content on mount
  useEffect(() => {
    mainContentRef.current?.focus();
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <SidebarProvider>
      <Suspense fallback={<div>Loading...</div>}>
        {activeModal === "walletConnect" && <WalletConnectModal onClose={handleCloseModal} />}
        {activeModal === "tokenSwap" && <TokenSwapModal onClose={handleCloseModal} />}
        {activeModal === "settings" && <SettingsModal onClose={handleCloseModal} />}
        {activeModal === "notifications" && <NotificationsModal onClose={handleCloseModal} />}
        {activeModal === "addSubscription" && <AddSubscriptionModal onClose={handleCloseModal} />}
        {activeModal === "createTab" && <CreateTabModal onClose={handleCloseModal} />}
        {activeModal === "aiInsights" && <AiInsightsModal onClose={handleCloseModal} />}
        {activeModal === "transactionDetails" && <TransactionDetailsModal onClose={handleCloseModal} />}
        {activeModal === "createWallet" && <CreateWalletModal onAddWallet={handleAddWallet} onClose={handleCloseModal} />}
      </Suspense>

      <Sidebar defaultCollapsed={false}>
        <DashboardSidebar />
        <SidebarInset className="transition-all duration-300">
          <motion.main
            ref={mainContentRef}
            className="flex-1 p-4 md:p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            tabIndex={-1}
            aria-label="Dashboard content"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <motion.h1
                  className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Welcome onBoard
                </motion.h1>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatBox
                  title="Portfolio Value"
                  value={`${totalBalance.toLocaleString()} XDC`}
                  icon={PiggyBank}
                  gradient={THEME.colors.primary.gradient}
                  index={0}
                />
                <StatBox
                  title="Active Subscriptions"
                  value="2"
                  icon={ListChecks}
                  gradient={THEME.colors.secondary.gradient}
                  index={1}
                />
                <StatBox
                  title="Group Tabs"
                  value="2 Active"
                  icon={Users}
                  gradient={THEME.colors.success.gradient}
                  index={2}
                />
                <StatBox
                  title="AI Suggestions"
                  value="3 New"
                  icon={Sparkles}
                  gradient={THEME.colors.accent.gradient}
                  index={3}
                />
              </div>

              {/* Main content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card
                    title="AI Smart Wallet"
                    variant="gradient"
                    icon={<Zap className="h-5 w-5 text-white" />}
                  >
                    <div className="space-y-4 p-5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/20 text-white hover:bg-white/30"
                        onClick={() => handleOpenModal("createWallet")}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        New Wallet
                      </Button>
                    </div>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card
                    title="Quick Actions"
                    variant="glass"
                    icon={<Zap className="h-5 w-5 text-amber-500" />}
                  >
                    <div className="grid grid-cols-2 gap-3 p-5">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => handleOpenModal("tokenSwap")}
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                        Swap
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => handleOpenModal("addSubscription")}
                      >
                        <CreditCard className="h-4 w-4" />
                        Subscription
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </motion.main>
        </SidebarInset>
      </Sidebar>
    </SidebarProvider>
  );
};

export default DashboardLayout;