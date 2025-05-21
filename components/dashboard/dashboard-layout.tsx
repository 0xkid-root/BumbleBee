"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSidebar } from "./sidebar";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, Wallet, TrendingUp, CreditCard, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientDashboardLayout } from "./client-layout";

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

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ClientDashboardLayout>{children}</ClientDashboardLayout>
}