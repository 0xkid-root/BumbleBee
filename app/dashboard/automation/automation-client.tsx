"use client"

import { useState } from "react"
import { SectionTitle } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StrategyCard } from "@/components/automation/strategy-card"
import { RecurringTransactionCard } from "@/components/automation/recurring-transaction-card"
import { CreateStrategyModal } from "@/components/automation/create-strategy-modal"
import { CreateRecurringModal } from "@/components/automation/create-recurring-modal"
import { useAutomationStore } from "@/lib/store/use-automation-store"
import { Plus, RefreshCw, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AutomationClient() {
  const { strategies, recurringTransactions } = useAutomationStore()
  const [activeTab, setActiveTab] = useState("strategies")
  const [isCreateStrategyOpen, setIsCreateStrategyOpen] = useState(false)
  const [isCreateRecurringOpen, setIsCreateRecurringOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast({
      title: "Automation data refreshed",
      description: "Your automation strategies and recurring transactions have been updated.",
    })
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionTitle
          title="Automation"
          subtitle="Set up automated strategies and recurring transactions"
          className="text-left mb-0"
          titleClassName="text-3xl"
          subtitleClassName="text-base max-w-none text-left"
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => {
              activeTab === "strategies" ? setIsCreateStrategyOpen(true) : setIsCreateRecurringOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
          <Button size="sm" className="h-9" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Automation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Strategies</CardTitle>
            <CardDescription>Automated trading strategies</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold">{strategies.filter((s) => s.status === "active").length}</div>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setActiveTab("strategies")
                setIsCreateStrategyOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Strategy
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recurring Transactions</CardTitle>
            <CardDescription>Scheduled recurring payments</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold">
              {recurringTransactions.filter((r) => r.status === "active").length}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setActiveTab("recurring")
                setIsCreateRecurringOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Recurring
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Automated</CardTitle>
            <CardDescription>Value of automated assets</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold">
              $
              {(
                strategies.reduce((sum, s) => sum + (s.status === "active" ? s.value : 0), 0) +
                recurringTransactions.reduce((sum, r) => sum + (r.status === "active" ? r.amount : 0), 0)
              ).toLocaleString()}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" disabled>
              <Zap className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs for strategies and recurring transactions */}
      <Tabs defaultValue="strategies" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6 w-[400px]">
          <TabsTrigger value="strategies">Trading Strategies</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategies.length > 0 ? (
              strategies.map((strategy) => <StrategyCard key={strategy.id} strategy={strategy} />)
            ) : (
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">No strategies yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create automated trading strategies to optimize your portfolio
                    </p>
                    <Button onClick={() => setIsCreateStrategyOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recurring" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recurringTransactions.length > 0 ? (
              recurringTransactions.map((transaction) => (
                <RecurringTransactionCard key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                        <path d="M16 16h5v5"></path>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">No recurring transactions yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set up recurring buys, sells, or transfers to automate your finances
                    </p>
                    <Button onClick={() => setIsCreateRecurringOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Recurring Transaction
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateStrategyModal />

      <CreateRecurringModal />
    </div>
  )
}
