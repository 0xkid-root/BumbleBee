"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTransactionStore } from "@/lib/store/use-transaction-store"
import { ArrowUpRight, ArrowDownLeft, ExternalLink, Copy, Check, Clock, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useClipboard } from "@/lib/hooks/use-clipboard"

type TransactionDetailsProps = {
  isOpen: boolean
  onClose: () => void
  transactionId: string | null
}

export function TransactionDetails({ isOpen, onClose, transactionId }: TransactionDetailsProps) {
  const { transactions } = useTransactionStore()
  const { copy, status } = useClipboard()

  const transaction = transactions.find((tx) => tx.id === transactionId)

  if (!transaction) return null

  const handleCopyTxHash = () => {
    copy(transaction.hash)
  }

  const handleCopyAddress = (address: string) => {
    copy(address)
  }

  const getStatusIcon = () => {
    if (transaction.status === "completed") {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (transaction.status === "pending") {
      return <Clock className="h-5 w-5 text-amber-500" />
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                transaction.type === "send"
                  ? "bg-red-100 text-red-600"
                  : transaction.type === "receive"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600",
              )}
            >
              {transaction.type === "send" ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : transaction.type === "receive" ? (
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
            {transaction.type === "swap"
              ? `Swap ${transaction.fromAsset || transaction.asset} to ${transaction.toAsset || ""}`
              : `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} ${transaction.asset}`}
          </DialogTitle>
          <DialogDescription>Transaction details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="flex items-center gap-1.5">
              {getStatusIcon()}
              <span className="font-medium capitalize">{transaction.status}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="font-medium">
                {transaction.type === "swap"
                  ? `${transaction.fromAmount || transaction.amount} ${transaction.fromAsset || transaction.asset} → ${transaction.toAmount || ""} ${transaction.toAsset || ""}`
                  : `${transaction.amount} ${transaction.asset}`}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Fee</div>
              <div className="font-medium">{transaction.fee} ETH</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{format(new Date(transaction.timestamp), "MMM d, yyyy HH:mm:ss")}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Transaction Hash</div>
              <div className="flex items-center gap-1">
                <div className="font-mono text-xs">
                  {transaction.hash.slice(0, 6)}...{transaction.hash.slice(-4)}
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyTxHash}>
                  {status === "copied" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span className="sr-only">Copy transaction hash</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">From</div>
              <div className="flex items-center gap-1">
                <div className="font-mono text-xs">
                  {transaction.from.slice(0, 6)}...{transaction.from.slice(-4)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCopyAddress(transaction.from)}
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy from address</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">To</div>
              <div className="flex items-center gap-1">
                <div className="font-mono text-xs">
                  {transaction.to.slice(0, 6)}...{transaction.to.slice(-4)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCopyAddress(transaction.to)}
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy to address</span>
                </Button>
              </div>
            </div>

            {transaction.blockNumber && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Block</div>
                <div className="font-medium">{transaction.blockNumber}</div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => window.open(`https://etherscan.io/tx/${transaction.hash}`, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            View on Explorer
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
