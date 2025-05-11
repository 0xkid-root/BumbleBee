"use client"

import { useState } from "react"
import { SectionTitle } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactionStore } from "@/lib/store/use-transaction-store"
import { TransactionFilter } from "@/components/transactions/transaction-filter"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionDetails } from "@/components/transactions/transaction-details"
import { Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TransactionsClient() {
  const { transactions } = useTransactionStore()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [filter, setFilter] = useState({
    type: "all",
    status: "all",
    dateRange: "all",
    asset: "all",
  })
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast({
      title: "Transactions refreshed",
      description: "Your transaction history has been updated.",
    })
  }

  const handleTransactionClick = (txId: string) => {
    setSelectedTransaction(txId)
    setIsDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsOpen(false)
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (filter.type !== "all" && tx.type !== filter.type) return false
    if (filter.status !== "all" && tx.status !== filter.status) return false
    if (filter.asset !== "all" && tx.asset !== filter.asset) return false

    // Date range filtering would go here

    return true
  })

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionTitle
          title="Transactions"
          subtitle="View and manage your transaction history"
          className="text-left mb-0"
          titleClassName="text-3xl"
          subtitleClassName="text-base max-w-none text-left"
        />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="h-9" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Transaction History</CardTitle>
            <TransactionFilter filter={filter} setFilter={setFilter} />
          </div>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={filteredTransactions} onTransactionClick={handleTransactionClick} />
        </CardContent>
      </Card>

      <TransactionDetails isOpen={isDetailsOpen} onClose={handleCloseDetails} transactionId={selectedTransaction} />
    </div>
  )
}
