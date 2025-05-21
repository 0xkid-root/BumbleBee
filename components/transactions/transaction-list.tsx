"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import type { useTransactionStore } from "@/lib/store/use-transaction-store"

type TransactionListProps = {
  transactions: ReturnType<typeof useTransactionStore>["transactions"]
  onTransactionClick: (txId: string) => void
}

export function TransactionList({ transactions, onTransactionClick }: TransactionListProps) {
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  const paginatedTransactions = transactions.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  if (transactions.length === 0) {
    return (
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
            <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
          </svg>
        </div>
        <h3 className="font-medium mb-1">No transactions found</h3>
        <p className="text-sm text-muted-foreground">Try changing your filters or check back later</p>
      </div>
    )
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((tx) => (
              <TableRow
                key={tx.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onTransactionClick(tx.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        tx.type === "send"
                          ? "bg-red-100 text-red-600"
                          : tx.type === "receive"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600",
                      )}
                    >
                      {tx.type === "send" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : tx.type === "receive" ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 3h5v5" />
                          <path d="M4 20 21 3" />
                          <path d="M21 16v5h-5" />
                          <path d="M15 15 3 3" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium capitalize">{tx.type}</span>
                  </div>
                </TableCell>
                <TableCell>{tx.asset}</TableCell>
                <TableCell
                  className={cn(
                    "font-medium",
                    tx.type === "send" ? "text-red-600" : tx.type === "receive" ? "text-green-600" : "",
                  )}
                >
                  {tx.type === "send" ? "-" : tx.type === "receive" ? "+" : ""}
                  {tx.amount}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      tx.status === "completed" ? "default" : tx.status === "pending" ? "outline" : "destructive"
                    }
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(`https://etherscan.io/tx/${tx.hash}`, "_blank")
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View on Explorer</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, transactions.length)} of{" "}
            {transactions.length} transactions
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page === totalPages}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
