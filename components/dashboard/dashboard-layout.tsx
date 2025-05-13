"use client";

import { Suspense, lazy, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSidebar } from "./sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, Wallet, TrendingUp, CreditCard, Users, Sparkles } from "lucide-react";
import { PortfolioAnalytics } from "./components/PortfolioAnalytics";
// Lazy load components
const Card = lazy(() => import("./components/Card").then(mod => ({ default: mod.Card })));
const StatBox = lazy(() => import("./components/StatBox").then(mod => ({ default: mod.StatBox })));
const PortfolioChart = lazy(() => import("./components/PortfolioAnalytics").then(mod => ({ default: mod.PortfolioAnalytics })));
const AIInsights = lazy(() => import("./components/AIInsights").then(mod => ({ default: mod.AIInsights })));
const SubscriptionList = lazy(() => import("./components/SubscriptionList").then(mod => ({ default: mod.SubscriptionList })));
const GroupTabList = lazy(() => import("./components/GroupTabList").then(mod => ({ default: mod.GroupTabList })));
const TransactionHistory = lazy(() => import("./components/TransactionHistory").then(mod => ({ default: mod.TransactionHistory })));
const SmartWalletFeatures = lazy(() => import("./components/SmartWalletFeatures").then(mod => ({ default: mod.SmartWalletFeatures })));

// Dummy data
const recentActivity = [
  {
    id: 1,
    type: "Subscription Payment",
    amount: "-25 XDC",
    date: "2025-05-12T09:30:00Z",
    status: "Completed",
    to: "0xA3f...9E4d",
    description: "Monthly access to Onchain Research Premium",
  },
  {
    id: 2,
    type: "Group Tab Settlement",
    amount: "+120 XDC",
    date: "2025-05-11T14:50:00Z",
    status: "Completed",
    from: "0xF81...a0B2",
    description: "Settlement from DAO offsite expense split",
  },
  {
    id: 3,
    type: "Token Swap",
    amount: "-50 XDC",
    date: "2025-05-10T18:20:00Z",
    status: "Completed",
    pair: "XDC/USDC",
    txHash: "0x6b2...e791",
  },
  {
    id: 4,
    type: "Airdrop Claim",
    amount: "+10 XDC",
    date: "2025-05-09T22:00:00Z",
    status: "Completed",
    source: "XDC Foundation Reward Program",
  },
];

const smartWalletAlerts = [
  {
    id: 1,
    message: "Low gas detected – Auto-topup triggered via linked reserve wallet",
    type: "info",
    timestamp: "2025-05-11T08:15:00Z",
  },
  {
    id: 2,
    message: "Your DeFi portfolio was rebalanced: +3% performance improvement",
    type: "success",
    timestamp: "2025-05-10T23:00:00Z",
  },
  {
    id: 3,
    message: "Unusual token movement detected — review recent approvals",
    type: "warning",
    timestamp: "2025-05-09T16:45:00Z",
  },
];

const subscriptions = [
  {
    id: 1,
    name: "Onchain Research Premium",
    amount: "25 XDC",
    frequency: "Monthly",
    nextPayment: "2025-06-12",
    startedOn: "2024-12-12",
    contractAddress: "0x9D1...4Cc3",
  },
  {
    id: 2,
    name: "DeFi Analytics Pro",
    amount: "50 XDC",
    frequency: "Monthly",
    nextPayment: "2025-05-20",
    startedOn: "2025-01-20",
    contractAddress: "0x7B4...fE2a",
  },
  {
    id: 3,
    name: "Token Whales Tracker",
    amount: "10 XDC",
    frequency: "Weekly",
    nextPayment: "2025-05-17",
    startedOn: "2025-04-19",
    contractAddress: "0xA2c...9Dd8",
  },
];

const groupTabs = [
  {
    id: 1,
    name: "ETHGlobal Dubai DAO Offsite",
    participants: 6,
    outstandingAmount: "120 XDC",
    status: "Active",
    createdOn: "2025-05-05",
    groupId: "dao-tab-001",
  },
  {
    id: 2,
    name: "Shared Trading Terminal Access",
    participants: 4,
    outstandingAmount: "60 XDC",
    status: "Pending",
    createdOn: "2025-04-28",
    groupId: "sub-tab-002",
  },
  {
    id: 3,
    name: "Node Hosting Pool",
    participants: 3,
    outstandingAmount: "90 XDC",
    status: "Settled",
    createdOn: "2025-03-15",
    groupId: "infra-tab-003",
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar defaultCollapsed={false}>
        <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </Sidebar>
      <main className="flex-1 p-6 overflow-y-auto transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className="flex-1 p-6 overflow-y-auto transition-all duration-300 ease-in-out"
        style={{ marginLeft: isCollapsed ? '70px' : '280px' }}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your portfolio today.</p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Suspense fallback={<div className="h-32 rounded-xl bg-muted animate-pulse" />}>
              <StatBox
                title="Portfolio Value"
                value="$12,345.67"
                icon={Wallet}
                gradient="from-blue-500 to-indigo-600"
                trend={{ value: 12.5, isPositive: true }}
                index={0}
              />
            </Suspense>
            <Suspense fallback={<div className="h-32 rounded-xl bg-muted animate-pulse" />}>
              <StatBox
                title="24h Change"
                value="+$1,234.56"
                icon={TrendingUp}
                gradient="from-emerald-500 to-teal-600"
                trend={{ value: 8.2, isPositive: true }}
                index={1}
              />
            </Suspense>
            <Suspense fallback={<div className="h-32 rounded-xl bg-muted animate-pulse" />}>
              <StatBox
                title="Active Positions"
                value="8"
                icon={Activity}
                gradient="from-purple-500 to-pink-500"
                trend={{ value: 2, isPositive: true }}
                index={2}
              />
            </Suspense>
          </div>

          {/* Portfolio Chart */}
          <Suspense fallback={<div className="h-96 rounded-xl bg-muted animate-pulse" />}>
            <PortfolioChart />
          </Suspense>

          {/* Activity and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<div className="h-64 rounded-xl bg-muted animate-pulse" />}>
              <Card title="Recent Activity" icon={<Activity className="h-5 w-5" />}>
                <TransactionHistory transactions={recentActivity} />
              </Card>
            </Suspense>
            <Suspense fallback={<div className="h-64 rounded-xl bg-muted animate-pulse" />}>
              <Card title="Smart Wallet Alerts" variant="glass">
                <SmartWalletFeatures alerts={smartWalletAlerts} />
              </Card>
            </Suspense>
          </div>

          {/* Subscriptions and Group Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<div className="h-64 rounded-xl bg-muted animate-pulse" />}>
              <Card title="Active Subscriptions" icon={<CreditCard className="h-5 w-5" />}>
                <SubscriptionList subscriptions={subscriptions} />
              </Card>
            </Suspense>
            <Suspense fallback={<div className="h-64 rounded-xl bg-muted animate-pulse" />}>
              <Card title="Group Tabs" icon={<Users className="h-5 w-5" />}>
                <GroupTabList groupTabs={groupTabs} />
              </Card>
            </Suspense>
          </div>

          {/* AI Insights and Portfolio Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<div className="h-64 rounded-xl bg-muted animate-pulse" />}>
              <Card title="AI Insights" icon={<Sparkles className="h-5 w-5" />}>
                <AIInsights />
              </Card>
            </Suspense>
            <Suspense fallback={<div className="h-64 rounded-xl bg-muted animate-pulse" />}>
              <Card title="Portfolio Analytics" icon={<TrendingUp className="h-5 w-5" />}>
                <PortfolioAnalytics />
              </Card>
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}