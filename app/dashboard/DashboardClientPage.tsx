"use client"

import { AnimatedStatCard } from "@/components/dashboard/animated-stat-card"
import { AnimatedChart } from "@/components/dashboard/animated-chart"
import { AnimatedTransactions } from "@/components/dashboard/animated-transactions"
import { AnimatedInsights } from "@/components/dashboard/animated-insights"

export default function DashboardClientPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your portfolio and recent activity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedStatCard title="Total Balance" value="$12,345.67" change="+5.2%" trend="up" delay={0} />
        <AnimatedStatCard title="24h Change" value="$423.89" change="+3.5%" trend="up" delay={0.1} />
        <AnimatedStatCard title="Total Assets" value="8" change="+1" trend="up" delay={0.2} />
        <AnimatedStatCard title="Pending Transactions" value="3" change="0" trend="neutral" delay={0.3} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <AnimatedChart className="lg:col-span-4" delay={0.4} />
        <AnimatedTransactions className="lg:col-span-3" delay={0.5} />
      </div>

      <AnimatedInsights delay={0.6} />
    </div>
  )
}
